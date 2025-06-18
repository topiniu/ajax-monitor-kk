const AJAX_MODIFIER_KK_PANEL_DATA = []
// 命名空间
let ajax_interceptor_qoweifjqon = {
  settings: {
    ajaxInterceptor_switchOn: false,
    ajaxInterceptor_always200On: true, // 默认开启，后期可以扩展成设置项
    ajaxInterceptor_rules: [],
  },
  // 获取匹配到的规则项
  getMatchedInterface: ({ thisRequestUrl = '', thisMethod = '' }) => {
    return ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules.find(item => {
      let { filterType = 'normal', limitMethod = 'ALL', switchOn = true, match } = item
      // remove \n if match has it in the end
      match = match?.replace(/\n$/, '')
      const matchedMethod = thisMethod === limitMethod || limitMethod === 'ALL'
      const matchedRequest = (filterType === 'normal' && thisRequestUrl === match) ||
        (filterType === 'regex' && thisRequestUrl.match(new RegExp(match, 'i')))
      return switchOn && matchedMethod && matchedRequest
    })
  },
  // 执行用户输入的函数，如果有错误会抛出到控制台
  executeStringFunction: (stringFunction, args, funcName = '') => {
    try {
      stringFunction = (new Function('...args', stringFunction))(args)
    } catch (e) {
      console.error(`[Ajax Modifier] ExecuteFunctionError: Please check the ${funcName} function.\n`, e)
    }
    return stringFunction;
  },
  getRequestParams: (requestUrl) => {
    if (!requestUrl) {
      return null;
    }
    const paramStr = requestUrl.split('?').pop();
    const keyValueArr = paramStr.split('&');
    let keyValueObj = {};
    keyValueArr.forEach((item) => {
      // 保证中间不会把=给忽略掉
      const itemArr = item.replace('=', '〓').split('〓');
      const itemObj = { [itemArr[0]]: itemArr[1] };
      keyValueObj = Object.assign(keyValueObj, itemObj);
    });
    return keyValueObj;
  },
  getCompleteUrl: (inputUrl) => {
    let url = inputUrl.trim()
    const protocol = window.location.protocol
    const host = window.location.host
    const currentUrl = window.location.href
    try {
      // 如果解析成功，表示输入是完整的URL，不需要处理
      new URL(url)
    } catch (e) {
      if (url.startsWith("./") || url.startsWith("../")) {
        // 相对路由
        url = new URL(url, currentUrl).href
      } else if (url.startsWith("//")) {
        // 只缺少协议，补全协议
        url = protocol + url
      } else {
        // 既没有协议也没有域名，补全域名和协议
        url = protocol + "//" + host + (url.startsWith("/") ? "" : "/") + url
      }
    }
    return url
  },
  originalXHR: window.XMLHttpRequest,
  myXHR: function () {
    let pageScriptEventDispatched = false
    const modifyResponse = () => {
      const [method, requestUrl] = this._openArgs
      const queryParams = ajax_interceptor_qoweifjqon.getRequestParams(requestUrl)
      const [requestPayload] = this._sendArgs
      const matchedInterface = this._matchedInterface
      console.log('【Ajax Modifier in xhr】matchedInterface', matchedInterface)
      if (matchedInterface && (matchedInterface.overrideTxt || matchedInterface.overrideResponseFunc)) {
        AJAX_MODIFIER_KK_PANEL_DATA.push(matchedInterface)
        updateFloatPanelContent()
        const { overrideTxt, overrideResponseFunc, match, isExpert = false } = matchedInterface
        let overrideResponse = undefined
        let overrideStatus = undefined
        let overrideStatusText = undefined
        if (overrideTxt && !isExpert) {
          // 普通模式，直接替换
          overrideResponse = overrideTxt
          // 状态用200覆盖
          if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_always200On && this.status !== 200) {
            overrideStatus = 200
            overrideStatusText = 'OK'
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
          }
          const res = ajax_interceptor_qoweifjqon.executeStringFunction(overrideResponseFunc, funcArgs, 'response')
          // 返回是对象才处理
          if (typeof res === 'object' && res !== null) {
            const {
              response: newResponse = undefined,
              status: newStatus = undefined,
              statusText: newStatusText = undefined
            } = res
            overrideResponse = newResponse
            overrideStatus = newStatus
            overrideStatusText = newStatusText
          } else {
            console.error(`[Ajax Modifier] ExecuteFunctionError: Please check your return in the response function. See more details in the examples. \n`)
          }
        }
        // 没有返回不替换
        this.responseText = overrideResponse !== undefined ? overrideResponse : this.responseText
        this.response = overrideResponse !== undefined ? overrideResponse : this.response
        this.status = overrideStatus !== undefined ? overrideStatus : this.status
        this.statusText = overrideStatusText !== undefined ? overrideStatusText : this.statusText
        if (!pageScriptEventDispatched) {
          window.dispatchEvent(new CustomEvent("pageScript", {
            detail: { url: this.responseURL, match }
          }))
          pageScriptEventDispatched = true
        }
      }
    }

    const xhr = new ajax_interceptor_qoweifjqon.originalXHR
    for (let attr in xhr) {
      if (attr === 'onreadystatechange') {
        xhr.onreadystatechange = (...args) => {
          if (this.readyState === 4) {
            // 请求成功
            modifyResponse()
          }
          this.onreadystatechange && this.onreadystatechange.apply(this, args)
        }
        this.onreadystatechange = null
        continue
      } else if (attr === 'onload') {
        xhr.onload = (...args) => {
          // 请求成功
          modifyResponse()
          this.onload && this.onload.apply(this, args)
        }
        this.onload = null
        continue
      } else if (attr === 'open') {
        this.open = (...args) => {
          this._openArgs = args
          const [method, requestUrl] = args
          this._matchedInterface = ajax_interceptor_qoweifjqon.getMatchedInterface({
            thisRequestUrl: ajax_interceptor_qoweifjqon.getCompleteUrl(requestUrl),
            thisMethod: method
          })
          const matchedInterface = this._matchedInterface
          // modify request
          if (matchedInterface) {
            const { overridePayloadFunc, isExpert = false } = matchedInterface
            if (overridePayloadFunc && isExpert && args[0] && args[1] && args[0].toUpperCase() === 'GET') {
              const queryParams = ajax_interceptor_qoweifjqon.getRequestParams(args[1])
              const data = {
                requestUrl: args[1],
                queryParams
              }
              args[1] = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, data, 'payload')
            }
          }
          xhr.open && xhr.open.apply(xhr, args)
        }
        continue
      } else if (attr === 'setRequestHeader') {
        this.setRequestHeader = (...args) => {
          // get headers
          this._headerArgs = this._headerArgs ? Object.assign(this._headerArgs, { [args[0]]: args[1] }) : { [args[0]]: args[1] };
          const matchedInterface = this._matchedInterface;
          if (!(matchedInterface && matchedInterface.overrideHeadersFunc && matchedInterface.isExpert)) { // 没有要拦截修改或添加的header
            xhr.setRequestHeader && xhr.setRequestHeader.apply(xhr, args);
          }
        }
        continue;
      } else if (attr === 'send') {
        this.send = (...args) => {
          const matchedInterface = this._matchedInterface
          if (matchedInterface) {
            // modify headers
            const { overrideHeadersFunc, overridePayloadFunc, isExpert = false } = matchedInterface
            if (overrideHeadersFunc && isExpert) {
              const headers = ajax_interceptor_qoweifjqon.executeStringFunction(overrideHeadersFunc, this._headerArgs, 'headers')
              Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader && xhr.setRequestHeader.apply(xhr, [key, headers[key]]);
              })
            }
            // modify not GET payload
            const [method] = this._openArgs
            if (overridePayloadFunc && isExpert && method !== 'GET') {
              args[0] = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, args[0], 'payload');
            }
          }
          this._sendArgs = args
          xhr.send && xhr.send.apply(xhr, args)
        }
        continue
      }

      if (typeof xhr[attr] === 'function') {
        this[attr] = xhr[attr].bind(xhr)
      } else {
        // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
        if (['responseText', 'response', 'status', 'statusText'].includes(attr)) {
          Object.defineProperty(this, attr, {
            get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
            set: (val) => this[`_${attr}`] = val,
            enumerable: true
          })
        } else {
          Object.defineProperty(this, attr, {
            get: () => xhr[attr],
            set: (val) => xhr[attr] = val,
            enumerable: true
          })
        }
      }
    }
  },
  originalFetch: window.fetch.bind(window),
  myFetch: function (...args) {
    const getOriginalResponse = async (stream) => {
      let text = '';
      const decoder = new TextDecoder('utf-8');
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
    }
    const [requestUrl, data] = args;


    let inputUrl = ''

    if (typeof requestUrl === 'string') {
      inputUrl = requestUrl
    } else if (typeof requestUrl === 'object') {
      inputUrl = requestUrl.url || ''
    }

    const matchedInterface = ajax_interceptor_qoweifjqon.getMatchedInterface({
      thisRequestUrl: ajax_interceptor_qoweifjqon.getCompleteUrl(inputUrl),
      thisMethod: data && data.method
    })
    if (matchedInterface && args) {
      AJAX_MODIFIER_KK_PANEL_DATA.push(matchedInterface)
      updateFloatPanelContent()
      const { overrideHeadersFunc, overridePayloadFunc, isExpert = false } = matchedInterface;
      if (overrideHeadersFunc && isExpert && args[1]) {
        const headers = ajax_interceptor_qoweifjqon.executeStringFunction(overrideHeadersFunc, this._headerArgs, 'headers')
        args[1].headers = headers
      }
      if (overridePayloadFunc && isExpert && args[0] && args[1]) {
        const { method } = args[1]
        if (['GET', 'HEAD'].includes(method.toUpperCase())) {
          const queryParams = ajax_interceptor_qoweifjqon.getRequestParams(args[0]);
          const data = {
            requestUrl: args[0],
            queryParams
          }
          args[0] = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, data, 'payload');
        } else {
          data.body = ajax_interceptor_qoweifjqon.executeStringFunction(overridePayloadFunc, data.body, 'payload');
        }
      }
    }
    return ajax_interceptor_qoweifjqon.originalFetch(...args).then(async (response) => {
      if (matchedInterface && (matchedInterface.overrideTxt || matchedInterface.overrideResponseFunc)) {
        window.dispatchEvent(new CustomEvent("pageScript", {
          detail: { url: response.url, match: matchedInterface.match }
        }))
        let txt = undefined
        txt = matchedInterface.overrideTxt
        const { overrideTxt, overrideResponseFunc, isExpert = false } = matchedInterface
        let overrideResponse = undefined
        let overrideStatus = undefined
        let overrideStatusText = undefined

        if (overrideTxt && !isExpert) {
          // 普通模式，直接替换
          overrideResponse = overrideTxt
          // 状态用200覆盖
          if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_always200On && this.status !== 200) {
            overrideStatus = 200
            overrideStatusText = 'OK'
          }
        } else if (overrideResponseFunc && isExpert) {
          // 专业模式，用函数替换
          const queryParams = ajax_interceptor_qoweifjqon.getRequestParams(requestUrl)
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
          }
          const res = ajax_interceptor_qoweifjqon.executeStringFunction(overrideResponseFunc, funcArgs, 'response')
          if (typeof res === 'object' && res !== null) {
            const {
              response: newResponse = undefined,
              status: newStatus = undefined,
              statusText: newStatusText = undefined
            } = res
            overrideResponse = newResponse
            overrideStatus = newStatus
            overrideStatusText = newStatusText
          } else {
            console.error(`[Ajax Modifier] ExecuteFunctionError: Please check your return in the response function. See more details in the examples. \n`)
          }
        }
        txt = overrideResponse !== undefined ? overrideResponse : response.responseText
        const stream = new ReadableStream({
          start(controller) {
            // const bufView = new Uint8Array(new ArrayBuffer(txt.length))
            // for (var i = 0 i < txt.length i++) {
            //   bufView[i] = txt.charCodeAt(i)
            // }
            controller.enqueue(new TextEncoder().encode(txt))
            controller.close()
          }
        })
        let params = {
          status: overrideStatus !== undefined ? overrideStatus : response.status,
          statusText: overrideStatusText !== undefined ? overrideStatusText : response.statusText,
        }
        const newResponse = new Response(stream, {
          headers: response.headers,
          ...params
        })
        const proxy = new Proxy(newResponse, {
          get: function (target, name) {
            switch (name) {
              case 'redirected':
              case 'type':
              case 'url':
              case 'useFinalURL':
              case 'body':
              case 'bodyUsed':
                return response[name]
            }
            return target[name]
          }
        })
        for (let key in proxy) {
          if (typeof proxy[key] === 'function') {
            proxy[key] = proxy[key].bind(newResponse)
          }
        }
        return proxy
      } else {
        return response
      }
    })
  },
}

