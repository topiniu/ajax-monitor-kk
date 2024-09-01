// const elt = document.createElement("script")
// elt.innerHTML = "window.test = 1"
// document.head.appendChild(elt)

// 在页面上插入代码
// const s1 = document.createElement('script')
// s1.setAttribute('type', 'text/javascript')
// s1.setAttribute('src', chrome.runtime.getURL('pageScripts/defaultSettings.js'))
// document.documentElement.appendChild(s1)

console.log('content_script.js')
// 在页面上插入代码
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', chrome.runtime.getURL('js/main.js'))
document.documentElement.appendChild(script)

script.addEventListener('load', () => {
  chrome.storage.local.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules'], (result) => {
    if (result.hasOwnProperty('ajaxInterceptor_switchOn')) {
      postMessage({type: 'ajaxInterceptor', to: 'pageScript', key: 'ajaxInterceptor_switchOn', value: result.ajaxInterceptor_switchOn})
    }
    if (result.ajaxInterceptor_rules) {
      postMessage({type: 'ajaxInterceptor', to: 'pageScript', key: 'ajaxInterceptor_rules', value: result.ajaxInterceptor_rules})
    }
  })
})

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ajaxInterceptor') {
    // Update the Ajax interception rules
    // updateInterceptionRules(message.rules);
    postMessage({...message, to: 'pageScript'})
  }
});

// Send intercepted requests to the popup
function sendInterceptedRequest(request) {
  chrome.runtime.sendMessage({
    type: 'interceptedRequest',
    request: request
  });
}

chrome.runtime.sendMessage(chrome.runtime.id, {type: 'ajaxInterceptor', to: 'background', contentScriptLoaded: true})
