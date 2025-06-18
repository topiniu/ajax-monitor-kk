/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup.tsx":
/*!***********************!*\
  !*** ./src/popup.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/collapse/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/select/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/message/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/tabs/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/button/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/badge/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/space/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/input/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/switch/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/tooltip/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/upload/index.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/PlusOutlined.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/DeleteOutlined.js");
/* harmony import */ var react_icons_fa__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-icons/fa */ "./node_modules/react-icons/fa/index.mjs");
/* harmony import */ var _components_Replacer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/Replacer */ "./src/components/Replacer/index.tsx");
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./index.less */ "./src/index.less");





const { Panel } = antd__WEBPACK_IMPORTED_MODULE_2__["default"];
const { Option } = antd__WEBPACK_IMPORTED_MODULE_3__["default"];


const buildUUID = () => {
    const dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (dt + Math.random() * 16) % 16 | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};
const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
const App = () => {
    const [interceptedRequests, setInterceptedRequests] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
    const [showAllRules, setShowAllRules] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [positionClass, setPositionClass] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('suspend');
    const [customFunction, setCustomFunction] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({ panelPosition: 0 });
    const [showRefreshTip, setShowRefreshTip] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [searchName, setSearchName] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [newTabName, setNewTabName] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [searchUrl, setSearchUrl] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const forceUpdateTimeoutRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const [, forceUpdate] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(x => x + 1, 0);
    const [activeKey, setActiveKey] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(undefined);
    const [switchOn, setSwitchOn] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [rules, setRules] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [dataList, setDataList] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        chrome.storage.local.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules', 'customFunction'], (result) => {
            setSwitchOn(result.ajaxInterceptor_switchOn || false);
            // Initialize default rule if no rules exist
            if (!result.ajaxInterceptor_rules || result.ajaxInterceptor_rules.length === 0) {
                const defaultRule = {
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
            }
            else {
                setRules(result.ajaxInterceptor_rules);
            }
            setCustomFunction(result.customFunction || { panelPosition: 0 });
            setIsLoading(false);
        });
        setupMessageListener();
        notifyBackgroundScriptLoaded();
    }, []);
    const groupRulesByTab = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
        const groupedRules = rules.reduce((acc, rule) => {
            const tab = rule.tabId || 'Default';
            if (!acc[tab]) {
                acc[tab] = [];
            }
            acc[tab].push(rule);
            return acc;
        }, {});
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
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        groupRulesByTab();
    }, [rules, groupRulesByTab]);
    const setupMessageListener = () => {
        chrome.runtime.onMessage.addListener(handleIncomingMessage);
    };
    const uploadProps = {
        name: 'file',
        action: '#',
        accept: '.json',
        beforeUpload(file) {
            alert('beforeUpload');
            console.log(file);
            // get json database
            const jsonDatabase = file;
            console.log(jsonDatabase);
            // replace rules
            setRules(jsonDatabase);
            // set to storage
            set('ajaxInterceptor_rules', jsonDatabase);
            // group rules by tab
            groupRulesByTab();
            return false;
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                antd__WEBPACK_IMPORTED_MODULE_6__["default"].success(`${info.file.name} file uploaded successfully`);
            }
            else if (info.file.status === 'error') {
                antd__WEBPACK_IMPORTED_MODULE_6__["default"].error(`${info.file.name} file upload failed.`);
            }
        },
    };
    const handleIncomingMessage = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(({ type, to, url, match, contentScriptLoaded = false, showFreshTip = false, }) => {
        if (type === 'ajaxInterceptor' && to === 'iframe') {
            if (contentScriptLoaded || showFreshTip) {
                setShowRefreshTip(showFreshTip);
                return;
            }
            setInterceptedRequests(prev => {
                const newRequests = Object.assign({}, prev);
                if (!newRequests[match])
                    newRequests[match] = [];
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
        var _a;
        chrome.runtime.sendMessage(chrome.runtime.id, {
            type: 'ajaxInterceptor',
            to: 'background',
            key,
            value,
        });
        (_a = chrome.storage) === null || _a === void 0 ? void 0 : _a.local.set({ [key]: value });
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
            const newRules = prevRules.map(rule => rule.id === ruleId ? Object.assign(Object.assign({}, rule), { switchOn }) : rule);
            set('ajaxInterceptor_rules', newRules);
            return newRules;
        });
    };
    const handleLimitMethodChange = (val, ruleId) => {
        setRules(prevRules => {
            const newRules = prevRules.map(rule => rule.id === ruleId ? Object.assign(Object.assign({}, rule), { limitMethod: val }) : rule);
            set('ajaxInterceptor_rules', newRules);
            return newRules;
        });
    };
    const handleExportRules = () => {
        const rulesForExport = rules.map(rule => (Object.assign(Object.assign({}, rule), { overrideTxt: typeof rule.overrideTxt === 'string' ? JSON.parse(rule.overrideTxt) : rule.overrideTxt })));
        const dataStr = JSON.stringify(rulesForExport, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const exportFileDefaultName = 'ajax_interceptor_rules.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };
    const handleImportRules = () => {
        console.log('handleImportRules');
    };
    const handleFilterTypeChange = (val, ruleId) => {
        setRules(prevRules => {
            const newRules = prevRules.map(rule => rule.id === ruleId ? Object.assign(Object.assign({}, rule), { filterType: val }) : rule);
            set('ajaxInterceptor_rules', newRules);
            return newRules;
        });
    };
    const handleMatchChange = (e, ruleId) => {
        const value = e.target.value.replace(/\n$/, ''); // Remove trailing newline
        setRules(prevRules => {
            const newRules = prevRules.map(rule => rule.id === ruleId ? Object.assign(Object.assign({}, rule), { match: value }) : rule);
            set('ajaxInterceptor_rules', newRules);
            return newRules;
        });
    };
    const handleLabelChange = (e, ruleId) => {
        setRules(prevRules => {
            const newRules = prevRules.map(rule => rule.id === ruleId ? Object.assign(Object.assign({}, rule), { label: e.target.value }) : rule);
            set('ajaxInterceptor_rules', newRules);
            return newRules;
        });
    };
    const handleClickAdd = (tabId) => {
        const newRule = {
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
    const handleBatchRemove = (ruleIds, needGroupRulesByTab = false) => {
        setRules(prevRules => {
            const newRules = prevRules.filter(rule => !ruleIds.includes(rule.id));
            set('ajaxInterceptor_rules', newRules);
            return newRules;
        });
        setInterceptedRequests(prev => {
            const newRequests = Object.assign({}, prev);
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
        }
        else {
            setDataList(prevDataList => {
                const newDataList = Object.assign({}, prevDataList);
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
            var _a;
            const newDataList = Object.assign({}, prevDataList);
            if (currentTabId && ((_a = newDataList[currentTabId]) === null || _a === void 0 ? void 0 : _a.length) === 0) {
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
    const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };
    const handleTabEdit = (targetKey, action) => {
        if (action === 'add') {
            const newTabId = generateRandomString(5);
            handleClickAdd(newTabId);
        }
        else {
            const tabId = targetKey;
            let deletingRuleIds = dataList[tabId].map(rule => rule.id);
            handleBatchRemove(deletingRuleIds, true);
            const remainingTabs = Object.keys(dataList).filter(id => id !== tabId);
            // Set the activeKey to the last remaining tab, or undefined if no tabs left
            setActiveKey(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : undefined);
        }
    };
    const renderTabs = () => {
        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_7__["default"], { activeKey: activeKey, size: 'small', onChange: (key) => setActiveKey(key), type: "editable-card", items: Object.entries(dataList).map(([tabId, rules]) => {
                const filteredRules = rules.filter(rule => searchName ? rule.label.indexOf(searchName) > -1 : true).filter(rule => searchUrl ? rule.match.indexOf(searchUrl) > -1 : true);
                const newLocal = (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_2__["default"], { className: 'collapse', onChange: handleCollaseChange }, renderRules(filteredRules)),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"], { size: "large", className: 'btn-add', type: "primary", onClick: () => handleClickAdd(tabId), disabled: !switchOn },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_9__["default"], null))));
                return {
                    key: tabId,
                    label: (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { className: "site-badge-count-109", count: filteredRules.length, size: 'small', style: { backgroundColor: '#52c41a' } }),
                        "\u00A0",
                        tabId)),
                    children: newLocal,
                };
            }), onEdit: handleTabEdit }));
    };
    const renderRules = (rules) => {
        return rules.map((rule) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Panel, { key: rule.key, header: renderPanelHeader(rule) },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Replacer__WEBPACK_IMPORTED_MODULE_4__["default"], { updateAddBtnTop_interval: () => { }, ruleId: rule.id, set: set, rule: rule, rules: rules }),
            renderInterceptedRequests(rule.match))));
    };
    const renderPanelHeader = ({ id, filterType = 'normal', limitMethod = 'ALL', match, label, switchOn = true, key }) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "panel-header", onClick: e => e.stopPropagation() },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
            } },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_11__["default"].Compact, null,
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_12__["default"], { size: "small", placeholder: "name", style: {
                        maxWidth: '200px',
                        flex: 'auto',
                        display: 'inline-block',
                    }, defaultValue: label, onChange: e => handleLabelChange(e, id) }),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_3__["default"], { size: "small", defaultValue: limitMethod, style: {
                        width: '1px',
                        maxWidth: '120px',
                        flex: '1.5 1 auto',
                        display: 'inline-block',
                    }, onChange: val => handleLimitMethodChange(val, id) },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Option, { value: "ALL" }, "ALL"),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Option, { value: "GET" }, "GET"),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Option, { value: "POST" }, "POST"),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Option, { value: "PUT" }, "PUT"),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Option, { value: "HEAD" }, "HEAD"),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Option, { value: "DELETE" }, "DELETE"),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Option, { value: "OPTIONS" }, "OPTIONS")),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_3__["default"], { size: "small", defaultValue: filterType, style: {
                        width: '1px',
                        maxWidth: '120px',
                        flex: '1.5 1 auto',
                        display: 'inline-block',
                    }, onChange: val => handleFilterTypeChange(val, id) },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Option, { value: "normal" }, "normal"),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Option, { value: "regex" }, "regex"))),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_12__["default"].TextArea, { rows: 2, size: "small", placeholder: filterType === 'normal' ? 'eg: abc/get' : 'eg: abc.*', style: {
                    flex: '1',
                    width: '100%',
                    display: 'inline-block',
                    marginTop: 10,
                }, defaultValue: match, onChange: e => handleMatchChange(e, id) })),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "button-group" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_13__["default"], { size: "small", defaultChecked: switchOn, onChange: val => handleSingleSwitchChange(val, id), style: {
                    width: '28px',
                    flex: 'none',
                    marginRight: '8px',
                } }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"], { danger: true, type: "primary", shape: "circle", icon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_14__["default"], null), size: "small", onClick: e => handleClickRemove(e, id), style: { width: '24px', flex: 'none' } }))));
    const renderInterceptedRequests = (match) => {
        if (!interceptedRequests[match]) {
            return null;
        }
        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "intercepted-requests" }, "Intercepted Networks:"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "intercepted" }, interceptedRequests[match].map(({ url, num }) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_15__["default"], { placement: "top", title: url, key: url },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { count: num, style: {
                        backgroundColor: '#fff',
                        color: '#999',
                        boxShadow: '0 0 0 1px #d9d9d9 inset',
                        marginTop: '-3px',
                        marginRight: '4px',
                    } }),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "url" }, url)))))));
    };
    const renderHeader = () => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
            textAlign: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'white',
            paddingBottom: 10,
        } },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            } },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                } },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_13__["default"], { checked: switchOn, onChange: handleSwitchChange }),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_11__["default"].Compact, null,
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_12__["default"], { allowClear: true, onChange: (e) => {
                            setNewTabName(e.target.value);
                        }, placeholder: "Add new tab", onPressEnter: (e) => {
                            handleClickAdd(newTabName || generateRandomString(5));
                        } }),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"], { type: "primary", icon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_9__["default"], null), onClick: () => handleClickAdd(newTabName || generateRandomString(5)) }),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"], { type: "primary", icon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_16__.FaFileExport, { style: {
                                marginBottom: -1
                            } }), onClick: () => handleExportRules() }),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_17__["default"], Object.assign({}, uploadProps),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"], { type: "primary", icon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_16__.FaFileImport, { style: {
                                    marginBottom: -1
                                } }) })))),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                } },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_12__["default"], { style: { marginRight: 10 }, placeholder: "Search by name", onPressEnter: handleSearch }),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_12__["default"], { style: { marginRight: 10 }, placeholder: "Search by url", onPressEnter: handleUrlSearch }),
                showRefreshTip && (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                        color: '#1890ff',
                        lineHeight: '16px',
                        marginTop: '16px',
                    } }, "Please Refresh your page after changing rules."))))));
    if (isLoading) {
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Loading...");
    }
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"], { onClick: () => {
            window.open('./mainpanel.html', '_blank');
        } }, "open popup"));
};
const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(document.getElementById("root"));
root.render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().StrictMode), null,
    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(App, null)));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		// The chunk loading function for additional chunks
