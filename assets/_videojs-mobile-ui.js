/*! @name videojs-mobile-ui @version 0.7.0 @license MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("video.js"),require("global/window")):"function"==typeof define&&define.amd?define(["video.js","global/window"],t):(e="undefined"!=typeof globalThis?globalThis:e||self).videojsMobileUi=t(e.videojs,e.window)}(this,(function(e,t){"use strict";function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var o=n(e),i=n(t);function r(e,t,n){return e(n={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&n.path)}},n.exports),n.exports}var a=r((function(e){function t(n,o){return e.exports=t=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},e.exports.default=e.exports,e.exports.__esModule=!0,t(n,o)}e.exports=t,e.exports.default=e.exports,e.exports.__esModule=!0})),l=r((function(e){e.exports=function(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,a(e,t)},e.exports.default=e.exports,e.exports.__esModule=!0})),s=o.default.getComponent("Component"),u=o.default.dom||o.default,d=function(e){function t(t,n){var o;return(o=e.call(this,t,n)||this).seekSeconds=n.seekSeconds,o.tapTimeout=n.tapTimeout,o.addChild("playToggle",{}),t.on(["playing","userinactive"],(function(e){o.removeClass("show-play-toggle")})),0===o.player_.options_.inactivityTimeout&&(o.player_.options_.inactivityTimeout=5e3),o.enable(),o}l(t,e);var n=t.prototype;return n.createEl=function(){window.overlay_ele=u.createEl("div",{className:"vjs-touch-overlay",tabIndex:-1});return window.overlay_ele;},n.handleTap=function(e){var t=this;e.target===this.el_&&(e.preventDefault(),this.firstTapCaptured?(this.firstTapCaptured=!1,this.timeout&&i.default.clearTimeout(this.timeout),this.handleDoubleTap(e)):(this.firstTapCaptured=!0,this.timeout=i.default.setTimeout((function(){t.firstTapCaptured=!1,t.handleSingleTap(e)}),this.tapTimeout)))},n.handleSingleTap=function(e){this.removeClass("skip"),this.toggleClass("show-play-toggle")},n.handleDoubleTap=function(e){var t=this,n=this.el_.getBoundingClientRect(),o=e.changedTouches[0].clientX-n.left;if(o<.4*n.width)this.player_.currentTime(Math.max(0,this.player_.currentTime()-this.seekSeconds)),this.addClass("reverse");else{if(!(o>n.width-.4*n.width))return;this.player_.currentTime(Math.min(this.player_.duration(),this.player_.currentTime()+this.seekSeconds)),this.removeClass("reverse")}this.removeClass("show-play-toggle"),this.removeClass("skip"),i.default.requestAnimationFrame((function(){t.addClass("skip")}))},n.enable=function(){this.firstTapCaptured=!1,this.on("touchend",this.handleTap)},n.disable=function(){this.off("touchend",this.handleTap)},t}(s);s.registerComponent("TouchOverlay",d);var c={fullscreen:{enterOnRotate:!0,exitOnRotate:!0,lockOnRotate:!0,iOS:!1,disabled:!1},touchControls:{seekSeconds:10,tapTimeout:300,disableOnEnd:!1,disabled:!1}},f=i.default.screen,p=o.default.registerPlugin||o.default.plugin,h=function(e,t){if(e.addClass("vjs-mobile-ui"),t.fullscreen.iOS&&(o.default.log.warn("videojs-mobile-ui: `fullscreen.iOS` is deprecated. Use Video.js option `preferFullWindow` instead."),o.default.browser.IS_IOS&&o.default.browser.IOS_VERSION>9&&!e.el_.ownerDocument.querySelector(".bc-iframe")&&(e.tech_.el_.setAttribute("playsinline","playsinline"),e.tech_.supportsFullScreen=function(){return!1})),!t.touchControls.disabled){var n;(t.touchControls.disableOnEnd||"function"==typeof e.endscreen)&&e.addClass("vjs-mobile-ui-disable-end");var r=o.default.VERSION.split("."),a=parseInt(r[0],10),l=parseInt(r[1],10);n=a<7||7===a&&l<7?Array.prototype.indexOf.call(e.el_.children,e.getChild("ControlBar").el_):e.children_.indexOf(e.getChild("ControlBar")),e.touchOverlay=e.addChild("TouchOverlay",t.touchControls,n)};LongTab(e.touchOverlay.el_);if(!t.fullscreen.disabled){var s=!1,u=function(){var n=function(){if(f){var e=((f.orientation||{}).type||f.mozOrientation||f.msOrientation||"").split("-")[0];if("landscape"===e||"portrait"===e)return e}return"number"==typeof i.default.orientation?0===i.default.orientation||180===i.default.orientation?"portrait":"landscape":"portrait"}();"landscape"===n&&t.fullscreen.enterOnRotate?!1===e.paused()&&(e.requestFullscreen(),t.fullscreen.lockOnRotate&&f.orientation&&f.orientation.lock&&f.orientation.lock("landscape").then((function(){s=!0})).catch((function(e){o.default.log("Browser refused orientation lock:",e)}))):"portrait"===n&&t.fullscreen.exitOnRotate&&!s&&e.isFullscreen()&&e.exitFullscreen()};(t.fullscreen.enterOnRotate||t.fullscreen.exitOnRotate)&&(o.default.browser.IS_IOS?(i.default.addEventListener("orientationchange",u),e.on("dispose",(function(){i.default.removeEventListener("orientationchange",u)}))):f.orientation&&(f.orientation.onchange=u,e.on("dispose",(function(){f.orientation.onchange=null}))),e.on("fullscreenchange",(function(t){!e.isFullscreen()&&s&&(f.orientation.unlock(),s=!1)}))),e.on("ended",(function(e){!0===s&&(f.orientation.unlock(),s=!1)}))}},m=function(e){var t=this;void 0===e&&(e={}),(e.forceForTesting||o.default.browser.IS_ANDROID||o.default.browser.IS_IOS)&&this.ready((function(){change_key_poster();h(t,o.default.mergeOptions(c,e))}))};return p("mobileUi",m),m.VERSION="0.7.0",m}));


//长按倍速播放
function LongTab(overlay_ele){
    const video_ele = overlay_ele.parentElement.getElementsByTagName('video')[0];
    const toast_ele = overlay_ele.parentElement.getElementsByClassName('toast_text')[0];
    let rate=1;
    addLongtabListener(
        overlay_ele,
        function(){rate=video_ele.playbackRate;video_ele.playbackRate=3},/*callback1 */
        function(){video_ele.playbackRate=rate;current_brightness=new_brightness;toast_ele.style.opacity=0;},
        rate_volume
    );

    /*处理代码开始 */
    let origin_time,origin_volume;
    let current_brightness=1,new_brightness;
    let rate_or_volume_or_brightness=0;/*1为rate,2为volume */
    let startX,startY;
    function addLongtabListener(target,callback1,callback2,callback3){/*目标dom，1长按开始回调，2结束回调，3滑动回调 */
        let dom_w,dom_h;
        let timer=0,is_longtab=false;   // 初始化
        target.ontouchstart=(event)=>{
            rate_or_volume_or_brightness=0;
            startX = event.touches[0].pageX;
            startY = event.touches[0].pageY;
            dom_w=target.clientWidth;
            dom_h=target.clientHeight;
            origin_time=video_ele.currentTime;
            origin_volume=video_ele.volume;
            timer=0   // 重置timer
            event.preventDefault(); 
            timer=setTimeout(()=>{is_longtab=true;callback1();timer=0},1000)  // 超时器能成功执行，说明是长按
        }
        target.ontouchmove=(event)=>{
            if (!is_longtab) {
                clearTimeout(timer);    // 如果来到这里，说明是滑动，不执行长按函数
                timer=0;
                let nowX= event.changedTouches[0].pageX;
                let nowY= event.changedTouches[0].pageY;
                let spanX = nowX - startX;/*左正右负 */
                
                let spanY = nowY - startY;/*下正上负*/
                callback3(target , dom_w,nowX,spanX , dom_h,nowY,spanY);
            }
        }
        target.ontouchend=()=>{   // 到这里如果timer有值，说明此触摸时间不足1000ms，是点击
        if(timer){clearTimeout(timer);}
            else{callback2()}
        }
    }

    function rate_volume(overlay_ele, w,nowX,spanX , h,nowY,spanY){
        let nowx_rate=nowX/w , spanx_rate=spanX/w;
        let nowy_rate=nowY/h , spany_rate=spanY/h;
        function change_rate(){
            function durationTrans(a){
                var b = ""
                var h = parseInt(a/3600),
                    m = parseInt(a%3600/60),
                    s = parseInt(a%3600%60);
                if(h>0){
                  h = h<10 ? '0'+h : h
                  b += h+":"
                }
                m = m<10 ? '0'+m : m 
                s = s<10 ? '0'+s : s 
                b+=m+":"+s
                return b;
            }
            rate_or_volume_or_brightness=1;
            let duation=video_ele.duration;
            let newTime=spanx_rate*duation*0.8;
            video_ele.currentTime=origin_time+newTime;
            toast_ele.innerHTML=durationTrans(video_ele.currentTime);
            toast_ele.style.opacity=1;
            overlay_ele.parentElement.getElementsByClassName('vjs-control-bar')[0].getElementsByClassName('vjs-progress-control')[0].getElementsByClassName('vjs-play-progress')[0].style.width = video_ele.currentTime/duation*100+"%";
        }
        function change_volume(){
            function range_volume(num,min=0,max=1){
                if (num>=max) {
                    startY=nowy_rate*h;
                    origin_volume=video_ele.volume;
                    return max;
                }
                else if (num<=min) {
                    startY=nowy_rate*h;
                    origin_volume=video_ele.volume;
                    return min
                }
                else return num.toFixed(2);
            }
            rate_or_volume_or_brightness=2;
            let newVolume=(-spany_rate);
            video_ele.volume=range_volume(origin_volume+newVolume);
            toast_ele.innerHTML="音量: "+parseInt(video_ele.volume*100)+"%";
            toast_ele.style.opacity=1;
        }
        function change_brightness(){
            function range_brightness(num,min=0.5,max=1.1){
                if (num>=max) {
                    startY=nowy_rate*h;
                    /*超出范围后，亮度声音及时生效*/
                    current_brightness=new_brightness;
                    return max;
                }
                else if (num<=min) {
                    startY=nowy_rate*h;
                    current_brightness=new_brightness;
                    return min
                }
                else return num;
            }
            rate_or_volume_or_brightness=3;
            new_brightness=range_brightness(current_brightness-(spany_rate*0.8));
            video_ele.parentElement.style.filter="brightness("+new_brightness+")";
            toast_ele.innerHTML="亮度: "+parseInt(new_brightness*100)+"%";
            toast_ele.style.opacity=1;
        }
        switch(rate_or_volume_or_brightness){
            case 0:
                if (Math.abs(spanx_rate)>0.1) change_rate()
                else if (nowx_rate>0.67 && Math.abs(spany_rate)>0.1) change_volume();
                else if (nowx_rate<0.33 && Math.abs(spany_rate)>0.1) change_brightness();
                break;
            case 1:
                change_rate()
                break;
            case 2:
                change_volume();
                break;
            case 3:
                change_brightness();
                break;
        }
    }
}


function change_key_poster(){
    Array.prototype.slice.call(document.getElementsByTagName("video")).forEach(ele=>{
        (ele.getAttribute("poster") == "/libs/videojs2/key.png") && ele.setAttribute('poster','/libs/videojs2/key_mobile.png');
    })
}