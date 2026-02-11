console.log('[KK Ajax Monitor] Script loading...');
const AJAX_MODIFIER_KK_PANEL_DATA = [];
// 命名空间
let ajax_interceptor = {
  settings: {
    ajaxInterceptor_switchOn: false,
    ajaxInterceptor_always200On: true, // 默认开启，后期可以扩展成设置项
    ajaxInterceptor_rules: [],
  },
  // 获取匹配到的规则项
  getMatchedInterface: ({ thisRequestUrl = "", thisMethod = "" }) => {
    const normalizedUrl = thisRequestUrl || "";
    const normalizedMethod = (thisMethod || "GET").toUpperCase();
    console.log('[KK Ajax Monitor] Checking rules for URL:', thisRequestUrl, 'Method:', thisMethod);
    console.log('[KK Ajax Monitor] Available rules:', ajax_interceptor.settings.ajaxInterceptor_rules.length);

    return ajax_interceptor.settings.ajaxInterceptor_rules.find((item, index) => {
      let {
        filterType = "normal",
        limitMethod = "ALL",
        switchOn = true,
        match,
      } = item;
      const normalizedLimitMethod = (limitMethod || "ALL").toUpperCase();
      // remove \n if match has it in the end and trim whitespace to avoid accidental mismatches
      match = match?.replace(/\n$/, "")?.trim();

      // Empty match should not trigger interception
      if (!match) {
        return false;
      }

      const matchedMethod = normalizedMethod === normalizedLimitMethod || normalizedLimitMethod === "ALL";

      let matchedRequest = false;
      if (filterType === "normal") {
        // 支持完整匹配或部分匹配，确保填写路径片段时也能拦截
        matchedRequest = normalizedUrl === match || normalizedUrl.includes(match);
      } else if (filterType === "regex") {
        try {
          matchedRequest = new RegExp(match, "i").test(normalizedUrl);
        } catch (e) {
          console.warn("[KK Ajax Monitor] Invalid regex pattern:", match, e);
          matchedRequest = false;
        }
      }

      console.log(`[KK Ajax Monitor] Rule ${index}:`, {
        match: match,
        filterType: filterType,
        limitMethod: limitMethod,
        switchOn: switchOn,
        matchedMethod: matchedMethod,
        matchedRequest: matchedRequest,
        finalMatch: switchOn && matchedMethod && matchedRequest
      });

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
        AJAX_MODIFIER_KK_PANEL_DATA.push(matchedInterface);
        updateFloatPanelContent();
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
          const normalizedMethod = (method || "GET").toUpperCase();
          args[0] = normalizedMethod;
          const completeUrl = ajax_interceptor.getCompleteUrl(requestUrl);
          self._openArgs = [normalizedMethod, requestUrl, ...args.slice(2)];
          self._matchedInterface = ajax_interceptor.getMatchedInterface({
            thisRequestUrl: completeUrl,
            thisMethod: normalizedMethod,
          });
          const matchedInterface = self._matchedInterface;
          console.log('[KK Ajax Monitor] XHR request:', normalizedMethod, completeUrl, 'Matched rule:', !!matchedInterface);
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
    console.log('[KK Ajax Monitor] Fetch intercepted:', args[0]);
    if (!ajax_interceptor.settings.ajaxInterceptor_switchOn) {
      console.log('[KK Ajax Monitor] Fetch interception disabled, using original fetch');
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

    const normalizedFetchMethod = (data && data.method ? data.method : "GET").toUpperCase();
    const completeUrl = ajax_interceptor.getCompleteUrl(inputUrl);
    const matchedInterface = ajax_interceptor.getMatchedInterface({
      thisRequestUrl: completeUrl,
      thisMethod: normalizedFetchMethod,
    });
    console.log('[KK Ajax Monitor] Fetch request:', normalizedFetchMethod, completeUrl, 'Matched rule:', !!matchedInterface);
    if (matchedInterface && args) {
      AJAX_MODIFIER_KK_PANEL_DATA.push(matchedInterface);
      updateFloatPanelContent();
      const {
        overrideHeadersFunc,
        overridePayloadFunc,
        isExpert = false,
      } = matchedInterface;
      if (overrideHeadersFunc && isExpert && args[1]) {
        const headers = ajax_interceptor.executeStringFunction(
          overrideHeadersFunc,
          args[1].headers || {},
          "headers"
        );
        args[1].headers = headers;
      }
      if (overridePayloadFunc && isExpert && args[0] && args[1]) {
        const { method } = args[1];
        const normalizedMethod = (method || "GET").toUpperCase();
        if (["GET", "HEAD"].includes(normalizedMethod)) {
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
          args[1].body = ajax_interceptor.executeStringFunction(
            overridePayloadFunc,
            args[1].body,
            "payload"
          );
        }
      }
    }
    return ajax_interceptor.originalFetch(...args).then(async (response) => {
      console.log('[KK Ajax Monitor] Fetch response received:', response.url, response.status);
      if (
        matchedInterface &&
        (matchedInterface.overrideTxt || matchedInterface.overrideResponseFunc)
      ) {
        console.log('[KK Ajax Monitor] Modifying fetch response for:', response.url);
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
            response.status !== 200
          ) {
            overrideStatus = 200;
            overrideStatusText = "OK";
          }
        } else if (overrideResponseFunc && isExpert) {
          // 专业模式，用函数替换
          const safeRequestUrl =
            typeof requestUrl === "string"
              ? requestUrl
              : requestUrl?.url || "";
          const queryParams = ajax_interceptor.getRequestParams(safeRequestUrl);
          const orgResponse = await getOriginalResponse(response.clone().body);
          const funcArgs = {
            method: normalizedFetchMethod,
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
            : await getOriginalResponse(response.clone().body);
        console.log('[KK Ajax Monitor] Final response text length:', txt?.length || 0, 'Override used:', overrideResponse !== undefined);
        const stream = new ReadableStream({
          start(controller) {
            // const bufView = new Uint8Array(new ArrayBuffer(txt.length))
            // for (var i = 0 i < txt.length i++) {
            //   bufView[i] = txt.charCodeAt(i)
            // }
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

const toastMessage = (matchedInterface) => {
  // toast a message though dom to show the matchedInterface
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.top = "10px";
  toast.style.left = "10px";
  toast.style.backgroundColor = "red";
  toast.style.color = "white";
  toast.style.padding = "10px";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0.5";
  toast.innerHTML = `[AJAx Modifier] matchedInterface: ${matchedInterface.match}`;
  if (document.body) document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 5000);
};

const controlFloatPanelButton = () => {
  // Check if button already exists
  let button = document.getElementById("ajax-modifier-panel-button");
  if (button) {
    return; // Button already exists
  }

  // create a modern draggable button to control the float panel
  button = document.createElement("div");
  button.id = "ajax-modifier-panel-button";
  button.innerHTML = `
    <div class="kk-button-content">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span class="kk-button-text">KK</span>
    </div>
    <div class="kk-button-close" title="Hide button">×</div>
  `;

  // Modern styling
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    cursor: move;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    transition: all 0.3s ease;
    user-select: none;
    overflow: hidden;
  `;

  // Add hover effects with CSS
  const style = document.createElement('style');
  style.textContent = `
    #ajax-modifier-panel-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
    }

    .kk-button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      transition: all 0.3s ease;
    }

    .kk-button-text {
      font-size: 10px;
      font-weight: 600;
      margin-top: 2px;
    }

    .kk-button-close {
      position: absolute;
      top: -2px;
      right: 2px;
      width: 16px;
      height: 16px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .kk-button-close:hover {
      background: rgba(255, 0, 0, 0.8);
    }

    #ajax-modifier-panel-button:hover .kk-button-close {
      display: flex;
    }

    .kk-dragging {
      transition: none !important;
      cursor: grabbing !important;
    }
  `;
  document.head.appendChild(style);

  // Make button draggable
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  const startDrag = (e) => {
    if (e.target.classList.contains('kk-button-close')) return;

    isDragging = true;
    button.classList.add('kk-dragging');

    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

    startX = clientX;
    startY = clientY;
    startLeft = parseInt(window.getComputedStyle(button).right);
    startTop = parseInt(window.getComputedStyle(button).top);

    e.preventDefault();
  };

  const drag = (e) => {
    if (!isDragging) return;

    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

    const deltaX = startX - clientX;
    const deltaY = clientY - startY;

    const newRight = Math.max(10, Math.min(window.innerWidth - 58, startLeft + deltaX));
    const newTop = Math.max(10, Math.min(window.innerHeight - 58, startTop + deltaY));

    button.style.right = newRight + 'px';
    button.style.top = newTop + 'px';

    e.preventDefault();
  };

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    button.classList.remove('kk-dragging');

    // Save position to localStorage
    const position = {
      right: button.style.right,
      top: button.style.top
    };
    localStorage.setItem('kk-button-position', JSON.stringify(position));
  };

  // Mouse events
  button.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);

  // Touch events for mobile
  button.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', endDrag);

  // Click handler (only if not dragging)
  button.addEventListener('click', (e) => {
    if (e.target.classList.contains('kk-button-close')) {
      // Hide button
      button.style.display = 'none';
      // Save hidden state
      localStorage.setItem('kk-button-hidden', 'true');
      return;
    }

    if (button.classList.contains('kk-dragging')) return;

    const panel = document.getElementById("ajax-modifier-panel");
    if (panel && panel.style.display !== "none") {
      hideFloatPanel();
    } else {
      showFloatPanel();
    }
  });

  // Restore position from localStorage
  const savedPosition = localStorage.getItem('kk-button-position');
  if (savedPosition) {
    const position = JSON.parse(savedPosition);
    button.style.right = position.right;
    button.style.top = position.top;
  }

  document.body.appendChild(button);
};

const showFloatPanel = () => {
  const panel = document.getElementById("ajax-modifier-panel");
  if (panel) {
    panel.style.display = "block";
    panel.style.opacity = "1";
    panel.style.zIndex = "9999";
  }
};

const hideFloatPanel = () => {
  const panel = document.getElementById("ajax-modifier-panel");
  if (panel) {
    panel.style.display = "none";
    panel.style.opacity = "0";
    panel.style.zIndex = "-1";
  }
};

const hideFloatPanelButton = () => {
  const button = document.getElementById("ajax-modifier-panel-button");
  if (button) {
    button.style.display = "none";
    localStorage.setItem('kk-button-hidden', 'true');
  }
};

const showFloatPanelButton = () => {
  const button = document.getElementById("ajax-modifier-panel-button");
  if (button) {
    const isHidden = localStorage.getItem('kk-button-hidden') === 'true';
    if (!isHidden) {
      button.style.display = "flex";
    }
  }
};

const createRestoreButtonHint = () => {
  // Create a small hint to restore the button if it was hidden
  const isHidden = localStorage.getItem('kk-button-hidden') === 'true';
  if (!isHidden) return;

  let hint = document.getElementById("kk-restore-hint");
  if (hint) return;

  hint = document.createElement("div");
  hint.id = "kk-restore-hint";
  hint.innerHTML = "↗️ KK";
  hint.title = "Click to show KK Ajax Monitor button";
  hint.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    background: rgba(102, 126, 234, 0.8);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    cursor: pointer;
    z-index: 9999;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  `;

  hint.addEventListener('click', () => {
    localStorage.removeItem('kk-button-hidden');
    const button = document.getElementById("ajax-modifier-panel-button");
    if (button) {
      button.style.display = "flex";
    } else {
      controlFloatPanelButton();
    }
    hint.remove();
  });

  hint.addEventListener('mouseenter', () => {
    hint.style.opacity = '1';
  });

  hint.addEventListener('mouseleave', () => {
    hint.style.opacity = '0.7';
  });

  document.body.appendChild(hint);
};

const updateFloatPanelContent = () => {
  // filter the same match
  const uniqueMatches = [
    ...new Set(AJAX_MODIFIER_KK_PANEL_DATA?.map((item) => item.match)),
  ];

  const titleElement = document.getElementById("ajax-modifier-panel-title");
  if (titleElement) {
    titleElement.innerHTML = `KK Ajax Monitor (${uniqueMatches.length})`;
  }

  const urlsContainer = document.getElementById("ajax-modifier-panel-h3");
  if (!urlsContainer) {
    return;
  }

  urlsContainer.innerHTML = "";

  uniqueMatches.forEach((match) => {
    const urlItem = document.createElement("div");
    urlItem.className = "kk-url-item";

    urlItem.innerHTML = `
      <div class="kk-url-match">${match}</div>
      <div class="kk-url-actions">
        <button class="kk-copy-btn" data-url="${match}">📋 Copy</button>
      </div>
    `;

    // Add copy functionality
    const copyBtn = urlItem.querySelector('.kk-copy-btn');
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(match).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Copied!';
        copyBtn.style.background = '#28a745';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.background = '#667eea';
        }, 1500);
      });
    });

    urlsContainer.appendChild(urlItem);
  });
};

const createFloatPanel = () => {
  // if the panel already exists, update data
  let panel = document.getElementById("ajax-modifier-panel");
  if (panel) {
    updateFloatPanelContent();
    return;
  }

  panel = document.createElement("div");
  panel.id = "ajax-modifier-panel";
  panel.innerHTML = `
    <div class="kk-panel-header">
      <div class="kk-panel-title">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M8.5,8.5L11,11L8.5,13.5L7,12L8.5,10.5L7,9L8.5,8.5M13.5,8.5L15,9L13.5,10.5L15,12L13.5,13.5L11,11L13.5,8.5M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"/>
        </svg>
        <span id="ajax-modifier-panel-title">KK Ajax Monitor</span>
      </div>
      <div class="kk-panel-controls">
        <button class="kk-panel-minimize" title="Minimize">−</button>
        <button class="kk-panel-close" title="Close">×</button>
      </div>
    </div>
    <div class="kk-panel-body" id="ajax-modifier-panel-body">
      <div id="ajax-modifier-panel-h3" class="kk-matched-urls"></div>
    </div>
  `;

  // Modern panel styling
  panel.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    width: 320px;
    max-height: 400px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(0, 0, 0, 0.08);
    z-index: 9998;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    overflow: hidden;
    transition: all 0.3s ease;
    display: none;
  `;

  // Add panel styles
  if (!document.getElementById('kk-panel-styles')) {
    const style = document.createElement('style');
    style.id = 'kk-panel-styles';
    style.textContent = `
      .kk-panel-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: move;
      }

      .kk-panel-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
      }

      .kk-panel-controls {
        display: flex;
        gap: 4px;
      }

      .kk-panel-minimize, .kk-panel-close {
        width: 20px;
        height: 20px;
        border: none;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        transition: background 0.2s ease;
      }

      .kk-panel-minimize:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .kk-panel-close:hover {
        background: rgba(255, 0, 0, 0.6);
      }

      .kk-panel-body {
        padding: 16px;
        max-height: 320px;
        overflow-y: auto;
      }

      .kk-matched-urls:empty::after {
        content: "No intercepted requests yet";
        color: #888;
        font-style: italic;
        display: block;
        text-align: center;
        padding: 20px;
      }

      .kk-url-item {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 8px;
        transition: all 0.2s ease;
      }

      .kk-url-item:hover {
        background: #e9ecef;
        border-color: #667eea;
      }

      .kk-url-match {
        font-weight: 600;
        color: #495057;
        font-size: 13px;
        margin-bottom: 4px;
        word-break: break-all;
      }

      .kk-url-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .kk-copy-btn {
        background: #667eea;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 11px;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .kk-copy-btn:hover {
        background: #5a67d8;
      }

      .kk-copy-btn:active {
        background: #4c51bf;
      }

      .kk-panel-minimized {
        height: 48px !important;
        overflow: hidden !important;
      }

      .kk-panel-minimized .kk-panel-body {
        display: none;
      }

      .kk-dragging-panel {
        transition: none !important;
        cursor: grabbing !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Make panel draggable
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  const header = panel.querySelector('.kk-panel-header');

  const startDrag = (e) => {
    if (e.target.closest('.kk-panel-controls')) return;

    isDragging = true;
    panel.classList.add('kk-dragging-panel');

    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

    startX = clientX;
    startY = clientY;
    startLeft = parseInt(window.getComputedStyle(panel).right);
    startTop = parseInt(window.getComputedStyle(panel).top);

    e.preventDefault();
  };

  const drag = (e) => {
    if (!isDragging) return;

    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

    const deltaX = startX - clientX;
    const deltaY = clientY - startY;

    const newRight = Math.max(10, Math.min(window.innerWidth - panel.offsetWidth - 10, startLeft + deltaX));
    const newTop = Math.max(10, Math.min(window.innerHeight - panel.offsetHeight - 10, startTop + deltaY));

    panel.style.right = newRight + 'px';
    panel.style.top = newTop + 'px';

    e.preventDefault();
  };

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    panel.classList.remove('kk-dragging-panel');

    // Save position
    const position = {
      right: panel.style.right,
      top: panel.style.top
    };
    localStorage.setItem('kk-panel-position', JSON.stringify(position));
  };

  header.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);

  // Touch events
  header.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', endDrag);

  // Control buttons
  panel.querySelector('.kk-panel-minimize').addEventListener('click', () => {
    panel.classList.toggle('kk-panel-minimized');
  });

  panel.querySelector('.kk-panel-close').addEventListener('click', () => {
    hideFloatPanel();
  });

  // Restore position
  const savedPosition = localStorage.getItem('kk-panel-position');
  if (savedPosition) {
    const position = JSON.parse(savedPosition);
    panel.style.right = position.right;
    panel.style.top = position.top;
  }

  document.body.appendChild(panel);
};

