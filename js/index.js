;
(function (win) {
    var App = function(){
        return {
            /**
             * 初始化入口
             * 
             */
            init:function(){
                var url = location.href;
                $.ajax({
                    type: "get",
                    url: "http://192.168.1.170/NewWelfare/token/jssdk.php?url=" + url,
                    dataType: "jsonp",
                    success: function(data) {
                        // console.log(data);
                        window._APPID = data.appId;
                        wx.config({
                            appId: data.appId,
                            timestamp: data.timestamp,
                            nonceStr: data.nonceStr,
                            signature: data.signature,
                            jsApiList: [
                                "onMenuShareTimeline",
                                "onMenuShareAppMessage"
                            ]
                        });                        
                        window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+_APPID+"&redirect_uri=http://h5.yunplus.com.cn/test/NewWelfare/oauth.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
                    },
                    error: function(data) {
                        alert("连接失败！");
                    }
                });
                window.onload = function(){                
                   App.bindEvent(); 
                }         
            },
            checkPhone:function(phone){
                var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;                    
                return reg.test(phone); 
            },
            /**
             * 手机端toast提示
             * @param {String} msg
             * @param {String} time
            */
            toast:function(msg,time){
                var time = time || 2000;
                if($('.util-toast').length >= 1){
                    return false;
                }
                $('body').append('<div class="util-toast">' + msg + '</div>');
                setTimeout(function() {
                    $('.util-toast').remove();
                    $('.fixed-button').removeClass('btn-disable').removeAttr("disabled");
                }, time);
            },
            //事件绑定
            bindEvent:function(){
                $('.fixed-button').on('click',function(){
                    var phone = $('.phone-input').val();
                    $(this).addClass('btn-disable').attr("disabled","true");
                    if(!phone){
                        App.toast("请输入手机号码!");
                        return false;                        
                    }else if(!App.checkPhone(phone)){
                        App.toast("手机号码有误，请重填!");                     
                        return false;
                    }else{
                        window.location.href="main.html";                                   
                    };                    
                })
            }
        }
    }();
    window.addEventListener('DOMContentLoaded', App.init(), false);
})(window)