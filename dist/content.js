/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*******************************!*\
  !*** ./src/content_script.js ***!
  \*******************************/
// const elt = document.createElement("script")
// elt.innerHTML = "window.test = 1"
// document.head.appendChild(elt)

// 在页面上插入代码
// const s1 = document.createElement('script')
// s1.setAttribute('type', 'text/javascript')
// s1.setAttribute('src', chrome.runtime.getURL('pageScripts/defaultSettings.js'))
// document.documentElement.appendChild(s1)

console.log('content_script.js');
// 在页面上插入代码
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('js/main.js'));
document.documentElement.appendChild(script);
script.addEventListener('load', () => {
  chrome.storage.local.get(['ajaxInterceptor_switchOn', 'ajaxInterceptor_rules'], result => {
    if (result.hasOwnProperty('ajaxInterceptor_switchOn')) {
      postMessage({
        type: 'ajaxInterceptor',
        to: 'pageScript',
        key: 'ajaxInterceptor_switchOn',
        value: result.ajaxInterceptor_switchOn
      });
    }
    if (result.ajaxInterceptor_rules) {
      postMessage({
        type: 'ajaxInterceptor',
        to: 'pageScript',
        key: 'ajaxInterceptor_rules',
        value: result.ajaxInterceptor_rules
      });
    }
  });
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ajaxInterceptor') {
    // Update the Ajax interception rules
    // updateInterceptionRules(message.rules);
    postMessage({
      ...message,
      to: 'pageScript'
    });
  }
});

