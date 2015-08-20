(function () {
var user_agent = navigator.userAgent.toLowerCase()
var is_weixin = -1 != user_agent.indexOf("micromessenger");
var is_android = -1 != user_agent.indexOf("android");
var is_ios = -1 != user_agent.indexOf("iphone") || -1 != user_agent.indexOf("ipad");


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
    } else if (api_name == 'scanQRCode' && is_ios) {
      // ** ios 扫码会返回一个很反人类的行为，
      //    微信官方在 js sdk 中通过检查 is_ios 抹平了这个接口的不一致性
      //    因此模拟的时候也要把这个反人类的行为模拟出来
      result.resultStr = JSON.stringify({
        scan_code: {
          scan_result: MOCKUP_RESULT[api_name] || '',
        },
      });
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
}());
