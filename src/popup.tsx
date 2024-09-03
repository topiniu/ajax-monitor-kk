import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { createRoot } from "react-dom/client";
import {
  Switch,
  Collapse,
  Input,
  Select,
  Button,
  Badge,
  Tooltip,
  Modal,
  Radio,
  Space,
  Tabs,
  Row,
  Col,
  Divider,
  message,
} from 'antd';
import { MinusOutlined, PlusOutlined, DeleteOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import MonacoEditor from './components/Editor/index'
import JSONPretty from 'react-json-pretty';
import { FaFileExport, FaFileImport } from "react-icons/fa";


const { Panel } = Collapse;
const { Option } = Select;

import Replacer from './components/Replacer';

import './index.less';
import { Rnd } from 'react-rnd';

type DataList = {
  [tabId: string]: AjaxInterceptorRule[];
};

const buildUUID = () => {
  const dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const App = () => {
  const [interceptedRequests, setInterceptedRequests] = useState({});
  const [showAllRules, setShowAllRules] = useState(false);
  const [positionClass, setPositionClass] = useState('suspend');
  const [customFunction, setCustomFunction] = useState({ panelPosition: 0 });
  const [showRefreshTip, setShowRefreshTip] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [newTabName, setNewTabName] = useState('');
  const [searchUrl, setSearchUrl] = useState('');
  const forceUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);

  const [switchOn, setSwitchOn] = useState(false);
  const [rules, setRules] = useState<AjaxInterceptorRule[]>([]);
  const [dataList, setDataList] = useState<DataList>({});

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules', 'customFunction'], (result) => {
      setSwitchOn(result.ajaxInterceptor_switchOn || false);

      // Initialize default rule if no rules exist
      if (!result.ajaxInterceptor_rules || result.ajaxInterceptor_rules.length === 0) {
        const defaultRule: AjaxInterceptorRule = {
          id: generateUniqueId(),
          match: '',
          label: 'Default Rule',
          switchOn: true,
          key: buildUUID(),
          tabId: 'Default',
        };
        const defaultRules = [defaultRule];
        setRules(defaultRules);
        set('ajaxInterceptor_rules', defaultRules);
      } else {
        setRules(result.ajaxInterceptor_rules);
      }

      setCustomFunction(result.customFunction || { panelPosition: 0 });
      setIsLoading(false);
    });

    setupMessageListener();
    notifyBackgroundScriptLoaded();
  }, []);

  const groupRulesByTab = useCallback(() => {
    const groupedRules = rules.reduce((acc, rule) => {
      const tab = rule.tabId || 'Default';
      if (!acc[tab]) {
        acc[tab] = [];
      }
      acc[tab].push(rule);
      return acc;
    }, {} as DataList);

    if (Object.keys(groupedRules).length === 0) {
      groupedRules['Default'] = [];
    }

    setDataList(groupedRules);

    // Only set the activeKey if it's not already set
    if (!activeKey) {
      const firstTabId = Object.keys(groupedRules)[0];
      setActiveKey(firstTabId);
    }
  }, [rules, activeKey]);

  useEffect(() => {
    groupRulesByTab();
  }, [rules, groupRulesByTab]);

  const setupMessageListener = () => {
    chrome.runtime.onMessage.addListener(handleIncomingMessage);
  };

  const handleIncomingMessage = useCallback(({
    type,
    to,
    url,
    match,
    contentScriptLoaded = false,
    showFreshTip = false,
  }) => {
    if (type === 'ajaxInterceptor' && to === 'iframe') {
      if (contentScriptLoaded || showFreshTip) {
        setShowRefreshTip(showFreshTip);
        return;
      }
      setInterceptedRequests(prev => {
        const newRequests = { ...prev };
        if (!newRequests[match]) newRequests[match] = [];
        const exists = newRequests[match].some(obj => {
          if (obj.url === url) {
            obj.num++;
            return true;
          }
          return false;
        });
        if (!exists) {
          newRequests[match].push({ url, num: 1 });
        }
        return newRequests;
      });
    }
  }, []);

  const notifyBackgroundScriptLoaded = () => {
    chrome.runtime.sendMessage(chrome.runtime.id, {
      type: 'ajaxInterceptor',
      to: 'background',
      iframeScriptLoaded: true,
    });
  };

  const set = (key, value) => {
    chrome.runtime.sendMessage(chrome.runtime.id, {
      type: 'ajaxInterceptor',
      to: 'background',
      key,
      value,
    });
    chrome.storage?.local.set({ [key]: value });
  };

  const forceUpdateDebouce = () => {
    if (forceUpdateTimeoutRef.current) {
      clearTimeout(forceUpdateTimeoutRef.current);
    }
    forceUpdateTimeoutRef.current = setTimeout(() => {
      forceUpdate();
    }, 1000);
  };

  const handleSingleSwitchChange = (switchOn, ruleId) => {
    setRules(prevRules => {
      const newRules = prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, switchOn } : rule
      );
      set('ajaxInterceptor_rules', newRules);
      return newRules;
    });
  };

  const handleLimitMethodChange = (val, ruleId) => {
    setRules(prevRules => {
      const newRules = prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, limitMethod: val } : rule
      );
      set('ajaxInterceptor_rules', newRules);
      return newRules;
    });
  };

  const handleExportRules = () => {
    const rulesForExport = rules.map(rule => ({
      ...rule,
      overrideTxt: typeof rule.overrideTxt === 'string' ? JSON.parse(rule.overrideTxt) : rule.overrideTxt,
    }));
    const dataStr = JSON.stringify(rulesForExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = 'ajax_interceptor_rules.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleFilterTypeChange = (val, ruleId) => {
    setRules(prevRules => {
      const newRules = prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, filterType: val } : rule
      );
      set('ajaxInterceptor_rules', newRules);
      return newRules;
    });
  };

  const handleMatchChange = (e, ruleId) => {
    const value = e.target.value.replace(/\n$/, ''); // Remove trailing newline
    setRules(prevRules => {
      const newRules = prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, match: value } : rule
      );
      set('ajaxInterceptor_rules', newRules);
      return newRules;
    });
  };

  const handleLabelChange = (e, ruleId) => {
    setRules(prevRules => {
      const newRules = prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, label: e.target.value } : rule
      );
      set('ajaxInterceptor_rules', newRules);
      return newRules;
    });
  };

  const handleClickAdd = (tabId) => {
    const newRule: AjaxInterceptorRule = {
      id: generateUniqueId(),
      match: '',
      label: `url${rules.length + 1}`,
      switchOn: true,
      key: buildUUID(),
      tabId: tabId,
    };
    setActiveKey(tabId);
    setRules(prevRules => {
      const newRules = [...prevRules, newRule];
      set('ajaxInterceptor_rules', newRules);
      return newRules;
    });
  };

  const handleBatchRemove = (ruleIds: string[], needGroupRulesByTab = false) => {
    setRules(prevRules => {
      const newRules = prevRules.filter(rule => !ruleIds.includes(rule.id));
      set('ajaxInterceptor_rules', newRules);
      return newRules;
    });

    setInterceptedRequests(prev => {
      const newRequests = { ...prev };
      ruleIds.forEach(id => {
        const rule = rules.find(r => r.id === id);
        if (rule) {
          delete newRequests[rule.match];
          delete newRequests[rule.label];
        }
      });
      return newRequests;
    });

    if (needGroupRulesByTab) {
      groupRulesByTab();
    } else {
      setDataList(prevDataList => {
        const newDataList = { ...prevDataList };
        Object.keys(newDataList).forEach(tabId => {
          newDataList[tabId] = newDataList[tabId].filter(rule => !ruleIds.includes(rule.id));
        });
        return newDataList;
      });
    }
  };

  const handleClickRemove = (e, ruleId) => {
    e.stopPropagation();
    const currentTabId = activeKey;

    handleBatchRemove([ruleId]);

    setDataList(prevDataList => {
      const newDataList = { ...prevDataList };
      if (currentTabId && newDataList[currentTabId]?.length === 0) {
        delete newDataList[currentTabId];
        const remainingTabs = Object.keys(newDataList);
        setActiveKey(remainingTabs.length > 0 ? remainingTabs[0] : undefined);
      }
      return newDataList;
    });
  };

  const handleCollaseChange = () => {
  };

  const handleSwitchChange = () => {
    setSwitchOn(prev => {
      const newSwitchOn = !prev;
      set('ajaxInterceptor_switchOn', newSwitchOn);
      return newSwitchOn;
    });
  };

  const handleSearch = (e) => {
    setSearchName(e.target.value);
  };

  const handleUrlSearch = (e) => {
    setSearchUrl(e.target.value);
  };

  const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      const newTabId = generateRandomString(5);
      handleClickAdd(newTabId);
    } else {
      const tabId = targetKey as string;
      let deletingRuleIds = dataList[tabId].map(rule => rule.id);
      handleBatchRemove(deletingRuleIds, true);

      const remainingTabs = Object.keys(dataList).filter(id => id !== tabId);
      // Set the activeKey to the last remaining tab, or undefined if no tabs left
      setActiveKey(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : undefined);
    }
  };

  const renderTabs = () => {
    return (
      <Tabs
        activeKey={activeKey}
        size={'small'}
        onChange={(key) => setActiveKey(key)}
        type="editable-card"
        items={Object.entries(dataList).map(([tabId, rules]) => {
          const filteredRules = rules.filter(rule => searchName ? rule.label.indexOf(searchName) > -1 : true).filter(rule => searchUrl ? rule.match.indexOf(searchUrl) > -1 : true)

          const newLocal = (
            <>
              <Collapse
                className='collapse'
                onChange={handleCollaseChange}
              >
                {renderRules(filteredRules)}
              </Collapse>

              <Button
                size="large"
                className='btn-add'
                type="primary"
                onClick={() => handleClickAdd(tabId)}
                disabled={!switchOn}
              >
                <PlusOutlined />
              </Button>
            </>
          );
          return {
            key: tabId,
            label: (
              <div style={{
                display: 'flex',
                alignItems: 'center',
              }}>
                <Badge
                  className="site-badge-count-109"
                  count={filteredRules.length}
                  size={'small'}
                  style={{ backgroundColor: '#52c41a' }}
                />
                &nbsp;{tabId}
              </div>
            ),
            children: newLocal,
          }
        })}
        onEdit={handleTabEdit}
      />
    );
  };

  const renderRules = (rules: AjaxInterceptorRule[]) => {
    return rules.map((rule) => (
      <Panel key={rule.key} header={renderPanelHeader(rule)}>
        <Replacer
          updateAddBtnTop_interval={() => { }}
          ruleId={rule.id}
          set={set}
          rule={rule}
          rules={rules}
        />
        {renderInterceptedRequests(rule.match)}
      </Panel>
    ));
  };

  const renderPanelHeader = ({ id, filterType = 'normal', limitMethod = 'ALL', match, label, switchOn = true, key }) => (
    <div className="panel-header" onClick={e => e.stopPropagation()}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
        <Space.Compact >
          <Input
            size="small"
            placeholder="name"
            style={{
              maxWidth: '200px',
              flex: 'auto',
              display: 'inline-block',
            }}
            defaultValue={label}
            onChange={e => handleLabelChange(e, id)}
          />
          <Select
            size="small"
            defaultValue={limitMethod}
            style={{
              width: '1px',
              maxWidth: '120px',
              flex: '1.5 1 auto',
              display: 'inline-block',
            }}
            onChange={val => handleLimitMethodChange(val, id)}
          >
            <Option value="ALL">ALL</Option>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="HEAD">HEAD</Option>
            <Option value="DELETE">DELETE</Option>
            <Option value="OPTIONS">OPTIONS</Option>
          </Select>
          <Select
            size="small"
            defaultValue={filterType}
            style={{
              width: '1px',
              maxWidth: '120px',
              flex: '1.5 1 auto',
              display: 'inline-block',
            }}
            onChange={val => handleFilterTypeChange(val, id)}
          >
            <Option value="normal">normal</Option>
            <Option value="regex">regex</Option>
          </Select>
        </Space.Compact>

        <Input.TextArea
          rows={2}
          size="small"
          placeholder={filterType === 'normal' ? 'eg: abc/get' : 'eg: abc.*'}
          style={{
            flex: '1',
            width: '100%',
            display: 'inline-block',
            marginTop: 10,
          }}
          defaultValue={match}
          onChange={e => handleMatchChange(e, id)}
        />
      </div>

      <div className="button-group">
        <Switch
          size="small"
          defaultChecked={switchOn}
          onChange={val => handleSingleSwitchChange(val, id)}
          style={{
            width: '28px',
            flex: 'none',
            marginRight: '8px',
          }}
        />
        <Button
          danger
          type="primary"
          shape="circle"
          icon={<DeleteOutlined />}
          size="small"
          onClick={e => handleClickRemove(e, id)}
          style={{ width: '24px', flex: 'none' }}
        />
      </div>
    </div>
  );

  const renderInterceptedRequests = (match) => {
    if (!interceptedRequests[match]) {
      return null;
    }

    return (
      <>
        <div className="intercepted-requests">Intercepted Networks:</div>
        <div className="intercepted">
          {interceptedRequests[match].map(({ url, num }) => (
            <Tooltip placement="top" title={url} key={url}>
              <Badge
                count={num}
                style={{
                  backgroundColor: '#fff',
                  color: '#999',
                  boxShadow: '0 0 0 1px #d9d9d9 inset',
                  marginTop: '-3px',
                  marginRight: '4px',
                }}
              />
              <span className="url">{url}</span>
            </Tooltip>
          ))}
        </div>
      </>
    );
  };

  const renderHeader = () => (
    <div style={{
      textAlign: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: 'white',
      paddingBottom: 10,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <Switch
            checked={switchOn}
            onChange={handleSwitchChange}
          />
          <Space.Compact>

            <Input
              allowClear
              onChange={(e) => {
                setNewTabName(e.target.value);
              }}
              placeholder="Add new tab"
              onPressEnter={(e) => {
                handleClickAdd(newTabName || generateRandomString(5));
              }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleClickAdd(newTabName || generateRandomString(5))}
            />
            <Button
              type="primary"
              icon={<FaFileExport style={{
                marginBottom: -1
              }} />}
              onClick={() => handleExportRules()}
            />
          </Space.Compact>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <Input
            style={{ marginRight: 10 }}
            placeholder="Search by name"
            onPressEnter={handleSearch}
          />
          <Input
            style={{ marginRight: 10 }}
            placeholder="Search by url"
            onPressEnter={handleUrlSearch}
          />
          {showRefreshTip && (
            <div style={{
              color: '#1890ff',
              lineHeight: '16px',
              marginTop: '16px',
            }}>
              Please Refresh your page after changing rules.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ajax-modifier-main">
      {renderHeader()}
      {
        showAllRules && (
          <div>
            <JSONPretty data={rules} />
            <Divider />
            <JSONPretty data={dataList} />
          </div>
        )
      }
      {
        !showAllRules && (
          <div className='setting-body'>
            {renderTabs()}
          </div>
        )
      }
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);