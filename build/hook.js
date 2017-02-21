if (/MicroMessenger/i.test(window.navigator.userAgent)) {
  const script = document.createElement('script')
  script.src = chrome.extension.getURL('js/wechat-js-bridge-mockup.js');
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
  console.debug('wechat-webview-debug is ready');
}
