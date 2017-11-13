(function() {
    var designWidth = 750,
        rem2px = 100,
        ua = navigator.userAgent,
        ResetEvent = "onorientationchange" in window ? "orientationchange" : "resize";
    var d = window.document.createElement('div');
    var docWidth = document.documentElement.clientWidth;
    var measureWidth = window.innerWidth;
        d.style.width = '1rem';
        d.style.display = 'none';
        var head = window.document.getElementsByTagName('head')[0];
        head.appendChild(d);
        var defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));

        var remSt = document.createElement('style');
        remSt.innerHTML = "html{font-size:" + (measureWidth / (designWidth / rem2px) / defaultFontSize * 100) + "%;}";
        if (!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) && docWidth > 1024) {
            remSt.innerHTML = "html{font-size:625%;margin-right:auto!important;margin-left:auto!important;max-width:750px;}";
        }
        head.appendChild(remSt);
    function resetRemSt() {
        var getWidthFn = setInterval(function() {
            if (window.innerWidth != measureWidth) {
                measureWidth = window.innerWidth
                remSt.innerHTML = "html{font-size:" + (measureWidth / (designWidth / rem2px) / defaultFontSize * 100) + "%;}";
                clearInterval(getWidthFn)
            }
        }, 50)
    }
    // window.addEventListener(ResetEvent, resetRemSt, false);
    window.addEventListener('resize', function() {
        resetRemSt();
    }, false);
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
           resetRemSt();
        }
    }, false);
    resetRemSt();
})()