const toastMessage = (matchedInterface) => {
  // toast a message though dom to show the matchedInterface
  const toast = document.createElement('div')
  toast.style.position = 'fixed'
  toast.style.top = '10px'
  toast.style.left = '10px'
  toast.style.backgroundColor = 'red'
  toast.style.color = 'white'
  toast.style.padding = '10px'
  toast.style.zIndex = '9999'
  toast.style.opacity = '0.5'
  toast.innerHTML = `[AJAx Modifier] matchedInterface: ${matchedInterface.match}`
  document.body.appendChild(toast)
  setTimeout(() => {
    document.body.removeChild(toast)
  }, 5000)
}

const controlFloatPanelButton = () => {
  console.log('[controlFloatPanelButton]')
  // create a button to control the float panel
  const button = document.createElement('button')
  button.id = 'ajax-modifier-panel-button'
  button.innerHTML = 'Ajax KK'
  button.style.position = 'fixed'
  button.style.bottom = '10px'
  button.style.right = '10px'
  button.style.backgroundColor = '#ccd5ae'
  button.style.color = 'white'
  //font size
  button.style.fontSize = '12px'
  button.style.padding = '4px 2px'
  //border none
  button.style.border = 'none'
  // shadow
  button.style.boxShadow = '0 0 10px 0 rgba(0, 0, 0, 0.5)'
  // hover
  button.style.cursor = 'pointer'
  button.style.zIndex = '9999'
  button.addEventListener('click', () => {
    const panel = document.getElementById('ajax-modifier-panel')
    if (panel && panel.style.display !== 'none') {
      // hide the panel
      hideFloatPanel()
    } else {
      // show the panel
      showFloatPanel()
    }
  })

  document.body.appendChild(button)
}

