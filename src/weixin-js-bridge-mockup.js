(function () {
var user_agent = navigator.userAgent.toLowerCase()
var is_weixin = -1 != user_agent.indexOf("micromessenger");
var is_android = -1 != user_agent.indexOf("android");
var is_ios = -1 != user_agent.indexOf("iphone") || -1 != user_agent.indexOf("ipad");


var LAZY_INVOKE = {
  'menu:share:appmessage': null,
  'menu:share:timeline': null,
};


var Bridge = {
  invoke: function (api_name, conf, callback) {
    var result = {
      err_code: 'WILL_DELETE',
      err_desc: 'WILL_DELETE',
      err_detail: 'WILL_DELETE',

      err_msg: api_name + ':ok',
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
      if (MOCKUP_RESULT[api_name]) {
        result.resultStr = MOCKUP_RESULT[api_name];
      }
    }

    callback(result);
  },

  on: function (api_name, callback) {
    var MOCKUP_RESULT = window.WEIXIN_JS_BRIDGE_ON || {};

    if (api_name in LAZY_INVOKE) {
      LAZY_INVOKE[api_name] = function () {
        callback({
          err_code: 'WILL_DELETE',
          err_desc: 'WILL_DELETE',
          err_detail: 'WILL_DELETE',

          err_msg: 'ok',

          resultStr: MOCKUP_RESULT[api_name] || '{}'
        });
      };
    } else {
      callback({
        err_code: 'WILL_DELETE',
        err_desc: 'WILL_DELETE',
        err_detail: 'WILL_DELETE',

        err_msg: 'ok',

        resultStr: MOCKUP_RESULT[api_name] || '{}'
      });
    }
  },
};


function lazyInvoke(api) {
  // ** from jweixin
  var API_NAMES = {
      config: "preVerifyJSAPI",
      onMenuShareTimeline: "menu:share:timeline",
      onMenuShareAppMessage: "menu:share:appmessage",
      onMenuShareQQ: "menu:share:qq",
      onMenuShareWeibo: "menu:share:weiboApp",
      onMenuShareQZone: "menu:share:QZone",
      previewImage: "imagePreview",
      getLocation: "geoLocation",
      openProductSpecificView: "openProductViewWithPid",
      addCard: "batchAddCard",
      openCard: "batchViewCard",
      chooseWXPay: "getBrandWCPayRequest"
  };

  var lazy_key = API_NAMES[api];
  var lazy_callback = LAZY_INVOKE[lazy_key];

  if (lazy_callback) {
    lazy_callback();
    LAZY_INVOKE[lazy_key] = null;
  }
};


window.WeixinJSBridge = Bridge;


var share = {};

Object.defineProperty(share, 'moment', {
  get: function () {
    console.debug('分享到朋友圈');
    lazyInvoke('onMenuShareTimeline');
    return null;
  },
});

Object.defineProperty(share, 'chat', {
  get: function () {
    console.debug('分享到聊天');
    lazyInvoke('onMenuShareAppMessage');
    return null;
  },
});



var command = {
  share: share,
};


var head = window.head || {};
head.wechat = command;
window.head = head;
}());