// Manage swapping between native and intercepted implementations
let interceptionApplied = false;
let interceptionMonitorTimer = null;
const logInterceptionState = (reason = "") => {
  try {
    console.log("[KK Ajax Monitor] Interception state", {
      reason,
      switchOn: ajax_interceptor.settings.ajaxInterceptor_switchOn,
      rulesCount: ajax_interceptor.settings.ajaxInterceptor_rules?.length || 0,
      interceptionApplied,
      fetchPatched: window.fetch === ajax_interceptor.myFetch,
      xhrPatched: window.XMLHttpRequest === ajax_interceptor.myXHR,
    });
  } catch (e) {
    // Swallow logging errors to avoid breaking page
  }
};

const ensureInterceptionIntegrity = () => {
  console.log('[KK Monitor Checking]', {...ajax_interceptor})
  if (!ajax_interceptor.settings.ajaxInterceptor_switchOn) {
    return;
  }
  let rePatched = false;
  if (window.fetch !== ajax_interceptor.myFetch) {
    window.fetch = ajax_interceptor.myFetch;
    rePatched = true;
  }
  if (window.XMLHttpRequest !== ajax_interceptor.myXHR) {
    window.XMLHttpRequest = ajax_interceptor.myXHR;
    rePatched = true;
  }
  if (rePatched) {
    console.log("[KK Ajax Monitor] Detected external override, re-applying interception");
    logInterceptionState("after reapply integrity check");
  }
};

