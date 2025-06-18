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
  Upload,
  Table,
  Drawer,
  Typography,
  Spin,
  Alert,
} from 'antd';
import { MinusOutlined, EditOutlined, PlusOutlined, DeleteOutlined, ReloadOutlined, ExportOutlined, CopyOutlined } from '@ant-design/icons';
import MonacoEditor from './components/Editor/index'
import JSONPretty from 'react-json-pretty';
import { FaFileExport, FaFileImport } from "react-icons/fa";
import { JsonEditor } from 'json-edit-react'

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
  const [isCreating, setIsCreating] = useState(false);

  const [switchOn, setSwitchOn] = useState(false);
  const [rules, setRules] = useState<AjaxInterceptorRule[]>([]);
  const [dataList, setDataList] = useState<DataList>({});
  const [duplicateMatch, setDuplicateMatch] = useState<AjaxInterceptorRule[]>([]);

  const tableBoxRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [tableBoxHeight, setTableBoxHeight] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [currentEditRule, setCurrentEditRule] = useState<AjaxInterceptorRule | null>(null);
  useEffect(() => {
    if (tableBoxRef.current) {
      setTableBoxHeight(window.innerHeight - tableBoxRef.current.offsetTop - 34);
    }
  }, [tableBoxRef.current]);

  const readRulesFromStorage = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['ajaxInterceptor_rules'], (result) => {
        // setRules(result.ajaxInterceptor_rules || []);
        resolve(result.ajaxInterceptor_rules as any || []);
      });
    });
  };

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
        // set('ajaxInterceptor_rules', defaultRules);
      } else {
        setRules(result.ajaxInterceptor_rules);
      }

      setCustomFunction(result.customFunction || { panelPosition: 0 });
      setIsLoading(false);
    });

    window.addEventListener('resize', () => {
      if (tableBoxRef.current) {
        setTableBoxHeight(window.innerHeight - tableBoxRef.current.offsetTop - 34);
      }
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

  const uploadProps: any = {
    name: 'file',
    action: '#',
    accept: '.json',
    showUploadList: false,
    beforeUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonDatabase = JSON.parse(e.target?.result as string);
          console.log('jsonDatabase', jsonDatabase);
          if (jsonDatabase.length > 0) {
            jsonDatabase.forEach(rule => {
              try {
                rule.overrideTxt = JSON.stringify(rule.overrideTxt);
              } catch (error) {
                rule.overrideTxt = '{}'
              }
            });
            setRules(jsonDatabase);
            set('ajaxInterceptor_rules', jsonDatabase);
            groupRulesByTab();
            message.success(`${file.name} uploaded successfully`);
          } else {
            message.error('Failed to parse JSON file');
          }
        } catch (error) {
          message.error('Failed to parse JSON file');
          console.error(error);
        }
      };
      reader.readAsText(file);
      return false; // Prevent default upload behavior
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
    },
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
    setIsLoading(true);
    // First ensure we have the latest state before sending messages
    chrome.storage?.local.set({ [key]: value }, () => {
      console.log(`[set] key: ${key}, value: ${value}`);
      chrome.runtime.sendMessage(chrome.runtime.id, {
        type: 'ajaxInterceptor',
        to: 'background',
        key,
        value,
      });
    });
    setIsLoading(false);
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
    console.log('handleSingleSwitchChange', switchOn, ruleId);
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
      overrideTxt: typeof rule.overrideTxt === 'string' ?
        (() => {
          try {
            return JSON.parse(rule.overrideTxt);
          } catch (e) {
            return rule.overrideTxt;
          }
        })()
        : rule.overrideTxt,
    }));
    const dataStr = JSON.stringify(rulesForExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = 'ajax_interceptor_rules.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    console.log('searchName', searchName);
    console.log('searchUrl', searchUrl);
    if (searchName || searchUrl) {
      setRules(prevRules => {
        const newRules = prevRules.filter(rule => {
          return rule.label.includes(searchName) && rule.match.includes(searchUrl);
        });
        console.log('newRules', newRules);
        return newRules;
      });
    } else {
      readRulesFromStorage().then(rules => {
        setRules(rules as any);
      });
    }
  }, [searchName, searchUrl]);

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
    const value = e.target.value.replace(/\n$/, '');
    setRules(prevRules => {
      const newRules = prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, match: value } : { ...rule }
      );
      console.log(`[handleMatchChange] newRules:`, newRules);
      return newRules;
    });
  };

  const handleLabelChange = (e, ruleId) => {
    setRules(prevRules => {
      const newRules = prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, label: e.target.value } : rule
      );
      // set('ajaxInterceptor_rules', newRules);
      return newRules;
    });
  };

  const handleAddNewRule = () => {
    setIsCreating(true);
    const newRule: AjaxInterceptorRule = {
      id: generateUniqueId(),
      match: '',
      label: `url${rules.length + 1}`,
      switchOn: true,
      key: buildUUID(),
      tabId: 'Default',
    };
    setCurrentEditRule(newRule);
    setShowDetail(true);
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
      // set('ajaxInterceptor_rules', newRules);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleViewDetail = (text, record) => {
    setCurrentEditRule(record);
    setShowDetail(true);
  };

  const checkDuplicateMatch = (e) => {
    console.log(e)

    const currentMatch = e.target.value;
    readRulesFromStorage().then(rules => {
      console.log(rules, currentMatch)
      // return duplicate match
      const duplicateMatch = (rules as any).filter(rule => rule.match === currentMatch);
      console.log(duplicateMatch)
      // return duplicateMatch;
      setDuplicateMatch(duplicateMatch);
    })
  };

  const tableColumns = [
    {
      title: "id",
      dataIndex: "id",
      width: '160px',
      ellipsis: true,
      key: "id",
      render: (text, record) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: "Name",
      width: '150px',
      dataIndex: "label",
      key: "label",
      ellipsis: true,
    },
    {
      title: "Enable",
      width: '120px',
      dataIndex: "switchOn",
      key: "switchOn",
      render: (text, record) => (
        <Switch
          checked={record.switchOn}
          onChange={(val) => handleSingleSwitchChange(val, record.id)}
        />
      )
    },
    {
      title: "match",
      dataIndex: "match",
      key: "match",
      ellipsis: true,
      render: (text, record) => (
        <Tooltip placement="topLeft" title={text}>
          <Space.Compact>
            <Button type="text" icon={<CopyOutlined />} size="small" onClick={() => {
              // copy match
              navigator.clipboard.writeText(record.match || '');
              message.success('Copied to clipboard');

            }} />

            <Button type="link" size="small" onClick={() => handleViewDetail(text, record)}>{text}</Button>

          </Space.Compact>
        </Tooltip>
      )
    },
    {
      title: "Action",
      width: '100px',
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => handleViewDetail(text, record)} icon={<EditOutlined />} />
          <Button type="text" danger onClick={() => handleClickRemove(text, record.id)} icon={<DeleteOutlined />} />
        </Space>
      )
    }
  ]

  const handleRulesChange = (data) => {
    console.log(1);
    if (currentEditRule) {
      setCurrentEditRule({ ...currentEditRule, overrideTxt: JSON.stringify(data) });
    }
  };
  const handleUpdateRules = () => {
    if (currentEditRule) {
      readRulesFromStorage().then(rules => {
        const index = (rules as any).findIndex(rule => rule.id === currentEditRule.id);
        let newRules = [...(rules as any)];
        if (index !== -1) {
          newRules[index] = currentEditRule;
        } else {
          // new rule
          newRules.push(currentEditRule);
        }
        setRules(newRules);
        set('ajaxInterceptor_rules', newRules);
        setShowDetail(false);
      })
    }
  };

  return (
    <Spin spinning={isLoading}>
      <div style={{
        width: '100%',
        height: '100%',
        padding: '20px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          boxSizing: 'border-box',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <Switch
              checkedChildren="On"
              unCheckedChildren="Off"
              checked={switchOn}
              onChange={handleSwitchChange}
            />
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <Input.Search
              style={{
                width: 200,
              }}
              placeholder="Search by name"
              onPressEnter={handleSearch}
            />
            <Input.Search
              style={{
                width: 200,
              }}
              placeholder="Search by url"
              onPressEnter={handleUrlSearch}
            />
            <Button style={{
              width: 32,
              height: 32,
              borderRadius: 4,
            }} color="primary" variant="filled" onClick={() => handleExportRules()} icon={<ExportOutlined />} />

            <Upload {...uploadProps}>
              <Button
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                }}
                color="primary" variant="filled"
                icon={<FaFileImport style={{
                  marginBottom: -1
                }} />}
              />
            </Upload>
            <Button type="primary" onClick={handleAddNewRule}>
              <PlusOutlined />
              Add Rule
            </Button>
          </div>
        </div>
        <div
          ref={tableBoxRef}
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: tableBoxHeight,
            position: 'relative',
          }}>
          {!switchOn && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              zIndex: 1,
              cursor: 'not-allowed',
              pointerEvents: 'none',
            }} />
          )}
          <Table
            bordered
            pagination={{
              pageSize: 20,
              total: rules.length,
              showTotal: (total, range) => `Total: ${total}`,
              showSizeChanger: true
            }}
            style={{
              height: tableBoxHeight,
              opacity: switchOn ? 1 : 0.65,
            }}
            scroll={{ y: tableBoxHeight - 78 }}
            size='small'
            columns={tableColumns}
            dataSource={rules}
          />
        </div>
        <Drawer
          maskClosable={false}
          width={1200}
          title={isCreating ? 'Create new rule' : 'Detail for ' + currentEditRule?.label}
          open={showDetail}
          onClose={() => {
            setShowDetail(false);
            setIsCreating(false);
            setDuplicateMatch([]);
          }}
          extra={
            <Space>
              <Button onClick={() => setShowDetail(false)}>Cancel</Button>
              <Button type="primary" onClick={handleUpdateRules}>
                OK
              </Button>
            </Space>
          }
        >
          <div style={{
            display: 'flex',
            gap: '10px',
            height: '100%',
            overflowY: 'scroll',
          }}>
            <div style={{
              width: 500
            }}>
              <Typography.Title level={4} style={{
                marginTop: 0
              }}>Id:</Typography.Title>

              <Space.Compact style={{
                width: '100%',
              }}>
                <Input
                  style={{
                    marginBottom: '10px',
                  }}
                  disabled
                  value={currentEditRule?.id || ''}
                />
                <Button type="primary" icon={<CopyOutlined />} onClick={() => {
                  navigator.clipboard.writeText(currentEditRule?.id || '');
                  message.success('Copied to clipboard');
                }}></Button>
              </Space.Compact>
              <Typography.Title level={4}>Label:</Typography.Title>
              <Input
                style={{
                  marginBottom: '10px',
                }}
                value={currentEditRule?.label || ''}
                onChange={(e) => {
                  if (currentEditRule) {
                    setCurrentEditRule({ ...currentEditRule, label: e.target.value });
                  }
                }}
              />
              <Typography.Title level={4}>Match:</Typography.Title>
              <Input.TextArea
                rows={10}
                style={{
                  marginBottom: '10px',
                }}
                onBlur={checkDuplicateMatch}
                value={currentEditRule?.match || ''}
                onChange={(e) => {
                  if (currentEditRule) {
                    setCurrentEditRule({ ...currentEditRule, match: e.target.value });
                  }
                }}
              />
              {duplicateMatch.length > 0 && isCreating && (
                <Collapse
                  size="small"
                  defaultActiveKey={['1']}
                  items={[{
                    key: '1', label: 'Duplicate match: ' + duplicateMatch.length, children: <>
                      {duplicateMatch.map(rule => (
                        <Typography.Text
                          className='duplicate-match'
                          key={rule.id} onClick={() => {
                            setIsCreating(false);
                            setCurrentEditRule(rule);
                            setShowDetail(true);
                          }}>{rule.match}</Typography.Text>
                      ))}
                    </>
                  }]}
                />
              )}
            </div>

            <JsonEditor
              rootName=''
              className='json-editor'
              data={JSON.parse(currentEditRule?.overrideTxt || '{}')}
              setData={handleRulesChange}
            />
          </div>

        </Drawer>
      </div>
    </Spin>
  )

};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);