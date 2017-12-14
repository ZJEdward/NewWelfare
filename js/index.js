;
(function (win) {
    //判断是否微信客户端
    var isWeiXin = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    };
    //获取URL参数
    var getUrlparam = function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    };
    var deleteItem = function () {  
        localStorage.removeItem('userinfo');
        // alert("清除缓存成功");
    };

    var App = function(){
        return {
            /**
             * 初始化入口
             * 
             */
            init:function(){
                if(isWeiXin()){
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', App.onBridgeReady(), false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', App.onBridgeReady());
                            document.attachEvent('onWeixinJSBridgeReady', App.onBridgeReady());
                        }
                    } else {
                        App.onBridgeReady();
                    }           
                    App.getStorge();  
                }
                App.bindEvent();
                if(getUrlparam("name")){
                    $('#nickname').html(getUrlparam("name"));
                };
                if(getUrlparam("imgurl")){
                    $('#headImgUrl').attr('src',getUrlparam("imgurl"));
                };
            },
            //判断是否授权过登录
            getStorge:function(){
                if(userdata==null||userdata==""||userdata==undefined){
                    var link = encodeURIComponent('http://192.168.1.170:8888/oauth?fromUrl='+location.href);
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+_APPID+"&redirect_uri="+link+"&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
                }else{
                    App.name = userdata.nickname;
                    App.imgurl = userdata.headImgUrl;       
                }
            },
            onBridgeReady:function() {
                var postData = {};
                var now_url = window.location.href;
                postData.url = now_url;
                $.ajax({
                    url: "/jssdk",
                    type: "get",
                    dataType: "json",
                    data:{
                        url:now_url
                    },
                    success: function(data) {
                        console.log(data);
                        window._APPID = data.appId;
                        wx.config({
                            appId: data.appId,
                            timestamp: data.timestamp,
                            nonceStr: data.nonceStr,
                            signature: data.signature,
                            jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"]
                        }); 
                        wx.ready(function(){
                            //分享配置信息
                            var share_title, share_desc, share_link, share_img;
                                share_title = "新手注册领取福利";
                                share_desc = "邀请好友,新手注册领取福利";
                                share_link = encodeURI("http://192.168.1.170:8888/share?name="+App.name+"&imgurl="+App.imgurl);
                                share_img = "http://192.168.1.170:8888/images/success01.png";
                            wx.onMenuShareAppMessage({
                                title: share_title,
                                desc: share_desc,
                                link: share_link,
                                imgUrl: share_img,
                                type: '',
                                dataUrl: '',
                                success: function() {},
                                cancel: function() {}
                            });
                            wx.onMenuShareTimeline({
                                title: share_title,
                                link: share_link,
                                imgUrl: share_img,
                                success: function() {},
                                cancel: function() {}
                            });
                        });                   
                    },
                    error: function(data) {
                       App.toast("系统连接超时");
                    }
                });
            },
            checkPhone:function(phone){
                var reg = /^((\+86)|(86)|0)?(1[3|4|5|7|8|9])\d{9}$/;                    
                return reg.test(phone); 
            },
            checkReg:function(phone,callback){
                console.log(phone);
                $.ajax({
                    url: "http://192.168.1.17:8011/channel/weChat/userBindFlag",
                    type: "get",
                    dataType: "json",
                    data:{
                        queryType:'S0001',
                        mobile:phone
                    },
                    success: function(data) {
                        callback(data);
                        console.log(data);
                    },
                    error: function(data) {
                       console.log(data);
                    }
                });
            },
            loading:function(callback){
                $('body').loading({
                    loadingWidth:120,
                    title:'请稍等！',
                    name:'loading',
                    discription:'',
                    direction:'column',
                    type:'origin',
                    // originBg:'#71EA71',
                    originDivWidth:40,
                    originDivHeight:40,
                    originWidth:6,
                    originHeight:6,
                    smallLoading:false,
                    loadingMaskBg:'rgba(0,0,0,0.2)'
                });
                setTimeout(function(){
                    removeLoading('loading');
                    callback();
                },1500);
            },
            /**
             * 手机端toast提示
             * @param {String} msg
             * @param {String} time
            */
            toast:function(msg,time){
                var t = time || 1500;
                if($('.util-toast').length >= 1){
                    return false;
                }
                $('body').append('<div class="util-toast">' + msg + '</div>');
                setTimeout(function() {
                    $('.util-toast').remove();
                    $('.fixed-button').removeClass('btn-disable').removeAttr("disabled");
                }, t);
            },
            //事件绑定
            bindEvent:function(){
                $('.fixed-button').on('click',function(){
                    var $phone = $('.phone-input');
                    var phone = $phone.val();
                    $(this).addClass('btn-disable').attr("disabled","true");
                    deleteItem();
                    if(!phone){
                        App.toast("请输入手机号码!");
                        return false;                        
                    }else if(!App.checkPhone(phone)){
                        $phone.val('');
                        App.toast("手机号码有误，请重填!");                     
                        return false;
                    }else{
                        App.checkReg(phone,function(data){
                            if(data.returnCode == 1){
                                $phone.val('');
                                App.toast("该手机号码已注册!");
                                return false; 
                            }else{
                                App.loading(function(){
                                    window.location.href = "main.html?"+window.btoa("phone="+phone+"&inviteCode="); 
                                });                                 
                            }                            
                        });                                                      
                    }                  
                });
            }
        };
    }();
    window.onload = function(){
        App.init();
    };
})(window);