const showFloatPanel = () => {
  const panel = document.getElementById('ajax-modifier-panel')
  if (panel) {
    panel.style.display = 'block'
    panel.style.opacity = '1'
    panel.style.zIndex = '9999'
  }
}

const hideFloatPanel = () => {
  const panel = document.getElementById('ajax-modifier-panel')
  if (panel) {
    panel.style.display = 'none'
    panel.style.opacity = '0'
    panel.style.zIndex = '-1'
  }
}

const hideFloatPanelButton = () => {
  const button = document.getElementById('ajax-modifier-panel-button')
  if (button) {
    button.style.display = 'none'
  }
}
const showFloatPanelButton = () => {
  const button = document.getElementById('ajax-modifier-panel-button')
  if (button) {
    button.style.display = 'block'
  }
}

const updateFloatPanelContent = () => {
  // filter the same match
  const uniqueMatches = [...new Set(AJAX_MODIFIER_KK_PANEL_DATA?.map(item => item.match))]
  const h2 = document.getElementById('ajax-modifier-panel-title')
  h2.innerHTML = `AJAx Modifier ${uniqueMatches.length}`
  const h3Div = document.getElementById('ajax-modifier-panel-h3')
  h3Div.innerHTML = ''
  uniqueMatches.forEach((item) => {
    const h3 = document.createElement('h3')
    h3.innerHTML = `${item}`
    h3Div.appendChild(h3)
  })
}

