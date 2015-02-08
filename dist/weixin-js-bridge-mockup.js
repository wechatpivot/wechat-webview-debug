var Bridge = {
  invoke: function (api_name, conf, callback) {
    var result = {
      err_code: 'WILL_DELETE',
      err_desc: 'WILL_DELETE',
      err_detail: 'WILL_DELETE',

      err_msg: 'ok',
    };

    var MOCKUP_RESULT = window.WEIXIN_JS_BRIDGE_INVOKE || {};

    if (api_name === 'geoLocation') {
      var mock = MOCKUP_RESULT[api_name] || {};
      for (var k in mock) {
        result[k] = mock[k];
      }
    } else {
      result.resultStr = MOCKUP_RESULT[api_name] || '{}';
    }

    callback(result);
  },

  on: function (api_name, callback) {
    var MOCKUP_RESULT = window.WEIXIN_JS_BRIDGE_ON || {};

    callback({
      err_code: 'WILL_DELETE',
      err_desc: 'WILL_DELETE',
      err_detail: 'WILL_DELETE',

      err_msg: 'ok',

      resultStr: MOCKUP_RESULT[api_name] || '{}'
    });
  }
};


window.WeixinJSBridge = Bridge;
