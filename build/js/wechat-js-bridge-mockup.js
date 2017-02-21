(function () {
  var userAgent = navigator.userAgent.toLowerCase()
  var isWeixin = -1 != userAgent.indexOf("micromessenger");
  var isAndroid = -1 != userAgent.indexOf("android");
  var isIOS = -1 != userAgent.indexOf("iphone") || -1 != userAgent.indexOf("ipad");


  var LAZY_INVOKE = {
    'menu:share:appmessage': null,
    'menu:share:timeline': null,
  };


  var Bridge = {
    invoke: function (apiName, conf, callback) {
      var result = {
        err_code: 'WILL_DELETE',
        err_desc: 'WILL_DELETE',
        err_detail: 'WILL_DELETE',

        err_msg: apiName + ':ok',
      };

      var MOCKUP_RESULT = window.WEIXIN_JS_BRIDGE_INVOKE || {};

      if (apiName === 'geoLocation') {
        var mock = MOCKUP_RESULT[apiName] || {};
        for (var k in mock) {
          result[k] = mock[k];
        }
      } else if (apiName == 'scanQRCode' && isIOS) {
        // ** ios 扫码会返回一个很反人类的行为，
        //    微信官方在 js sdk 中通过检查 isIOS 抹平了这个接口的不一致性
        //    因此模拟的时候也要把这个反人类的行为模拟出来
        result.resultStr = JSON.stringify({
          scan_code: {
            scan_result: MOCKUP_RESULT[apiName] || '',
          },
        });
      } else {
        if (MOCKUP_RESULT[apiName]) {
          result.resultStr = MOCKUP_RESULT[apiName];
        }
      }

      callback(result);
    },

    on: function (apiName, callback) {
      var MOCKUP_RESULT = window.WEIXIN_JS_BRIDGE_ON || {};

      if (apiName in LAZY_INVOKE) {
        LAZY_INVOKE[apiName] = function () {
          callback({
            err_code: 'WILL_DELETE',
            err_desc: 'WILL_DELETE',
            err_detail: 'WILL_DELETE',

            err_msg: 'ok',

            resultStr: MOCKUP_RESULT[apiName] || '{}'
          });
        };
      } else {
        callback({
          err_code: 'WILL_DELETE',
          err_desc: 'WILL_DELETE',
          err_detail: 'WILL_DELETE',

          err_msg: 'ok',

          resultStr: MOCKUP_RESULT[apiName] || '{}'
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
      chooseWXPay: "getBrandWCPayRequest",
    };

    var lazyKey = API_NAMES[api];
    var lazyCallback = LAZY_INVOKE[lazyKey];

    if (lazyCallback) {
      lazyCallback();
      LAZY_INVOKE[lazyKey] = null;
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
