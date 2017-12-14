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
                    callback();                 
                }, time);
            },
            //事件绑定
            bindEvent:function(){
                $('.reg-button').on('click',function(){
                    var phone = $('.reg-phone').val();
                    $(this).addClass('btn-disable').attr("disabled","true");
                    if(!phone){
                        App.toast("请输入手机号码!",function(){
                            $('.reg-button').removeClass('btn-disable').removeAttr("disabled");
                        });
                        return false;                        
                    }else if(!App.checkPhone(phone)){
                        App.toast("手机号码有误，请重填!",function(){
                            $('.reg-button').removeClass('btn-disable').removeAttr("disabled");
                        });                     
                        return false;
                    }else{
                        window.location.href="success.html";                                   
                    };                    
                })
            }
        }
    }();
    window.onload = function(){
        App.init();
    };
})(window)