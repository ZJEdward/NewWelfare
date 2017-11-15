;
(function (win) {
    var App = function(){
        return {
            /**
             * 初始化入口
             * 
             */
            init:function(){
                window.onload = function(){
                   App.goScrollTop(); 
                }         
            },
            goScrollTop:function(){
                var fixel = $('.footer');
                console.log(fixel,$('.fixed-box'))
                $(window).scroll(function(e){
                    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;                       
                    if (scrollTop > 10) {
                        $('.footer').show(.5);
                    } else {
                        $('.footer').hide(.5);
                    }
                });
            },
            //事件绑定
            bindEvent:function(){

            }
        }
    }();
    window.addEventListener('DOMContentLoaded', App.init(), false);
})(window)