const startInterceptionMonitor = () => {
  if (interceptionMonitorTimer) return;
  interceptionMonitorTimer = window.setInterval(ensureInterceptionIntegrity, 2000);
};

const stopInterceptionMonitor = () => {
  if (!interceptionMonitorTimer) return;
  clearInterval(interceptionMonitorTimer);
  interceptionMonitorTimer = null;
};

const applyInterception = (enable) => {
  console.log("[KK Ajax Monitor] applyInterception called", { enable });
  if (enable) {
    if (!interceptionApplied) {
      console.log('[KK Ajax Monitor] Applying interception');
      window.XMLHttpRequest = ajax_interceptor.myXHR;
      window.fetch = ajax_interceptor.myFetch;
      interceptionApplied = true;
      startInterceptionMonitor();
    } else {
      console.log('[KK Ajax Monitor] Interception already applied, skipping');
      startInterceptionMonitor();
    }
  } else {
    if (interceptionApplied) {
      console.log('[KK Ajax Monitor] Restoring native XHR/fetch');
      window.XMLHttpRequest = ajax_interceptor.originalXHR;
      window.fetch = ajax_interceptor.originalFetch;
      interceptionApplied = false;
      stopInterceptionMonitor();
    } else {
      console.log('[KK Ajax Monitor] Interception already off, skipping');
      stopInterceptionMonitor();
    }
  }
  logInterceptionState("after applyInterception");
};

