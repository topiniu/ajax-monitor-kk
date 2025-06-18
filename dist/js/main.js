/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/main.jsx ***!
  \**********************/
const AJAX_MODIFIER_KK_PANEL_DATA = [];
// 命名空间
let ajax_interceptor_qoweifjqon = {
  settings: {
    ajaxInterceptor_switchOn: false,
    ajaxInterceptor_always200On: true,
    // 默认开启，后期可以扩展成设置项
    ajaxInterceptor_rules: []
  },
  // 获取匹配到的规则项
  getMatchedInterface: ({
    thisRequestUrl = '',
    thisMethod = ''
  }) => {
    return ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules.find(item => {
      let {
        filterType = 'normal',
        limitMethod = 'ALL',
        switchOn = true,
        match
      } = item;
      // remove \n if match has it in the end
      match = match?.replace(/\n$/, '');
      const matchedMethod = thisMethod === limitMethod || limitMethod === 'ALL';
      const matchedRequest = filterType === 'normal' && thisRequestUrl === match || filterType === 'regex' && thisRequestUrl.match(new RegExp(match, 'i'));
      return switchOn && matchedMethod && matchedRequest;
    });
  },
  // 执行用户输入的函数，如果有错误会抛出到控制台
  executeStringFunction: (stringFunction, args, funcName = '') => {
    try {
      stringFunction = new Function('...args', stringFunction)(args);
    } catch (e) {
      console.error(`[Ajax Modifier] ExecuteFunctionError: Please check the ${funcName} function.\n`, e);
    }
    return stringFunction;
  },
  getRequestParams: requestUrl => {
    if (!requestUrl) {
      return null;
    }
    const paramStr = requestUrl.split('?').pop();
    const keyValueArr = paramStr.split('&');
    let keyValueObj = {};
    keyValueArr.forEach(item => {
      // 保证中间不会把=给忽略掉
      const itemArr = item.replace('=', '〓').split('〓');
      const itemObj = {
        [itemArr[0]]: itemArr[1]
      };
      keyValueObj = Object.assign(keyValueObj, itemObj);
    });
    return keyValueObj;
  },
  getCompleteUrl: inputUrl => {
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
    const modifyResponse = () => {
      const [method, requestUrl] = this._openArgs;
      const queryParams = ajax_interceptor_qoweifjqon.getRequestParams(requestUrl);
      const [requestPayload] = this._sendArgs;
      const matchedInterface = this._matchedInterface;
      console.log('【Ajax Modifier in xhr】matchedInterface', matchedInterface);
      if (matchedInterface && (matchedInterface.overrideTxt || matchedInterface.overrideResponseFunc)) {
        AJAX_MODIFIER_KK_PANEL_DATA.push(matchedInterface);
        updateFloatPanelContent();
        const {
          overrideTxt,
          overrideResponseFunc,
          match,
          isExpert = false
        } = matchedInterface;
        let overrideResponse = undefined;
        let overrideStatus = undefined;
        let overrideStatusText = undefined;
        if (overrideTxt && !isExpert) {
          // 普通模式，直接替换
          overrideResponse = overrideTxt;
          // 状态用200覆盖
          if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_always200On && this.status !== 200) {
            overrideStatus = 200;
            overrideStatusText = 'OK';
          }
        } else if (overrideResponseFunc && isExpert) {
          // 专业模式，用函数替换
          const funcArgs = {
            method,
            payload: {
              queryParams,
              requestPayload
            },
            orgResponse: this.response,
            orgStatus: this.status,
            orgStatusText: this.statusText
          };
          const res = ajax_interceptor_qoweifjqon.executeStringFunction(overrideResponseFunc, funcArgs, 'response');
          // 返回是对象才处理
          if (typeof res === 'object' && res !== null) {
            const {
              response: newResponse = undefined,
              status: newStatus = undefined,
              statusText: newStatusText = undefined
            } = res;
            overrideResponse = newResponse;
            overrideStatus = newStatus;
            overrideStatusText = newStatusText;
          } else {
            console.error(`[Ajax Modifier] ExecuteFunctionError: Please check your return in the response function. See more details in the examples. \n`);
          }
        }
        // 没有返回不替换
        this.responseText = overrideResponse !== undefined ? overrideResponse : this.responseText;
        this.response = overrideResponse !== undefined ? overrideResponse : this.response;
        this.status = overrideStatus !== undefined ? overrideStatus : this.status;
        this.statusText = overrideStatusText !== undefined ? overrideStatusText : this.statusText;
        if (!pageScriptEventDispatched) {
          window.dispatchEvent(new CustomEvent("pageScript", {
            detail: {
              url: this.responseURL,
              match
            }
          }));
          pageScriptEventDispatched = true;
        }
      }
    };
    const xhr = new ajax_interceptor_qoweifjqon.originalXHR();
    for (let attr in xhr) {
      if (attr === 'onreadystatechange') {
        xhr.onreadystatechange = (...args) => {
          if (this.readyState === 4) {
            // 请求成功
            modifyResponse();
          }
          this.onreadystatechange && this.onreadystatechange.apply(this, args);
        };
        this.onreadystatechange = null;
        continue;
      } else if (attr === 'onload') {
        xhr.onload = (...args) => {
          // 请求成功
          modifyResponse();
          this.onload && this.onload.apply(this, args);
        };
        this.onload = null;
        continue;
      } else if (attr === 'open') {
        this.open = (...args) => {
          this._openArgs = args;
          const [method, requestUrl] = args;
          this._matchedInterface = ajax_interceptor_qoweifjqon.getMatchedInterface({
            thisRequestUrl: ajax_interceptor_qoweifjqon.getCompleteUrl(requestUrl),
            thisMethod: method
          });
          const matchedInterface = this._matchedInterface;
          // modify request
          if (matchedInterface) {
            const {
              overridePayloadFunc,
              isExpert = false
            } = matchedInterface;
            if (overridePayloadFunc && isExpert && args[0] && args[1] && args[0].toUpperCase() === 'GET') {
              const queryParams = ajax_interceptor_qoweifjqon.getRequestParams(args[1]);
              const data = {
                requestUrl: args[1],
                queryParams
              };
              args[1] = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, data, 'payload');
            }
          }
          xhr.open && xhr.open.apply(xhr, args);
        };
        continue;
      } else if (attr === 'setRequestHeader') {
        this.setRequestHeader = (...args) => {
          // get headers
          this._headerArgs = this._headerArgs ? Object.assign(this._headerArgs, {
            [args[0]]: args[1]
          }) : {
            [args[0]]: args[1]
          };
          const matchedInterface = this._matchedInterface;
          if (!(matchedInterface && matchedInterface.overrideHeadersFunc && matchedInterface.isExpert)) {
            // 没有要拦截修改或添加的header
            xhr.setRequestHeader && xhr.setRequestHeader.apply(xhr, args);
          }
        };
        continue;
      } else if (attr === 'send') {
        this.send = (...args) => {
          const matchedInterface = this._matchedInterface;
          if (matchedInterface) {
            // modify headers
            const {
              overrideHeadersFunc,
              overridePayloadFunc,
              isExpert = false
            } = matchedInterface;
            if (overrideHeadersFunc && isExpert) {
              const headers = ajax_interceptor_qoweifjqon.executeStringFunction(overrideHeadersFunc, this._headerArgs, 'headers');
              Object.keys(headers).forEach(key => {
                xhr.setRequestHeader && xhr.setRequestHeader.apply(xhr, [key, headers[key]]);
              });
            }
            // modify not GET payload
            const [method] = this._openArgs;
            if (overridePayloadFunc && isExpert && method !== 'GET') {
              args[0] = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, args[0], 'payload');
            }
          }
          this._sendArgs = args;
          xhr.send && xhr.send.apply(xhr, args);
        };
        continue;
      }
      if (typeof xhr[attr] === 'function') {
        this[attr] = xhr[attr].bind(xhr);
      } else {
        // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
        if (['responseText', 'response', 'status', 'statusText'].includes(attr)) {
          Object.defineProperty(this, attr, {
            get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
            set: val => this[`_${attr}`] = val,
            enumerable: true
          });
        } else {
          Object.defineProperty(this, attr, {
            get: () => xhr[attr],
            set: val => xhr[attr] = val,
            enumerable: true
          });
        }
      }
    }
  },
  originalFetch: window.fetch.bind(window),
  myFetch: function (...args) {
    const getOriginalResponse = async stream => {
      let text = '';
      const decoder = new TextDecoder('utf-8');
      const reader = stream.getReader();
      const processData = result => {
        if (result.done) {
          return text;
        }
        const value = result.value; // Uint8Array
        text += decoder.decode(value, {
          stream: true
        });
        // 读取下一个文件片段，重复处理步骤
        return reader.read().then(processData);
      };
      return await reader.read().then(processData);
    };
    const [requestUrl, data] = args;
    let inputUrl = '';
    if (typeof requestUrl === 'string') {
      inputUrl = requestUrl;
    } else if (typeof requestUrl === 'object') {
      inputUrl = requestUrl.url || '';
    }
    const matchedInterface = ajax_interceptor_qoweifjqon.getMatchedInterface({
      thisRequestUrl: ajax_interceptor_qoweifjqon.getCompleteUrl(inputUrl),
      thisMethod: data && data.method
    });
    if (matchedInterface && args) {
      AJAX_MODIFIER_KK_PANEL_DATA.push(matchedInterface);
      updateFloatPanelContent();
      const {
        overrideHeadersFunc,
        overridePayloadFunc,
        isExpert = false
      } = matchedInterface;
      if (overrideHeadersFunc && isExpert && args[1]) {
        const headers = ajax_interceptor_qoweifjqon.executeStringFunction(overrideHeadersFunc, this._headerArgs, 'headers');
        args[1].headers = headers;
      }
      if (overridePayloadFunc && isExpert && args[0] && args[1]) {
        const {
          method
        } = args[1];
        if (['GET', 'HEAD'].includes(method.toUpperCase())) {
          const queryParams = ajax_interceptor_qoweifjqon.getRequestParams(args[0]);
          const data = {
            requestUrl: args[0],
            queryParams
          };
          args[0] = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, data, 'payload');
        } else {
          data.body = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, data.body, 'payload');
        }
      }
    }
    return ajax_interceptor_qoweifjqon.originalFetch(...args).then(async response => {
      if (matchedInterface && (matchedInterface.overrideTxt || matchedInterface.overrideResponseFunc)) {
        window.dispatchEvent(new CustomEvent("pageScript", {
          detail: {
            url: response.url,
            match: matchedInterface.match
          }
        }));
        let txt = undefined;
        txt = matchedInterface.overrideTxt;
        const {
          overrideTxt,
          overrideResponseFunc,
          isExpert = false
        } = matchedInterface;
        let overrideResponse = undefined;
        let overrideStatus = undefined;
        let overrideStatusText = undefined;
        if (overrideTxt && !isExpert) {
          // 普通模式，直接替换
          overrideResponse = overrideTxt;
          // 状态用200覆盖
          if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_always200On && this.status !== 200) {
            overrideStatus = 200;
            overrideStatusText = 'OK';
          }
        } else if (overrideResponseFunc && isExpert) {
          // 专业模式，用函数替换
          const queryParams = ajax_interceptor_qoweifjqon.getRequestParams(requestUrl);
          const orgResponse = await getOriginalResponse(response.body);
          const funcArgs = {
            method: data?.method,
            payload: {
              queryParams,
              requestPayload: data?.body
            },
            orgResponse,
            orgStatus: response.status,
            orgStatusText: response.statusText
          };
          const res = ajax_interceptor_qoweifjqon.executeStringFunction(overrideResponseFunc, funcArgs, 'response');
          if (typeof res === 'object' && res !== null) {
            const {
              response: newResponse = undefined,
              status: newStatus = undefined,
              statusText: newStatusText = undefined
            } = res;
            overrideResponse = newResponse;
            overrideStatus = newStatus;
            overrideStatusText = newStatusText;
          } else {
            console.error(`[Ajax Modifier] ExecuteFunctionError: Please check your return in the response function. See more details in the examples. \n`);
          }
        }
        txt = overrideResponse !== undefined ? overrideResponse : response.responseText;
        const stream = new ReadableStream({
          start(controller) {
            // const bufView = new Uint8Array(new ArrayBuffer(txt.length))
            // for (var i = 0 i < txt.length i++) {
            //   bufView[i] = txt.charCodeAt(i)
            // }
            controller.enqueue(new TextEncoder().encode(txt));
            controller.close();
          }
        });
        let params = {
          status: overrideStatus !== undefined ? overrideStatus : response.status,
          statusText: overrideStatusText !== undefined ? overrideStatusText : response.statusText
        };
        const newResponse = new Response(stream, {
          headers: response.headers,
          ...params
        });
        const proxy = new Proxy(newResponse, {
          get: function (target, name) {
            switch (name) {
              case 'redirected':
              case 'type':
              case 'url':
              case 'useFinalURL':
              case 'body':
              case 'bodyUsed':
                return response[name];
            }
            return target[name];
          }
        });
        for (let key in proxy) {
          if (typeof proxy[key] === 'function') {
            proxy[key] = proxy[key].bind(newResponse);
          }
        }
        return proxy;
      } else {
        return response;
      }
    });
  }
};
const toastMessage = matchedInterface => {
  // toast a message though dom to show the matchedInterface
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.top = '10px';
  toast.style.left = '10px';
  toast.style.backgroundColor = 'red';
  toast.style.color = 'white';
  toast.style.padding = '10px';
  toast.style.zIndex = '9999';
  toast.style.opacity = '0.5';
  toast.innerHTML = `[AJAx Modifier] matchedInterface: ${matchedInterface.match}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 5000);
};
const controlFloatPanelButton = () => {
  console.log('[controlFloatPanelButton]');
  // create a button to control the float panel
  const button = document.createElement('button');
  button.id = 'ajax-modifier-panel-button';
  button.innerHTML = 'Ajax KK';
  button.style.position = 'fixed';
  button.style.bottom = '10px';
  button.style.right = '10px';
  button.style.backgroundColor = '#ccd5ae';
  button.style.color = 'white';
  //font size
  button.style.fontSize = '12px';
  button.style.padding = '4px 2px';
  //border none
  button.style.border = 'none';
  // shadow
  button.style.boxShadow = '0 0 10px 0 rgba(0, 0, 0, 0.5)';
  // hover
  button.style.cursor = 'pointer';
  button.style.zIndex = '9999';
  button.addEventListener('click', () => {
    const panel = document.getElementById('ajax-modifier-panel');
    if (panel && panel.style.display !== 'none') {
      // hide the panel
      hideFloatPanel();
    } else {
      // show the panel
      showFloatPanel();
    }
  });
  document.body.appendChild(button);
};
const showFloatPanel = () => {
  const panel = document.getElementById('ajax-modifier-panel');
  if (panel) {
    panel.style.display = 'block';
    panel.style.opacity = '1';
    panel.style.zIndex = '9999';
  }
};
const hideFloatPanel = () => {
  const panel = document.getElementById('ajax-modifier-panel');
  if (panel) {
    panel.style.display = 'none';
    panel.style.opacity = '0';
    panel.style.zIndex = '-1';
  }
};
const hideFloatPanelButton = () => {
  const button = document.getElementById('ajax-modifier-panel-button');
  if (button) {
    button.style.display = 'none';
  }
};
const showFloatPanelButton = () => {
  const button = document.getElementById('ajax-modifier-panel-button');
  if (button) {
    button.style.display = 'block';
  }
};
const updateFloatPanelContent = () => {
  // filter the same match
  const uniqueMatches = [...new Set(AJAX_MODIFIER_KK_PANEL_DATA?.map(item => item.match))];
  const h2 = document.getElementById('ajax-modifier-panel-title');
  h2.innerHTML = `AJAx Modifier ${uniqueMatches.length}`;
  const h3Div = document.getElementById('ajax-modifier-panel-h3');
  h3Div.innerHTML = '';
  uniqueMatches.forEach(item => {
    const h3 = document.createElement('h3');
    h3.innerHTML = `${item}`;
    h3Div.appendChild(h3);
  });
};
const createFloatPanel = () => {
  // if the panel already exists, update data
  let panel = document.getElementById('ajax-modifier-panel');
  if (panel) {
    updateFloatPanelContent();
    return;
  }
  panel = document.createElement('div');
  panel.id = 'ajax-modifier-panel';
  panel.style.position = 'fixed';
  panel.style.top = '10px';
  panel.style.left = '10px';
  panel.style.backgroundColor = '#d4a373';
  panel.style.color = 'white';
  panel.style.padding = '10px';
  panel.style.zIndex = '9999';
  panel.style.fontSize = '12px';
  // panel.innerHTML = `[AJAx Modifier] matchedInterface: ${matchedInterface.match}`
  const h2 = document.createElement('h2');
  h2.id = 'ajax-modifier-panel-title';
  h2.innerHTML = `AJAx Modifier ${AJAX_MODIFIER_KK_PANEL_DATA?.length}`;
  panel.appendChild(h2);

  // put h3 into a div
  const h3Div = document.createElement('div');
  h3Div.id = 'ajax-modifier-panel-h3';
  // filter the same match
  const uniqueMatches = [...new Set(AJAX_MODIFIER_KK_PANEL_DATA?.map(item => item.match))];
  uniqueMatches.forEach(item => {
    const h3 = document.createElement('h3');
    h3.innerHTML = `${item.match}`;
    // add button to copy the matchedInterface
    const button = document.createElement('button');
    button.innerHTML = 'Copy';
    button.addEventListener('click', () => {
      navigator.clipboard.writeText(item.match);
    });
    h3.appendChild(button);
    h3Div.appendChild(h3);
  });
  panel.appendChild(h3Div);
  document.body.appendChild(panel);
};
window.addEventListener("message", function (event) {
  const data = event.data;
  // console.log('data from content_script main.js', data)

  if (data.type === 'ajaxInterceptor' && data.to === 'pageScript') {
    console.log('data', data);
    ajax_interceptor_qoweifjqon.settings[data.key] = data.value;

    // compare if ajaxInterceptor_rules includes window.location.host
    console.log(ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules);
    if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules.some(item => item.match.includes(window.location.host))) {
      controlFloatPanelButton();
      createFloatPanel();
    }
  }
  if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_switchOn) {
    window.XMLHttpRequest = ajax_interceptor_qoweifjqon.myXHR;
    window.fetch = ajax_interceptor_qoweifjqon.myFetch;
    showFloatPanelButton();
  } else {
    window.XMLHttpRequest = ajax_interceptor_qoweifjqon.originalXHR;
    window.fetch = ajax_interceptor_qoweifjqon.originalFetch;
    hideFloatPanelButton();
    hideFloatPanel();
  }
}, false);
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsQ0FBQztFQUNsQjtBQUNGLENBQUMsRUFBRSxLQUFLLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL21haW4uanN4Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFKQVhfTU9ESUZJRVJfS0tfUEFORUxfREFUQSA9IFtdXG4vLyDlkb3lkI3nqbrpl7RcbmxldCBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24gPSB7XG4gIHNldHRpbmdzOiB7XG4gICAgYWpheEludGVyY2VwdG9yX3N3aXRjaE9uOiBmYWxzZSxcbiAgICBhamF4SW50ZXJjZXB0b3JfYWx3YXlzMjAwT246IHRydWUsIC8vIOm7mOiupOW8gOWQr++8jOWQjuacn+WPr+S7peaJqeWxleaIkOiuvue9rumhuVxuICAgIGFqYXhJbnRlcmNlcHRvcl9ydWxlczogW10sXG4gIH0sXG4gIC8vIOiOt+WPluWMuemFjeWIsOeahOinhOWImemhuVxuICBnZXRNYXRjaGVkSW50ZXJmYWNlOiAoeyB0aGlzUmVxdWVzdFVybCA9ICcnLCB0aGlzTWV0aG9kID0gJycgfSkgPT4ge1xuICAgIHJldHVybiBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24uc2V0dGluZ3MuYWpheEludGVyY2VwdG9yX3J1bGVzLmZpbmQoaXRlbSA9PiB7XG4gICAgICBsZXQgeyBmaWx0ZXJUeXBlID0gJ25vcm1hbCcsIGxpbWl0TWV0aG9kID0gJ0FMTCcsIHN3aXRjaE9uID0gdHJ1ZSwgbWF0Y2ggfSA9IGl0ZW1cbiAgICAgIC8vIHJlbW92ZSBcXG4gaWYgbWF0Y2ggaGFzIGl0IGluIHRoZSBlbmRcbiAgICAgIG1hdGNoID0gbWF0Y2g/LnJlcGxhY2UoL1xcbiQvLCAnJylcbiAgICAgIGNvbnN0IG1hdGNoZWRNZXRob2QgPSB0aGlzTWV0aG9kID09PSBsaW1pdE1ldGhvZCB8fCBsaW1pdE1ldGhvZCA9PT0gJ0FMTCdcbiAgICAgIGNvbnN0IG1hdGNoZWRSZXF1ZXN0ID0gKGZpbHRlclR5cGUgPT09ICdub3JtYWwnICYmIHRoaXNSZXF1ZXN0VXJsID09PSBtYXRjaCkgfHxcbiAgICAgICAgKGZpbHRlclR5cGUgPT09ICdyZWdleCcgJiYgdGhpc1JlcXVlc3RVcmwubWF0Y2gobmV3IFJlZ0V4cChtYXRjaCwgJ2knKSkpXG4gICAgICByZXR1cm4gc3dpdGNoT24gJiYgbWF0Y2hlZE1ldGhvZCAmJiBtYXRjaGVkUmVxdWVzdFxuICAgIH0pXG4gIH0sXG4gIC8vIOaJp+ihjOeUqOaIt+i+k+WFpeeahOWHveaVsO+8jOWmguaenOaciemUmeivr+S8muaKm+WHuuWIsOaOp+WItuWPsFxuICBleGVjdXRlU3RyaW5nRnVuY3Rpb246IChzdHJpbmdGdW5jdGlvbiwgYXJncywgZnVuY05hbWUgPSAnJykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBzdHJpbmdGdW5jdGlvbiA9IChuZXcgRnVuY3Rpb24oJy4uLmFyZ3MnLCBzdHJpbmdGdW5jdGlvbikpKGFyZ3MpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihgW0FqYXggTW9kaWZpZXJdIEV4ZWN1dGVGdW5jdGlvbkVycm9yOiBQbGVhc2UgY2hlY2sgdGhlICR7ZnVuY05hbWV9IGZ1bmN0aW9uLlxcbmAsIGUpXG4gICAgfVxuICAgIHJldHVybiBzdHJpbmdGdW5jdGlvbjtcbiAgfSxcbiAgZ2V0UmVxdWVzdFBhcmFtczogKHJlcXVlc3RVcmwpID0+IHtcbiAgICBpZiAoIXJlcXVlc3RVcmwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBwYXJhbVN0ciA9IHJlcXVlc3RVcmwuc3BsaXQoJz8nKS5wb3AoKTtcbiAgICBjb25zdCBrZXlWYWx1ZUFyciA9IHBhcmFtU3RyLnNwbGl0KCcmJyk7XG4gICAgbGV0IGtleVZhbHVlT2JqID0ge307XG4gICAga2V5VmFsdWVBcnIuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgLy8g5L+d6K+B5Lit6Ze05LiN5Lya5oqKPee7meW/veeVpeaOiVxuICAgICAgY29uc3QgaXRlbUFyciA9IGl0ZW0ucmVwbGFjZSgnPScsICfjgJMnKS5zcGxpdCgn44CTJyk7XG4gICAgICBjb25zdCBpdGVtT2JqID0geyBbaXRlbUFyclswXV06IGl0ZW1BcnJbMV0gfTtcbiAgICAgIGtleVZhbHVlT2JqID0gT2JqZWN0LmFzc2lnbihrZXlWYWx1ZU9iaiwgaXRlbU9iaik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGtleVZhbHVlT2JqO1xuICB9LFxuICBnZXRDb21wbGV0ZVVybDogKGlucHV0VXJsKSA9PiB7XG4gICAgbGV0IHVybCA9IGlucHV0VXJsLnRyaW0oKVxuICAgIGNvbnN0IHByb3RvY29sID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sXG4gICAgY29uc3QgaG9zdCA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0XG4gICAgY29uc3QgY3VycmVudFVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgdHJ5IHtcbiAgICAgIC8vIOWmguaenOino+aekOaIkOWKn++8jOihqOekuui+k+WFpeaYr+WujOaVtOeahFVSTO+8jOS4jemcgOimgeWkhOeQhlxuICAgICAgbmV3IFVSTCh1cmwpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKHVybC5zdGFydHNXaXRoKFwiLi9cIikgfHwgdXJsLnN0YXJ0c1dpdGgoXCIuLi9cIikpIHtcbiAgICAgICAgLy8g55u45a+56Lev55SxXG4gICAgICAgIHVybCA9IG5ldyBVUkwodXJsLCBjdXJyZW50VXJsKS5ocmVmXG4gICAgICB9IGVsc2UgaWYgKHVybC5zdGFydHNXaXRoKFwiLy9cIikpIHtcbiAgICAgICAgLy8g5Y+q57y65bCR5Y2P6K6u77yM6KGl5YWo5Y2P6K6uXG4gICAgICAgIHVybCA9IHByb3RvY29sICsgdXJsXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyDml6LmsqHmnInljY/orq7kuZ/msqHmnInln5/lkI3vvIzooaXlhajln5/lkI3lkozljY/orq5cbiAgICAgICAgdXJsID0gcHJvdG9jb2wgKyBcIi8vXCIgKyBob3N0ICsgKHVybC5zdGFydHNXaXRoKFwiL1wiKSA/IFwiXCIgOiBcIi9cIikgKyB1cmxcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVybFxuICB9LFxuICBvcmlnaW5hbFhIUjogd2luZG93LlhNTEh0dHBSZXF1ZXN0LFxuICBteVhIUjogZnVuY3Rpb24gKCkge1xuICAgIGxldCBwYWdlU2NyaXB0RXZlbnREaXNwYXRjaGVkID0gZmFsc2VcbiAgICBjb25zdCBtb2RpZnlSZXNwb25zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IFttZXRob2QsIHJlcXVlc3RVcmxdID0gdGhpcy5fb3BlbkFyZ3NcbiAgICAgIGNvbnN0IHF1ZXJ5UGFyYW1zID0gYWpheF9pbnRlcmNlcHRvcl9xb3dlaWZqcW9uLmdldFJlcXVlc3RQYXJhbXMocmVxdWVzdFVybClcbiAgICAgIGNvbnN0IFtyZXF1ZXN0UGF5bG9hZF0gPSB0aGlzLl9zZW5kQXJnc1xuICAgICAgY29uc3QgbWF0Y2hlZEludGVyZmFjZSA9IHRoaXMuX21hdGNoZWRJbnRlcmZhY2VcbiAgICAgIGNvbnNvbGUubG9nKCfjgJBBamF4IE1vZGlmaWVyIGluIHhocuOAkW1hdGNoZWRJbnRlcmZhY2UnLCBtYXRjaGVkSW50ZXJmYWNlKVxuICAgICAgaWYgKG1hdGNoZWRJbnRlcmZhY2UgJiYgKG1hdGNoZWRJbnRlcmZhY2Uub3ZlcnJpZGVUeHQgfHwgbWF0Y2hlZEludGVyZmFjZS5vdmVycmlkZVJlc3BvbnNlRnVuYykpIHtcbiAgICAgICAgQUpBWF9NT0RJRklFUl9LS19QQU5FTF9EQVRBLnB1c2gobWF0Y2hlZEludGVyZmFjZSlcbiAgICAgICAgdXBkYXRlRmxvYXRQYW5lbENvbnRlbnQoKVxuICAgICAgICBjb25zdCB7IG92ZXJyaWRlVHh0LCBvdmVycmlkZVJlc3BvbnNlRnVuYywgbWF0Y2gsIGlzRXhwZXJ0ID0gZmFsc2UgfSA9IG1hdGNoZWRJbnRlcmZhY2VcbiAgICAgICAgbGV0IG92ZXJyaWRlUmVzcG9uc2UgPSB1bmRlZmluZWRcbiAgICAgICAgbGV0IG92ZXJyaWRlU3RhdHVzID0gdW5kZWZpbmVkXG4gICAgICAgIGxldCBvdmVycmlkZVN0YXR1c1RleHQgPSB1bmRlZmluZWRcbiAgICAgICAgaWYgKG92ZXJyaWRlVHh0ICYmICFpc0V4cGVydCkge1xuICAgICAgICAgIC8vIOaZrumAmuaooeW8j++8jOebtOaOpeabv+aNolxuICAgICAgICAgIG92ZXJyaWRlUmVzcG9uc2UgPSBvdmVycmlkZVR4dFxuICAgICAgICAgIC8vIOeKtuaAgeeUqDIwMOimhuebllxuICAgICAgICAgIGlmIChhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24uc2V0dGluZ3MuYWpheEludGVyY2VwdG9yX2Fsd2F5czIwME9uICYmIHRoaXMuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgIG92ZXJyaWRlU3RhdHVzID0gMjAwXG4gICAgICAgICAgICBvdmVycmlkZVN0YXR1c1RleHQgPSAnT0snXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG92ZXJyaWRlUmVzcG9uc2VGdW5jICYmIGlzRXhwZXJ0KSB7XG4gICAgICAgICAgLy8g5LiT5Lia5qih5byP77yM55So5Ye95pWw5pu/5o2iXG4gICAgICAgICAgY29uc3QgZnVuY0FyZ3MgPSB7XG4gICAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgIHF1ZXJ5UGFyYW1zLFxuICAgICAgICAgICAgICByZXF1ZXN0UGF5bG9hZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9yZ1Jlc3BvbnNlOiB0aGlzLnJlc3BvbnNlLFxuICAgICAgICAgICAgb3JnU3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgICAgICAgIG9yZ1N0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dFxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCByZXMgPSBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24uZXhlY3V0ZVN0cmluZ0Z1bmN0aW9uKG92ZXJyaWRlUmVzcG9uc2VGdW5jLCBmdW5jQXJncywgJ3Jlc3BvbnNlJylcbiAgICAgICAgICAvLyDov5Tlm57mmK/lr7nosaHmiY3lpITnkIZcbiAgICAgICAgICBpZiAodHlwZW9mIHJlcyA9PT0gJ29iamVjdCcgJiYgcmVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICAgIHJlc3BvbnNlOiBuZXdSZXNwb25zZSA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgc3RhdHVzOiBuZXdTdGF0dXMgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIHN0YXR1c1RleHQ6IG5ld1N0YXR1c1RleHQgPSB1bmRlZmluZWRcbiAgICAgICAgICAgIH0gPSByZXNcbiAgICAgICAgICAgIG92ZXJyaWRlUmVzcG9uc2UgPSBuZXdSZXNwb25zZVxuICAgICAgICAgICAgb3ZlcnJpZGVTdGF0dXMgPSBuZXdTdGF0dXNcbiAgICAgICAgICAgIG92ZXJyaWRlU3RhdHVzVGV4dCA9IG5ld1N0YXR1c1RleHRcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW0FqYXggTW9kaWZpZXJdIEV4ZWN1dGVGdW5jdGlvbkVycm9yOiBQbGVhc2UgY2hlY2sgeW91ciByZXR1cm4gaW4gdGhlIHJlc3BvbnNlIGZ1bmN0aW9uLiBTZWUgbW9yZSBkZXRhaWxzIGluIHRoZSBleGFtcGxlcy4gXFxuYClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8g5rKh5pyJ6L+U5Zue5LiN5pu/5o2iXG4gICAgICAgIHRoaXMucmVzcG9uc2VUZXh0ID0gb3ZlcnJpZGVSZXNwb25zZSAhPT0gdW5kZWZpbmVkID8gb3ZlcnJpZGVSZXNwb25zZSA6IHRoaXMucmVzcG9uc2VUZXh0XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSBvdmVycmlkZVJlc3BvbnNlICE9PSB1bmRlZmluZWQgPyBvdmVycmlkZVJlc3BvbnNlIDogdGhpcy5yZXNwb25zZVxuICAgICAgICB0aGlzLnN0YXR1cyA9IG92ZXJyaWRlU3RhdHVzICE9PSB1bmRlZmluZWQgPyBvdmVycmlkZVN0YXR1cyA6IHRoaXMuc3RhdHVzXG4gICAgICAgIHRoaXMuc3RhdHVzVGV4dCA9IG92ZXJyaWRlU3RhdHVzVGV4dCAhPT0gdW5kZWZpbmVkID8gb3ZlcnJpZGVTdGF0dXNUZXh0IDogdGhpcy5zdGF0dXNUZXh0XG4gICAgICAgIGlmICghcGFnZVNjcmlwdEV2ZW50RGlzcGF0Y2hlZCkge1xuICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcInBhZ2VTY3JpcHRcIiwge1xuICAgICAgICAgICAgZGV0YWlsOiB7IHVybDogdGhpcy5yZXNwb25zZVVSTCwgbWF0Y2ggfVxuICAgICAgICAgIH0pKVxuICAgICAgICAgIHBhZ2VTY3JpcHRFdmVudERpc3BhdGNoZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB4aHIgPSBuZXcgYWpheF9pbnRlcmNlcHRvcl9xb3dlaWZqcW9uLm9yaWdpbmFsWEhSXG4gICAgZm9yIChsZXQgYXR0ciBpbiB4aHIpIHtcbiAgICAgIGlmIChhdHRyID09PSAnb25yZWFkeXN0YXRlY2hhbmdlJykge1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICAvLyDor7fmsYLmiJDlip9cbiAgICAgICAgICAgIG1vZGlmeVJlc3BvbnNlKClcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5vbnJlYWR5c3RhdGVjaGFuZ2UgJiYgdGhpcy5vbnJlYWR5c3RhdGVjaGFuZ2UuYXBwbHkodGhpcywgYXJncylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICAgICAgY29udGludWVcbiAgICAgIH0gZWxzZSBpZiAoYXR0ciA9PT0gJ29ubG9hZCcpIHtcbiAgICAgICAgeGhyLm9ubG9hZCA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgLy8g6K+35rGC5oiQ5YqfXG4gICAgICAgICAgbW9kaWZ5UmVzcG9uc2UoKVxuICAgICAgICAgIHRoaXMub25sb2FkICYmIHRoaXMub25sb2FkLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vbmxvYWQgPSBudWxsXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9IGVsc2UgaWYgKGF0dHIgPT09ICdvcGVuJykge1xuICAgICAgICB0aGlzLm9wZW4gPSAoLi4uYXJncykgPT4ge1xuICAgICAgICAgIHRoaXMuX29wZW5BcmdzID0gYXJnc1xuICAgICAgICAgIGNvbnN0IFttZXRob2QsIHJlcXVlc3RVcmxdID0gYXJnc1xuICAgICAgICAgIHRoaXMuX21hdGNoZWRJbnRlcmZhY2UgPSBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24uZ2V0TWF0Y2hlZEludGVyZmFjZSh7XG4gICAgICAgICAgICB0aGlzUmVxdWVzdFVybDogYWpheF9pbnRlcmNlcHRvcl9xb3dlaWZqcW9uLmdldENvbXBsZXRlVXJsKHJlcXVlc3RVcmwpLFxuICAgICAgICAgICAgdGhpc01ldGhvZDogbWV0aG9kXG4gICAgICAgICAgfSlcbiAgICAgICAgICBjb25zdCBtYXRjaGVkSW50ZXJmYWNlID0gdGhpcy5fbWF0Y2hlZEludGVyZmFjZVxuICAgICAgICAgIC8vIG1vZGlmeSByZXF1ZXN0XG4gICAgICAgICAgaWYgKG1hdGNoZWRJbnRlcmZhY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3ZlcnJpZGVQYXlsb2FkRnVuYywgaXNFeHBlcnQgPSBmYWxzZSB9ID0gbWF0Y2hlZEludGVyZmFjZVxuICAgICAgICAgICAgaWYgKG92ZXJyaWRlUGF5bG9hZEZ1bmMgJiYgaXNFeHBlcnQgJiYgYXJnc1swXSAmJiBhcmdzWzFdICYmIGFyZ3NbMF0udG9VcHBlckNhc2UoKSA9PT0gJ0dFVCcpIHtcbiAgICAgICAgICAgICAgY29uc3QgcXVlcnlQYXJhbXMgPSBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24uZ2V0UmVxdWVzdFBhcmFtcyhhcmdzWzFdKVxuICAgICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHJlcXVlc3RVcmw6IGFyZ3NbMV0sXG4gICAgICAgICAgICAgICAgcXVlcnlQYXJhbXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhcmdzWzFdID0gYWpheF9pbnRlcmNlcHRvcl9xb3dlaWZqcW9uLmV4ZWN1dGVTdHJpbmdGdW5jdGlvbihvdmVycmlkZVBheWxvYWRGdW5jLCBkYXRhLCAncGF5bG9hZCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHhoci5vcGVuICYmIHhoci5vcGVuLmFwcGx5KHhociwgYXJncylcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZVxuICAgICAgfSBlbHNlIGlmIChhdHRyID09PSAnc2V0UmVxdWVzdEhlYWRlcicpIHtcbiAgICAgICAgdGhpcy5zZXRSZXF1ZXN0SGVhZGVyID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAvLyBnZXQgaGVhZGVyc1xuICAgICAgICAgIHRoaXMuX2hlYWRlckFyZ3MgPSB0aGlzLl9oZWFkZXJBcmdzID8gT2JqZWN0LmFzc2lnbih0aGlzLl9oZWFkZXJBcmdzLCB7IFthcmdzWzBdXTogYXJnc1sxXSB9KSA6IHsgW2FyZ3NbMF1dOiBhcmdzWzFdIH07XG4gICAgICAgICAgY29uc3QgbWF0Y2hlZEludGVyZmFjZSA9IHRoaXMuX21hdGNoZWRJbnRlcmZhY2U7XG4gICAgICAgICAgaWYgKCEobWF0Y2hlZEludGVyZmFjZSAmJiBtYXRjaGVkSW50ZXJmYWNlLm92ZXJyaWRlSGVhZGVyc0Z1bmMgJiYgbWF0Y2hlZEludGVyZmFjZS5pc0V4cGVydCkpIHsgLy8g5rKh5pyJ6KaB5oum5oiq5L+u5pS55oiW5re75Yqg55qEaGVhZGVyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciAmJiB4aHIuc2V0UmVxdWVzdEhlYWRlci5hcHBseSh4aHIsIGFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0ciA9PT0gJ3NlbmQnKSB7XG4gICAgICAgIHRoaXMuc2VuZCA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgY29uc3QgbWF0Y2hlZEludGVyZmFjZSA9IHRoaXMuX21hdGNoZWRJbnRlcmZhY2VcbiAgICAgICAgICBpZiAobWF0Y2hlZEludGVyZmFjZSkge1xuICAgICAgICAgICAgLy8gbW9kaWZ5IGhlYWRlcnNcbiAgICAgICAgICAgIGNvbnN0IHsgb3ZlcnJpZGVIZWFkZXJzRnVuYywgb3ZlcnJpZGVQYXlsb2FkRnVuYywgaXNFeHBlcnQgPSBmYWxzZSB9ID0gbWF0Y2hlZEludGVyZmFjZVxuICAgICAgICAgICAgaWYgKG92ZXJyaWRlSGVhZGVyc0Z1bmMgJiYgaXNFeHBlcnQpIHtcbiAgICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IGFqYXhfaW50ZXJjZXB0b3JfcW93ZWlmanFvbi5leGVjdXRlU3RyaW5nRnVuY3Rpb24ob3ZlcnJpZGVIZWFkZXJzRnVuYywgdGhpcy5faGVhZGVyQXJncywgJ2hlYWRlcnMnKVxuICAgICAgICAgICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciAmJiB4aHIuc2V0UmVxdWVzdEhlYWRlci5hcHBseSh4aHIsIFtrZXksIGhlYWRlcnNba2V5XV0pO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbW9kaWZ5IG5vdCBHRVQgcGF5bG9hZFxuICAgICAgICAgICAgY29uc3QgW21ldGhvZF0gPSB0aGlzLl9vcGVuQXJnc1xuICAgICAgICAgICAgaWYgKG92ZXJyaWRlUGF5bG9hZEZ1bmMgJiYgaXNFeHBlcnQgJiYgbWV0aG9kICE9PSAnR0VUJykge1xuICAgICAgICAgICAgICBhcmdzWzBdID0gYWpheF9pbnRlcmNlcHRvcl9xb3dlaWZqcW9uLmV4ZWN1dGVTdHJpbmdGdW5jdGlvbihvdmVycmlkZVBheWxvYWRGdW5jLCBhcmdzWzBdLCAncGF5bG9hZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9zZW5kQXJncyA9IGFyZ3NcbiAgICAgICAgICB4aHIuc2VuZCAmJiB4aHIuc2VuZC5hcHBseSh4aHIsIGFyZ3MpXG4gICAgICAgIH1cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB4aHJbYXR0cl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpc1thdHRyXSA9IHhoclthdHRyXS5iaW5kKHhocilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlc3BvbnNlVGV4dOWSjHJlc3BvbnNl5LiN5pivd3JpdGVhYmxl55qE77yM5L2G5oum5oiq5pe26ZyA6KaB5L+u5pS55a6D77yM5omA5Lul5L+u5pS55bCx5a2Y5YKo5ZyodGhpc1tgXyR7YXR0cn1gXeS4ilxuICAgICAgICBpZiAoWydyZXNwb25zZVRleHQnLCAncmVzcG9uc2UnLCAnc3RhdHVzJywgJ3N0YXR1c1RleHQnXS5pbmNsdWRlcyhhdHRyKSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBhdHRyLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IHRoaXNbYF8ke2F0dHJ9YF0gPT0gdW5kZWZpbmVkID8geGhyW2F0dHJdIDogdGhpc1tgXyR7YXR0cn1gXSxcbiAgICAgICAgICAgIHNldDogKHZhbCkgPT4gdGhpc1tgXyR7YXR0cn1gXSA9IHZhbCxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBhdHRyLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IHhoclthdHRyXSxcbiAgICAgICAgICAgIHNldDogKHZhbCkgPT4geGhyW2F0dHJdID0gdmFsLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG9yaWdpbmFsRmV0Y2g6IHdpbmRvdy5mZXRjaC5iaW5kKHdpbmRvdyksXG4gIG15RmV0Y2g6IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgY29uc3QgZ2V0T3JpZ2luYWxSZXNwb25zZSA9IGFzeW5jIChzdHJlYW0pID0+IHtcbiAgICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcpO1xuICAgICAgY29uc3QgcmVhZGVyID0gc3RyZWFtLmdldFJlYWRlcigpO1xuICAgICAgY29uc3QgcHJvY2Vzc0RhdGEgPSAocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuZG9uZSkge1xuICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhbHVlID0gcmVzdWx0LnZhbHVlOyAvLyBVaW50OEFycmF5XG4gICAgICAgIHRleHQgKz0gZGVjb2Rlci5kZWNvZGUodmFsdWUsIHsgc3RyZWFtOiB0cnVlIH0pO1xuICAgICAgICAvLyDor7vlj5bkuIvkuIDkuKrmlofku7bniYfmrrXvvIzph43lpI3lpITnkIbmraXpqqRcbiAgICAgICAgcmV0dXJuIHJlYWRlci5yZWFkKCkudGhlbihwcm9jZXNzRGF0YSk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGF3YWl0IHJlYWRlci5yZWFkKCkudGhlbihwcm9jZXNzRGF0YSk7XG4gICAgfVxuICAgIGNvbnN0IFtyZXF1ZXN0VXJsLCBkYXRhXSA9IGFyZ3M7XG5cblxuICAgIGxldCBpbnB1dFVybCA9ICcnXG5cbiAgICBpZiAodHlwZW9mIHJlcXVlc3RVcmwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpbnB1dFVybCA9IHJlcXVlc3RVcmxcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZXF1ZXN0VXJsID09PSAnb2JqZWN0Jykge1xuICAgICAgaW5wdXRVcmwgPSByZXF1ZXN0VXJsLnVybCB8fCAnJ1xuICAgIH1cblxuICAgIGNvbnN0IG1hdGNoZWRJbnRlcmZhY2UgPSBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24uZ2V0TWF0Y2hlZEludGVyZmFjZSh7XG4gICAgICB0aGlzUmVxdWVzdFVybDogYWpheF9pbnRlcmNlcHRvcl9xb3dlaWZqcW9uLmdldENvbXBsZXRlVXJsKGlucHV0VXJsKSxcbiAgICAgIHRoaXNNZXRob2Q6IGRhdGEgJiYgZGF0YS5tZXRob2RcbiAgICB9KVxuICAgIGlmIChtYXRjaGVkSW50ZXJmYWNlICYmIGFyZ3MpIHtcbiAgICAgIEFKQVhfTU9ESUZJRVJfS0tfUEFORUxfREFUQS5wdXNoKG1hdGNoZWRJbnRlcmZhY2UpXG4gICAgICB1cGRhdGVGbG9hdFBhbmVsQ29udGVudCgpXG4gICAgICBjb25zdCB7IG92ZXJyaWRlSGVhZGVyc0Z1bmMsIG92ZXJyaWRlUGF5bG9hZEZ1bmMsIGlzRXhwZXJ0ID0gZmFsc2UgfSA9IG1hdGNoZWRJbnRlcmZhY2U7XG4gICAgICBpZiAob3ZlcnJpZGVIZWFkZXJzRnVuYyAmJiBpc0V4cGVydCAmJiBhcmdzWzFdKSB7XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24uZXhlY3V0ZVN0cmluZ0Z1bmN0aW9uKG92ZXJyaWRlSGVhZGVyc0Z1bmMsIHRoaXMuX2hlYWRlckFyZ3MsICdoZWFkZXJzJylcbiAgICAgICAgYXJnc1sxXS5oZWFkZXJzID0gaGVhZGVyc1xuICAgICAgfVxuICAgICAgaWYgKG92ZXJyaWRlUGF5bG9hZEZ1bmMgJiYgaXNFeHBlcnQgJiYgYXJnc1swXSAmJiBhcmdzWzFdKSB7XG4gICAgICAgIGNvbnN0IHsgbWV0aG9kIH0gPSBhcmdzWzFdXG4gICAgICAgIGlmIChbJ0dFVCcsICdIRUFEJ10uaW5jbHVkZXMobWV0aG9kLnRvVXBwZXJDYXNlKCkpKSB7XG4gICAgICAgICAgY29uc3QgcXVlcnlQYXJhbXMgPSBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24uZ2V0UmVxdWVzdFBhcmFtcyhhcmdzWzBdKTtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgcmVxdWVzdFVybDogYXJnc1swXSxcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zXG4gICAgICAgICAgfVxuICAgICAgICAgIGFyZ3NbMF0gPSBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24uZXhlY3V0ZVN0cmluZ0Z1bmN0aW9uKG92ZXJyaWRlUGF5bG9hZEZ1bmMsIGRhdGEsICdwYXlsb2FkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YS5ib2R5ID0gYWpheF9pbnRlcmNlcHRvcl9xb3dlaWZqcW9uLmV4ZWN1dGVTdHJpbmdGdW5jdGlvbihvdmVycmlkZVBheWxvYWRGdW5jLCBkYXRhLmJvZHksICdwYXlsb2FkJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFqYXhfaW50ZXJjZXB0b3JfcW93ZWlmanFvbi5vcmlnaW5hbEZldGNoKC4uLmFyZ3MpLnRoZW4oYXN5bmMgKHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAobWF0Y2hlZEludGVyZmFjZSAmJiAobWF0Y2hlZEludGVyZmFjZS5vdmVycmlkZVR4dCB8fCBtYXRjaGVkSW50ZXJmYWNlLm92ZXJyaWRlUmVzcG9uc2VGdW5jKSkge1xuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJwYWdlU2NyaXB0XCIsIHtcbiAgICAgICAgICBkZXRhaWw6IHsgdXJsOiByZXNwb25zZS51cmwsIG1hdGNoOiBtYXRjaGVkSW50ZXJmYWNlLm1hdGNoIH1cbiAgICAgICAgfSkpXG4gICAgICAgIGxldCB0eHQgPSB1bmRlZmluZWRcbiAgICAgICAgdHh0ID0gbWF0Y2hlZEludGVyZmFjZS5vdmVycmlkZVR4dFxuICAgICAgICBjb25zdCB7IG92ZXJyaWRlVHh0LCBvdmVycmlkZVJlc3BvbnNlRnVuYywgaXNFeHBlcnQgPSBmYWxzZSB9ID0gbWF0Y2hlZEludGVyZmFjZVxuICAgICAgICBsZXQgb3ZlcnJpZGVSZXNwb25zZSA9IHVuZGVmaW5lZFxuICAgICAgICBsZXQgb3ZlcnJpZGVTdGF0dXMgPSB1bmRlZmluZWRcbiAgICAgICAgbGV0IG92ZXJyaWRlU3RhdHVzVGV4dCA9IHVuZGVmaW5lZFxuXG4gICAgICAgIGlmIChvdmVycmlkZVR4dCAmJiAhaXNFeHBlcnQpIHtcbiAgICAgICAgICAvLyDmma7pgJrmqKHlvI/vvIznm7TmjqXmm7/mjaJcbiAgICAgICAgICBvdmVycmlkZVJlc3BvbnNlID0gb3ZlcnJpZGVUeHRcbiAgICAgICAgICAvLyDnirbmgIHnlKgyMDDopobnm5ZcbiAgICAgICAgICBpZiAoYWpheF9pbnRlcmNlcHRvcl9xb3dlaWZqcW9uLnNldHRpbmdzLmFqYXhJbnRlcmNlcHRvcl9hbHdheXMyMDBPbiAmJiB0aGlzLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICBvdmVycmlkZVN0YXR1cyA9IDIwMFxuICAgICAgICAgICAgb3ZlcnJpZGVTdGF0dXNUZXh0ID0gJ09LJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvdmVycmlkZVJlc3BvbnNlRnVuYyAmJiBpc0V4cGVydCkge1xuICAgICAgICAgIC8vIOS4k+S4muaooeW8j++8jOeUqOWHveaVsOabv+aNolxuICAgICAgICAgIGNvbnN0IHF1ZXJ5UGFyYW1zID0gYWpheF9pbnRlcmNlcHRvcl9xb3dlaWZqcW9uLmdldFJlcXVlc3RQYXJhbXMocmVxdWVzdFVybClcbiAgICAgICAgICBjb25zdCBvcmdSZXNwb25zZSA9IGF3YWl0IGdldE9yaWdpbmFsUmVzcG9uc2UocmVzcG9uc2UuYm9keSk7XG4gICAgICAgICAgY29uc3QgZnVuY0FyZ3MgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IGRhdGE/Lm1ldGhvZCxcbiAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgcXVlcnlQYXJhbXMsXG4gICAgICAgICAgICAgIHJlcXVlc3RQYXlsb2FkOiBkYXRhPy5ib2R5XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3JnUmVzcG9uc2UsXG4gICAgICAgICAgICBvcmdTdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICAgIG9yZ1N0YXR1c1RleHQ6IHJlc3BvbnNlLnN0YXR1c1RleHRcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcmVzID0gYWpheF9pbnRlcmNlcHRvcl9xb3dlaWZqcW9uLmV4ZWN1dGVTdHJpbmdGdW5jdGlvbihvdmVycmlkZVJlc3BvbnNlRnVuYywgZnVuY0FyZ3MsICdyZXNwb25zZScpXG4gICAgICAgICAgaWYgKHR5cGVvZiByZXMgPT09ICdvYmplY3QnICYmIHJlcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICByZXNwb25zZTogbmV3UmVzcG9uc2UgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIHN0YXR1czogbmV3U3RhdHVzID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBzdGF0dXNUZXh0OiBuZXdTdGF0dXNUZXh0ID0gdW5kZWZpbmVkXG4gICAgICAgICAgICB9ID0gcmVzXG4gICAgICAgICAgICBvdmVycmlkZVJlc3BvbnNlID0gbmV3UmVzcG9uc2VcbiAgICAgICAgICAgIG92ZXJyaWRlU3RhdHVzID0gbmV3U3RhdHVzXG4gICAgICAgICAgICBvdmVycmlkZVN0YXR1c1RleHQgPSBuZXdTdGF0dXNUZXh0XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtBamF4IE1vZGlmaWVyXSBFeGVjdXRlRnVuY3Rpb25FcnJvcjogUGxlYXNlIGNoZWNrIHlvdXIgcmV0dXJuIGluIHRoZSByZXNwb25zZSBmdW5jdGlvbi4gU2VlIG1vcmUgZGV0YWlscyBpbiB0aGUgZXhhbXBsZXMuIFxcbmApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHR4dCA9IG92ZXJyaWRlUmVzcG9uc2UgIT09IHVuZGVmaW5lZCA/IG92ZXJyaWRlUmVzcG9uc2UgOiByZXNwb25zZS5yZXNwb25zZVRleHRcbiAgICAgICAgY29uc3Qgc3RyZWFtID0gbmV3IFJlYWRhYmxlU3RyZWFtKHtcbiAgICAgICAgICBzdGFydChjb250cm9sbGVyKSB7XG4gICAgICAgICAgICAvLyBjb25zdCBidWZWaWV3ID0gbmV3IFVpbnQ4QXJyYXkobmV3IEFycmF5QnVmZmVyKHR4dC5sZW5ndGgpKVxuICAgICAgICAgICAgLy8gZm9yICh2YXIgaSA9IDAgaSA8IHR4dC5sZW5ndGggaSsrKSB7XG4gICAgICAgICAgICAvLyAgIGJ1ZlZpZXdbaV0gPSB0eHQuY2hhckNvZGVBdChpKVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgY29udHJvbGxlci5lbnF1ZXVlKG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZSh0eHQpKVxuICAgICAgICAgICAgY29udHJvbGxlci5jbG9zZSgpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICAgIHN0YXR1czogb3ZlcnJpZGVTdGF0dXMgIT09IHVuZGVmaW5lZCA/IG92ZXJyaWRlU3RhdHVzIDogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IG92ZXJyaWRlU3RhdHVzVGV4dCAhPT0gdW5kZWZpbmVkID8gb3ZlcnJpZGVTdGF0dXNUZXh0IDogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdSZXNwb25zZSA9IG5ldyBSZXNwb25zZShzdHJlYW0sIHtcbiAgICAgICAgICBoZWFkZXJzOiByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIC4uLnBhcmFtc1xuICAgICAgICB9KVxuICAgICAgICBjb25zdCBwcm94eSA9IG5ldyBQcm94eShuZXdSZXNwb25zZSwge1xuICAgICAgICAgIGdldDogZnVuY3Rpb24gKHRhcmdldCwgbmFtZSkge1xuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3JlZGlyZWN0ZWQnOlxuICAgICAgICAgICAgICBjYXNlICd0eXBlJzpcbiAgICAgICAgICAgICAgY2FzZSAndXJsJzpcbiAgICAgICAgICAgICAgY2FzZSAndXNlRmluYWxVUkwnOlxuICAgICAgICAgICAgICBjYXNlICdib2R5JzpcbiAgICAgICAgICAgICAgY2FzZSAnYm9keVVzZWQnOlxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZVtuYW1lXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtuYW1lXVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHByb3h5KSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBwcm94eVtrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBwcm94eVtrZXldID0gcHJveHlba2V5XS5iaW5kKG5ld1Jlc3BvbnNlKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJveHlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG59XG5cbmNvbnN0IHRvYXN0TWVzc2FnZSA9IChtYXRjaGVkSW50ZXJmYWNlKSA9PiB7XG4gIC8vIHRvYXN0IGEgbWVzc2FnZSB0aG91Z2ggZG9tIHRvIHNob3cgdGhlIG1hdGNoZWRJbnRlcmZhY2VcbiAgY29uc3QgdG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICB0b2FzdC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCdcbiAgdG9hc3Quc3R5bGUudG9wID0gJzEwcHgnXG4gIHRvYXN0LnN0eWxlLmxlZnQgPSAnMTBweCdcbiAgdG9hc3Quc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JlZCdcbiAgdG9hc3Quc3R5bGUuY29sb3IgPSAnd2hpdGUnXG4gIHRvYXN0LnN0eWxlLnBhZGRpbmcgPSAnMTBweCdcbiAgdG9hc3Quc3R5bGUuekluZGV4ID0gJzk5OTknXG4gIHRvYXN0LnN0eWxlLm9wYWNpdHkgPSAnMC41J1xuICB0b2FzdC5pbm5lckhUTUwgPSBgW0FKQXggTW9kaWZpZXJdIG1hdGNoZWRJbnRlcmZhY2U6ICR7bWF0Y2hlZEludGVyZmFjZS5tYXRjaH1gXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9hc3QpXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodG9hc3QpXG4gIH0sIDUwMDApXG59XG5cbmNvbnN0IGNvbnRyb2xGbG9hdFBhbmVsQnV0dG9uID0gKCkgPT4ge1xuICBjb25zb2xlLmxvZygnW2NvbnRyb2xGbG9hdFBhbmVsQnV0dG9uXScpXG4gIC8vIGNyZWF0ZSBhIGJ1dHRvbiB0byBjb250cm9sIHRoZSBmbG9hdCBwYW5lbFxuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICBidXR0b24uaWQgPSAnYWpheC1tb2RpZmllci1wYW5lbC1idXR0b24nXG4gIGJ1dHRvbi5pbm5lckhUTUwgPSAnQWpheCBLSydcbiAgYnV0dG9uLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJ1xuICBidXR0b24uc3R5bGUuYm90dG9tID0gJzEwcHgnXG4gIGJ1dHRvbi5zdHlsZS5yaWdodCA9ICcxMHB4J1xuICBidXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNjY2Q1YWUnXG4gIGJ1dHRvbi5zdHlsZS5jb2xvciA9ICd3aGl0ZSdcbiAgLy9mb250IHNpemVcbiAgYnV0dG9uLnN0eWxlLmZvbnRTaXplID0gJzEycHgnXG4gIGJ1dHRvbi5zdHlsZS5wYWRkaW5nID0gJzRweCAycHgnXG4gIC8vYm9yZGVyIG5vbmVcbiAgYnV0dG9uLnN0eWxlLmJvcmRlciA9ICdub25lJ1xuICAvLyBzaGFkb3dcbiAgYnV0dG9uLnN0eWxlLmJveFNoYWRvdyA9ICcwIDAgMTBweCAwIHJnYmEoMCwgMCwgMCwgMC41KSdcbiAgLy8gaG92ZXJcbiAgYnV0dG9uLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJ1xuICBidXR0b24uc3R5bGUuekluZGV4ID0gJzk5OTknXG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBjb25zdCBwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhamF4LW1vZGlmaWVyLXBhbmVsJylcbiAgICBpZiAocGFuZWwgJiYgcGFuZWwuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKSB7XG4gICAgICAvLyBoaWRlIHRoZSBwYW5lbFxuICAgICAgaGlkZUZsb2F0UGFuZWwoKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzaG93IHRoZSBwYW5lbFxuICAgICAgc2hvd0Zsb2F0UGFuZWwoKVxuICAgIH1cbiAgfSlcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbilcbn1cblxuY29uc3Qgc2hvd0Zsb2F0UGFuZWwgPSAoKSA9PiB7XG4gIGNvbnN0IHBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FqYXgtbW9kaWZpZXItcGFuZWwnKVxuICBpZiAocGFuZWwpIHtcbiAgICBwYW5lbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIHBhbmVsLnN0eWxlLm9wYWNpdHkgPSAnMSdcbiAgICBwYW5lbC5zdHlsZS56SW5kZXggPSAnOTk5OSdcbiAgfVxufVxuXG5jb25zdCBoaWRlRmxvYXRQYW5lbCA9ICgpID0+IHtcbiAgY29uc3QgcGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWpheC1tb2RpZmllci1wYW5lbCcpXG4gIGlmIChwYW5lbCkge1xuICAgIHBhbmVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICBwYW5lbC5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgcGFuZWwuc3R5bGUuekluZGV4ID0gJy0xJ1xuICB9XG59XG5cbmNvbnN0IGhpZGVGbG9hdFBhbmVsQnV0dG9uID0gKCkgPT4ge1xuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWpheC1tb2RpZmllci1wYW5lbC1idXR0b24nKVxuICBpZiAoYnV0dG9uKSB7XG4gICAgYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgfVxufVxuY29uc3Qgc2hvd0Zsb2F0UGFuZWxCdXR0b24gPSAoKSA9PiB7XG4gIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhamF4LW1vZGlmaWVyLXBhbmVsLWJ1dHRvbicpXG4gIGlmIChidXR0b24pIHtcbiAgICBidXR0b24uc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgfVxufVxuXG5jb25zdCB1cGRhdGVGbG9hdFBhbmVsQ29udGVudCA9ICgpID0+IHtcbiAgLy8gZmlsdGVyIHRoZSBzYW1lIG1hdGNoXG4gIGNvbnN0IHVuaXF1ZU1hdGNoZXMgPSBbLi4ubmV3IFNldChBSkFYX01PRElGSUVSX0tLX1BBTkVMX0RBVEE/Lm1hcChpdGVtID0+IGl0ZW0ubWF0Y2gpKV1cbiAgY29uc3QgaDIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWpheC1tb2RpZmllci1wYW5lbC10aXRsZScpXG4gIGgyLmlubmVySFRNTCA9IGBBSkF4IE1vZGlmaWVyICR7dW5pcXVlTWF0Y2hlcy5sZW5ndGh9YFxuICBjb25zdCBoM0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhamF4LW1vZGlmaWVyLXBhbmVsLWgzJylcbiAgaDNEaXYuaW5uZXJIVE1MID0gJydcbiAgdW5pcXVlTWF0Y2hlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgY29uc3QgaDMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpXG4gICAgaDMuaW5uZXJIVE1MID0gYCR7aXRlbX1gXG4gICAgaDNEaXYuYXBwZW5kQ2hpbGQoaDMpXG4gIH0pXG59XG5cbmNvbnN0IGNyZWF0ZUZsb2F0UGFuZWwgPSAoKSA9PiB7XG4gIC8vIGlmIHRoZSBwYW5lbCBhbHJlYWR5IGV4aXN0cywgdXBkYXRlIGRhdGFcbiAgbGV0IHBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FqYXgtbW9kaWZpZXItcGFuZWwnKVxuICBpZiAocGFuZWwpIHtcbiAgICB1cGRhdGVGbG9hdFBhbmVsQ29udGVudCgpXG4gICAgcmV0dXJuXG4gIH1cbiAgcGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBwYW5lbC5pZCA9ICdhamF4LW1vZGlmaWVyLXBhbmVsJ1xuICBwYW5lbC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCdcbiAgcGFuZWwuc3R5bGUudG9wID0gJzEwcHgnXG4gIHBhbmVsLnN0eWxlLmxlZnQgPSAnMTBweCdcbiAgcGFuZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNkNGEzNzMnXG4gIHBhbmVsLnN0eWxlLmNvbG9yID0gJ3doaXRlJ1xuICBwYW5lbC5zdHlsZS5wYWRkaW5nID0gJzEwcHgnXG4gIHBhbmVsLnN0eWxlLnpJbmRleCA9ICc5OTk5J1xuICBwYW5lbC5zdHlsZS5mb250U2l6ZSA9ICcxMnB4J1xuICAvLyBwYW5lbC5pbm5lckhUTUwgPSBgW0FKQXggTW9kaWZpZXJdIG1hdGNoZWRJbnRlcmZhY2U6ICR7bWF0Y2hlZEludGVyZmFjZS5tYXRjaH1gXG4gIGNvbnN0IGgyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKVxuICBoMi5pZCA9ICdhamF4LW1vZGlmaWVyLXBhbmVsLXRpdGxlJ1xuICBoMi5pbm5lckhUTUwgPSBgQUpBeCBNb2RpZmllciAke0FKQVhfTU9ESUZJRVJfS0tfUEFORUxfREFUQT8ubGVuZ3RofWBcbiAgcGFuZWwuYXBwZW5kQ2hpbGQoaDIpXG5cbiAgLy8gcHV0IGgzIGludG8gYSBkaXZcbiAgY29uc3QgaDNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBoM0Rpdi5pZCA9ICdhamF4LW1vZGlmaWVyLXBhbmVsLWgzJ1xuICAvLyBmaWx0ZXIgdGhlIHNhbWUgbWF0Y2hcbiAgY29uc3QgdW5pcXVlTWF0Y2hlcyA9IFsuLi5uZXcgU2V0KEFKQVhfTU9ESUZJRVJfS0tfUEFORUxfREFUQT8ubWFwKGl0ZW0gPT4gaXRlbS5tYXRjaCkpXVxuICB1bmlxdWVNYXRjaGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBjb25zdCBoMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJylcbiAgICBoMy5pbm5lckhUTUwgPSBgJHtpdGVtLm1hdGNofWBcbiAgICAvLyBhZGQgYnV0dG9uIHRvIGNvcHkgdGhlIG1hdGNoZWRJbnRlcmZhY2VcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICAgIGJ1dHRvbi5pbm5lckhUTUwgPSAnQ29weSdcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChpdGVtLm1hdGNoKVxuICAgIH0pXG4gICAgaDMuYXBwZW5kQ2hpbGQoYnV0dG9uKVxuICAgIGgzRGl2LmFwcGVuZENoaWxkKGgzKVxuICB9KVxuICBwYW5lbC5hcHBlbmRDaGlsZChoM0RpdilcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBhbmVsKVxufVxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICBjb25zdCBkYXRhID0gZXZlbnQuZGF0YVxuICAvLyBjb25zb2xlLmxvZygnZGF0YSBmcm9tIGNvbnRlbnRfc2NyaXB0IG1haW4uanMnLCBkYXRhKVxuXG4gIGlmIChkYXRhLnR5cGUgPT09ICdhamF4SW50ZXJjZXB0b3InICYmIGRhdGEudG8gPT09ICdwYWdlU2NyaXB0Jykge1xuICAgIGNvbnNvbGUubG9nKCdkYXRhJywgZGF0YSlcbiAgICBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24uc2V0dGluZ3NbZGF0YS5rZXldID0gZGF0YS52YWx1ZVxuXG5cbiAgICAvLyBjb21wYXJlIGlmIGFqYXhJbnRlcmNlcHRvcl9ydWxlcyBpbmNsdWRlcyB3aW5kb3cubG9jYXRpb24uaG9zdFxuICAgIGNvbnNvbGUubG9nKGFqYXhfaW50ZXJjZXB0b3JfcW93ZWlmanFvbi5zZXR0aW5ncy5hamF4SW50ZXJjZXB0b3JfcnVsZXMpXG4gICAgaWYgKGFqYXhfaW50ZXJjZXB0b3JfcW93ZWlmanFvbi5zZXR0aW5ncy5hamF4SW50ZXJjZXB0b3JfcnVsZXMuc29tZShpdGVtID0+IGl0ZW0ubWF0Y2guaW5jbHVkZXMod2luZG93LmxvY2F0aW9uLmhvc3QpKSkge1xuICAgICAgY29udHJvbEZsb2F0UGFuZWxCdXR0b24oKVxuICAgICAgY3JlYXRlRmxvYXRQYW5lbCgpXG4gICAgfVxuICB9XG5cbiAgaWYgKGFqYXhfaW50ZXJjZXB0b3JfcW93ZWlmanFvbi5zZXR0aW5ncy5hamF4SW50ZXJjZXB0b3Jfc3dpdGNoT24pIHtcbiAgICB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPSBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24ubXlYSFJcbiAgICB3aW5kb3cuZmV0Y2ggPSBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24ubXlGZXRjaFxuICAgIHNob3dGbG9hdFBhbmVsQnV0dG9uKClcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPSBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24ub3JpZ2luYWxYSFJcbiAgICB3aW5kb3cuZmV0Y2ggPSBhamF4X2ludGVyY2VwdG9yX3Fvd2VpZmpxb24ub3JpZ2luYWxGZXRjaFxuICAgIGhpZGVGbG9hdFBhbmVsQnV0dG9uKClcbiAgICBoaWRlRmxvYXRQYW5lbCgpXG4gIH1cbn0sIGZhbHNlKVxuIl0sIm5hbWVzIjpbIkFKQVhfTU9ESUZJRVJfS0tfUEFORUxfREFUQSIsImFqYXhfaW50ZXJjZXB0b3JfcW93ZWlmanFvbiIsInNldHRpbmdzIiwiYWpheEludGVyY2VwdG9yX3N3aXRjaE9uIiwiYWpheEludGVyY2VwdG9yX2Fsd2F5czIwME9uIiwiYWpheEludGVyY2VwdG9yX3J1bGVzIiwiZ2V0TWF0Y2hlZEludGVyZmFjZSIsInRoaXNSZXF1ZXN0VXJsIiwidGhpc01ldGhvZCIsImZpbmQiLCJpdGVtIiwiZmlsdGVyVHlwZSIsImxpbWl0TWV0aG9kIiwic3dpdGNoT24iLCJtYXRjaCIsInJlcGxhY2UiLCJtYXRjaGVkTWV0aG9kIiwibWF0Y2hlZFJlcXVlc3QiLCJSZWdFeHAiLCJleGVjdXRlU3RyaW5nRnVuY3Rpb24iLCJzdHJpbmdGdW5jdGlvbiIsImFyZ3MiLCJmdW5jTmFtZSIsIkZ1bmN0aW9uIiwiZSIsImNvbnNvbGUiLCJlcnJvciIsImdldFJlcXVlc3RQYXJhbXMiLCJyZXF1ZXN0VXJsIiwicGFyYW1TdHIiLCJzcGxpdCIsInBvcCIsImtleVZhbHVlQXJyIiwia2V5VmFsdWVPYmoiLCJmb3JFYWNoIiwiaXRlbUFyciIsIml0ZW1PYmoiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRDb21wbGV0ZVVybCIsImlucHV0VXJsIiwidXJsIiwidHJpbSIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0IiwiY3VycmVudFVybCIsImhyZWYiLCJVUkwiLCJzdGFydHNXaXRoIiwib3JpZ2luYWxYSFIiLCJYTUxIdHRwUmVxdWVzdCIsIm15WEhSIiwicGFnZVNjcmlwdEV2ZW50RGlzcGF0Y2hlZCIsIm1vZGlmeVJlc3BvbnNlIiwibWV0aG9kIiwiX29wZW5BcmdzIiwicXVlcnlQYXJhbXMiLCJyZXF1ZXN0UGF5bG9hZCIsIl9zZW5kQXJncyIsIm1hdGNoZWRJbnRlcmZhY2UiLCJfbWF0Y2hlZEludGVyZmFjZSIsImxvZyIsIm92ZXJyaWRlVHh0Iiwib3ZlcnJpZGVSZXNwb25zZUZ1bmMiLCJwdXNoIiwidXBkYXRlRmxvYXRQYW5lbENvbnRlbnQiLCJpc0V4cGVydCIsIm92ZXJyaWRlUmVzcG9uc2UiLCJ1bmRlZmluZWQiLCJvdmVycmlkZVN0YXR1cyIsIm92ZXJyaWRlU3RhdHVzVGV4dCIsInN0YXR1cyIsImZ1bmNBcmdzIiwicGF5bG9hZCIsIm9yZ1Jlc3BvbnNlIiwicmVzcG9uc2UiLCJvcmdTdGF0dXMiLCJvcmdTdGF0dXNUZXh0Iiwic3RhdHVzVGV4dCIsInJlcyIsIm5ld1Jlc3BvbnNlIiwibmV3U3RhdHVzIiwibmV3U3RhdHVzVGV4dCIsInJlc3BvbnNlVGV4dCIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsInJlc3BvbnNlVVJMIiwieGhyIiwiYXR0ciIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJhcHBseSIsIm9ubG9hZCIsIm9wZW4iLCJvdmVycmlkZVBheWxvYWRGdW5jIiwidG9VcHBlckNhc2UiLCJkYXRhIiwic2V0UmVxdWVzdEhlYWRlciIsIl9oZWFkZXJBcmdzIiwib3ZlcnJpZGVIZWFkZXJzRnVuYyIsInNlbmQiLCJoZWFkZXJzIiwia2V5cyIsImtleSIsImJpbmQiLCJpbmNsdWRlcyIsImRlZmluZVByb3BlcnR5IiwiZ2V0Iiwic2V0IiwidmFsIiwiZW51bWVyYWJsZSIsIm9yaWdpbmFsRmV0Y2giLCJmZXRjaCIsIm15RmV0Y2giLCJnZXRPcmlnaW5hbFJlc3BvbnNlIiwic3RyZWFtIiwidGV4dCIsImRlY29kZXIiLCJUZXh0RGVjb2RlciIsInJlYWRlciIsImdldFJlYWRlciIsInByb2Nlc3NEYXRhIiwicmVzdWx0IiwiZG9uZSIsInZhbHVlIiwiZGVjb2RlIiwicmVhZCIsInRoZW4iLCJib2R5IiwidHh0IiwiUmVhZGFibGVTdHJlYW0iLCJzdGFydCIsImNvbnRyb2xsZXIiLCJlbnF1ZXVlIiwiVGV4dEVuY29kZXIiLCJlbmNvZGUiLCJjbG9zZSIsInBhcmFtcyIsIlJlc3BvbnNlIiwicHJveHkiLCJQcm94eSIsInRhcmdldCIsIm5hbWUiLCJ0b2FzdE1lc3NhZ2UiLCJ0b2FzdCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwicG9zaXRpb24iLCJ0b3AiLCJsZWZ0IiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJwYWRkaW5nIiwiekluZGV4Iiwib3BhY2l0eSIsImlubmVySFRNTCIsImFwcGVuZENoaWxkIiwic2V0VGltZW91dCIsInJlbW92ZUNoaWxkIiwiY29udHJvbEZsb2F0UGFuZWxCdXR0b24iLCJidXR0b24iLCJpZCIsImJvdHRvbSIsInJpZ2h0IiwiZm9udFNpemUiLCJib3JkZXIiLCJib3hTaGFkb3ciLCJjdXJzb3IiLCJhZGRFdmVudExpc3RlbmVyIiwicGFuZWwiLCJnZXRFbGVtZW50QnlJZCIsImRpc3BsYXkiLCJoaWRlRmxvYXRQYW5lbCIsInNob3dGbG9hdFBhbmVsIiwiaGlkZUZsb2F0UGFuZWxCdXR0b24iLCJzaG93RmxvYXRQYW5lbEJ1dHRvbiIsInVuaXF1ZU1hdGNoZXMiLCJTZXQiLCJtYXAiLCJoMiIsImxlbmd0aCIsImgzRGl2IiwiaDMiLCJjcmVhdGVGbG9hdFBhbmVsIiwibmF2aWdhdG9yIiwiY2xpcGJvYXJkIiwid3JpdGVUZXh0IiwiZXZlbnQiLCJ0eXBlIiwidG8iLCJzb21lIl0sInNvdXJjZVJvb3QiOiIifQ==