// Send intercepted requests to the popup
function sendInterceptedRequest(request) {
  chrome.runtime.sendMessage({
    type: 'interceptedRequest',
    request: request
  });
}
chrome.runtime.sendMessage(chrome.runtime.id, {
  type: 'ajaxInterceptor',
  to: 'background',
  contentScriptLoaded: true
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vY29udGVudC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBQSxPQUFPLENBQUNDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQztBQUNoQztBQUNBLE1BQU1DLE1BQU0sR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsUUFBUSxDQUFDO0FBQy9DRixNQUFNLENBQUNHLFlBQVksQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUM7QUFDOUNILE1BQU0sQ0FBQ0csWUFBWSxDQUFDLEtBQUssRUFBRUMsTUFBTSxDQUFDQyxPQUFPLENBQUNDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMvREwsUUFBUSxDQUFDTSxlQUFlLENBQUNDLFdBQVcsQ0FBQ1IsTUFBTSxDQUFDO0FBRTVDQSxNQUFNLENBQUNTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxNQUFNO0VBQ3BDTCxNQUFNLENBQUNNLE9BQU8sQ0FBQ0MsS0FBSyxDQUFDQyxHQUFHLENBQUMsQ0FBQywwQkFBMEIsRUFBRSx1QkFBdUIsQ0FBQyxFQUFHQyxNQUFNLElBQUs7SUFDMUYsSUFBSUEsTUFBTSxDQUFDQyxjQUFjLENBQUMsMEJBQTBCLENBQUMsRUFBRTtNQUNyREMsV0FBVyxDQUFDO1FBQUNDLElBQUksRUFBRSxpQkFBaUI7UUFBRUMsRUFBRSxFQUFFLFlBQVk7UUFBRUMsR0FBRyxFQUFFLDBCQUEwQjtRQUFFQyxLQUFLLEVBQUVOLE1BQU0sQ0FBQ087TUFBd0IsQ0FBQyxDQUFDO0lBQ25JO0lBQ0EsSUFBSVAsTUFBTSxDQUFDUSxxQkFBcUIsRUFBRTtNQUNoQ04sV0FBVyxDQUFDO1FBQUNDLElBQUksRUFBRSxpQkFBaUI7UUFBRUMsRUFBRSxFQUFFLFlBQVk7UUFBRUMsR0FBRyxFQUFFLHVCQUF1QjtRQUFFQyxLQUFLLEVBQUVOLE1BQU0sQ0FBQ1E7TUFBcUIsQ0FBQyxDQUFDO0lBQzdIO0VBQ0YsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDOztBQUVGO0FBQ0FqQixNQUFNLENBQUNDLE9BQU8sQ0FBQ2lCLFNBQVMsQ0FBQ0MsV0FBVyxDQUFDLENBQUNDLE9BQU8sRUFBRUMsTUFBTSxFQUFFQyxZQUFZLEtBQUs7RUFDdEUsSUFBSUYsT0FBTyxDQUFDUixJQUFJLEtBQUssaUJBQWlCLEVBQUU7SUFDdEM7SUFDQTtJQUNBRCxXQUFXLENBQUM7TUFBQyxHQUFHUyxPQUFPO01BQUVQLEVBQUUsRUFBRTtJQUFZLENBQUMsQ0FBQztFQUM3QztBQUNGLENBQUMsQ0FBQzs7QUFFRjtBQUNBLFNBQVNVLHNCQUFzQkEsQ0FBQ0MsT0FBTyxFQUFFO0VBQ3ZDeEIsTUFBTSxDQUFDQyxPQUFPLENBQUN3QixXQUFXLENBQUM7SUFDekJiLElBQUksRUFBRSxvQkFBb0I7SUFDMUJZLE9BQU8sRUFBRUE7RUFDWCxDQUFDLENBQUM7QUFDSjtBQUVBeEIsTUFBTSxDQUFDQyxPQUFPLENBQUN3QixXQUFXLENBQUN6QixNQUFNLENBQUNDLE9BQU8sQ0FBQ3lCLEVBQUUsRUFBRTtFQUFDZCxJQUFJLEVBQUUsaUJBQWlCO0VBQUVDLEVBQUUsRUFBRSxZQUFZO0VBQUVjLG1CQUFtQixFQUFFO0FBQUksQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50X3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb25zdCBlbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpXG4vLyBlbHQuaW5uZXJIVE1MID0gXCJ3aW5kb3cudGVzdCA9IDFcIlxuLy8gZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbHQpXG5cbi8vIOWcqOmhtemdouS4iuaPkuWFpeS7o+eggVxuLy8gY29uc3QgczEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuLy8gczEuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvamF2YXNjcmlwdCcpXG4vLyBzMS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGNocm9tZS5ydW50aW1lLmdldFVSTCgncGFnZVNjcmlwdHMvZGVmYXVsdFNldHRpbmdzLmpzJykpXG4vLyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoczEpXG5cbmNvbnNvbGUubG9nKCdjb250ZW50X3NjcmlwdC5qcycpXG4vLyDlnKjpobXpnaLkuIrmj5LlhaXku6PnoIFcbmNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG5zY3JpcHQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvamF2YXNjcmlwdCcpXG5zY3JpcHQuc2V0QXR0cmlidXRlKCdzcmMnLCBjaHJvbWUucnVudGltZS5nZXRVUkwoJ2pzL21haW4uanMnKSlcbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChzY3JpcHQpXG5cbnNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydhamF4SW50ZXJjZXB0b3Jfc3dpdGNoT24nLCAnYWpheEludGVyY2VwdG9yX3J1bGVzJ10sIChyZXN1bHQpID0+IHtcbiAgICBpZiAocmVzdWx0Lmhhc093blByb3BlcnR5KCdhamF4SW50ZXJjZXB0b3Jfc3dpdGNoT24nKSkge1xuICAgICAgcG9zdE1lc3NhZ2Uoe3R5cGU6ICdhamF4SW50ZXJjZXB0b3InLCB0bzogJ3BhZ2VTY3JpcHQnLCBrZXk6ICdhamF4SW50ZXJjZXB0b3Jfc3dpdGNoT24nLCB2YWx1ZTogcmVzdWx0LmFqYXhJbnRlcmNlcHRvcl9zd2l0Y2hPbn0pXG4gICAgfVxuICAgIGlmIChyZXN1bHQuYWpheEludGVyY2VwdG9yX3J1bGVzKSB7XG4gICAgICBwb3N0TWVzc2FnZSh7dHlwZTogJ2FqYXhJbnRlcmNlcHRvcicsIHRvOiAncGFnZVNjcmlwdCcsIGtleTogJ2FqYXhJbnRlcmNlcHRvcl9ydWxlcycsIHZhbHVlOiByZXN1bHQuYWpheEludGVyY2VwdG9yX3J1bGVzfSlcbiAgICB9XG4gIH0pXG59KVxuXG4vLyBMaXN0ZW4gZm9yIG1lc3NhZ2VzIGZyb20gdGhlIHBvcHVwXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gIGlmIChtZXNzYWdlLnR5cGUgPT09ICdhamF4SW50ZXJjZXB0b3InKSB7XG4gICAgLy8gVXBkYXRlIHRoZSBBamF4IGludGVyY2VwdGlvbiBydWxlc1xuICAgIC8vIHVwZGF0ZUludGVyY2VwdGlvblJ1bGVzKG1lc3NhZ2UucnVsZXMpO1xuICAgIHBvc3RNZXNzYWdlKHsuLi5tZXNzYWdlLCB0bzogJ3BhZ2VTY3JpcHQnfSlcbiAgfVxufSk7XG5cbi8vIFNlbmQgaW50ZXJjZXB0ZWQgcmVxdWVzdHMgdG8gdGhlIHBvcHVwXG5mdW5jdGlvbiBzZW5kSW50ZXJjZXB0ZWRSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgIHR5cGU6ICdpbnRlcmNlcHRlZFJlcXVlc3QnLFxuICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgfSk7XG59XG5cbmNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKGNocm9tZS5ydW50aW1lLmlkLCB7dHlwZTogJ2FqYXhJbnRlcmNlcHRvcicsIHRvOiAnYmFja2dyb3VuZCcsIGNvbnRlbnRTY3JpcHRMb2FkZWQ6IHRydWV9KVxuIl0sIm5hbWVzIjpbImNvbnNvbGUiLCJsb2ciLCJzY3JpcHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJjaHJvbWUiLCJydW50aW1lIiwiZ2V0VVJMIiwiZG9jdW1lbnRFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwic3RvcmFnZSIsImxvY2FsIiwiZ2V0IiwicmVzdWx0IiwiaGFzT3duUHJvcGVydHkiLCJwb3N0TWVzc2FnZSIsInR5cGUiLCJ0byIsImtleSIsInZhbHVlIiwiYWpheEludGVyY2VwdG9yX3N3aXRjaE9uIiwiYWpheEludGVyY2VwdG9yX3J1bGVzIiwib25NZXNzYWdlIiwiYWRkTGlzdGVuZXIiLCJtZXNzYWdlIiwic2VuZGVyIiwic2VuZFJlc3BvbnNlIiwic2VuZEludGVyY2VwdGVkUmVxdWVzdCIsInJlcXVlc3QiLCJzZW5kTWVzc2FnZSIsImlkIiwiY29udGVudFNjcmlwdExvYWRlZCJdLCJzb3VyY2VSb290IjoiIn0=