// Sync switch status from storage on page load
const initializeAjaxInterceptor = () => {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    // Listen for changes to ajaxInterceptor_switchOn
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "local" && changes.ajaxInterceptor_switchOn) {
        const switchOn = changes.ajaxInterceptor_switchOn.newValue;
        ajax_interceptor.settings.ajaxInterceptor_switchOn = switchOn;
        applyInterception(!!switchOn);
        updateButtonVisibility();
      }

      if (namespace === "local" && changes.ajaxInterceptor_rules) {
        ajax_interceptor.settings.ajaxInterceptor_rules = changes.ajaxInterceptor_rules.newValue;
        console.log('[KK Ajax Monitor] Rules updated:', ajax_interceptor.settings.ajaxInterceptor_rules.length, 'rules loaded');
        updateButtonVisibility();
      }
    });

  // Initial state check
  chrome.storage.local.get(["ajaxInterceptor_switchOn", "ajaxInterceptor_rules"], (result) => {
    const switchOn = result.ajaxInterceptor_switchOn;
    ajax_interceptor.settings.ajaxInterceptor_switchOn = switchOn;
    ajax_interceptor.settings.ajaxInterceptor_rules = result.ajaxInterceptor_rules || [];
    console.log('[KK Ajax Monitor] Initial load - Switch:', switchOn, 'Rules:', ajax_interceptor.settings.ajaxInterceptor_rules.length);
    logInterceptionState("after initial chrome.storage.local.get");

    applyInterception(!!switchOn);

    // Check if button should be shown for current site
    updateButtonVisibility();
    });
  }
};

