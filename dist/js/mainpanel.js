/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/mainpanel.tsx":
/*!***************************!*\
  !*** ./src/mainpanel.tsx ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/collapse/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/select/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/message/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/space/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/input/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/switch/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/button/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/tooltip/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/badge/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/spin/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/upload/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/table/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/drawer/index.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/typography/index.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/DeleteOutlined.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/CopyOutlined.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/EditOutlined.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/ExportOutlined.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/PlusOutlined.js");
/* harmony import */ var react_icons_fa__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! react-icons/fa */ "./node_modules/react-icons/fa/index.mjs");
/* harmony import */ var json_edit_react__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! json-edit-react */ "./node_modules/json-edit-react/build/index.esm.js");
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
    const [isCreating, setIsCreating] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [switchOn, setSwitchOn] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [rules, setRules] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [dataList, setDataList] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
    const [duplicateMatch, setDuplicateMatch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const tableBoxRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
    const [tableBoxHeight, setTableBoxHeight] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
    const [showDetail, setShowDetail] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [currentEditRule, setCurrentEditRule] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (tableBoxRef.current) {
            setTableBoxHeight(window.innerHeight - tableBoxRef.current.offsetTop - 34);
        }
    }, [tableBoxRef.current]);
    const readRulesFromStorage = () => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['ajaxInterceptor_rules'], (result) => {
                // setRules(result.ajaxInterceptor_rules || []);
                resolve(result.ajaxInterceptor_rules || []);
            });
        });
    };
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
                // set('ajaxInterceptor_rules', defaultRules);
            }
            else {
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
        showUploadList: false,
        beforeUpload(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                var _a;
                try {
                    const jsonDatabase = JSON.parse((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
                    console.log('jsonDatabase', jsonDatabase);
                    if (jsonDatabase.length > 0) {
                        jsonDatabase.forEach(rule => {
                            try {
                                rule.overrideTxt = JSON.stringify(rule.overrideTxt);
                            }
                            catch (error) {
                                rule.overrideTxt = '{}';
                            }
                        });
                        setRules(jsonDatabase);
                        set('ajaxInterceptor_rules', jsonDatabase);
                        groupRulesByTab();
                        antd__WEBPACK_IMPORTED_MODULE_6__["default"].success(`${file.name} uploaded successfully`);
                    }
                    else {
                        antd__WEBPACK_IMPORTED_MODULE_6__["default"].error('Failed to parse JSON file');
                    }
                }
                catch (error) {
                    antd__WEBPACK_IMPORTED_MODULE_6__["default"].error('Failed to parse JSON file');
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
        setIsLoading(true);
        // First ensure we have the latest state before sending messages
        (_a = chrome.storage) === null || _a === void 0 ? void 0 : _a.local.set({ [key]: value }, () => {
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
        const rulesForExport = rules.map(rule => (Object.assign(Object.assign({}, rule), { overrideTxt: typeof rule.overrideTxt === 'string' ?
                (() => {
                    try {
                        return JSON.parse(rule.overrideTxt);
                    }
                    catch (e) {
                        return rule.overrideTxt;
                    }
                })()
                : rule.overrideTxt })));
        const dataStr = JSON.stringify(rulesForExport, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const exportFileDefaultName = 'ajax_interceptor_rules.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
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
        }
        else {
            readRulesFromStorage().then(rules => {
                setRules(rules);
            });
        }
    }, [searchName, searchUrl]);
    const handleFilterTypeChange = (val, ruleId) => {
        setRules(prevRules => {
            const newRules = prevRules.map(rule => rule.id === ruleId ? Object.assign(Object.assign({}, rule), { filterType: val }) : rule);
            set('ajaxInterceptor_rules', newRules);
            return newRules;
        });
    };
    const handleMatchChange = (e, ruleId) => {
        const value = e.target.value.replace(/\n$/, '');
        setRules(prevRules => {
            const newRules = prevRules.map(rule => rule.id === ruleId ? Object.assign(Object.assign({}, rule), { match: value }) : Object.assign({}, rule));
            console.log(`[handleMatchChange] newRules:`, newRules);
            return newRules;
        });
    };
    const handleLabelChange = (e, ruleId) => {
        setRules(prevRules => {
            const newRules = prevRules.map(rule => rule.id === ruleId ? Object.assign(Object.assign({}, rule), { label: e.target.value }) : rule);
            // set('ajaxInterceptor_rules', newRules);
            return newRules;
        });
    };
    const handleAddNewRule = () => {
        setIsCreating(true);
        const newRule = {
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
            // set('ajaxInterceptor_rules', newRules);
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
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_7__["default"].Compact, null,
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"], { size: "small", placeholder: "name", style: {
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
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"].TextArea, { rows: 2, size: "small", placeholder: filterType === 'normal' ? 'eg: abc/get' : 'eg: abc.*', style: {
                    flex: '1',
                    width: '100%',
                    display: 'inline-block',
                    marginTop: 10,
                }, defaultValue: match, onChange: e => handleMatchChange(e, id) })),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "button-group" },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_9__["default"], { size: "small", defaultChecked: switchOn, onChange: val => handleSingleSwitchChange(val, id), style: {
                    width: '28px',
                    flex: 'none',
                    marginRight: '8px',
                } }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { danger: true, type: "primary", shape: "circle", icon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_11__["default"], null), size: "small", onClick: e => handleClickRemove(e, id), style: { width: '24px', flex: 'none' } }))));
    const renderInterceptedRequests = (match) => {
        if (!interceptedRequests[match]) {
            return null;
        }
        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "intercepted-requests" }, "Intercepted Networks:"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "intercepted" }, interceptedRequests[match].map(({ url, num }) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_12__["default"], { placement: "top", title: url, key: url },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_13__["default"], { count: num, style: {
                        backgroundColor: '#fff',
                        color: '#999',
                        boxShadow: '0 0 0 1px #d9d9d9 inset',
                        marginTop: '-3px',
                        marginRight: '4px',
                    } }),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: "url" }, url)))))));
    };
    if (isLoading) {
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Loading...");
    }
    const handleViewDetail = (text, record) => {
        setCurrentEditRule(record);
        setShowDetail(true);
    };
    const checkDuplicateMatch = (e) => {
        console.log(e);
        const currentMatch = e.target.value;
        readRulesFromStorage().then(rules => {
            console.log(rules, currentMatch);
            // return duplicate match
            const duplicateMatch = rules.filter(rule => rule.match === currentMatch);
            console.log(duplicateMatch);
            // return duplicateMatch;
            setDuplicateMatch(duplicateMatch);
        });
    };
    const tableColumns = [
        {
            title: "id",
            dataIndex: "id",
            width: '160px',
            ellipsis: true,
            key: "id",
            render: (text, record) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_12__["default"], { title: text },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, text)))
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
            render: (text, record) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_9__["default"], { checked: record.switchOn, onChange: (val) => handleSingleSwitchChange(val, record.id) }))
        },
        {
            title: "match",
            dataIndex: "match",
            key: "match",
            ellipsis: true,
            render: (text, record) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_12__["default"], { placement: "topLeft", title: text },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_7__["default"].Compact, null,
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { type: "text", icon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_14__["default"], null), size: "small", onClick: () => {
                            // copy match
                            navigator.clipboard.writeText(record.match || '');
                            antd__WEBPACK_IMPORTED_MODULE_6__["default"].success('Copied to clipboard');
                        } }),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { type: "link", size: "small", onClick: () => handleViewDetail(text, record) }, text))))
        },
        {
            title: "Action",
            width: '100px',
            render: (text, record) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_7__["default"], null,
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { type: "link", onClick: () => handleViewDetail(text, record), icon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_15__["default"], null) }),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { type: "text", danger: true, onClick: () => handleClickRemove(text, record.id), icon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_11__["default"], null) })))
        }
    ];
    const handleRulesChange = (data) => {
        console.log(1);
        if (currentEditRule) {
            setCurrentEditRule(Object.assign(Object.assign({}, currentEditRule), { overrideTxt: JSON.stringify(data) }));
        }
    };
    const handleUpdateRules = () => {
        if (currentEditRule) {
            readRulesFromStorage().then(rules => {
                const index = rules.findIndex(rule => rule.id === currentEditRule.id);
                let newRules = [...rules];
                if (index !== -1) {
                    newRules[index] = currentEditRule;
                }
                else {
                    // new rule
                    newRules.push(currentEditRule);
                }
                setRules(newRules);
                set('ajaxInterceptor_rules', newRules);
                setShowDetail(false);
            });
        }
    };
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_16__["default"], { spinning: isLoading },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                width: '100%',
                height: '100%',
                padding: '20px',
                boxSizing: 'border-box',
            } },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    boxSizing: 'border-box',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                } },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_9__["default"], { checkedChildren: "On", unCheckedChildren: "Off", checked: switchOn, onChange: handleSwitchChange })),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"].Search, { style: {
                            width: 200,
                        }, placeholder: "Search by name", onPressEnter: handleSearch }),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"].Search, { style: {
                            width: 200,
                        }, placeholder: "Search by url", onPressEnter: handleUrlSearch }),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { style: {
                            width: 32,
                            height: 32,
                            borderRadius: 4,
                        }, color: "primary", variant: "filled", onClick: () => handleExportRules(), icon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_17__["default"], null) }),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_18__["default"], Object.assign({}, uploadProps),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { style: {
                                width: '32px',
                                height: '32px',
                                borderRadius: '4px',
                            }, color: "primary", variant: "filled", icon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_19__.FaFileImport, { style: {
                                    marginBottom: -1
                                } }) })),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { type: "primary", onClick: handleAddNewRule },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_20__["default"], null),
                        "Add Rule"))),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { ref: tableBoxRef, style: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    height: tableBoxHeight,
                    position: 'relative',
                } },
                !switchOn && (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        zIndex: 1,
                        cursor: 'not-allowed',
                        pointerEvents: 'none',
                    } })),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_21__["default"], { bordered: true, pagination: {
                        pageSize: 20,
                        total: rules.length,
                        showTotal: (total, range) => `Total: ${total}`,
                        showSizeChanger: true
                    }, style: {
                        height: tableBoxHeight,
                        opacity: switchOn ? 1 : 0.65,
                    }, scroll: { y: tableBoxHeight - 78 }, size: 'small', columns: tableColumns, dataSource: rules })),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_22__["default"], { maskClosable: false, width: 1200, title: isCreating ? 'Create new rule' : 'Detail for ' + (currentEditRule === null || currentEditRule === void 0 ? void 0 : currentEditRule.label), open: showDetail, onClose: () => {
                    setShowDetail(false);
                    setIsCreating(false);
                    setDuplicateMatch([]);
                }, extra: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_7__["default"], null,
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { onClick: () => setShowDetail(false) }, "Cancel"),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { type: "primary", onClick: handleUpdateRules }, "OK")) },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                        display: 'flex',
                        gap: '10px',
                        height: '100%',
                        overflowY: 'scroll',
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                            width: 500
                        } },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_23__["default"].Title, { level: 4, style: {
                                marginTop: 0
                            } }, "Id:"),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_7__["default"].Compact, { style: {
                                width: '100%',
                            } },
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"], { style: {
                                    marginBottom: '10px',
                                }, disabled: true, value: (currentEditRule === null || currentEditRule === void 0 ? void 0 : currentEditRule.id) || '' }),
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_10__["default"], { type: "primary", icon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_14__["default"], null), onClick: () => {
                                    navigator.clipboard.writeText((currentEditRule === null || currentEditRule === void 0 ? void 0 : currentEditRule.id) || '');
                                    antd__WEBPACK_IMPORTED_MODULE_6__["default"].success('Copied to clipboard');
                                } })),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_23__["default"].Title, { level: 4 }, "Label:"),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"], { style: {
                                marginBottom: '10px',
                            }, value: (currentEditRule === null || currentEditRule === void 0 ? void 0 : currentEditRule.label) || '', onChange: (e) => {
                                if (currentEditRule) {
                                    setCurrentEditRule(Object.assign(Object.assign({}, currentEditRule), { label: e.target.value }));
                                }
                            } }),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_23__["default"].Title, { level: 4 }, "Match:"),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_8__["default"].TextArea, { rows: 10, style: {
                                marginBottom: '10px',
                            }, onBlur: checkDuplicateMatch, value: (currentEditRule === null || currentEditRule === void 0 ? void 0 : currentEditRule.match) || '', onChange: (e) => {
                                if (currentEditRule) {
                                    setCurrentEditRule(Object.assign(Object.assign({}, currentEditRule), { match: e.target.value }));
                                }
                            } }),
                        duplicateMatch.length > 0 && isCreating && (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_2__["default"], { size: "small", defaultActiveKey: ['1'], items: [{
                                    key: '1', label: 'Duplicate match: ' + duplicateMatch.length, children: react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, duplicateMatch.map(rule => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(antd__WEBPACK_IMPORTED_MODULE_23__["default"].Text, { className: 'duplicate-match', key: rule.id, onClick: () => {
                                            setIsCreating(false);
                                            setCurrentEditRule(rule);
                                            setShowDetail(true);
                                        } }, rule.match))))
                                }] }))),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(json_edit_react__WEBPACK_IMPORTED_MODULE_24__.JsonEditor, { rootName: '', className: 'json-editor', data: JSON.parse((currentEditRule === null || currentEditRule === void 0 ? void 0 : currentEditRule.overrideTxt) || '{}'), setData: handleRulesChange }))))));
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
/******/ 			"mainpanel": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/mainpanel.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDbEJBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7V0NoREE7Ozs7O1VFQUE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL21haW5wYW5lbC50c3giLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2FtZCBvcHRpb25zIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2NyZWF0ZSBmYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9lbnN1cmUgY2h1bmsiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvaGFybW9ueSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlQ2FsbGJhY2ssIHVzZVJlZHVjZXIgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjcmVhdGVSb290IH0gZnJvbSBcInJlYWN0LWRvbS9jbGllbnRcIjtcbmltcG9ydCB7IFN3aXRjaCwgQ29sbGFwc2UsIElucHV0LCBTZWxlY3QsIEJ1dHRvbiwgQmFkZ2UsIFRvb2x0aXAsIFNwYWNlLCBtZXNzYWdlLCBVcGxvYWQsIFRhYmxlLCBEcmF3ZXIsIFR5cG9ncmFwaHksIFNwaW4sIH0gZnJvbSAnYW50ZCc7XG5pbXBvcnQgeyBFZGl0T3V0bGluZWQsIFBsdXNPdXRsaW5lZCwgRGVsZXRlT3V0bGluZWQsIEV4cG9ydE91dGxpbmVkLCBDb3B5T3V0bGluZWQgfSBmcm9tICdAYW50LWRlc2lnbi9pY29ucyc7XG5pbXBvcnQgeyBGYUZpbGVJbXBvcnQgfSBmcm9tIFwicmVhY3QtaWNvbnMvZmFcIjtcbmltcG9ydCB7IEpzb25FZGl0b3IgfSBmcm9tICdqc29uLWVkaXQtcmVhY3QnO1xuY29uc3QgeyBQYW5lbCB9ID0gQ29sbGFwc2U7XG5jb25zdCB7IE9wdGlvbiB9ID0gU2VsZWN0O1xuaW1wb3J0IFJlcGxhY2VyIGZyb20gJy4vY29tcG9uZW50cy9SZXBsYWNlcic7XG5pbXBvcnQgJy4vaW5kZXgubGVzcyc7XG5jb25zdCBidWlsZFVVSUQgPSAoKSA9PiB7XG4gICAgY29uc3QgZHQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCAoYykgPT4ge1xuICAgICAgICBjb25zdCByID0gKGR0ICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDMpIHwgMHg4KS50b1N0cmluZygxNik7XG4gICAgfSk7XG59O1xuY29uc3QgZ2VuZXJhdGVVbmlxdWVJZCA9ICgpID0+IHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKS50b1N0cmluZygzNikgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMik7XG59O1xuY29uc3QgQXBwID0gKCkgPT4ge1xuICAgIGNvbnN0IFtpbnRlcmNlcHRlZFJlcXVlc3RzLCBzZXRJbnRlcmNlcHRlZFJlcXVlc3RzXSA9IHVzZVN0YXRlKHt9KTtcbiAgICBjb25zdCBbc2hvd0FsbFJ1bGVzLCBzZXRTaG93QWxsUnVsZXNdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtwb3NpdGlvbkNsYXNzLCBzZXRQb3NpdGlvbkNsYXNzXSA9IHVzZVN0YXRlKCdzdXNwZW5kJyk7XG4gICAgY29uc3QgW2N1c3RvbUZ1bmN0aW9uLCBzZXRDdXN0b21GdW5jdGlvbl0gPSB1c2VTdGF0ZSh7IHBhbmVsUG9zaXRpb246IDAgfSk7XG4gICAgY29uc3QgW3Nob3dSZWZyZXNoVGlwLCBzZXRTaG93UmVmcmVzaFRpcF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3NlYXJjaE5hbWUsIHNldFNlYXJjaE5hbWVdID0gdXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtuZXdUYWJOYW1lLCBzZXROZXdUYWJOYW1lXSA9IHVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCBbc2VhcmNoVXJsLCBzZXRTZWFyY2hVcmxdID0gdXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IGZvcmNlVXBkYXRlVGltZW91dFJlZiA9IHVzZVJlZihudWxsKTtcbiAgICBjb25zdCBbLCBmb3JjZVVwZGF0ZV0gPSB1c2VSZWR1Y2VyKHggPT4geCArIDEsIDApO1xuICAgIGNvbnN0IFthY3RpdmVLZXksIHNldEFjdGl2ZUtleV0gPSB1c2VTdGF0ZSh1bmRlZmluZWQpO1xuICAgIGNvbnN0IFtpc0NyZWF0aW5nLCBzZXRJc0NyZWF0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbc3dpdGNoT24sIHNldFN3aXRjaE9uXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbcnVsZXMsIHNldFJ1bGVzXSA9IHVzZVN0YXRlKFtdKTtcbiAgICBjb25zdCBbZGF0YUxpc3QsIHNldERhdGFMaXN0XSA9IHVzZVN0YXRlKHt9KTtcbiAgICBjb25zdCBbZHVwbGljYXRlTWF0Y2gsIHNldER1cGxpY2F0ZU1hdGNoXSA9IHVzZVN0YXRlKFtdKTtcbiAgICBjb25zdCB0YWJsZUJveFJlZiA9IHVzZVJlZihudWxsKTtcbiAgICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gICAgY29uc3QgW3RhYmxlQm94SGVpZ2h0LCBzZXRUYWJsZUJveEhlaWdodF0gPSB1c2VTdGF0ZSgwKTtcbiAgICBjb25zdCBbc2hvd0RldGFpbCwgc2V0U2hvd0RldGFpbF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW2N1cnJlbnRFZGl0UnVsZSwgc2V0Q3VycmVudEVkaXRSdWxlXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICh0YWJsZUJveFJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBzZXRUYWJsZUJveEhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQgLSB0YWJsZUJveFJlZi5jdXJyZW50Lm9mZnNldFRvcCAtIDM0KTtcbiAgICAgICAgfVxuICAgIH0sIFt0YWJsZUJveFJlZi5jdXJyZW50XSk7XG4gICAgY29uc3QgcmVhZFJ1bGVzRnJvbVN0b3JhZ2UgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydhamF4SW50ZXJjZXB0b3JfcnVsZXMnXSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHNldFJ1bGVzKHJlc3VsdC5hamF4SW50ZXJjZXB0b3JfcnVsZXMgfHwgW10pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LmFqYXhJbnRlcmNlcHRvcl9ydWxlcyB8fCBbXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydhamF4SW50ZXJjZXB0b3Jfc3dpdGNoT24nLCAnYWpheEludGVyY2VwdG9yX3J1bGVzJywgJ2N1c3RvbUZ1bmN0aW9uJ10sIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHNldFN3aXRjaE9uKHJlc3VsdC5hamF4SW50ZXJjZXB0b3Jfc3dpdGNoT24gfHwgZmFsc2UpO1xuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZSBkZWZhdWx0IHJ1bGUgaWYgbm8gcnVsZXMgZXhpc3RcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmFqYXhJbnRlcmNlcHRvcl9ydWxlcyB8fCByZXN1bHQuYWpheEludGVyY2VwdG9yX3J1bGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRSdWxlID0ge1xuICAgICAgICAgICAgICAgICAgICBpZDogZ2VuZXJhdGVVbmlxdWVJZCgpLFxuICAgICAgICAgICAgICAgICAgICBtYXRjaDogJycsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnRGVmYXVsdCBSdWxlJyxcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoT246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGtleTogYnVpbGRVVUlEKCksXG4gICAgICAgICAgICAgICAgICAgIHRhYklkOiAnRGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0UnVsZXMgPSBbZGVmYXVsdFJ1bGVdO1xuICAgICAgICAgICAgICAgIHNldFJ1bGVzKGRlZmF1bHRSdWxlcyk7XG4gICAgICAgICAgICAgICAgLy8gc2V0KCdhamF4SW50ZXJjZXB0b3JfcnVsZXMnLCBkZWZhdWx0UnVsZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0UnVsZXMocmVzdWx0LmFqYXhJbnRlcmNlcHRvcl9ydWxlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRDdXN0b21GdW5jdGlvbihyZXN1bHQuY3VzdG9tRnVuY3Rpb24gfHwgeyBwYW5lbFBvc2l0aW9uOiAwIH0pO1xuICAgICAgICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGFibGVCb3hSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgICAgIHNldFRhYmxlQm94SGVpZ2h0KHdpbmRvdy5pbm5lckhlaWdodCAtIHRhYmxlQm94UmVmLmN1cnJlbnQub2Zmc2V0VG9wIC0gMzQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2V0dXBNZXNzYWdlTGlzdGVuZXIoKTtcbiAgICAgICAgbm90aWZ5QmFja2dyb3VuZFNjcmlwdExvYWRlZCgpO1xuICAgIH0sIFtdKTtcbiAgICBjb25zdCBncm91cFJ1bGVzQnlUYWIgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgICAgIGNvbnN0IGdyb3VwZWRSdWxlcyA9IHJ1bGVzLnJlZHVjZSgoYWNjLCBydWxlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YWIgPSBydWxlLnRhYklkIHx8ICdEZWZhdWx0JztcbiAgICAgICAgICAgIGlmICghYWNjW3RhYl0pIHtcbiAgICAgICAgICAgICAgICBhY2NbdGFiXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWNjW3RhYl0ucHVzaChydWxlKTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGdyb3VwZWRSdWxlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBncm91cGVkUnVsZXNbJ0RlZmF1bHQnXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHNldERhdGFMaXN0KGdyb3VwZWRSdWxlcyk7XG4gICAgICAgIC8vIE9ubHkgc2V0IHRoZSBhY3RpdmVLZXkgaWYgaXQncyBub3QgYWxyZWFkeSBzZXRcbiAgICAgICAgaWYgKCFhY3RpdmVLZXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0VGFiSWQgPSBPYmplY3Qua2V5cyhncm91cGVkUnVsZXMpWzBdO1xuICAgICAgICAgICAgc2V0QWN0aXZlS2V5KGZpcnN0VGFiSWQpO1xuICAgICAgICB9XG4gICAgfSwgW3J1bGVzLCBhY3RpdmVLZXldKTtcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBncm91cFJ1bGVzQnlUYWIoKTtcbiAgICB9LCBbcnVsZXMsIGdyb3VwUnVsZXNCeVRhYl0pO1xuICAgIGNvbnN0IHNldHVwTWVzc2FnZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoaGFuZGxlSW5jb21pbmdNZXNzYWdlKTtcbiAgICB9O1xuICAgIGNvbnN0IHVwbG9hZFByb3BzID0ge1xuICAgICAgICBuYW1lOiAnZmlsZScsXG4gICAgICAgIGFjdGlvbjogJyMnLFxuICAgICAgICBhY2NlcHQ6ICcuanNvbicsXG4gICAgICAgIHNob3dVcGxvYWRMaXN0OiBmYWxzZSxcbiAgICAgICAgYmVmb3JlVXBsb2FkKGZpbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICByZWFkZXIub25sb2FkID0gKGUpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QganNvbkRhdGFiYXNlID0gSlNPTi5wYXJzZSgoX2EgPSBlLnRhcmdldCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdqc29uRGF0YWJhc2UnLCBqc29uRGF0YWJhc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoanNvbkRhdGFiYXNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb25EYXRhYmFzZS5mb3JFYWNoKHJ1bGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGUub3ZlcnJpZGVUeHQgPSBKU09OLnN0cmluZ2lmeShydWxlLm92ZXJyaWRlVHh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGUub3ZlcnJpZGVUeHQgPSAne30nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UnVsZXMoanNvbkRhdGFiYXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldCgnYWpheEludGVyY2VwdG9yX3J1bGVzJywganNvbkRhdGFiYXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwUnVsZXNCeVRhYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5zdWNjZXNzKGAke2ZpbGUubmFtZX0gdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLmVycm9yKCdGYWlsZWQgdG8gcGFyc2UgSlNPTiBmaWxlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UuZXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSBKU09OIGZpbGUnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBQcmV2ZW50IGRlZmF1bHQgdXBsb2FkIGJlaGF2aW9yXG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2hhbmdlKGluZm8pIHtcbiAgICAgICAgICAgIGlmIChpbmZvLmZpbGUuc3RhdHVzICE9PSAndXBsb2FkaW5nJykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZm8uZmlsZSwgaW5mby5maWxlTGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVJbmNvbWluZ01lc3NhZ2UgPSB1c2VDYWxsYmFjaygoeyB0eXBlLCB0bywgdXJsLCBtYXRjaCwgY29udGVudFNjcmlwdExvYWRlZCA9IGZhbHNlLCBzaG93RnJlc2hUaXAgPSBmYWxzZSwgfSkgPT4ge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ2FqYXhJbnRlcmNlcHRvcicgJiYgdG8gPT09ICdpZnJhbWUnKSB7XG4gICAgICAgICAgICBpZiAoY29udGVudFNjcmlwdExvYWRlZCB8fCBzaG93RnJlc2hUaXApIHtcbiAgICAgICAgICAgICAgICBzZXRTaG93UmVmcmVzaFRpcChzaG93RnJlc2hUaXApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldEludGVyY2VwdGVkUmVxdWVzdHMocHJldiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UmVxdWVzdHMgPSBPYmplY3QuYXNzaWduKHt9LCBwcmV2KTtcbiAgICAgICAgICAgICAgICBpZiAoIW5ld1JlcXVlc3RzW21hdGNoXSlcbiAgICAgICAgICAgICAgICAgICAgbmV3UmVxdWVzdHNbbWF0Y2hdID0gW107XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gbmV3UmVxdWVzdHNbbWF0Y2hdLnNvbWUob2JqID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iai51cmwgPT09IHVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLm51bSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1JlcXVlc3RzW21hdGNoXS5wdXNoKHsgdXJsLCBudW06IDEgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXdSZXF1ZXN0cztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwgW10pO1xuICAgIGNvbnN0IG5vdGlmeUJhY2tncm91bmRTY3JpcHRMb2FkZWQgPSAoKSA9PiB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKGNocm9tZS5ydW50aW1lLmlkLCB7XG4gICAgICAgICAgICB0eXBlOiAnYWpheEludGVyY2VwdG9yJyxcbiAgICAgICAgICAgIHRvOiAnYmFja2dyb3VuZCcsXG4gICAgICAgICAgICBpZnJhbWVTY3JpcHRMb2FkZWQ6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3Qgc2V0ID0gKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG4gICAgICAgIC8vIEZpcnN0IGVuc3VyZSB3ZSBoYXZlIHRoZSBsYXRlc3Qgc3RhdGUgYmVmb3JlIHNlbmRpbmcgbWVzc2FnZXNcbiAgICAgICAgKF9hID0gY2hyb21lLnN0b3JhZ2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sb2NhbC5zZXQoeyBba2V5XTogdmFsdWUgfSwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFtzZXRdIGtleTogJHtrZXl9LCB2YWx1ZTogJHt2YWx1ZX1gKTtcbiAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKGNocm9tZS5ydW50aW1lLmlkLCB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2FqYXhJbnRlcmNlcHRvcicsXG4gICAgICAgICAgICAgICAgdG86ICdiYWNrZ3JvdW5kJyxcbiAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgfTtcbiAgICBjb25zdCBmb3JjZVVwZGF0ZURlYm91Y2UgPSAoKSA9PiB7XG4gICAgICAgIGlmIChmb3JjZVVwZGF0ZVRpbWVvdXRSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGZvcmNlVXBkYXRlVGltZW91dFJlZi5jdXJyZW50KTtcbiAgICAgICAgfVxuICAgICAgICBmb3JjZVVwZGF0ZVRpbWVvdXRSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVTaW5nbGVTd2l0Y2hDaGFuZ2UgPSAoc3dpdGNoT24sIHJ1bGVJZCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaGFuZGxlU2luZ2xlU3dpdGNoQ2hhbmdlJywgc3dpdGNoT24sIHJ1bGVJZCk7XG4gICAgICAgIHNldFJ1bGVzKHByZXZSdWxlcyA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdSdWxlcyA9IHByZXZSdWxlcy5tYXAocnVsZSA9PiBydWxlLmlkID09PSBydWxlSWQgPyBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHJ1bGUpLCB7IHN3aXRjaE9uIH0pIDogcnVsZSk7XG4gICAgICAgICAgICBzZXQoJ2FqYXhJbnRlcmNlcHRvcl9ydWxlcycsIG5ld1J1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdSdWxlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVMaW1pdE1ldGhvZENoYW5nZSA9ICh2YWwsIHJ1bGVJZCkgPT4ge1xuICAgICAgICBzZXRSdWxlcyhwcmV2UnVsZXMgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3UnVsZXMgPSBwcmV2UnVsZXMubWFwKHJ1bGUgPT4gcnVsZS5pZCA9PT0gcnVsZUlkID8gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBydWxlKSwgeyBsaW1pdE1ldGhvZDogdmFsIH0pIDogcnVsZSk7XG4gICAgICAgICAgICBzZXQoJ2FqYXhJbnRlcmNlcHRvcl9ydWxlcycsIG5ld1J1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdSdWxlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVFeHBvcnRSdWxlcyA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcnVsZXNGb3JFeHBvcnQgPSBydWxlcy5tYXAocnVsZSA9PiAoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBydWxlKSwgeyBvdmVycmlkZVR4dDogdHlwZW9mIHJ1bGUub3ZlcnJpZGVUeHQgPT09ICdzdHJpbmcnID9cbiAgICAgICAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocnVsZS5vdmVycmlkZVR4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBydWxlLm92ZXJyaWRlVHh0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgICAgIDogcnVsZS5vdmVycmlkZVR4dCB9KSkpO1xuICAgICAgICBjb25zdCBkYXRhU3RyID0gSlNPTi5zdHJpbmdpZnkocnVsZXNGb3JFeHBvcnQsIG51bGwsIDIpO1xuICAgICAgICBjb25zdCBkYXRhVXJpID0gYGRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04LCR7ZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFTdHIpfWA7XG4gICAgICAgIGNvbnN0IGV4cG9ydEZpbGVEZWZhdWx0TmFtZSA9ICdhamF4X2ludGVyY2VwdG9yX3J1bGVzLmpzb24nO1xuICAgICAgICBjb25zdCBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgZGF0YVVyaSk7XG4gICAgICAgIGxpbmtFbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBleHBvcnRGaWxlRGVmYXVsdE5hbWUpO1xuICAgICAgICBsaW5rRWxlbWVudC5jbGljaygpO1xuICAgIH07XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaE5hbWUnLCBzZWFyY2hOYW1lKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaFVybCcsIHNlYXJjaFVybCk7XG4gICAgICAgIGlmIChzZWFyY2hOYW1lIHx8IHNlYXJjaFVybCkge1xuICAgICAgICAgICAgc2V0UnVsZXMocHJldlJ1bGVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdSdWxlcyA9IHByZXZSdWxlcy5maWx0ZXIocnVsZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBydWxlLmxhYmVsLmluY2x1ZGVzKHNlYXJjaE5hbWUpICYmIHJ1bGUubWF0Y2guaW5jbHVkZXMoc2VhcmNoVXJsKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3UnVsZXMnLCBuZXdSdWxlcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld1J1bGVzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZWFkUnVsZXNGcm9tU3RvcmFnZSgpLnRoZW4ocnVsZXMgPT4ge1xuICAgICAgICAgICAgICAgIHNldFJ1bGVzKHJ1bGVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwgW3NlYXJjaE5hbWUsIHNlYXJjaFVybF0pO1xuICAgIGNvbnN0IGhhbmRsZUZpbHRlclR5cGVDaGFuZ2UgPSAodmFsLCBydWxlSWQpID0+IHtcbiAgICAgICAgc2V0UnVsZXMocHJldlJ1bGVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1J1bGVzID0gcHJldlJ1bGVzLm1hcChydWxlID0+IHJ1bGUuaWQgPT09IHJ1bGVJZCA/IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcnVsZSksIHsgZmlsdGVyVHlwZTogdmFsIH0pIDogcnVsZSk7XG4gICAgICAgICAgICBzZXQoJ2FqYXhJbnRlcmNlcHRvcl9ydWxlcycsIG5ld1J1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBuZXdSdWxlcztcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVNYXRjaENoYW5nZSA9IChlLCBydWxlSWQpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBlLnRhcmdldC52YWx1ZS5yZXBsYWNlKC9cXG4kLywgJycpO1xuICAgICAgICBzZXRSdWxlcyhwcmV2UnVsZXMgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3UnVsZXMgPSBwcmV2UnVsZXMubWFwKHJ1bGUgPT4gcnVsZS5pZCA9PT0gcnVsZUlkID8gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBydWxlKSwgeyBtYXRjaDogdmFsdWUgfSkgOiBPYmplY3QuYXNzaWduKHt9LCBydWxlKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW2hhbmRsZU1hdGNoQ2hhbmdlXSBuZXdSdWxlczpgLCBuZXdSdWxlcyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3UnVsZXM7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlTGFiZWxDaGFuZ2UgPSAoZSwgcnVsZUlkKSA9PiB7XG4gICAgICAgIHNldFJ1bGVzKHByZXZSdWxlcyA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdSdWxlcyA9IHByZXZSdWxlcy5tYXAocnVsZSA9PiBydWxlLmlkID09PSBydWxlSWQgPyBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHJ1bGUpLCB7IGxhYmVsOiBlLnRhcmdldC52YWx1ZSB9KSA6IHJ1bGUpO1xuICAgICAgICAgICAgLy8gc2V0KCdhamF4SW50ZXJjZXB0b3JfcnVsZXMnLCBuZXdSdWxlcyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3UnVsZXM7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlQWRkTmV3UnVsZSA9ICgpID0+IHtcbiAgICAgICAgc2V0SXNDcmVhdGluZyh0cnVlKTtcbiAgICAgICAgY29uc3QgbmV3UnVsZSA9IHtcbiAgICAgICAgICAgIGlkOiBnZW5lcmF0ZVVuaXF1ZUlkKCksXG4gICAgICAgICAgICBtYXRjaDogJycsXG4gICAgICAgICAgICBsYWJlbDogYHVybCR7cnVsZXMubGVuZ3RoICsgMX1gLFxuICAgICAgICAgICAgc3dpdGNoT246IHRydWUsXG4gICAgICAgICAgICBrZXk6IGJ1aWxkVVVJRCgpLFxuICAgICAgICAgICAgdGFiSWQ6ICdEZWZhdWx0JyxcbiAgICAgICAgfTtcbiAgICAgICAgc2V0Q3VycmVudEVkaXRSdWxlKG5ld1J1bGUpO1xuICAgICAgICBzZXRTaG93RGV0YWlsKHRydWUpO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlQ2xpY2tBZGQgPSAodGFiSWQpID0+IHtcbiAgICAgICAgY29uc3QgbmV3UnVsZSA9IHtcbiAgICAgICAgICAgIGlkOiBnZW5lcmF0ZVVuaXF1ZUlkKCksXG4gICAgICAgICAgICBtYXRjaDogJycsXG4gICAgICAgICAgICBsYWJlbDogYHVybCR7cnVsZXMubGVuZ3RoICsgMX1gLFxuICAgICAgICAgICAgc3dpdGNoT246IHRydWUsXG4gICAgICAgICAgICBrZXk6IGJ1aWxkVVVJRCgpLFxuICAgICAgICAgICAgdGFiSWQ6IHRhYklkLFxuICAgICAgICB9O1xuICAgICAgICBzZXRBY3RpdmVLZXkodGFiSWQpO1xuICAgICAgICBzZXRSdWxlcyhwcmV2UnVsZXMgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3UnVsZXMgPSBbLi4ucHJldlJ1bGVzLCBuZXdSdWxlXTtcbiAgICAgICAgICAgIC8vIHNldCgnYWpheEludGVyY2VwdG9yX3J1bGVzJywgbmV3UnVsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIG5ld1J1bGVzO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZUJhdGNoUmVtb3ZlID0gKHJ1bGVJZHMsIG5lZWRHcm91cFJ1bGVzQnlUYWIgPSBmYWxzZSkgPT4ge1xuICAgICAgICBzZXRSdWxlcyhwcmV2UnVsZXMgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3UnVsZXMgPSBwcmV2UnVsZXMuZmlsdGVyKHJ1bGUgPT4gIXJ1bGVJZHMuaW5jbHVkZXMocnVsZS5pZCkpO1xuICAgICAgICAgICAgc2V0KCdhamF4SW50ZXJjZXB0b3JfcnVsZXMnLCBuZXdSdWxlcyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3UnVsZXM7XG4gICAgICAgIH0pO1xuICAgICAgICBzZXRJbnRlcmNlcHRlZFJlcXVlc3RzKHByZXYgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3UmVxdWVzdHMgPSBPYmplY3QuYXNzaWduKHt9LCBwcmV2KTtcbiAgICAgICAgICAgIHJ1bGVJZHMuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcnVsZSA9IHJ1bGVzLmZpbmQociA9PiByLmlkID09PSBpZCk7XG4gICAgICAgICAgICAgICAgaWYgKHJ1bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5ld1JlcXVlc3RzW3J1bGUubWF0Y2hdO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbmV3UmVxdWVzdHNbcnVsZS5sYWJlbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3UmVxdWVzdHM7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobmVlZEdyb3VwUnVsZXNCeVRhYikge1xuICAgICAgICAgICAgZ3JvdXBSdWxlc0J5VGFiKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZXREYXRhTGlzdChwcmV2RGF0YUxpc3QgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0RhdGFMaXN0ID0gT2JqZWN0LmFzc2lnbih7fSwgcHJldkRhdGFMaXN0KTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhuZXdEYXRhTGlzdCkuZm9yRWFjaCh0YWJJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0RhdGFMaXN0W3RhYklkXSA9IG5ld0RhdGFMaXN0W3RhYklkXS5maWx0ZXIocnVsZSA9PiAhcnVsZUlkcy5pbmNsdWRlcyhydWxlLmlkKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld0RhdGFMaXN0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZUNsaWNrUmVtb3ZlID0gKGUsIHJ1bGVJZCkgPT4ge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBjb25zdCBjdXJyZW50VGFiSWQgPSBhY3RpdmVLZXk7XG4gICAgICAgIGhhbmRsZUJhdGNoUmVtb3ZlKFtydWxlSWRdKTtcbiAgICAgICAgc2V0RGF0YUxpc3QocHJldkRhdGFMaXN0ID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGNvbnN0IG5ld0RhdGFMaXN0ID0gT2JqZWN0LmFzc2lnbih7fSwgcHJldkRhdGFMaXN0KTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50VGFiSWQgJiYgKChfYSA9IG5ld0RhdGFMaXN0W2N1cnJlbnRUYWJJZF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG5ld0RhdGFMaXN0W2N1cnJlbnRUYWJJZF07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVtYWluaW5nVGFicyA9IE9iamVjdC5rZXlzKG5ld0RhdGFMaXN0KTtcbiAgICAgICAgICAgICAgICBzZXRBY3RpdmVLZXkocmVtYWluaW5nVGFicy5sZW5ndGggPiAwID8gcmVtYWluaW5nVGFic1swXSA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3RGF0YUxpc3Q7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlQ29sbGFzZUNoYW5nZSA9ICgpID0+IHtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZVN3aXRjaENoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgc2V0U3dpdGNoT24ocHJldiA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdTd2l0Y2hPbiA9ICFwcmV2O1xuICAgICAgICAgICAgc2V0KCdhamF4SW50ZXJjZXB0b3Jfc3dpdGNoT24nLCBuZXdTd2l0Y2hPbik7XG4gICAgICAgICAgICByZXR1cm4gbmV3U3dpdGNoT247XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlU2VhcmNoID0gKGUpID0+IHtcbiAgICAgICAgc2V0U2VhcmNoTmFtZShlLnRhcmdldC52YWx1ZSk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVVcmxTZWFyY2ggPSAoZSkgPT4ge1xuICAgICAgICBzZXRTZWFyY2hVcmwoZS50YXJnZXQudmFsdWUpO1xuICAgIH07XG4gICAgY29uc3QgZ2VuZXJhdGVSYW5kb21TdHJpbmcgPSAobGVuZ3RoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoYXJhY3RlcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzLmxlbmd0aCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVUYWJFZGl0ID0gKHRhcmdldEtleSwgYWN0aW9uKSA9PiB7XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdhZGQnKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdUYWJJZCA9IGdlbmVyYXRlUmFuZG9tU3RyaW5nKDUpO1xuICAgICAgICAgICAgaGFuZGxlQ2xpY2tBZGQobmV3VGFiSWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdGFiSWQgPSB0YXJnZXRLZXk7XG4gICAgICAgICAgICBsZXQgZGVsZXRpbmdSdWxlSWRzID0gZGF0YUxpc3RbdGFiSWRdLm1hcChydWxlID0+IHJ1bGUuaWQpO1xuICAgICAgICAgICAgaGFuZGxlQmF0Y2hSZW1vdmUoZGVsZXRpbmdSdWxlSWRzLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlbWFpbmluZ1RhYnMgPSBPYmplY3Qua2V5cyhkYXRhTGlzdCkuZmlsdGVyKGlkID0+IGlkICE9PSB0YWJJZCk7XG4gICAgICAgICAgICAvLyBTZXQgdGhlIGFjdGl2ZUtleSB0byB0aGUgbGFzdCByZW1haW5pbmcgdGFiLCBvciB1bmRlZmluZWQgaWYgbm8gdGFicyBsZWZ0XG4gICAgICAgICAgICBzZXRBY3RpdmVLZXkocmVtYWluaW5nVGFicy5sZW5ndGggPiAwID8gcmVtYWluaW5nVGFic1tyZW1haW5pbmdUYWJzLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgcmVuZGVyUnVsZXMgPSAocnVsZXMpID0+IHtcbiAgICAgICAgcmV0dXJuIHJ1bGVzLm1hcCgocnVsZSkgPT4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGFuZWwsIHsga2V5OiBydWxlLmtleSwgaGVhZGVyOiByZW5kZXJQYW5lbEhlYWRlcihydWxlKSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZXBsYWNlciwgeyB1cGRhdGVBZGRCdG5Ub3BfaW50ZXJ2YWw6ICgpID0+IHsgfSwgcnVsZUlkOiBydWxlLmlkLCBzZXQ6IHNldCwgcnVsZTogcnVsZSwgcnVsZXM6IHJ1bGVzIH0pLFxuICAgICAgICAgICAgcmVuZGVySW50ZXJjZXB0ZWRSZXF1ZXN0cyhydWxlLm1hdGNoKSkpKTtcbiAgICB9O1xuICAgIGNvbnN0IHJlbmRlclBhbmVsSGVhZGVyID0gKHsgaWQsIGZpbHRlclR5cGUgPSAnbm9ybWFsJywgbGltaXRNZXRob2QgPSAnQUxMJywgbWF0Y2gsIGxhYmVsLCBzd2l0Y2hPbiA9IHRydWUsIGtleSB9KSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwYW5lbC1oZWFkZXJcIiwgb25DbGljazogZSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICAgICAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgICAgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTcGFjZS5Db21wYWN0LCBudWxsLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXQsIHsgc2l6ZTogXCJzbWFsbFwiLCBwbGFjZWhvbGRlcjogXCJuYW1lXCIsIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhXaWR0aDogJzIwMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6ICdhdXRvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgICAgICAgICB9LCBkZWZhdWx0VmFsdWU6IGxhYmVsLCBvbkNoYW5nZTogZSA9PiBoYW5kbGVMYWJlbENoYW5nZShlLCBpZCkgfSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3QsIHsgc2l6ZTogXCJzbWFsbFwiLCBkZWZhdWx0VmFsdWU6IGxpbWl0TWV0aG9kLCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6ICcxMjBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4OiAnMS41IDEgYXV0bycsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgICAgICAgICAgfSwgb25DaGFuZ2U6IHZhbCA9PiBoYW5kbGVMaW1pdE1ldGhvZENoYW5nZSh2YWwsIGlkKSB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE9wdGlvbiwgeyB2YWx1ZTogXCJBTExcIiB9LCBcIkFMTFwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChPcHRpb24sIHsgdmFsdWU6IFwiR0VUXCIgfSwgXCJHRVRcIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoT3B0aW9uLCB7IHZhbHVlOiBcIlBPU1RcIiB9LCBcIlBPU1RcIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoT3B0aW9uLCB7IHZhbHVlOiBcIlBVVFwiIH0sIFwiUFVUXCIpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE9wdGlvbiwgeyB2YWx1ZTogXCJIRUFEXCIgfSwgXCJIRUFEXCIpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE9wdGlvbiwgeyB2YWx1ZTogXCJERUxFVEVcIiB9LCBcIkRFTEVURVwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChPcHRpb24sIHsgdmFsdWU6IFwiT1BUSU9OU1wiIH0sIFwiT1BUSU9OU1wiKSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3QsIHsgc2l6ZTogXCJzbWFsbFwiLCBkZWZhdWx0VmFsdWU6IGZpbHRlclR5cGUsIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzFweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhXaWR0aDogJzEyMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6ICcxLjUgMSBhdXRvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgICAgICAgICB9LCBvbkNoYW5nZTogdmFsID0+IGhhbmRsZUZpbHRlclR5cGVDaGFuZ2UodmFsLCBpZCkgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChPcHRpb24sIHsgdmFsdWU6IFwibm9ybWFsXCIgfSwgXCJub3JtYWxcIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoT3B0aW9uLCB7IHZhbHVlOiBcInJlZ2V4XCIgfSwgXCJyZWdleFwiKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dC5UZXh0QXJlYSwgeyByb3dzOiAyLCBzaXplOiBcInNtYWxsXCIsIHBsYWNlaG9sZGVyOiBmaWx0ZXJUeXBlID09PSAnbm9ybWFsJyA/ICdlZzogYWJjL2dldCcgOiAnZWc6IGFiYy4qJywgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZmxleDogJzEnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAxMCxcbiAgICAgICAgICAgICAgICB9LCBkZWZhdWx0VmFsdWU6IG1hdGNoLCBvbkNoYW5nZTogZSA9PiBoYW5kbGVNYXRjaENoYW5nZShlLCBpZCkgfSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImJ1dHRvbi1ncm91cFwiIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFN3aXRjaCwgeyBzaXplOiBcInNtYWxsXCIsIGRlZmF1bHRDaGVja2VkOiBzd2l0Y2hPbiwgb25DaGFuZ2U6IHZhbCA9PiBoYW5kbGVTaW5nbGVTd2l0Y2hDaGFuZ2UodmFsLCBpZCksIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMjhweCcsXG4gICAgICAgICAgICAgICAgICAgIGZsZXg6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6ICc4cHgnLFxuICAgICAgICAgICAgICAgIH0gfSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBkYW5nZXI6IHRydWUsIHR5cGU6IFwicHJpbWFyeVwiLCBzaGFwZTogXCJjaXJjbGVcIiwgaWNvbjogUmVhY3QuY3JlYXRlRWxlbWVudChEZWxldGVPdXRsaW5lZCwgbnVsbCksIHNpemU6IFwic21hbGxcIiwgb25DbGljazogZSA9PiBoYW5kbGVDbGlja1JlbW92ZShlLCBpZCksIHN0eWxlOiB7IHdpZHRoOiAnMjRweCcsIGZsZXg6ICdub25lJyB9IH0pKSkpO1xuICAgIGNvbnN0IHJlbmRlckludGVyY2VwdGVkUmVxdWVzdHMgPSAobWF0Y2gpID0+IHtcbiAgICAgICAgaWYgKCFpbnRlcmNlcHRlZFJlcXVlc3RzW21hdGNoXSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpbnRlcmNlcHRlZC1yZXF1ZXN0c1wiIH0sIFwiSW50ZXJjZXB0ZWQgTmV0d29ya3M6XCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpbnRlcmNlcHRlZFwiIH0sIGludGVyY2VwdGVkUmVxdWVzdHNbbWF0Y2hdLm1hcCgoeyB1cmwsIG51bSB9KSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChUb29sdGlwLCB7IHBsYWNlbWVudDogXCJ0b3BcIiwgdGl0bGU6IHVybCwga2V5OiB1cmwgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJhZGdlLCB7IGNvdW50OiBudW0sIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzk5OScsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDAgMCAxcHggI2Q5ZDlkOSBpbnNldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6ICctM3B4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAnNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSB9KSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJ1cmxcIiB9LCB1cmwpKSkpKSkpO1xuICAgIH07XG4gICAgaWYgKGlzTG9hZGluZykge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcIkxvYWRpbmcuLi5cIik7XG4gICAgfVxuICAgIGNvbnN0IGhhbmRsZVZpZXdEZXRhaWwgPSAodGV4dCwgcmVjb3JkKSA9PiB7XG4gICAgICAgIHNldEN1cnJlbnRFZGl0UnVsZShyZWNvcmQpO1xuICAgICAgICBzZXRTaG93RGV0YWlsKHRydWUpO1xuICAgIH07XG4gICAgY29uc3QgY2hlY2tEdXBsaWNhdGVNYXRjaCA9IChlKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICBjb25zdCBjdXJyZW50TWF0Y2ggPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgcmVhZFJ1bGVzRnJvbVN0b3JhZ2UoKS50aGVuKHJ1bGVzID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJ1bGVzLCBjdXJyZW50TWF0Y2gpO1xuICAgICAgICAgICAgLy8gcmV0dXJuIGR1cGxpY2F0ZSBtYXRjaFxuICAgICAgICAgICAgY29uc3QgZHVwbGljYXRlTWF0Y2ggPSBydWxlcy5maWx0ZXIocnVsZSA9PiBydWxlLm1hdGNoID09PSBjdXJyZW50TWF0Y2gpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coZHVwbGljYXRlTWF0Y2gpO1xuICAgICAgICAgICAgLy8gcmV0dXJuIGR1cGxpY2F0ZU1hdGNoO1xuICAgICAgICAgICAgc2V0RHVwbGljYXRlTWF0Y2goZHVwbGljYXRlTWF0Y2gpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IHRhYmxlQ29sdW1ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGl0bGU6IFwiaWRcIixcbiAgICAgICAgICAgIGRhdGFJbmRleDogXCJpZFwiLFxuICAgICAgICAgICAgd2lkdGg6ICcxNjBweCcsXG4gICAgICAgICAgICBlbGxpcHNpczogdHJ1ZSxcbiAgICAgICAgICAgIGtleTogXCJpZFwiLFxuICAgICAgICAgICAgcmVuZGVyOiAodGV4dCwgcmVjb3JkKSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChUb29sdGlwLCB7IHRpdGxlOiB0ZXh0IH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgdGV4dCkpKVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogXCJOYW1lXCIsXG4gICAgICAgICAgICB3aWR0aDogJzE1MHB4JyxcbiAgICAgICAgICAgIGRhdGFJbmRleDogXCJsYWJlbFwiLFxuICAgICAgICAgICAga2V5OiBcImxhYmVsXCIsXG4gICAgICAgICAgICBlbGxpcHNpczogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGl0bGU6IFwiRW5hYmxlXCIsXG4gICAgICAgICAgICB3aWR0aDogJzEyMHB4JyxcbiAgICAgICAgICAgIGRhdGFJbmRleDogXCJzd2l0Y2hPblwiLFxuICAgICAgICAgICAga2V5OiBcInN3aXRjaE9uXCIsXG4gICAgICAgICAgICByZW5kZXI6ICh0ZXh0LCByZWNvcmQpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KFN3aXRjaCwgeyBjaGVja2VkOiByZWNvcmQuc3dpdGNoT24sIG9uQ2hhbmdlOiAodmFsKSA9PiBoYW5kbGVTaW5nbGVTd2l0Y2hDaGFuZ2UodmFsLCByZWNvcmQuaWQpIH0pKVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogXCJtYXRjaFwiLFxuICAgICAgICAgICAgZGF0YUluZGV4OiBcIm1hdGNoXCIsXG4gICAgICAgICAgICBrZXk6IFwibWF0Y2hcIixcbiAgICAgICAgICAgIGVsbGlwc2lzOiB0cnVlLFxuICAgICAgICAgICAgcmVuZGVyOiAodGV4dCwgcmVjb3JkKSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChUb29sdGlwLCB7IHBsYWNlbWVudDogXCJ0b3BMZWZ0XCIsIHRpdGxlOiB0ZXh0IH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTcGFjZS5Db21wYWN0LCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyB0eXBlOiBcInRleHRcIiwgaWNvbjogUmVhY3QuY3JlYXRlRWxlbWVudChDb3B5T3V0bGluZWQsIG51bGwpLCBzaXplOiBcInNtYWxsXCIsIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb3B5IG1hdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQocmVjb3JkLm1hdGNoIHx8ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLnN1Y2Nlc3MoJ0NvcGllZCB0byBjbGlwYm9hcmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gfSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IHR5cGU6IFwibGlua1wiLCBzaXplOiBcInNtYWxsXCIsIG9uQ2xpY2s6ICgpID0+IGhhbmRsZVZpZXdEZXRhaWwodGV4dCwgcmVjb3JkKSB9LCB0ZXh0KSkpKVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogXCJBY3Rpb25cIixcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwcHgnLFxuICAgICAgICAgICAgcmVuZGVyOiAodGV4dCwgcmVjb3JkKSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChTcGFjZSwgbnVsbCxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyB0eXBlOiBcImxpbmtcIiwgb25DbGljazogKCkgPT4gaGFuZGxlVmlld0RldGFpbCh0ZXh0LCByZWNvcmQpLCBpY29uOiBSZWFjdC5jcmVhdGVFbGVtZW50KEVkaXRPdXRsaW5lZCwgbnVsbCkgfSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgdHlwZTogXCJ0ZXh0XCIsIGRhbmdlcjogdHJ1ZSwgb25DbGljazogKCkgPT4gaGFuZGxlQ2xpY2tSZW1vdmUodGV4dCwgcmVjb3JkLmlkKSwgaWNvbjogUmVhY3QuY3JlYXRlRWxlbWVudChEZWxldGVPdXRsaW5lZCwgbnVsbCkgfSkpKVxuICAgICAgICB9XG4gICAgXTtcbiAgICBjb25zdCBoYW5kbGVSdWxlc0NoYW5nZSA9IChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKDEpO1xuICAgICAgICBpZiAoY3VycmVudEVkaXRSdWxlKSB7XG4gICAgICAgICAgICBzZXRDdXJyZW50RWRpdFJ1bGUoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBjdXJyZW50RWRpdFJ1bGUpLCB7IG92ZXJyaWRlVHh0OiBKU09OLnN0cmluZ2lmeShkYXRhKSB9KSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZVVwZGF0ZVJ1bGVzID0gKCkgPT4ge1xuICAgICAgICBpZiAoY3VycmVudEVkaXRSdWxlKSB7XG4gICAgICAgICAgICByZWFkUnVsZXNGcm9tU3RvcmFnZSgpLnRoZW4ocnVsZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcnVsZXMuZmluZEluZGV4KHJ1bGUgPT4gcnVsZS5pZCA9PT0gY3VycmVudEVkaXRSdWxlLmlkKTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3UnVsZXMgPSBbLi4ucnVsZXNdO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UnVsZXNbaW5kZXhdID0gY3VycmVudEVkaXRSdWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbmV3IHJ1bGVcbiAgICAgICAgICAgICAgICAgICAgbmV3UnVsZXMucHVzaChjdXJyZW50RWRpdFJ1bGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRSdWxlcyhuZXdSdWxlcyk7XG4gICAgICAgICAgICAgICAgc2V0KCdhamF4SW50ZXJjZXB0b3JfcnVsZXMnLCBuZXdSdWxlcyk7XG4gICAgICAgICAgICAgICAgc2V0U2hvd0RldGFpbChmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFNwaW4sIHsgc3Bpbm5pbmc6IGlzTG9hZGluZyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcyMHB4JyxcbiAgICAgICAgICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMjBweCcsXG4gICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMnB4IDhweCByZ2JhKDAsMCwwLDAuMSknLFxuICAgICAgICAgICAgICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMjBweCcsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgICAgICAgICAgICAgfSB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTd2l0Y2gsIHsgY2hlY2tlZENoaWxkcmVuOiBcIk9uXCIsIHVuQ2hlY2tlZENoaWxkcmVuOiBcIk9mZlwiLCBjaGVja2VkOiBzd2l0Y2hPbiwgb25DaGFuZ2U6IGhhbmRsZVN3aXRjaENoYW5nZSB9KSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogMTAsXG4gICAgICAgICAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dC5TZWFyY2gsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogMjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcGxhY2Vob2xkZXI6IFwiU2VhcmNoIGJ5IG5hbWVcIiwgb25QcmVzc0VudGVyOiBoYW5kbGVTZWFyY2ggfSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXQuU2VhcmNoLCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDIwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHBsYWNlaG9sZGVyOiBcIlNlYXJjaCBieSB1cmxcIiwgb25QcmVzc0VudGVyOiBoYW5kbGVVcmxTZWFyY2ggfSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDMyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgY29sb3I6IFwicHJpbWFyeVwiLCB2YXJpYW50OiBcImZpbGxlZFwiLCBvbkNsaWNrOiAoKSA9PiBoYW5kbGVFeHBvcnRSdWxlcygpLCBpY29uOiBSZWFjdC5jcmVhdGVFbGVtZW50KEV4cG9ydE91dGxpbmVkLCBudWxsKSB9KSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVcGxvYWQsIE9iamVjdC5hc3NpZ24oe30sIHVwbG9hZFByb3BzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMzJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzMycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc0cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGNvbG9yOiBcInByaW1hcnlcIiwgdmFyaWFudDogXCJmaWxsZWRcIiwgaWNvbjogUmVhY3QuY3JlYXRlRWxlbWVudChGYUZpbGVJbXBvcnQsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSB9KSB9KSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IHR5cGU6IFwicHJpbWFyeVwiLCBvbkNsaWNrOiBoYW5kbGVBZGROZXdSdWxlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBsdXNPdXRsaW5lZCwgbnVsbCksXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFkZCBSdWxlXCIpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgcmVmOiB0YWJsZUJveFJlZiwgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCAycHggOHB4IHJnYmEoMCwwLDAsMC4xKScsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGFibGVCb3hIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgICAgICAhc3dpdGNoT24gJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDAuMSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAnbm90LWFsbG93ZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICB9IH0pKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYmxlLCB7IGJvcmRlcmVkOiB0cnVlLCBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMjAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogcnVsZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1RvdGFsOiAodG90YWwsIHJhbmdlKSA9PiBgVG90YWw6ICR7dG90YWx9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dTaXplQ2hhbmdlcjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9LCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0YWJsZUJveEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IHN3aXRjaE9uID8gMSA6IDAuNjUsXG4gICAgICAgICAgICAgICAgICAgIH0sIHNjcm9sbDogeyB5OiB0YWJsZUJveEhlaWdodCAtIDc4IH0sIHNpemU6ICdzbWFsbCcsIGNvbHVtbnM6IHRhYmxlQ29sdW1ucywgZGF0YVNvdXJjZTogcnVsZXMgfSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcmF3ZXIsIHsgbWFza0Nsb3NhYmxlOiBmYWxzZSwgd2lkdGg6IDEyMDAsIHRpdGxlOiBpc0NyZWF0aW5nID8gJ0NyZWF0ZSBuZXcgcnVsZScgOiAnRGV0YWlsIGZvciAnICsgKGN1cnJlbnRFZGl0UnVsZSA9PT0gbnVsbCB8fCBjdXJyZW50RWRpdFJ1bGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1cnJlbnRFZGl0UnVsZS5sYWJlbCksIG9wZW46IHNob3dEZXRhaWwsIG9uQ2xvc2U6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U2hvd0RldGFpbChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHNldElzQ3JlYXRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBzZXREdXBsaWNhdGVNYXRjaChbXSk7XG4gICAgICAgICAgICAgICAgfSwgZXh0cmE6IFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3BhY2UsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IG9uQ2xpY2s6ICgpID0+IHNldFNob3dEZXRhaWwoZmFsc2UpIH0sIFwiQ2FuY2VsXCIpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyB0eXBlOiBcInByaW1hcnlcIiwgb25DbGljazogaGFuZGxlVXBkYXRlUnVsZXMgfSwgXCJPS1wiKSkgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhcDogJzEwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvd1k6ICdzY3JvbGwnLFxuICAgICAgICAgICAgICAgICAgICB9IH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA1MDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVHlwb2dyYXBoeS5UaXRsZSwgeyBsZXZlbDogNCwgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSB9LCBcIklkOlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3BhY2UuQ29tcGFjdCwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElucHV0LCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcxMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZGlzYWJsZWQ6IHRydWUsIHZhbHVlOiAoY3VycmVudEVkaXRSdWxlID09PSBudWxsIHx8IGN1cnJlbnRFZGl0UnVsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VycmVudEVkaXRSdWxlLmlkKSB8fCAnJyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyB0eXBlOiBcInByaW1hcnlcIiwgaWNvbjogUmVhY3QuY3JlYXRlRWxlbWVudChDb3B5T3V0bGluZWQsIG51bGwpLCBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCgoY3VycmVudEVkaXRSdWxlID09PSBudWxsIHx8IGN1cnJlbnRFZGl0UnVsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VycmVudEVkaXRSdWxlLmlkKSB8fCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLnN1Y2Nlc3MoJ0NvcGllZCB0byBjbGlwYm9hcmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSB9KSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFR5cG9ncmFwaHkuVGl0bGUsIHsgbGV2ZWw6IDQgfSwgXCJMYWJlbDpcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElucHV0LCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzEwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHZhbHVlOiAoY3VycmVudEVkaXRSdWxlID09PSBudWxsIHx8IGN1cnJlbnRFZGl0UnVsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VycmVudEVkaXRSdWxlLmxhYmVsKSB8fCAnJywgb25DaGFuZ2U6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RWRpdFJ1bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEN1cnJlbnRFZGl0UnVsZShPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGN1cnJlbnRFZGl0UnVsZSksIHsgbGFiZWw6IGUudGFyZ2V0LnZhbHVlIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFR5cG9ncmFwaHkuVGl0bGUsIHsgbGV2ZWw6IDQgfSwgXCJNYXRjaDpcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElucHV0LlRleHRBcmVhLCB7IHJvd3M6IDEwLCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcxMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBvbkJsdXI6IGNoZWNrRHVwbGljYXRlTWF0Y2gsIHZhbHVlOiAoY3VycmVudEVkaXRSdWxlID09PSBudWxsIHx8IGN1cnJlbnRFZGl0UnVsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VycmVudEVkaXRSdWxlLm1hdGNoKSB8fCAnJywgb25DaGFuZ2U6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RWRpdFJ1bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEN1cnJlbnRFZGl0UnVsZShPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGN1cnJlbnRFZGl0UnVsZSksIHsgbWF0Y2g6IGUudGFyZ2V0LnZhbHVlIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXBsaWNhdGVNYXRjaC5sZW5ndGggPiAwICYmIGlzQ3JlYXRpbmcgJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29sbGFwc2UsIHsgc2l6ZTogXCJzbWFsbFwiLCBkZWZhdWx0QWN0aXZlS2V5OiBbJzEnXSwgaXRlbXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6ICcxJywgbGFiZWw6ICdEdXBsaWNhdGUgbWF0Y2g6ICcgKyBkdXBsaWNhdGVNYXRjaC5sZW5ndGgsIGNoaWxkcmVuOiBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLCBkdXBsaWNhdGVNYXRjaC5tYXAocnVsZSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChUeXBvZ3JhcGh5LlRleHQsIHsgY2xhc3NOYW1lOiAnZHVwbGljYXRlLW1hdGNoJywga2V5OiBydWxlLmlkLCBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldElzQ3JlYXRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDdXJyZW50RWRpdFJ1bGUocnVsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFNob3dEZXRhaWwodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSB9LCBydWxlLm1hdGNoKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XSB9KSkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEpzb25FZGl0b3IsIHsgcm9vdE5hbWU6ICcnLCBjbGFzc05hbWU6ICdqc29uLWVkaXRvcicsIGRhdGE6IEpTT04ucGFyc2UoKGN1cnJlbnRFZGl0UnVsZSA9PT0gbnVsbCB8fCBjdXJyZW50RWRpdFJ1bGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1cnJlbnRFZGl0UnVsZS5vdmVycmlkZVR4dCkgfHwgJ3t9JyksIHNldERhdGE6IGhhbmRsZVJ1bGVzQ2hhbmdlIH0pKSkpKSk7XG59O1xuY29uc3Qgcm9vdCA9IGNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpKTtcbnJvb3QucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuU3RyaWN0TW9kZSwgbnVsbCxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEFwcCwgbnVsbCkpKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmFtZE8gPSB7fTsiLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsInZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiA/IChvYmopID0+IChPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSkgOiAob2JqKSA9PiAob2JqLl9fcHJvdG9fXyk7XG52YXIgbGVhZlByb3RvdHlwZXM7XG4vLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3Rcbi8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuLy8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4vLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3Rcbi8vIG1vZGUgJiAxNjogcmV0dXJuIHZhbHVlIHdoZW4gaXQncyBQcm9taXNlLWxpa2Vcbi8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbl9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG5cdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IHRoaXModmFsdWUpO1xuXHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuXHRpZih0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlKSB7XG5cdFx0aWYoKG1vZGUgJiA0KSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG5cdFx0aWYoKG1vZGUgJiAxNikgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09ICdmdW5jdGlvbicpIHJldHVybiB2YWx1ZTtcblx0fVxuXHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuXHR2YXIgZGVmID0ge307XG5cdGxlYWZQcm90b3R5cGVzID0gbGVhZlByb3RvdHlwZXMgfHwgW251bGwsIGdldFByb3RvKHt9KSwgZ2V0UHJvdG8oW10pLCBnZXRQcm90byhnZXRQcm90byldO1xuXHRmb3IodmFyIGN1cnJlbnQgPSBtb2RlICYgMiAmJiB2YWx1ZTsgdHlwZW9mIGN1cnJlbnQgPT0gJ29iamVjdCcgJiYgIX5sZWFmUHJvdG90eXBlcy5pbmRleE9mKGN1cnJlbnQpOyBjdXJyZW50ID0gZ2V0UHJvdG8oY3VycmVudCkpIHtcblx0XHRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjdXJyZW50KS5mb3JFYWNoKChrZXkpID0+IChkZWZba2V5XSA9ICgpID0+ICh2YWx1ZVtrZXldKSkpO1xuXHR9XG5cdGRlZlsnZGVmYXVsdCddID0gKCkgPT4gKHZhbHVlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBkZWYpO1xuXHRyZXR1cm4gbnM7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIi8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuLy8gU2luY2UgYWxsIHJlZmVyZW5jZWQgY2h1bmtzIGFyZSBhbHJlYWR5IGluY2x1ZGVkXG4vLyBpbiB0aGlzIGZpbGUsIHRoaXMgZnVuY3Rpb24gaXMgZW1wdHkgaGVyZS5cbl9fd2VicGFja19yZXF1aXJlX18uZSA9ICgpID0+IChQcm9taXNlLnJlc29sdmUoKSk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmhtZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGUpO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsICdleHBvcnRzJywge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0c2V0OiAoKSA9PiB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VTIE1vZHVsZXMgbWF5IG5vdCBhc3NpZ24gbW9kdWxlLmV4cG9ydHMgb3IgZXhwb3J0cy4qLCBVc2UgRVNNIGV4cG9ydCBzeW50YXgsIGluc3RlYWQ6ICcgKyBtb2R1bGUuaWQpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAhc2NyaXB0VXJsKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWlucGFuZWxcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2hyb21lX2V4dGVuc2lvbl90eXBlc2NyaXB0X3N0YXJ0ZXJcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2hyb21lX2V4dGVuc2lvbl90eXBlc2NyaXB0X3N0YXJ0ZXJcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21haW5wYW5lbC50c3hcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==