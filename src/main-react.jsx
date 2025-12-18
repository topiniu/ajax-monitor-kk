import React from 'react';
import { createRoot } from 'react-dom/client';
import FloatingUI from './components/FloatingUI';

// Enhanced monitoring system with proper data management
class AjaxMonitoringSystem {
  constructor() {
    this.interceptedRequests = new Map(); // Use Map for better performance
    this.maxHistorySize = 50; // Limit history to prevent memory issues
    this.listeners = [];
  }

  // Add a new intercepted request
  addInterceptedRequest(matchedInterface, requestUrl, method) {
    if (!matchedInterface || !matchedInterface.match) {
      console.warn('[KK Ajax Monitor] Invalid matchedInterface:', matchedInterface);
      return;
    }

    const match = matchedInterface.match.trim();
    if (!match) {
      console.warn('[KK Ajax Monitor] Empty match pattern, skipping');
      return;
    }

    const timestamp = Date.now();
    const requestId = `${match}_${timestamp}`;

    // Create request entry
    const requestEntry = {
      id: requestId,
      match,
      url: requestUrl,
      method,
      timestamp,
      matchedInterface,
      count: 1
    };

    // Check if we already have this match pattern
    if (this.interceptedRequests.has(match)) {
      const existing = this.interceptedRequests.get(match);
      existing.count++;
      existing.timestamp = timestamp; // Update last seen time
      existing.url = requestUrl; // Update to latest URL
    } else {
      this.interceptedRequests.set(match, requestEntry);
    }

    // Limit history size
    this.limitHistorySize();

    // Notify listeners
    this.notifyListeners();
  }

  // Get all unique matches
  getUniqueMatches() {
    return Array.from(this.interceptedRequests.keys()).filter(match => match && match.trim());
  }

  // Get detailed request info
  getRequestDetails() {
    return Array.from(this.interceptedRequests.values())
      .sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent
  }

  // Clear old entries to prevent memory issues
  limitHistorySize() {
    if (this.interceptedRequests.size > this.maxHistorySize) {
      const entries = Array.from(this.interceptedRequests.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp); // Sort by oldest first

      // Remove oldest entries
      const toRemove = entries.slice(0, this.interceptedRequests.size - this.maxHistorySize);
      toRemove.forEach(([match]) => {
        this.interceptedRequests.delete(match);
      });
    }
  }

  // Clear all data
  clear() {
    this.interceptedRequests.clear();
    this.notifyListeners();
  }