// Initialize as soon as possible to avoid missing early requests
let interceptorInitialized = false;
const startAjaxInterceptor = () => {
  if (interceptorInitialized) return;
  interceptorInitialized = true;
  console.log('[KK Ajax Monitor] Starting interceptor bootstrap');
  logInterceptionState("before bootstrap applyInterception(false)");
  applyInterception(false);
  initializeAjaxInterceptor();
};

if (document.readyState === "complete" || document.readyState === "interactive") {
  startAjaxInterceptor();
} else {
  document.addEventListener("DOMContentLoaded", startAjaxInterceptor, { once: true });
}

// Function to check if current website should show the button
const shouldShowButtonForCurrentSite = () => {
  if (!ajax_interceptor.settings.ajaxInterceptor_switchOn) {
    return false;
  }

  if (!ajax_interceptor.settings.ajaxInterceptor_rules || ajax_interceptor.settings.ajaxInterceptor_rules.length === 0) {
    return false;
  }

  const currentUrl = window.location.href;
  const currentHost = window.location.host;

  // Check if any rule matches the current URL or host
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
      // Normal string matching - check if URL contains the match or if match contains the host
      return currentUrl.includes(match) || match.includes(currentHost);
    }
  });
};

// Function to update button visibility based on current site
const updateButtonVisibility = () => {
  const shouldShow = shouldShowButtonForCurrentSite();

  if (shouldShow) {
    controlFloatPanelButton();
    createFloatPanel();
    showFloatPanelButton();
    createRestoreButtonHint();
  } else {
    hideFloatPanelButton();
    hideFloatPanel();
    // Remove restore hint if button should not be shown
    const hint = document.getElementById("kk-restore-hint");
    if (hint) hint.remove();
  }
};

window.addEventListener(
  "message",
  function (event) {
    const data = event.data;

    if (data.type === "ajaxInterceptor" && data.to === "pageScript") {
      console.log("[KK Ajax Monitor] Message from extension", data);
      ajax_interceptor.settings[data.key] = data.value;

      // Keep interception state in sync even when running in page context without chrome APIs
      if (data.key === "ajaxInterceptor_switchOn") {
        applyInterception(!!data.value);
        logInterceptionState("message toggle switchOn");
      }

      updateButtonVisibility();
      logInterceptionState("after message updateButtonVisibility");
    }
  },
  false
);
