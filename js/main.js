;
(function (win) {
    //获取URL参数
    var getUrlparam = function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.atob(window.location.search.substr(1)).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }
    var App = function(){
        var phone = getUrlparam("phone");
        var invitation_code = getUrlparam("invitation_code");
        return {
            /**
             * 初始化入口
             * 
             */
            init:function(){
                if(phone){
                    $('.reg-phone').val(phone);
                }            
                App.bindEvent();        
            },
            checkPhone:function(phone){
                var reg = /^((\+86)|(86)|0)?(1[3|4|5|7|8|9])\d{9}$/;                     
                return reg.test(phone); 
            },
            /**
             * 手机端toast提示
             * @param {String} msg
             * @param {String} time
            */
            toast:function(msg,callback,time){
                var time = time || 2000;
                if($('.util-toast').length >= 1){
                    return false;
                }
                $('body').append('<div class="util-toast">' + msg + '</div>');
                setTimeout(function() {
                    $('.util-toast').remove();
                    $('.reg-button').removeClass('btn-disable').removeAttr("disabled");
                    if(callback) {callback()};                 
                }, time);
            },
            //事件绑定
            bindEvent:function(){
                $('.reg-button').on('click',function(){
                    var phone = $('.reg-phone').val();
                    var smsCode = $('.reg-code').val();
                    var password = $('.reg-psw').val();
                    $(this).addClass('btn-disable').attr("disabled","true");
                    if(!phone){
                        App.toast("请输入手机号码!");
                        return false;                        
                    }else if(!App.checkPhone(phone)){
                        App.toast("手机号码有误，请重填!");                     
                        return false;
                    }else if(!smsCode){
                        App.toast("请输入手机验证码!");
                        return false; 
                    }else{
                        $.ajax({
                            url:'http://192.168.1.17:8011/channel/weChat/userReg',
                            type: "get",
                            dataType: "json",
                            data:{
                                mobile:phone,
                                weChatCode:'',
                                password: password,
                                regType:'A0001',
                                smsCode:smsCode,
                                invitation_code:invitation_code,
                                reg_ip:returnCitySN["cip"]
                            },
                            success: function(data) {
                                console.log(data)
                                if(data.returnCode == 1){
                                    App.toast(data.returnMsg,function(){
                                        window.location.href="success.html";
                                    });  
                                }else{
                                   App.toast(data.returnMsg); 
                                }                               
                            },
                            error: function(data) {
                               console.log(data);
                            }
                        });                                                  
                    };                                     
                });
                $('.code-button').on('click',function(){
                    var mobile = $('.reg-phone').val();
                    var $this = $(".code-button");
                    var s = 120; 
                    $(this).addClass('btn-disable').attr("disabled","true");
                    if(!mobile){
                        App.toast("请输入手机号码!",function(){
                            $this.removeClass('btn-disable').removeAttr("disabled");
                        });
                        return false;  
                    }else if(!App.checkPhone(mobile)){
                        App.toast("手机号码有误，请重填!",function(){
                            $this.removeClass('btn-disable').removeAttr("disabled");
                        });                     
                        return false;
                    }else{
                        $.post("http://192.168.1.240:8080/message/sendText", {
                            mobile: mobile,
                            action: "regist"
                        }, function(data) {
                            console.log(data,1)
                            if (data.result == 1) {
                                $this.html("等待<b>60</b>秒");
                                var ping = window.setInterval(function() {
                                    var s = parseInt($(".code-button b").html());
                                    if (s == 0) {
                                        $this.html("重发验证码");
                                        $this.removeClass('btn-disable').removeAttr("disabled");
                                        clearInterval(ping);
                                        return false;
                                    } else {
                                        $(".code-button b").html(s - 1);
                                    }
                                }, 1000);
                            } else {
                                App.toast("发送验证码失败！");
                            }
                        });
                    }         
                })
            }
        }
    }();
    window.onload = function(){
        App.init();
    };
})(window)