  // Delete specific request by match pattern
  deleteRequest(match) {
    try {
      if (this.interceptedRequests.has(match)) {
        this.interceptedRequests.delete(match);
        // Use setTimeout to avoid any potential sync issues
        setTimeout(() => {
          this.notifyListeners();
        }, 0);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[KK Ajax Monitor] Delete request error:', error.message);
      return false;
    }
  }

  // Add listener for data changes
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Notify all listeners of data changes
  notifyListeners() {
    try {
      const uniqueMatches = this.getUniqueMatches();
      const requestDetails = this.getRequestDetails();

      this.listeners.forEach(callback => {
        try {
          callback(uniqueMatches, requestDetails);
        } catch (error) {
          console.error('[KK Ajax Monitor] Listener error:', error.message);
        }
      });
    } catch (error) {
      console.error('[KK Ajax Monitor] Notification error:', error.message);
    }
  }

  // Get statistics
  getStats() {
    const details = this.getRequestDetails();
    return {
      totalRequests: details.reduce((sum, req) => sum + req.count, 0),
      uniqueMatches: details.length,
      oldestRequest: details.length > 0 ? Math.min(...details.map(r => r.timestamp)) : null,
      newestRequest: details.length > 0 ? Math.max(...details.map(r => r.timestamp)) : null
    };
  }
}

// Global monitoring system instance
const ajaxMonitoringSystem = new AjaxMonitoringSystem();

// 命名空间
let ajax_interceptor = {
  settings: {
    ajaxInterceptor_switchOn: false,
    ajaxInterceptor_always200On: true, // 默认开启，后期可以扩展成设置项
    ajaxInterceptor_rules: [],
  },
  // 获取匹配到的规则项
  getMatchedInterface: ({ thisRequestUrl = "", thisMethod = "" }) => {
    return ajax_interceptor.settings.ajaxInterceptor_rules.find((item) => {
      let {
        filterType = "normal",
        limitMethod = "ALL",
        switchOn = true,
        match,
      } = item;
      // remove \n if match has it in the end
      match = match?.replace(/\n$/, "");
      const matchedMethod = thisMethod === limitMethod || limitMethod === "ALL";
      const matchedRequest =
        (filterType === "normal" && thisRequestUrl === match) ||
        (filterType === "regex" &&
          thisRequestUrl.match(new RegExp(match, "i")));
      return switchOn && matchedMethod && matchedRequest;
    });
  },
  // 执行用户输入的函数，如果有错误会抛出到控制台
  executeStringFunction: (stringFunction, args, funcName = "") => {
    try {
      stringFunction = new Function("...args", stringFunction)(args);
    } catch (e) {
      console.error(
        `[Ajax Modifier] ExecuteFunctionError: Please check the ${funcName} function.\n`,
        e
      );
    }
    return stringFunction;
  },
  getRequestParams: (requestUrl) => {
    if (!requestUrl) {
      return null;
    }
    const paramStr = requestUrl.split("?").pop();
    const keyValueArr = paramStr.split("&");
    let keyValueObj = {};
    keyValueArr.forEach((item) => {
      // 保证中间不会把=给忽略掉
      const itemArr = item.replace("=", "〓").split("〓");
      const itemObj = { [itemArr[0]]: itemArr[1] };
      keyValueObj = Object.assign(keyValueObj, itemObj);
    });
    return keyValueObj;
  },
  getCompleteUrl: (inputUrl) => {
    let url = inputUrl.trim();
    const protocol = window.location.protocol;
    const host = window.location.host;
    const currentUrl = window.location.href;
    try {
      // 如果解析成功，表示输入是完整的URL，不需要处理
      new URL(url);
    } catch (e) {
      if (url.startsWith("./") || url.startsWith("../")) {
        // 相对路由
        url = new URL(url, currentUrl).href;
      } else if (url.startsWith("//")) {
        // 只缺少协议，补全协议
        url = protocol + url;
      } else {
        // 既没有协议也没有域名，补全域名和协议
        url = protocol + "//" + host + (url.startsWith("/") ? "" : "/") + url;
      }
    }
    return url;
  },
  originalXHR: window.XMLHttpRequest,
  myXHR: function () {
    let pageScriptEventDispatched = false;
    const self = this; // Capture the custom wrapper context
    if (!ajax_interceptor.settings.ajaxInterceptor_switchOn) {
      return new ajax_interceptor.originalXHR();
    }
    const modifyResponse = function () {
      const [method, requestUrl] = self._openArgs;
      const queryParams = ajax_interceptor.getRequestParams(requestUrl);
      const [requestPayload] = self._sendArgs;
      const matchedInterface = self._matchedInterface;
      if (
        matchedInterface &&
        (matchedInterface.overrideTxt || matchedInterface.overrideResponseFunc)
      ) {
        // Use enhanced monitoring system
        ajaxMonitoringSystem.addInterceptedRequest(matchedInterface, requestUrl, method);
        const {
          overrideTxt,
          overrideResponseFunc,
          match,
          isExpert = false,
        } = matchedInterface;
        let overrideResponse = undefined;
        let overrideStatus = undefined;
        let overrideStatusText = undefined;
        if (overrideTxt && !isExpert) {
          // 普通模式，直接替换
          overrideResponse = overrideTxt;
          // 状态用200覆盖
          if (
            ajax_interceptor.settings.ajaxInterceptor_always200On &&
            self.status !== 200
          ) {
            overrideStatus = 200;
            overrideStatusText = "OK";
          }
        } else if (overrideResponseFunc && isExpert) {
          // 专业模式，用函数替换
          const funcArgs = {
            method,
            payload: {
              queryParams,
              requestPayload,
            },
            orgResponse: self.response,
            orgStatus: self.status,
            orgStatusText: self.statusText,
          };
          const res = ajax_interceptor.executeStringFunction(
            overrideResponseFunc,
            funcArgs,
            "response"
          );
          // 返回是对象才处理
          if (typeof res === "object" && res !== null) {
            const {
              response: newResponse = undefined,
              status: newStatus = undefined,
              statusText: newStatusText = undefined,
            } = res;
            overrideResponse = newResponse;
            overrideStatus = newStatus;
            overrideStatusText = newStatusText;
          } else {
            console.error(
              `[Ajax Modifier] ExecuteFunctionError: Please check your return in the response function. See more details in the examples. \n`
            );
          }
        }
        // 没有返回不替换
        self.responseText =
          overrideResponse !== undefined ? overrideResponse : self.responseText;
        self.response =
          overrideResponse !== undefined ? overrideResponse : self.response;
        self.status =
          overrideStatus !== undefined ? overrideStatus : self.status;
        self.statusText =
          overrideStatusText !== undefined
            ? overrideStatusText
            : self.statusText;
        if (!pageScriptEventDispatched) {
          window.dispatchEvent(
            new CustomEvent("pageScript", {
              detail: { url: self.responseURL, match },
            })
          );
          pageScriptEventDispatched = true;
        }
      }
    };

    const xhr = new ajax_interceptor.originalXHR();
    for (let attr in xhr) {
      if (attr === "onreadystatechange") {
        xhr.onreadystatechange = (...args) => {
          if (xhr.readyState === 4) {
            modifyResponse();
          }
          self.onreadystatechange && self.onreadystatechange.apply(self, args);
        };
        self.onreadystatechange = null;
        continue;
      } else if (attr === "onload") {
        xhr.onload = (...args) => {
          modifyResponse();
          self.onload && self.onload.apply(self, args);
        };
        self.onload = null;
        continue;
      } else if (attr === "open") {
        self.open = (...args) => {
          self._openArgs = args;
          const [method, requestUrl] = args;
          self._matchedInterface = ajax_interceptor.getMatchedInterface({
            thisRequestUrl: ajax_interceptor.getCompleteUrl(requestUrl),
            thisMethod: method,
          });
          const matchedInterface = self._matchedInterface;
          // modify request
          if (matchedInterface) {
            const { overridePayloadFunc, isExpert = false } = matchedInterface;
            if (
              overridePayloadFunc &&
              isExpert &&
              args[0] &&
              args[1] &&
              args[0].toUpperCase() === "GET"
            ) {
              const queryParams = ajax_interceptor.getRequestParams(args[1]);
              const data = {
                requestUrl: args[1],
                queryParams,
              };
              args[1] = ajax_interceptor.executeStringFunction(
                overridePayloadFunc,
                data,
                "payload"
              );
            }
          }
          xhr.open && xhr.open.apply(xhr, args);
        };
        continue;
      } else if (attr === "setRequestHeader") {
        self.setRequestHeader = (...args) => {
          // get headers
          self._headerArgs = self._headerArgs
            ? Object.assign(self._headerArgs, { [args[0]]: args[1] })
            : { [args[0]]: args[1] };
          const matchedInterface = self._matchedInterface;
          if (
            !(
              matchedInterface &&
              matchedInterface.overrideHeadersFunc &&
              matchedInterface.isExpert
            )
          ) {
            // 没有要拦截修改或添加的header
            xhr.setRequestHeader && xhr.setRequestHeader.apply(xhr, args);
          }
        };
        continue;
      } else if (attr === "send") {
        self.send = (...args) => {
          const matchedInterface = self._matchedInterface;
          if (matchedInterface) {
            // modify headers
            const {
              overrideHeadersFunc,
              overridePayloadFunc,
              isExpert = false,
            } = matchedInterface;
            if (overrideHeadersFunc && isExpert) {
              const headers = ajax_interceptor.executeStringFunction(
                overrideHeadersFunc,
                self._headerArgs,
                "headers"
              );
              Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader &&
                  xhr.setRequestHeader.apply(xhr, [key, headers[key]]);
              });
            }
            // modify not GET payload
            const [method] = self._openArgs;
            if (overridePayloadFunc && isExpert && method !== "GET") {
              args[0] = ajax_interceptor.executeStringFunction(
                overridePayloadFunc,
                args[0],
                "payload"
              );
            }
          }
          self._sendArgs = args;
          xhr.send && xhr.send.apply(xhr, args);
        };
        continue;
      }

      if (typeof xhr[attr] === "function") {
        self[attr] = xhr[attr].bind(xhr);
      } else {
        // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在self[`_${attr}`]上
        if (
          ["responseText", "response", "status", "statusText"].includes(attr)
        ) {
          Object.defineProperty(self, attr, {
            get: () =>
              self[`_${attr}`] == undefined ? xhr[attr] : self[`_${attr}`],
            set: (val) => (self[`_${attr}`] = val),
            enumerable: true,
          });
        } else {
          Object.defineProperty(self, attr, {
            get: () => xhr[attr],
            set: (val) => (xhr[attr] = val),
            enumerable: true,
          });
        }
      }
    }
  },
  originalFetch: window.fetch.bind(window),
  myFetch: function (...args) {
    if (!ajax_interceptor.settings.ajaxInterceptor_switchOn) {
      return ajax_interceptor.originalFetch(...args);
    }
    const getOriginalResponse = async (stream) => {
      let text = "";
      const decoder = new TextDecoder("utf-8");
      const reader = stream.getReader();
      const processData = (result) => {
        if (result.done) {
          return text;
        }
        const value = result.value; // Uint8Array
        text += decoder.decode(value, { stream: true });
        // 读取下一个文件片段，重复处理步骤
        return reader.read().then(processData);
      };
      return await reader.read().then(processData);
    };
    const [requestUrl, data] = args;

    let inputUrl = "";

    if (typeof requestUrl === "string") {
      inputUrl = requestUrl;
    } else if (typeof requestUrl === "object") {
      inputUrl = requestUrl.url || "";
    }

    const matchedInterface = ajax_interceptor.getMatchedInterface({
      thisRequestUrl: ajax_interceptor.getCompleteUrl(inputUrl),
      thisMethod: data && data.method,
    });
    if (matchedInterface && args) {
      // Use enhanced monitoring system
      ajaxMonitoringSystem.addInterceptedRequest(
        matchedInterface,
        inputUrl,
        data && data.method || 'GET'
      );
      const {
        overrideHeadersFunc,
        overridePayloadFunc,
        isExpert = false,
      } = matchedInterface;
      if (overrideHeadersFunc && isExpert && args[1]) {
        const headers = ajax_interceptor.executeStringFunction(
          overrideHeadersFunc,
          this._headerArgs,
          "headers"
        );
        args[1].headers = headers;
      }
      if (overridePayloadFunc && isExpert && args[0] && args[1]) {
        const { method } = args[1];
        if (["GET", "HEAD"].includes(method.toUpperCase())) {
          const queryParams = ajax_interceptor.getRequestParams(args[0]);
          const data = {
            requestUrl: args[0],
            queryParams,
          };
          args[0] = ajax_interceptor.executeStringFunction(
            overridePayloadFunc,
            data,
            "payload"
          );
        } else {
          data.body = ajax_interceptor.executeStringFunction(
            overridePayloadFunc,
            data.body,
            "payload"
          );
        }
      }
    }
    return ajax_interceptor.originalFetch(...args).then(async (response) => {
      if (
        matchedInterface &&
        (matchedInterface.overrideTxt || matchedInterface.overrideResponseFunc)
      ) {
        window.dispatchEvent(
          new CustomEvent("pageScript", {
            detail: { url: response.url, match: matchedInterface.match },
          })
        );
        let txt = undefined;
        txt = matchedInterface.overrideTxt;
        const {
          overrideTxt,
          overrideResponseFunc,
          isExpert = false,
        } = matchedInterface;
        let overrideResponse = undefined;
        let overrideStatus = undefined;
        let overrideStatusText = undefined;

        if (overrideTxt && !isExpert) {
          // 普通模式，直接替换
          overrideResponse = overrideTxt;
          // 状态用200覆盖
          if (
            ajax_interceptor.settings.ajaxInterceptor_always200On &&
            this.status !== 200
          ) {
            overrideStatus = 200;
            overrideStatusText = "OK";
          }
        } else if (overrideResponseFunc && isExpert) {
          // 专业模式，用函数替换
          const queryParams = ajax_interceptor.getRequestParams(requestUrl);
          const orgResponse = await getOriginalResponse(response.body);
          const funcArgs = {
            method: data?.method,
            payload: {
              queryParams,
              requestPayload: data?.body,
            },
            orgResponse,
            orgStatus: response.status,
            orgStatusText: response.statusText,
          };
          const res = ajax_interceptor.executeStringFunction(
            overrideResponseFunc,
            funcArgs,
            "response"
          );
          if (typeof res === "object" && res !== null) {
            const {
              response: newResponse = undefined,
              status: newStatus = undefined,
              statusText: newStatusText = undefined,
            } = res;
            overrideResponse = newResponse;
            overrideStatus = newStatus;
            overrideStatusText = newStatusText;
          } else {
            console.error(
              `[Ajax Modifier] ExecuteFunctionError: Please check your return in the response function. See more details in the examples. \n`
            );
          }
        }
        txt =
          overrideResponse !== undefined
            ? overrideResponse
            : response.responseText;
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(txt));
            controller.close();
          },
        });
        let params = {
          status:
            overrideStatus !== undefined ? overrideStatus : response.status,
          statusText:
            overrideStatusText !== undefined
              ? overrideStatusText
              : response.statusText,
        };
        const newResponse = new Response(stream, {
          headers: response.headers,
          ...params,
        });
        const proxy = new Proxy(newResponse, {
          get: function (target, name) {
            switch (name) {
              case "redirected":
              case "type":
              case "url":
              case "useFinalURL":
              case "body":
              case "bodyUsed":
                return response[name];
            }
            return target[name];
          },
        });
        for (let key in proxy) {
          if (typeof proxy[key] === "function") {
            proxy[key] = proxy[key].bind(newResponse);
          }
        }
        return proxy;
      } else {
        return response;
      }
    });
  },
};