/******/ 		// Since all referenced chunks are already included
/******/ 		// in this file, this function is empty here.
/******/ 		__webpack_require__.e = () => (Promise.resolve());
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"popup": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkchrome_extension_typescript_starter"] = self["webpackChunkchrome_extension_typescript_starter"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/popup.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Q7V0FDdEQsc0NBQXNDLGlFQUFpRTtXQUN2RztXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBOzs7OztXQ1ZBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ0pBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2xCQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1dDaERBOzs7OztVRUFBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9wb3B1cC50c3giLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2FtZCBvcHRpb25zIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2NyZWF0ZSBmYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9lbnN1cmUgY2h1bmsiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvaGFybW9ueSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlQ2FsbGJhY2ssIHVzZVJlZHVjZXIgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjcmVhdGVSb290IH0gZnJvbSBcInJlYWN0LWRvbS9jbGllbnRcIjtcbmltcG9ydCB7IFN3aXRjaCwgQ29sbGFwc2UsIElucHV0LCBTZWxlY3QsIEJ1dHRvbiwgQmFkZ2UsIFRvb2x0aXAsIFNwYWNlLCBUYWJzLCBtZXNzYWdlLCBVcGxvYWQsIH0gZnJvbSAnYW50ZCc7XG5pbXBvcnQgeyBQbHVzT3V0bGluZWQsIERlbGV0ZU91dGxpbmVkIH0gZnJvbSAnQGFudC1kZXNpZ24vaWNvbnMnO1xuaW1wb3J0IHsgRmFGaWxlRXhwb3J0LCBGYUZpbGVJbXBvcnQgfSBmcm9tIFwicmVhY3QtaWNvbnMvZmFcIjtcbmNvbnN0IHsgUGFuZWwgfSA9IENvbGxhcHNlO1xuY29uc3QgeyBPcHRpb24gfSA9IFNlbGVjdDtcbmltcG9ydCBSZXBsYWNlciBmcm9tICcuL2NvbXBvbmVudHMvUmVwbGFjZXInO1xuaW1wb3J0ICcuL2luZGV4Lmxlc3MnO1xuY29uc3QgYnVpbGRVVUlEID0gKCkgPT4ge1xuICAgIGNvbnN0IGR0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgKGMpID0+IHtcbiAgICAgICAgY29uc3QgciA9IChkdCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgICAgIHJldHVybiAoYyA9PT0gJ3gnID8gciA6IChyICYgMHgzKSB8IDB4OCkudG9TdHJpbmcoMTYpO1xuICAgIH0pO1xufTtcbmNvbnN0IGdlbmVyYXRlVW5pcXVlSWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIERhdGUubm93KCkudG9TdHJpbmcoMzYpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIpO1xufTtcbmNvbnN0IEFwcCA9ICgpID0+IHtcbiAgICBjb25zdCBbaW50ZXJjZXB0ZWRSZXF1ZXN0cywgc2V0SW50ZXJjZXB0ZWRSZXF1ZXN0c10gPSB1c2VTdGF0ZSh7fSk7XG4gICAgY29uc3QgW3Nob3dBbGxSdWxlcywgc2V0U2hvd0FsbFJ1bGVzXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbcG9zaXRpb25DbGFzcywgc2V0UG9zaXRpb25DbGFzc10gPSB1c2VTdGF0ZSgnc3VzcGVuZCcpO1xuICAgIGNvbnN0IFtjdXN0b21GdW5jdGlvbiwgc2V0Q3VzdG9tRnVuY3Rpb25dID0gdXNlU3RhdGUoeyBwYW5lbFBvc2l0aW9uOiAwIH0pO1xuICAgIGNvbnN0IFtzaG93UmVmcmVzaFRpcCwgc2V0U2hvd1JlZnJlc2hUaXBdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzZWFyY2hOYW1lLCBzZXRTZWFyY2hOYW1lXSA9IHVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCBbbmV3VGFiTmFtZSwgc2V0TmV3VGFiTmFtZV0gPSB1c2VTdGF0ZSgnJyk7XG4gICAgY29uc3QgW3NlYXJjaFVybCwgc2V0U2VhcmNoVXJsXSA9IHVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCBmb3JjZVVwZGF0ZVRpbWVvdXRSZWYgPSB1c2VSZWYobnVsbCk7XG4gICAgY29uc3QgWywgZm9yY2VVcGRhdGVdID0gdXNlUmVkdWNlcih4ID0+IHggKyAxLCAwKTtcbiAgICBjb25zdCBbYWN0aXZlS2V5LCBzZXRBY3RpdmVLZXldID0gdXNlU3RhdGUodW5kZWZpbmVkKTtcbiAgICBjb25zdCBbc3dpdGNoT24sIHNldFN3aXRjaE9uXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbcnVsZXMsIHNldFJ1bGVzXSA9IHVzZVN0YXRlKFtdKTtcbiAgICBjb25zdCBbZGF0YUxpc3QsIHNldERhdGFMaXN0XSA9IHVzZVN0YXRlKHt9KTtcbiAgICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFsnYWpheEludGVyY2VwdG9yX3N3aXRjaE9uJywgJ2FqYXhJbnRlcmNlcHRvcl9ydWxlcycsICdjdXN0b21GdW5jdGlvbiddLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBzZXRTd2l0Y2hPbihyZXN1bHQuYWpheEludGVyY2VwdG9yX3N3aXRjaE9uIHx8IGZhbHNlKTtcbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgZGVmYXVsdCBydWxlIGlmIG5vIHJ1bGVzIGV4aXN0XG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5hamF4SW50ZXJjZXB0b3JfcnVsZXMgfHwgcmVzdWx0LmFqYXhJbnRlcmNlcHRvcl9ydWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0UnVsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGdlbmVyYXRlVW5pcXVlSWQoKSxcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2g6ICcnLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0RlZmF1bHQgUnVsZScsXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaE9uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBrZXk6IGJ1aWxkVVVJRCgpLFxuICAgICAgICAgICAgICAgICAgICB0YWJJZDogJ0RlZmF1bHQnLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdFJ1bGVzID0gW2RlZmF1bHRSdWxlXTtcbiAgICAgICAgICAgICAgICBzZXRSdWxlcyhkZWZhdWx0UnVsZXMpO1xuICAgICAgICAgICAgICAgIHNldCgnYWpheEludGVyY2VwdG9yX3J1bGVzJywgZGVmYXVsdFJ1bGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFJ1bGVzKHJlc3VsdC5hamF4SW50ZXJjZXB0b3JfcnVsZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0Q3VzdG9tRnVuY3Rpb24ocmVzdWx0LmN1c3RvbUZ1bmN0aW9uIHx8IHsgcGFuZWxQb3NpdGlvbjogMCB9KTtcbiAgICAgICAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzZXR1cE1lc3NhZ2VMaXN0ZW5lcigpO1xuICAgICAgICBub3RpZnlCYWNrZ3JvdW5kU2NyaXB0TG9hZGVkKCk7XG4gICAgfSwgW10pO1xuICAgIGNvbnN0IGdyb3VwUnVsZXNCeVRhYiA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgY29uc3QgZ3JvdXBlZFJ1bGVzID0gcnVsZXMucmVkdWNlKChhY2MsIHJ1bGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhYiA9IHJ1bGUudGFiSWQgfHwgJ0RlZmF1bHQnO1xuICAgICAgICAgICAgaWYgKCFhY2NbdGFiXSkge1xuICAgICAgICAgICAgICAgIGFjY1t0YWJdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY2NbdGFiXS5wdXNoKHJ1bGUpO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZ3JvdXBlZFJ1bGVzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGdyb3VwZWRSdWxlc1snRGVmYXVsdCddID0gW107XG4gICAgICAgIH1cbiAgICAgICAgc2V0RGF0YUxpc3QoZ3JvdXBlZFJ1bGVzKTtcbiAgICAgICAgLy8gT25seSBzZXQgdGhlIGFjdGl2ZUtleSBpZiBpdCdzIG5vdCBhbHJlYWR5IHNldFxuICAgICAgICBpZiAoIWFjdGl2ZUtleSkge1xuICAgICAgICAgICAgY29uc3QgZmlyc3RUYWJJZCA9IE9iamVjdC5rZXlzKGdyb3VwZWRSdWxlcylbMF07XG4gICAgICAgICAgICBzZXRBY3RpdmVLZXkoZmlyc3RUYWJJZCk7XG4gICAgICAgIH1cbiAgICB9LCBbcnVsZXMsIGFjdGl2ZUtleV0pO1xuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGdyb3VwUnVsZXNCeVRhYigpO1xuICAgIH0sIFtydWxlcywgZ3JvdXBSdWxlc0J5VGFiXSk7XG4gICAgY29uc3Qgc2V0dXBNZXNzYWdlTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihoYW5kbGVJbmNvbWluZ01lc3NhZ2UpO1xuICAgIH07XG4gICAgY29uc3QgdXBsb2FkUHJvcHMgPSB7XG4gICAgICAgIG5hbWU6ICdmaWxlJyxcbiAgICAgICAgYWN0aW9uOiAnIycsXG4gICAgICAgIGFjY2VwdDogJy5qc29uJyxcbiAgICAgICAgYmVmb3JlVXBsb2FkKGZpbGUpIHtcbiAgICAgICAgICAgIGFsZXJ0KCdiZWZvcmVVcGxvYWQnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZpbGUpO1xuICAgICAgICAgICAgLy8gZ2V0IGpzb24gZGF0YWJhc2VcbiAgICAgICAgICAgIGNvbnN0IGpzb25EYXRhYmFzZSA9IGZpbGU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhqc29uRGF0YWJhc2UpO1xuICAgICAgICAgICAgLy8gcmVwbGFjZSBydWxlc1xuICAgICAgICAgICAgc2V0UnVsZXMoanNvbkRhdGFiYXNlKTtcbiAgICAgICAgICAgIC8vIHNldCB0byBzdG9yYWdlXG4gICAgICAgICAgICBzZXQoJ2FqYXhJbnRlcmNlcHRvcl9ydWxlcycsIGpzb25EYXRhYmFzZSk7XG4gICAgICAgICAgICAvLyBncm91cCBydWxlcyBieSB0YWJcbiAgICAgICAgICAgIGdyb3VwUnVsZXNCeVRhYigpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbkNoYW5nZShpbmZvKSB7XG4gICAgICAgICAgICBpZiAoaW5mby5maWxlLnN0YXR1cyAhPT0gJ3VwbG9hZGluZycpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbmZvLmZpbGUsIGluZm8uZmlsZUxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZm8uZmlsZS5zdGF0dXMgPT09ICdkb25lJykge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2Uuc3VjY2VzcyhgJHtpbmZvLmZpbGUubmFtZX0gZmlsZSB1cGxvYWRlZCBzdWNjZXNzZnVsbHlgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGluZm8uZmlsZS5zdGF0dXMgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLmVycm9yKGAke2luZm8uZmlsZS5uYW1lfSBmaWxlIHVwbG9hZCBmYWlsZWQuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVJbmNvbWluZ01lc3NhZ2UgPSB1c2VDYWxsYmFjaygoeyB0eXBlLCB0bywgdXJsLCBtYXRjaCwgY29udGVudFNjcmlwdExvYWRlZCA9IGZhbHNlLCBzaG93RnJlc2hUaXAgPSBmYWxzZSwgfSkgPT4ge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ2FqYXhJbnRlcmNlcHRvcicgJiYgdG8gPT09ICdpZnJhbWUnKSB7XG4gICAgICAgICAgICBpZiAoY29udGVudFNjcmlwdExvYWRlZCB8fCBzaG93RnJlc2hUaXApIHtcbiAgICAgICAgICAgICAgICBzZXRTaG93UmVmcmVzaFRpcChzaG93RnJlc2hUaXApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldEludGVyY2VwdGVkUmVxdWVzdHMocHJldiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UmVxdWVzdHMgPSBPYmplY3QuYXNzaWduKHt9LCBwcmV2KTtcbiAgICAgICAgICAgICAgICBpZiAoIW5ld1JlcXVlc3RzW21hdGNoXSlcbiAgICAgICAgICAgICAgICAgICAgbmV3UmVxdWVzdHNbbWF0Y2hdID0gW107XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gbmV3UmVxdWVzdHNbbWF0Y2hdLnNvbWUob2JqID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iai51cmwgPT09IHVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLm51bSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1JlcXVlc3RzW21hdGNoXS5wdXNoKHsgdXJsLCBudW06IDEgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXdSZXF1ZXN0cztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwgW10pO1xuICAgIGNvbnN0IG5vdGlmeUJhY2tncm91bmRTY3JpcHRMb2FkZWQgPSAoKSA9PiB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKGNocm9tZS5ydW50aW1lLmlkLCB7XG4gICAgICAgICAgICB0eXBlOiAnYWpheEludGVyY2VwdG9yJyxcbiAgICAgICAgICAgIHRvOiAnYmFja2dyb3VuZCcsXG4gICAgICAgICAgICBpZnJhbWVTY3JpcHRMb2FkZWQ6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3Qgc2V0ID0gKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShjaHJvbWUucnVudGltZS5pZCwge1xuICAgICAgICAgICAgdHlwZTogJ2FqYXhJbnRlcmNlcHRvcicsXG4gICAgICAgICAgICB0bzogJ2JhY2tncm91bmQnLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgIH0pO1xuICAgICAgICAoX2EgPSBjaHJvbWUuc3RvcmFnZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxvY2FsLnNldCh7IFtrZXldOiB2YWx1ZSB9KTtcbiAgICB9O1xuICAgIGNvbnN0IGZvcmNlVXBkYXRlRGVib3VjZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKGZvcmNlVXBkYXRlVGltZW91dFJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoZm9yY2VVcGRhdGVUaW1lb3V0UmVmLmN1cnJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGZvcmNlVXBkYXRlVGltZW91dFJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBmb3JjZVVwZGF0ZSgpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZVNpbmdsZVN3aXRjaENoYW5nZSA9IChzd2l0Y2hPbiwgcnVsZUlkKSA9PiB7XG4gICAgICAgIHNldFJ1bGVzKHByZXZSdWxlcyA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdSdWxlcyA9IHByZXZSdWxlcy5tYXAocnVsZSA9PiBydWxlLmlkID09PSBydWxlSWQgPyBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHJ1bGUpLCB7IHN3aXRjaE9uIH0pIDogcnVsZSk7XG4gICAgICAgICAgICBzZXQoJ2FqYXhJbnRlcmNlcHRvcl9ydWxlcycsIG5ld1J1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdSdWxlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVMaW1pdE1ldGhvZENoYW5nZSA9ICh2YWwsIHJ1bGVJZCkgPT4ge1xuICAgICAgICBzZXRSdWxlcyhwcmV2UnVsZXMgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3UnVsZXMgPSBwcmV2UnVsZXMubWFwKHJ1bGUgPT4gcnVsZS5pZCA9PT0gcnVsZUlkID8gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBydWxlKSwgeyBsaW1pdE1ldGhvZDogdmFsIH0pIDogcnVsZSk7XG4gICAgICAgICAgICBzZXQoJ2FqYXhJbnRlcmNlcHRvcl9ydWxlcycsIG5ld1J1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdSdWxlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVFeHBvcnRSdWxlcyA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcnVsZXNGb3JFeHBvcnQgPSBydWxlcy5tYXAocnVsZSA9PiAoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBydWxlKSwgeyBvdmVycmlkZVR4dDogdHlwZW9mIHJ1bGUub3ZlcnJpZGVUeHQgPT09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShydWxlLm92ZXJyaWRlVHh0KSA6IHJ1bGUub3ZlcnJpZGVUeHQgfSkpKTtcbiAgICAgICAgY29uc3QgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KHJ1bGVzRm9yRXhwb3J0LCBudWxsLCAyKTtcbiAgICAgICAgY29uc3QgZGF0YVVyaSA9IGBkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCwke2VuY29kZVVSSUNvbXBvbmVudChkYXRhU3RyKX1gO1xuICAgICAgICBjb25zdCBleHBvcnRGaWxlRGVmYXVsdE5hbWUgPSAnYWpheF9pbnRlcmNlcHRvcl9ydWxlcy5qc29uJztcbiAgICAgICAgY29uc3QgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsIGRhdGFVcmkpO1xuICAgICAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZXhwb3J0RmlsZURlZmF1bHROYW1lKTtcbiAgICAgICAgbGlua0VsZW1lbnQuY2xpY2soKTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZUltcG9ydFJ1bGVzID0gKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlSW1wb3J0UnVsZXMnKTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZUZpbHRlclR5cGVDaGFuZ2UgPSAodmFsLCBydWxlSWQpID0+IHtcbiAgICAgICAgc2V0UnVsZXMocHJldlJ1bGVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1J1bGVzID0gcHJldlJ1bGVzLm1hcChydWxlID0+IHJ1bGUuaWQgPT09IHJ1bGVJZCA/IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcnVsZSksIHsgZmlsdGVyVHlwZTogdmFsIH0pIDogcnVsZSk7XG4gICAgICAgICAgICBzZXQoJ2FqYXhJbnRlcmNlcHRvcl9ydWxlcycsIG5ld1J1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdSdWxlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVNYXRjaENoYW5nZSA9IChlLCBydWxlSWQpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBlLnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXG4kLywgJycpOyAvLyBSZW1vdmUgdHJhaWxpbmcgbmV3bGluZVxuICAgICAgICBzZXRSdWxlcyhwcmV2UnVsZXMgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3UnVsZXMgPSBwcmV2UnVsZXMubWFwKHJ1bGUgPT4gcnVsZS5pZCA9PT0gcnVsZUlkID8gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBydWxlKSwgeyBtYXRjaDogdmFsdWUgfSkgOiBydWxlKTtcbiAgICAgICAgICAgIHNldCgnYWpheEludGVyY2VwdG9yX3J1bGVzJywgbmV3UnVsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ld1J1bGVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZUxhYmVsQ2hhbmdlID0gKGUsIHJ1bGVJZCkgPT4ge1xuICAgICAgICBzZXRSdWxlcyhwcmV2UnVsZXMgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3UnVsZXMgPSBwcmV2UnVsZXMubWFwKHJ1bGUgPT4gcnVsZS5pZCA9PT0gcnVsZUlkID8gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBydWxlKSwgeyBsYWJlbDogZS50YXJnZXQudmFsdWUgfSkgOiBydWxlKTtcbiAgICAgICAgICAgIHNldCgnYWpheEludGVyY2VwdG9yX3J1bGVzJywgbmV3UnVsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ld1J1bGVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZUNsaWNrQWRkID0gKHRhYklkKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld1J1bGUgPSB7XG4gICAgICAgICAgICBpZDogZ2VuZXJhdGVVbmlxdWVJZCgpLFxuICAgICAgICAgICAgbWF0Y2g6ICcnLFxuICAgICAgICAgICAgbGFiZWw6IGB1cmwke3J1bGVzLmxlbmd0aCArIDF9YCxcbiAgICAgICAgICAgIHN3aXRjaE9uOiB0cnVlLFxuICAgICAgICAgICAga2V5OiBidWlsZFVVSUQoKSxcbiAgICAgICAgICAgIHRhYklkOiB0YWJJZCxcbiAgICAgICAgfTtcbiAgICAgICAgc2V0QWN0aXZlS2V5KHRhYklkKTtcbiAgICAgICAgc2V0UnVsZXMocHJldlJ1bGVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1J1bGVzID0gWy4uLnByZXZSdWxlcywgbmV3UnVsZV07XG4gICAgICAgICAgICBzZXQoJ2FqYXhJbnRlcmNlcHRvcl9ydWxlcycsIG5ld1J1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdSdWxlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVCYXRjaFJlbW92ZSA9IChydWxlSWRzLCBuZWVkR3JvdXBSdWxlc0J5VGFiID0gZmFsc2UpID0+IHtcbiAgICAgICAgc2V0UnVsZXMocHJldlJ1bGVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1J1bGVzID0gcHJldlJ1bGVzLmZpbHRlcihydWxlID0+ICFydWxlSWRzLmluY2x1ZGVzKHJ1bGUuaWQpKTtcbiAgICAgICAgICAgIHNldCgnYWpheEludGVyY2VwdG9yX3J1bGVzJywgbmV3UnVsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ld1J1bGVzO1xuICAgICAgICB9KTtcbiAgICAgICAgc2V0SW50ZXJjZXB0ZWRSZXF1ZXN0cyhwcmV2ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1JlcXVlc3RzID0gT2JqZWN0LmFzc2lnbih7fSwgcHJldik7XG4gICAgICAgICAgICBydWxlSWRzLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bGUgPSBydWxlcy5maW5kKHIgPT4gci5pZCA9PT0gaWQpO1xuICAgICAgICAgICAgICAgIGlmIChydWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXdSZXF1ZXN0c1tydWxlLm1hdGNoXTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5ld1JlcXVlc3RzW3J1bGUubGFiZWxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG5ld1JlcXVlc3RzO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG5lZWRHcm91cFJ1bGVzQnlUYWIpIHtcbiAgICAgICAgICAgIGdyb3VwUnVsZXNCeVRhYigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2V0RGF0YUxpc3QocHJldkRhdGFMaXN0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdEYXRhTGlzdCA9IE9iamVjdC5hc3NpZ24oe30sIHByZXZEYXRhTGlzdCk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMobmV3RGF0YUxpc3QpLmZvckVhY2godGFiSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBuZXdEYXRhTGlzdFt0YWJJZF0gPSBuZXdEYXRhTGlzdFt0YWJJZF0uZmlsdGVyKHJ1bGUgPT4gIXJ1bGVJZHMuaW5jbHVkZXMocnVsZS5pZCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXdEYXRhTGlzdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVDbGlja1JlbW92ZSA9IChlLCBydWxlSWQpID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgY29uc3QgY3VycmVudFRhYklkID0gYWN0aXZlS2V5O1xuICAgICAgICBoYW5kbGVCYXRjaFJlbW92ZShbcnVsZUlkXSk7XG4gICAgICAgIHNldERhdGFMaXN0KHByZXZEYXRhTGlzdCA9PiB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBjb25zdCBuZXdEYXRhTGlzdCA9IE9iamVjdC5hc3NpZ24oe30sIHByZXZEYXRhTGlzdCk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFRhYklkICYmICgoX2EgPSBuZXdEYXRhTGlzdFtjdXJyZW50VGFiSWRdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVuZ3RoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXdEYXRhTGlzdFtjdXJyZW50VGFiSWRdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbWFpbmluZ1RhYnMgPSBPYmplY3Qua2V5cyhuZXdEYXRhTGlzdCk7XG4gICAgICAgICAgICAgICAgc2V0QWN0aXZlS2V5KHJlbWFpbmluZ1RhYnMubGVuZ3RoID4gMCA/IHJlbWFpbmluZ1RhYnNbMF0gOiB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ld0RhdGFMaXN0O1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZUNvbGxhc2VDaGFuZ2UgPSAoKSA9PiB7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVTd2l0Y2hDaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgIHNldFN3aXRjaE9uKHByZXYgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3U3dpdGNoT24gPSAhcHJldjtcbiAgICAgICAgICAgIHNldCgnYWpheEludGVyY2VwdG9yX3N3aXRjaE9uJywgbmV3U3dpdGNoT24pO1xuICAgICAgICAgICAgcmV0dXJuIG5ld1N3aXRjaE9uO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZVNlYXJjaCA9IChlKSA9PiB7XG4gICAgICAgIHNldFNlYXJjaE5hbWUoZS50YXJnZXQudmFsdWUpO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlVXJsU2VhcmNoID0gKGUpID0+IHtcbiAgICAgICAgc2V0U2VhcmNoVXJsKGUudGFyZ2V0LnZhbHVlKTtcbiAgICB9O1xuICAgIGNvbnN0IGdlbmVyYXRlUmFuZG9tU3RyaW5nID0gKGxlbmd0aCkgPT4ge1xuICAgICAgICBjb25zdCBjaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5JztcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVycy5sZW5ndGgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlVGFiRWRpdCA9ICh0YXJnZXRLZXksIGFjdGlvbikgPT4ge1xuICAgICAgICBpZiAoYWN0aW9uID09PSAnYWRkJykge1xuICAgICAgICAgICAgY29uc3QgbmV3VGFiSWQgPSBnZW5lcmF0ZVJhbmRvbVN0cmluZyg1KTtcbiAgICAgICAgICAgIGhhbmRsZUNsaWNrQWRkKG5ld1RhYklkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHRhYklkID0gdGFyZ2V0S2V5O1xuICAgICAgICAgICAgbGV0IGRlbGV0aW5nUnVsZUlkcyA9IGRhdGFMaXN0W3RhYklkXS5tYXAocnVsZSA9PiBydWxlLmlkKTtcbiAgICAgICAgICAgIGhhbmRsZUJhdGNoUmVtb3ZlKGRlbGV0aW5nUnVsZUlkcywgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCByZW1haW5pbmdUYWJzID0gT2JqZWN0LmtleXMoZGF0YUxpc3QpLmZpbHRlcihpZCA9PiBpZCAhPT0gdGFiSWQpO1xuICAgICAgICAgICAgLy8gU2V0IHRoZSBhY3RpdmVLZXkgdG8gdGhlIGxhc3QgcmVtYWluaW5nIHRhYiwgb3IgdW5kZWZpbmVkIGlmIG5vIHRhYnMgbGVmdFxuICAgICAgICAgICAgc2V0QWN0aXZlS2V5KHJlbWFpbmluZ1RhYnMubGVuZ3RoID4gMCA/IHJlbWFpbmluZ1RhYnNbcmVtYWluaW5nVGFicy5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHJlbmRlclRhYnMgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChUYWJzLCB7IGFjdGl2ZUtleTogYWN0aXZlS2V5LCBzaXplOiAnc21hbGwnLCBvbkNoYW5nZTogKGtleSkgPT4gc2V0QWN0aXZlS2V5KGtleSksIHR5cGU6IFwiZWRpdGFibGUtY2FyZFwiLCBpdGVtczogT2JqZWN0LmVudHJpZXMoZGF0YUxpc3QpLm1hcCgoW3RhYklkLCBydWxlc10pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZFJ1bGVzID0gcnVsZXMuZmlsdGVyKHJ1bGUgPT4gc2VhcmNoTmFtZSA/IHJ1bGUubGFiZWwuaW5kZXhPZihzZWFyY2hOYW1lKSA+IC0xIDogdHJ1ZSkuZmlsdGVyKHJ1bGUgPT4gc2VhcmNoVXJsID8gcnVsZS5tYXRjaC5pbmRleE9mKHNlYXJjaFVybCkgPiAtMSA6IHRydWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xvY2FsID0gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sbGFwc2UsIHsgY2xhc3NOYW1lOiAnY29sbGFwc2UnLCBvbkNoYW5nZTogaGFuZGxlQ29sbGFzZUNoYW5nZSB9LCByZW5kZXJSdWxlcyhmaWx0ZXJlZFJ1bGVzKSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IHNpemU6IFwibGFyZ2VcIiwgY2xhc3NOYW1lOiAnYnRuLWFkZCcsIHR5cGU6IFwicHJpbWFyeVwiLCBvbkNsaWNrOiAoKSA9PiBoYW5kbGVDbGlja0FkZCh0YWJJZCksIGRpc2FibGVkOiAhc3dpdGNoT24gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGx1c091dGxpbmVkLCBudWxsKSkpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IHRhYklkLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQmFkZ2UsIHsgY2xhc3NOYW1lOiBcInNpdGUtYmFkZ2UtY291bnQtMTA5XCIsIGNvdW50OiBmaWx0ZXJlZFJ1bGVzLmxlbmd0aCwgc2l6ZTogJ3NtYWxsJywgc3R5bGU6IHsgYmFja2dyb3VuZENvbG9yOiAnIzUyYzQxYScgfSB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx1MDBBMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFiSWQpKSxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IG5ld0xvY2FsLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSwgb25FZGl0OiBoYW5kbGVUYWJFZGl0IH0pKTtcbiAgICB9O1xuICAgIGNvbnN0IHJlbmRlclJ1bGVzID0gKHJ1bGVzKSA9PiB7XG4gICAgICAgIHJldHVybiBydWxlcy5tYXAoKHJ1bGUpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KFBhbmVsLCB7IGtleTogcnVsZS5rZXksIGhlYWRlcjogcmVuZGVyUGFuZWxIZWFkZXIocnVsZSkgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVwbGFjZXIsIHsgdXBkYXRlQWRkQnRuVG9wX2ludGVydmFsOiAoKSA9PiB7IH0sIHJ1bGVJZDogcnVsZS5pZCwgc2V0OiBzZXQsIHJ1bGU6IHJ1bGUsIHJ1bGVzOiBydWxlcyB9KSxcbiAgICAgICAgICAgIHJlbmRlckludGVyY2VwdGVkUmVxdWVzdHMocnVsZS5tYXRjaCkpKSk7XG4gICAgfTtcbiAgICBjb25zdCByZW5kZXJQYW5lbEhlYWRlciA9ICh7IGlkLCBmaWx0ZXJUeXBlID0gJ25vcm1hbCcsIGxpbWl0TWV0aG9kID0gJ0FMTCcsIG1hdGNoLCBsYWJlbCwgc3dpdGNoT24gPSB0cnVlLCBrZXkgfSkgPT4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicGFuZWwtaGVhZGVyXCIsIG9uQ2xpY2s6IGUgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICAgICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3BhY2UuQ29tcGFjdCwgbnVsbCxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElucHV0LCB7IHNpemU6IFwic21hbGxcIiwgcGxhY2Vob2xkZXI6IFwibmFtZVwiLCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6ICcyMDBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4OiAnYXV0bycsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgICAgICAgICAgfSwgZGVmYXVsdFZhbHVlOiBsYWJlbCwgb25DaGFuZ2U6IGUgPT4gaGFuZGxlTGFiZWxDaGFuZ2UoZSwgaWQpIH0pLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0LCB7IHNpemU6IFwic21hbGxcIiwgZGVmYXVsdFZhbHVlOiBsaW1pdE1ldGhvZCwgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMXB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heFdpZHRoOiAnMTIwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogJzEuNSAxIGF1dG8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgICAgICAgIH0sIG9uQ2hhbmdlOiB2YWwgPT4gaGFuZGxlTGltaXRNZXRob2RDaGFuZ2UodmFsLCBpZCkgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChPcHRpb24sIHsgdmFsdWU6IFwiQUxMXCIgfSwgXCJBTExcIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoT3B0aW9uLCB7IHZhbHVlOiBcIkdFVFwiIH0sIFwiR0VUXCIpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE9wdGlvbiwgeyB2YWx1ZTogXCJQT1NUXCIgfSwgXCJQT1NUXCIpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE9wdGlvbiwgeyB2YWx1ZTogXCJQVVRcIiB9LCBcIlBVVFwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChPcHRpb24sIHsgdmFsdWU6IFwiSEVBRFwiIH0sIFwiSEVBRFwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChPcHRpb24sIHsgdmFsdWU6IFwiREVMRVRFXCIgfSwgXCJERUxFVEVcIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoT3B0aW9uLCB7IHZhbHVlOiBcIk9QVElPTlNcIiB9LCBcIk9QVElPTlNcIikpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0LCB7IHNpemU6IFwic21hbGxcIiwgZGVmYXVsdFZhbHVlOiBmaWx0ZXJUeXBlLCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4OiAnMS41IDEgYXV0bycsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgICAgICAgICAgfSwgb25DaGFuZ2U6IHZhbCA9PiBoYW5kbGVGaWx0ZXJUeXBlQ2hhbmdlKHZhbCwgaWQpIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoT3B0aW9uLCB7IHZhbHVlOiBcIm5vcm1hbFwiIH0sIFwibm9ybWFsXCIpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE9wdGlvbiwgeyB2YWx1ZTogXCJyZWdleFwiIH0sIFwicmVnZXhcIikpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXQuVGV4dEFyZWEsIHsgcm93czogMiwgc2l6ZTogXCJzbWFsbFwiLCBwbGFjZWhvbGRlcjogZmlsdGVyVHlwZSA9PT0gJ25vcm1hbCcgPyAnZWc6IGFiYy9nZXQnIDogJ2VnOiBhYmMuKicsIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGZsZXg6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMTAsXG4gICAgICAgICAgICAgICAgfSwgZGVmYXVsdFZhbHVlOiBtYXRjaCwgb25DaGFuZ2U6IGUgPT4gaGFuZGxlTWF0Y2hDaGFuZ2UoZSwgaWQpIH0pKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJidXR0b24tZ3JvdXBcIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTd2l0Y2gsIHsgc2l6ZTogXCJzbWFsbFwiLCBkZWZhdWx0Q2hlY2tlZDogc3dpdGNoT24sIG9uQ2hhbmdlOiB2YWwgPT4gaGFuZGxlU2luZ2xlU3dpdGNoQ2hhbmdlKHZhbCwgaWQpLCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzI4cHgnLFxuICAgICAgICAgICAgICAgICAgICBmbGV4OiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAnOHB4JyxcbiAgICAgICAgICAgICAgICB9IH0pLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgZGFuZ2VyOiB0cnVlLCB0eXBlOiBcInByaW1hcnlcIiwgc2hhcGU6IFwiY2lyY2xlXCIsIGljb246IFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGVsZXRlT3V0bGluZWQsIG51bGwpLCBzaXplOiBcInNtYWxsXCIsIG9uQ2xpY2s6IGUgPT4gaGFuZGxlQ2xpY2tSZW1vdmUoZSwgaWQpLCBzdHlsZTogeyB3aWR0aDogJzI0cHgnLCBmbGV4OiAnbm9uZScgfSB9KSkpKTtcbiAgICBjb25zdCByZW5kZXJJbnRlcmNlcHRlZFJlcXVlc3RzID0gKG1hdGNoKSA9PiB7XG4gICAgICAgIGlmICghaW50ZXJjZXB0ZWRSZXF1ZXN0c1ttYXRjaF0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaW50ZXJjZXB0ZWQtcmVxdWVzdHNcIiB9LCBcIkludGVyY2VwdGVkIE5ldHdvcmtzOlwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaW50ZXJjZXB0ZWRcIiB9LCBpbnRlcmNlcHRlZFJlcXVlc3RzW21hdGNoXS5tYXAoKHsgdXJsLCBudW0gfSkgPT4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVG9vbHRpcCwgeyBwbGFjZW1lbnQ6IFwidG9wXCIsIHRpdGxlOiB1cmwsIGtleTogdXJsIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCYWRnZSwgeyBjb3VudDogbnVtLCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5OTknLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCAwIDAgMXB4ICNkOWQ5ZDkgaW5zZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAnLTNweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5SaWdodDogJzRweCcsXG4gICAgICAgICAgICAgICAgICAgIH0gfSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwidXJsXCIgfSwgdXJsKSkpKSkpKTtcbiAgICB9O1xuICAgIGNvbnN0IHJlbmRlckhlYWRlciA9ICgpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3N0aWNreScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICB6SW5kZXg6IDEwLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ3doaXRlJyxcbiAgICAgICAgICAgIHBhZGRpbmdCb3R0b206IDEwLFxuICAgICAgICB9IH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgICAgICAgICAgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIGdhcDogMTAsXG4gICAgICAgICAgICAgICAgfSB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3dpdGNoLCB7IGNoZWNrZWQ6IHN3aXRjaE9uLCBvbkNoYW5nZTogaGFuZGxlU3dpdGNoQ2hhbmdlIH0pLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3BhY2UuQ29tcGFjdCwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgeyBhbGxvd0NsZWFyOiB0cnVlLCBvbkNoYW5nZTogKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXROZXdUYWJOYW1lKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHBsYWNlaG9sZGVyOiBcIkFkZCBuZXcgdGFiXCIsIG9uUHJlc3NFbnRlcjogKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVDbGlja0FkZChuZXdUYWJOYW1lIHx8IGdlbmVyYXRlUmFuZG9tU3RyaW5nKDUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gfSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IHR5cGU6IFwicHJpbWFyeVwiLCBpY29uOiBSZWFjdC5jcmVhdGVFbGVtZW50KFBsdXNPdXRsaW5lZCwgbnVsbCksIG9uQ2xpY2s6ICgpID0+IGhhbmRsZUNsaWNrQWRkKG5ld1RhYk5hbWUgfHwgZ2VuZXJhdGVSYW5kb21TdHJpbmcoNSkpIH0pLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyB0eXBlOiBcInByaW1hcnlcIiwgaWNvbjogUmVhY3QuY3JlYXRlRWxlbWVudChGYUZpbGVFeHBvcnQsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gfSksIG9uQ2xpY2s6ICgpID0+IGhhbmRsZUV4cG9ydFJ1bGVzKCkgfSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXBsb2FkLCBPYmplY3QuYXNzaWduKHt9LCB1cGxvYWRQcm9wcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyB0eXBlOiBcInByaW1hcnlcIiwgaWNvbjogUmVhY3QuY3JlYXRlRWxlbWVudChGYUZpbGVJbXBvcnQsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSB9KSB9KSkpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElucHV0LCB7IHN0eWxlOiB7IG1hcmdpblJpZ2h0OiAxMCB9LCBwbGFjZWhvbGRlcjogXCJTZWFyY2ggYnkgbmFtZVwiLCBvblByZXNzRW50ZXI6IGhhbmRsZVNlYXJjaCB9KSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElucHV0LCB7IHN0eWxlOiB7IG1hcmdpblJpZ2h0OiAxMCB9LCBwbGFjZWhvbGRlcjogXCJTZWFyY2ggYnkgdXJsXCIsIG9uUHJlc3NFbnRlcjogaGFuZGxlVXJsU2VhcmNoIH0pLFxuICAgICAgICAgICAgICAgIHNob3dSZWZyZXNoVGlwICYmIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzE4OTBmZicsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAnMTZweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6ICcxNnB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSB9LCBcIlBsZWFzZSBSZWZyZXNoIHlvdXIgcGFnZSBhZnRlciBjaGFuZ2luZyBydWxlcy5cIikpKSkpKTtcbiAgICBpZiAoaXNMb2FkaW5nKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiTG9hZGluZy4uLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cub3BlbignLi9tYWlucGFuZWwuaHRtbCcsICdfYmxhbmsnKTtcbiAgICAgICAgfSB9LCBcIm9wZW4gcG9wdXBcIikpO1xufTtcbmNvbnN0IHJvb3QgPSBjcmVhdGVSb290KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSk7XG5yb290LnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LlN0cmljdE1vZGUsIG51bGwsXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChBcHAsIG51bGwpKSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5hbWRPID0ge307IiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCJ2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgPyAob2JqKSA9PiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikpIDogKG9iaikgPT4gKG9iai5fX3Byb3RvX18pO1xudmFyIGxlYWZQcm90b3R5cGVzO1xuLy8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4vLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbi8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuLy8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4vLyBtb2RlICYgMTY6IHJldHVybiB2YWx1ZSB3aGVuIGl0J3MgUHJvbWlzZS1saWtlXG4vLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuXHRpZihtb2RlICYgMSkgdmFsdWUgPSB0aGlzKHZhbHVlKTtcblx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcblx0aWYodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSkge1xuXHRcdGlmKChtb2RlICYgNCkgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuXHRcdGlmKChtb2RlICYgMTYpICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nKSByZXR1cm4gdmFsdWU7XG5cdH1cblx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcblx0dmFyIGRlZiA9IHt9O1xuXHRsZWFmUHJvdG90eXBlcyA9IGxlYWZQcm90b3R5cGVzIHx8IFtudWxsLCBnZXRQcm90byh7fSksIGdldFByb3RvKFtdKSwgZ2V0UHJvdG8oZ2V0UHJvdG8pXTtcblx0Zm9yKHZhciBjdXJyZW50ID0gbW9kZSAmIDIgJiYgdmFsdWU7IHR5cGVvZiBjdXJyZW50ID09ICdvYmplY3QnICYmICF+bGVhZlByb3RvdHlwZXMuaW5kZXhPZihjdXJyZW50KTsgY3VycmVudCA9IGdldFByb3RvKGN1cnJlbnQpKSB7XG5cdFx0T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY3VycmVudCkuZm9yRWFjaCgoa2V5KSA9PiAoZGVmW2tleV0gPSAoKSA9PiAodmFsdWVba2V5XSkpKTtcblx0fVxuXHRkZWZbJ2RlZmF1bHQnXSA9ICgpID0+ICh2YWx1ZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChucywgZGVmKTtcblx0cmV0dXJuIG5zO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCIvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3Ncbi8vIFNpbmNlIGFsbCByZWZlcmVuY2VkIGNodW5rcyBhcmUgYWxyZWFkeSBpbmNsdWRlZFxuLy8gaW4gdGhpcyBmaWxlLCB0aGlzIGZ1bmN0aW9uIGlzIGVtcHR5IGhlcmUuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSAoKSA9PiAoUHJvbWlzZS5yZXNvbHZlKCkpOyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5obWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZSA9IE9iamVjdC5jcmVhdGUobW9kdWxlKTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCAnZXhwb3J0cycsIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdHNldDogKCkgPT4ge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFUyBNb2R1bGVzIG1heSBub3QgYXNzaWduIG1vZHVsZS5leHBvcnRzIG9yIGV4cG9ydHMuKiwgVXNlIEVTTSBleHBvcnQgc3ludGF4LCBpbnN0ZWFkOiAnICsgbW9kdWxlLmlkKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgaSA9IHNjcmlwdHMubGVuZ3RoIC0gMTtcblx0XHRcdHdoaWxlIChpID4gLTEgJiYgIXNjcmlwdFVybCkgc2NyaXB0VXJsID0gc2NyaXB0c1tpLS1dLnNyYztcblx0XHR9XG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwicG9wdXBcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2hyb21lX2V4dGVuc2lvbl90eXBlc2NyaXB0X3N0YXJ0ZXJcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2hyb21lX2V4dGVuc2lvbl90eXBlc2NyaXB0X3N0YXJ0ZXJcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3BvcHVwLnRzeFwiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9