var Bridge = {
  invoke: function (api_name, conf, callback) {
    callback({
      err_code: 'WILL_DELETE',
      err_desc: 'WILL_DELETE',
      err_detail: 'WILL_DELETE',

      err_msg: 'ok',

      resultStr: window.WEIXIN_JS_BRIDGE_INVOKE[api_name] || '{}'
    });
  }
};


window.WeixinJSBridge = Bridge;
