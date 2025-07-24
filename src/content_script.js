// const elt = document.createElement("script")
// elt.innerHTML = "window.test = 1"
// document.head.appendChild(elt)

// 在页面上插入代码
// const s1 = document.createElement('script')
// s1.setAttribute('type', 'text/javascript')
// s1.setAttribute('src', chrome.runtime.getURL('pageScripts/defaultSettings.js'))
// document.documentElement.appendChild(s1)


const createFloatPanel = () => {
  // if the panel already exists, update data
  let panel = document.getElementById("ajax-modifier-panel");
  console.log("[AJAx Modifier] panel", panel);
  if (panel) {
    updateFloatPanelContent();
    return;
  }
  panel = document.createElement("div");
  panel.id = "ajax-modifier-panel";
  panel.style.position = "fixed";
  panel.style.top = "10px";
  panel.style.left = "10px";
  panel.style.backgroundColor = "#d4a373";
  panel.style.color = "white";
  panel.style.padding = "10px";
  panel.style.zIndex = "9999";
  panel.style.fontSize = "12px";
  // panel.innerHTML = `[AJAx Modifier] matchedInterface: ${matchedInterface.match}`
  const h2 = document.createElement("h2");
  h2.id = "ajax-modifier-panel-title";
  h2.innerHTML = `AJAx Modifier`;
  panel.appendChild(h2);

  // put h3 into a div
  const h3Div = document.createElement("div");
  h3Div.id = "ajax-modifier-panel-h3";
  // filter the same match
  // const uniqueMatches = [
  //   ...new Set(AJAX_MODIFIER_KK_PANEL_DATA?.map((item) => item.match)),
  // ];
  // uniqueMatches.forEach((item) => {
  //   const h3 = document.createElement("h3");
  //   h3.innerHTML = `${item.match}`;
  //   // add button to copy the matchedInterface
  //   const button = document.createElement("button");
  //   button.innerHTML = "Copy";
  //   button.addEventListener("click", () => {
  //     navigator.clipboard.writeText(item.match);
  //   });
  //   h3.appendChild(button);
  //   h3Div.appendChild(h3);
  // });
  panel.appendChild(h3Div);

  document.body.appendChild(panel);
};

const controlFloatPanelButton = () => {
  // create a button to control the float panel
  const button = document.createElement("button");
  button.id = "ajax-modifier-panel-button";
  button.innerHTML = "Ajax KK";
  button.style.position = "fixed";
  button.style.top = "10px";
  button.style.left = "10px";
  button.style.backgroundColor = "#ccd5ae";
  button.style.color = "white";
  //font size
  button.style.fontSize = "12px";
  button.style.padding = "4px 2px";
  //border none
  button.style.border = "none";
  button.style.borderRadius = "5px";
  // shadow
  button.style.boxShadow = "0 0 10px 0 rgba(0, 0, 0, 0.5)";
  // hover
  button.style.cursor = "pointer";
  button.style.zIndex = "9999";
  button.addEventListener("click", () => {
    const panel = document.getElementById("ajax-modifier-panel");
    if (panel && panel.style.display !== "none") {
      // hide the panel

      hideFloatPanel();
    } else {
      // show the panel
      showFloatPanel();
    }
  });

  document.body.appendChild(button);
};

// 在页面上插入代码
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', chrome.runtime.getURL('js/main.js'))
document.documentElement.appendChild(script)

script.addEventListener('load', () => {
  console.log("[AJAx Modifier] script loaded");
  controlFloatPanelButton();
  createFloatPanel();
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