const createFloatPanel = () => {
  // if the panel already exists, update data
  let panel = document.getElementById('ajax-modifier-panel')
  if (panel) {
    updateFloatPanelContent()
    return
  }
  panel = document.createElement('div')
  panel.id = 'ajax-modifier-panel'
  panel.style.position = 'fixed'
  panel.style.top = '10px'
  panel.style.left = '10px'
  panel.style.backgroundColor = '#d4a373'
  panel.style.color = 'white'
  panel.style.padding = '10px'
  panel.style.zIndex = '9999'
  panel.style.fontSize = '12px'
  // panel.innerHTML = `[AJAx Modifier] matchedInterface: ${matchedInterface.match}`
  const h2 = document.createElement('h2')
  h2.id = 'ajax-modifier-panel-title'
  h2.innerHTML = `AJAx Modifier ${AJAX_MODIFIER_KK_PANEL_DATA?.length}`
  panel.appendChild(h2)

  // put h3 into a div
  const h3Div = document.createElement('div')
  h3Div.id = 'ajax-modifier-panel-h3'
  // filter the same match
  const uniqueMatches = [...new Set(AJAX_MODIFIER_KK_PANEL_DATA?.map(item => item.match))]
  uniqueMatches.forEach((item) => {
    const h3 = document.createElement('h3')
    h3.innerHTML = `${item.match}`
    // add button to copy the matchedInterface
    const button = document.createElement('button')
    button.innerHTML = 'Copy'
    button.addEventListener('click', () => {
      navigator.clipboard.writeText(item.match)
    })
    h3.appendChild(button)
    h3Div.appendChild(h3)
  })
  panel.appendChild(h3Div)

  document.body.appendChild(panel)
}


window.addEventListener("message", function (event) {

  const data = event.data
  // console.log('data from content_script main.js', data)

  if (data.type === 'ajaxInterceptor' && data.to === 'pageScript') {
    console.log('data', data)
    ajax_interceptor_qoweifjqon.settings[data.key] = data.value


    // compare if ajaxInterceptor_rules includes window.location.host
    console.log(ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules)
    if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules.some(item => item.match.includes(window.location.host))) {
      controlFloatPanelButton()
      createFloatPanel()
    }
  }

  if (ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_switchOn) {
    window.XMLHttpRequest = ajax_interceptor_qoweifjqon.myXHR
    window.fetch = ajax_interceptor_qoweifjqon.myFetch
    showFloatPanelButton()
  } else {
    window.XMLHttpRequest = ajax_interceptor_qoweifjqon.originalXHR
    window.fetch = ajax_interceptor_qoweifjqon.originalFetch
    hideFloatPanelButton()
    hideFloatPanel()
  }
}, false)
