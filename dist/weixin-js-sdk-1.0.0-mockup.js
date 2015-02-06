function wrap(the_global, initialize) {
  if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(function () {
      return initialize(the_global);
    })
  } else {
    initialize(the_global, true);
  }
}

// a => the_global
// b => initialize
!wrap(this, function(a, b) {
    // ** mapping to `invoke`
    function c(api_name, conf, conf_of_callback) {
        a.WeixinJSBridge ? WeixinJSBridge.invoke(api_name, e(conf), function(result) {
            h(api_name, result, conf_of_callback)
        }) : k(api_name, conf_of_callback)
    }

    // ** mapping to `on`
    function d(api_name, conf_of_callback, fixme_another_conf) {
        if (a.WeixinJSBridge) {
            WeixinJSBridge.on(api_name, function (result) {
                if (fixme_another_conf && fixme_another_conf.trigger) {
                    fixme_another_conf.trigger(result);
                }
                h(api_name, result, conf_of_callback);
            });
        } else {
            if (fixme_another_conf) {
                k(api_name, fixme_another_conf);
            } else {
                k(api_name, conf_of_callback);
            }
        }
    }

    function e (conf) {
        conf = conf || {};

        conf.appId = A.appId;
        conf.verifyAppId = A.appId;
        conf.verifySignType = "sha1";
        conf.verifyTimestamp = A.timestamp + "",
        conf.verifyNonceStr = A.nonceStr,
        conf.verifySignature = A.signature

        return conf
    }

    function f(call_conf, scope) {
        return {
            scope: scope,
            signType: "sha1",
            timeStamp: call_conf.timestamp + "",
            nonceStr: call_conf.nonceStr,
            addrSign: call_conf.addrSign
        }
    }

    function g(a) {
        return {
            timeStamp: a.timestamp + "",
            nonceStr: a.nonceStr,
            "package": a.package,
            paySign: a.paySign,
            signType: a.signType || "SHA1"
        }
    }

    // api_name, result, conf_of_callback
    function h(a, bridge_result, c) {
        delete bridge_result.err_code;
        delete bridge_result.err_desc;
        delete bridge_result.err_detail;

        var d = bridge_result.errMsg
        if (!d) {
            d = bridge_result.err_msg;
            delete bridge_result.err_msg;
            d = i(a, d, c);
            bridge_result.errMsg = d;
        }

        c = c || {};
        if (c._complete) {
            c._complete(bridge_result);
            delete c._complete;
        }

        d = bridge_result.errMsg || "";

        if (A.debug && !c.isInnerInvoke) {
            alert(JSON.stringify(bridge_result));
        }

        var e = d.indexOf(":");
        var f = d.substring(e + 1);

        switch (f) {
            case "ok":
                if (c.success) {
                    c.success(bridge_result);
                }
                break;
            case "cancel":
                c.cancel && c.cancel(bridge_result);
                break;
            default:
                c.fail && c.fail(bridge_result)
        }

        if (c.complete) {
            c.complete(bridge_result)
        }
    }

    function i(api_name, err_msg) {
        var e;

        if (err_msg) {
            var idx = err_msg.indexOf(':');

            switch (api_name) {
                case p.config:
                    e = "config";
                    break;
                case p.openProductSpecificView:
                    e = "openProductSpecificView";
                    break;
                default:
                    e = err_msg.substring(0, idx);
                    e = e.replace(/_/g, " ");
                    // \b  word boundary
                    // http://blog.csdn.net/lxcnn/article/details/4355364
                    // CamelCase
                    // http://en.wikipedia.org/wiki/CamelCase
                    e = e.replace(/\b\w+\b/g, function (a) {
                        return a.substring(0, 1).toUpperCase() + a.substring(1);
                    });
                    e = e.substring(0, 1).toLowerCase() + e.substring(1);
                    e = e.replace(/ /g, "");

                    if (e.indexOf('Wcpay') !== -1) {
                        e = e.replace('Wcpay', 'WCPay');
                    }

                    var f = q[e];
                    if (f) {
                        e = f;
                    }
            }

            var g = err_msg.substring(idx + 1);

            if (g === 'confirm') {
                g = 'ok';
            }

            if (g.indexOf('failed_') !== -1) {
                g = g.substring(7);
            }

            if (g.indexOf('fail_') !== -1) {
                g = g.substring(5);
            }

            g = g.replace(/_/g, " ");
            g = g.toLowerCase();

            if (g === 'access denied' || g === 'no permission to execute') {
                g = 'permission denied';
            }

            if (e === 'config' && g === 'function not exist') {
                g = 'ok';
            }

            err_msg = e + ":" + g
        }

        return err_msg;
    }

    function j(a) {
        var b, c, d, e;
        if (a) {
            for (b = 0, c = a.length; c > b; ++b) d = a[b], e = p[d], e && (a[b] = e);
            return a
        }
    }

    function k(a, b) {
        if (A.debug && !b.isInnerInvoke) {
            var c = q[a];
            c && (a = c), b && b._complete && delete b._complete, console.log('"' + a + '",', b || "")
        }
    }

    function l() {
        if (!("6.0.2" > x || z.systemType < 0)) {
            var b = new Image;
            z.appId = A.appId, z.initTime = y.initEndTime - y.initStartTime, z.preVerifyTime = y.preVerifyEndTime - y.preVerifyStartTime, D.getNetworkType({
                isInnerInvoke: !0,
                success: function(a) {
                    z.networkType = a.networkType;
                    var c = "https://open.weixin.qq.com/sdk/report?v=" + z.version + "&o=" + z.isPreVerifyOk + "&s=" + z.systemType + "&c=" + z.clientVersion + "&a=" + z.appId + "&n=" + z.networkType + "&i=" + z.initTime + "&p=" + z.preVerifyTime + "&u=" + z.url;
                    b.src = c
                }
            })
        }
    }

    function m() {
        return (new Date).getTime()
    }

    function n(b) {
        u && (a.WeixinJSBridge ? b() : r.addEventListener && r.addEventListener("WeixinJSBridgeReady", b, !1))
    }

    function o() {
        D.invoke || (D.invoke = function(b, c, d) {
            a.WeixinJSBridge && WeixinJSBridge.invoke(b, e(c), d)
        }, D.on = function(b, c) {
            a.WeixinJSBridge && WeixinJSBridge.on(b, c)
        })
    }
    var p, q, r, s, t, u, v, w, x, y, z, A, B, C, D;
    if (!a.jWeixin) return p = {
        config: "preVerifyJSAPI",
        onMenuShareTimeline: "menu:share:timeline",
        onMenuShareAppMessage: "menu:share:appmessage",
        onMenuShareQQ: "menu:share:qq",
        onMenuShareWeibo: "menu:share:weiboApp",
        previewImage: "imagePreview",
        getLocation: "geoLocation",
        openProductSpecificView: "openProductViewWithPid",
        addCard: "batchAddCard",
        openCard: "batchViewCard",
        chooseWXPay: "getBrandWCPayRequest"
    }, q = function() {
        var b, a = {};
        for (b in p) a[p[b]] = b;
        return a
    }(), r = a.document, s = r.title, t = navigator.userAgent.toLowerCase(), u = -1 != t.indexOf("micromessenger"), v = -1 != t.indexOf("android"), w = -1 != t.indexOf("iphone") || -1 != t.indexOf("ipad"), x = function() {
        var a = t.match(/micromessenger\/(\d+\.\d+\.\d+)/) || t.match(/micromessenger\/(\d+\.\d+)/);
        return a ? a[1] : ""
    }(), y = {
        initStartTime: m(),
        initEndTime: 0,
        preVerifyStartTime: 0,
        preVerifyEndTime: 0
    }, z = {
        version: 1,
        appId: "",
        initTime: 0,
        preVerifyTime: 0,
        networkType: "",
        isPreVerifyOk: 1,
        systemType: w ? 1 : v ? 2 : -1,
        clientVersion: x,
        url: encodeURIComponent(location.href)
    }, A = {}, B = {
        _completes: []
    }, C = {
        state: 0,
        res: {}
    }, n(function() {
        y.initEndTime = m()
    }), D = {
        config: function (a) {
            // A = a, k("config", a), n(function() {
            //     c(p.config, {
            //         verifyJsApiList: j(A.jsApiList)
            //     }, function() {
            //         B._complete = function(a) {
            //             y.preVerifyEndTime = m(), C.state = 1, C.res = a
            //         },
            //         B.success = function() {
            //             z.isPreVerifyOk = 0
            //         },
            //         B.fail = function(a) {
            //             B._fail ? B._fail(a) : C.state = -1
            //         };
            //         var a = B._completes;
            //         return a.push(function() {
            //             A.debug || l()
            //         }), B.complete = function(b) {
            //             for (var c = 0, d = a.length; d > c; ++c) a[c](b);
            //             B._completes = []
            //         }, B
            //     }()), y.preVerifyStartTime = m()
            // }), A.beta && o()

            // ** mockup
            // pass
        },

        ready: function (callback) {
            // 0 != C.state ? callback() : (B._completes.push(callback), !u && A.debug && callback())

            // ** mockup
            setTimeout(function () {
                callback({
                    errMsg: 'config:ok'
                });
            }, 2000);
        },
        error: function(a) {
            "6.0.2" > x || (-1 == C.state ? a(C.res) : B._fail = a)
        },
        checkJsApi: function(a) {
            var b = function(a) {
                var c, d, b = a.checkResult;
                for (c in b) d = q[c], d && (b[d] = b[c], delete b[c]);
                return a
            };
            c("checkJsApi", {
                jsApiList: j(a.jsApiList)
            }, function() {
                return a._complete = function(a) {
                    if (v) {
                        var c = a.checkResult;
                        c && (a.checkResult = JSON.parse(c))
                    }
                    a = b(a)
                }, a
            }())
        },
        onMenuShareTimeline: function(conf) {
            d(p.onMenuShareTimeline, {
                complete: function() {
                    c("shareTimeline", {
                        title: conf.title || s,  // ** document.title
                        desc: conf.title || s,
                        img_url: conf.imgUrl,
                        link: conf.link || location.href
                    }, conf)
                }
            }, conf)
        },
        onMenuShareAppMessage: function(conf) {
            d(p.onMenuShareAppMessage, {
                complete: function() {
                    c("sendAppMessage", {
                        title: conf.title || s,
                        desc: conf.desc || "",
                        link: conf.link || location.href,
                        img_url: conf.imgUrl,
                        type: conf.type || "link",
                        data_url: conf.dataUrl || ""
                    }, conf)
                }
            }, conf)
        },
        onMenuShareQQ: function(conf) {
            d(p.onMenuShareQQ, {
                complete: function() {
                    c("shareQQ", {
                        title: conf.title || s,
                        desc: conf.desc || "",
                        img_url: conf.imgUrl,
                        link: conf.link || location.href
                    }, conf)
                }
            }, conf)
        },
        onMenuShareWeibo: function(conf) {
            d(p.onMenuShareWeibo, {
                complete: function() {
                    c("shareWeiboApp", {
                        title: conf.title || s,
                        desc: conf.desc || "",
                        img_url: conf.imgUrl,
                        link: conf.link || location.href
                    }, conf)
                }
            }, conf)
        },
        startRecord: function(a) {
            c("startRecord", {}, a)
        },
        stopRecord: function(a) {
            c("stopRecord", {}, a)
        },
        onVoiceRecordEnd: function(a) {
            d("onVoiceRecordEnd", a)
        },
        playVoice: function(a) {
            c("playVoice", {
                localId: a.localId
            }, a)
        },
        pauseVoice: function(a) {
            c("pauseVoice", {
                localId: a.localId
            }, a)
        },
        stopVoice: function(a) {
            c("stopVoice", {
                localId: a.localId
            }, a)
        },
        onVoicePlayEnd: function(a) {
            d("onVoicePlayEnd", a)
        },
        uploadVoice: function(a) {
            c("uploadVoice", {
                localId: a.localId,
                isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1
            }, a)
        },
        downloadVoice: function(a) {
            c("downloadVoice", {
                serverId: a.serverId,
                isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1
            }, a)
        },
        translateVoice: function(a) {
            c("translateVoice", {
                localId: a.localId,
                isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1
            }, a)
        },
        chooseImage: function(a) {
            c("chooseImage", {
                scene: "1|2"
            }, function() {
                return a._complete = function(a) {
                    if (v) {
                        var b = a.localIds;
                        b && (a.localIds = JSON.parse(b))
                    }
                }, a
            }())
        },
        previewImage: function(a) {
            c(p.previewImage, {
                current: a.current,
                urls: a.urls
            }, a)
        },
        uploadImage: function(a) {
            c("uploadImage", {
                localId: a.localId,
                isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1
            }, a)
        },
        downloadImage: function(a) {
            c("downloadImage", {
                serverId: a.serverId,
                isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1
            }, a)
        },
        getNetworkType: function(a) {
            var b = function(a) {
                var c, d, e, b = a.errMsg;
                if (a.errMsg = "getNetworkType:ok", c = a.subtype, delete a.subtype, c) a.networkType = c;
                else switch (d = b.indexOf(":"), e = b.substring(d + 1)) {
                    case "wifi":
                    case "edge":
                    case "wwan":
                        a.networkType = e;
                        break;
                    default:
                        a.errMsg = "getNetworkType:fail"
                }
                return a
            };
            c("getNetworkType", {}, function() {
                return a._complete = function(a) {
                    a = b(a)
                }, a
            }())
        },
        openLocation: function (call_conf) {
            c("openLocation", {
                latitude: call_conf.latitude,
                longitude: call_conf.longitude,
                name: call_conf.name || "",
                address: call_conf.address || "",
                scale: call_conf.scale || 28,
                infoUrl: call_conf.infoUrl || ""
            }, call_conf)

            // ** mockup
            alert('MOCKUP: 将用微信内置地图打开');
        },
        getLocation: function (conf) {
            c(p.getLocation,
                function () {
                    var b = f(conf, "jsapi_location");
                    // http://en.wikipedia.org/wiki/World_Geodetic_System#A_new_World_Geodetic_System:_WGS_84
                    b.type = "wgs84";
                    return b;
                }(),
                function () {
                    conf._complete = function (a) {
                        delete a.type
                    };
                    return conf;
                }());
        },
        hideOptionMenu: function(a) {
            c("hideOptionMenu", {}, a)
        },
        showOptionMenu: function(a) {
            c("showOptionMenu", {}, a)
        },
        closeWindow: function(a) {
            c("closeWindow", {
                immediate_close: a && a.immediateClose || 0
            }, a)
        },
        hideMenuItems: function(a) {
            c("hideMenuItems", {
                menuList: a.menuList
            }, a)
        },
        showMenuItems: function(a) {
            c("showMenuItems", {
                menuList: a.menuList
            }, a)
        },
        hideAllNonBaseMenuItem: function(a) {
            c("hideAllNonBaseMenuItem", {}, a)
        },
        showAllNonBaseMenuItem: function(a) {
            c("showAllNonBaseMenuItem", {}, a)
        },

        scanQRCode: function(conf) {
            c("scanQRCode", {
                desc: conf.desc,
                needResult: conf.needResult || 0,
                scanType: conf.scanType || ["qrCode", "barCode"]
            }, conf)
        },

        openProductSpecificView: function(a) {
            c(p.openProductSpecificView, {
                pid: a.productId,
                view_type: a.viewType || 0
            }, a)
        },
        addCard: function(a) {
            var e, f, g, h, b = a.cardList,
                d = [];
            for (e = 0, f = b.length; f > e; ++e) g = b[e], h = {
                card_id: g.cardId,
                card_ext: g.cardExt
            }, d.push(h);
            c(p.addCard, {
                card_list: d
            }, function() {
                return a._complete = function(a) {
                    var c, d, e, b = a.card_list;
                    if (b) {
                        for (b = JSON.parse(b), c = 0, d = b.length; d > c; ++c) e = b[c], e.cardId = e.card_id, e.cardExt = e.card_ext, e.isSuccess = e.is_succ ? !0 : !1, delete e.card_id, delete e.card_ext, delete e.is_succ;
                        a.cardList = b, delete a.card_list
                    }
                }, a
            }())
        },
        chooseCard: function(a) {
            c("chooseCard", {
                app_id: A.appId,
                location_id: a.shopId || "",
                sign_type: a.signType || "SHA1",
                card_id: a.cardId || "",
                card_type: a.cardType || "",
                card_sign: a.cardSign,
                time_stamp: a.timestamp + "",
                nonce_str: a.nonceStr
            }, function() {
                return a._complete = function(a) {
                    a.cardList = a.choose_card_info, delete a.choose_card_info
                }, a
            }())
        },
        openCard: function(a) {
            var e, f, g, h, b = a.cardList,
                d = [];
            for (e = 0, f = b.length; f > e; ++e) g = b[e], h = {
                card_id: g.cardId,
                code: g.code
            }, d.push(h);
            c(p.openCard, {
                card_list: d
            }, a)
        },
        chooseWXPay: function(a) {
            c(p.chooseWXPay, g(a), a)
        }
    }, b && (a.wx = a.jWeixin = D), D
});