// React UI Management
let floatingUIRoot = null;
let currentInterceptedUrls = [];
let currentRequestDetails = [];

const shouldShowButtonForCurrentSite = () => {
  if (!ajax_interceptor.settings.ajaxInterceptor_switchOn) {
    return false;
  }

  if (!ajax_interceptor.settings.ajaxInterceptor_rules || ajax_interceptor.settings.ajaxInterceptor_rules.length === 0) {
    return false;
  }

  const currentUrl = window.location.href;
  const currentHost = window.location.host;

  return ajax_interceptor.settings.ajaxInterceptor_rules.some((rule) => {
    if (!rule.switchOn) return false;

    const { match, filterType = "normal" } = rule;
    if (!match) return false;

    if (filterType === "regex") {
      try {
        return new RegExp(match, "i").test(currentUrl);
      } catch (e) {
        console.warn("[KK Ajax Monitor] Invalid regex pattern:", match);
        return false;
      }
    } else {
      return currentUrl.includes(match) || match.includes(currentHost);
    }
  });
};

const createFloatingUIContainer = () => {
  let container = document.getElementById('kk-floating-ui-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'kk-floating-ui-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 10001;
    `;
    container.style.pointerEvents = 'none';
    // Make all children have pointer events
    container.addEventListener('mousedown', (e) => e.stopPropagation());
    container.addEventListener('click', (e) => e.stopPropagation());
    document.body.appendChild(container);
  }
  return container;
};

const initializeFloatingUI = () => {
  const container = createFloatingUIContainer();
  container.style.pointerEvents = 'auto';

  if (!floatingUIRoot) {
    floatingUIRoot = createRoot(container);
  }

  const renderUI = () => {
    const shouldShow = shouldShowButtonForCurrentSite();

    floatingUIRoot.render(
      <FloatingUI
        interceptedUrls={currentInterceptedUrls}
        requestDetails={currentRequestDetails}
        shouldShow={shouldShow}
        onVisibilityChange={(visible) => {
          console.log('[KK Ajax Monitor] UI visibility changed:', visible);
        }}
        onClearRequests={() => {
          ajaxMonitoringSystem.clear();
        }}
        onDeleteItem={(match) => {
          try {
            const success = ajaxMonitoringSystem.deleteRequest(match);
            if (success) {
              // Use a simple log without any potential cross-context calls
              console.log('[KK Ajax Monitor] Deleted:', match.substring(0, 50) + (match.length > 50 ? '...' : ''));
            }
          } catch (error) {
            // Catch any potential errors and log them safely
            console.error('[KK Ajax Monitor] Delete error:', error.message);
          }
        }}
      />
    );
  };

  // Set up listener for monitoring system updates
  const handleMonitoringUpdate = (uniqueMatches, requestDetails) => {
    currentInterceptedUrls = uniqueMatches;
    currentRequestDetails = requestDetails;
    renderUI();
  };

  // Add listener to monitoring system
  ajaxMonitoringSystem.addListener(handleMonitoringUpdate);

  renderUI();
  return renderUI;
};

// Update function to refresh the React UI
const updateFloatingUI = initializeFloatingUI();

// Initialize AJAX interceptor
const initializeAjaxInterceptor = () => {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "local" && changes.ajaxInterceptor_switchOn) {
        const switchOn = changes.ajaxInterceptor_switchOn.newValue;
        ajax_interceptor.settings.ajaxInterceptor_switchOn = switchOn;
        if (switchOn) {
          setTimeout(() => {
            if (
              window.XMLHttpRequest.name.includes("Xhook") ||
              window.fetch.name.includes("Xhook")
            ) {
              window.XMLHttpRequest = ajax_interceptor.myXHR;
              window.fetch = ajax_interceptor.myFetch;
            }
          }, 0);
        } else {
          window.XMLHttpRequest = ajax_interceptor.originalXHR;
          window.fetch = ajax_interceptor.originalFetch;
        }
        updateFloatingUI();
      }

      if (namespace === "local" && changes.ajaxInterceptor_rules) {
        ajax_interceptor.settings.ajaxInterceptor_rules = changes.ajaxInterceptor_rules.newValue;
        updateFloatingUI();
      }
    });

    chrome.storage.local.get(["ajaxInterceptor_switchOn", "ajaxInterceptor_rules"], (result) => {
      const switchOn = result.ajaxInterceptor_switchOn;
      ajax_interceptor.settings.ajaxInterceptor_switchOn = switchOn;
      ajax_interceptor.settings.ajaxInterceptor_rules = result.ajaxInterceptor_rules || [];

      if (switchOn) {
        setTimeout(() => {
          if (
            window.XMLHttpRequest.name.includes("Xhook") ||
            window.fetch.name.includes("Xhook")
          ) {
            window.XMLHttpRequest = ajax_interceptor.myXHR;
            window.fetch = ajax_interceptor.myFetch;
          }
        }, 0);
      } else {
        ajaxMonitoringSystem.clear();
        window.XMLHttpRequest = ajax_interceptor.originalXHR;
        window.fetch = ajax_interceptor.originalFetch;
      }

      updateFloatingUI();
    });
  }
};

// Set up the interceptors
window.XMLHttpRequest = ajax_interceptor.myXHR;
window.fetch = ajax_interceptor.myFetch;

window.onload = () => {
  initializeAjaxInterceptor();
};

// Message listener for communication with content script
window.addEventListener(
  "message",
  function (event) {
    const data = event.data;

    if (data.type === "ajaxInterceptor" && data.to === "pageScript") {
      ajax_interceptor.settings[data.key] = data.value;
      updateFloatingUI();
    }
  },
  false
);