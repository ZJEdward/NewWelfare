;
(function (win) {
    var App = function(){
        return {
            /**
             * 初始化入口
             * 
             */
            init:function(){
                console.log("111")
                this.bindEvent();
            },
            //事件绑定
            bindEvent:function(){

            }
    }();
    window.addEventListener('DOMContentLoaded', App.init(), false);
}(window))