/*! @name videojs-mobile-ui @version 1.1.1 @license MIT */
/* 有更改 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.videojsMobileUi = factory(global.videojs));
})(this, (function (videojs) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var videojs__default = /*#__PURE__*/_interopDefaultLegacy(videojs);

  var version = "1.1.1";

  /**
   * @file touchOverlay.js
   * Touch UI component
   */
  const Component = videojs__default["default"].getComponent('Component');
  const dom = videojs__default["default"].dom || videojs__default["default"];

  /**
   * The `TouchOverlay` is an overlay to capture tap events.
   *
   * @extends Component
   */
  class TouchOverlay extends Component {
    /**
    * Creates an instance of the this class.
    *
    * @param  {Player} player
    *         The `Player` that this class should be attached to.
    *
    * @param  {Object} [options]
    *         The key/value store of player options.
    */
    constructor(player, options) {
      super(player, options);
      this.seekSeconds = options.seekSeconds;
      this.tapTimeout = options.tapTimeout;
      this.taps = 0;

      // Add play toggle overlay
      this.addChild('playToggle', {});

      // Clear overlay when playback starts or with control fade
      player.on(['playing', 'userinactive'], e => {
        this.removeClass('show-play-toggle');
      });

      // A 0 inactivity timeout won't work here
      if (this.player_.options_.inactivityTimeout === 0) {
        this.player_.options_.inactivityTimeout = 5000;
      }

      /**
       * Debounced tap handler.
       * Seeks number of (taps - 1) * configured seconds to skip.
       * One tap is a non-op
       *
       * @param {Event} event
       */
      this.handleTaps_ = videojs__default["default"].fn.debounce(event => {
        const increment = (this.taps - 1) * this.seekSeconds;
        this.taps = 0;
        if (increment < 1) {
          return;
        }
        const rect = this.el_.getBoundingClientRect();
        const x = event.changedTouches[0].clientX - rect.left;

        // Check if double tap is in left or right area
        if (x < rect.width * 0.4) {
          this.player_.currentTime(Math.max(0, this.player_.currentTime() - increment));
          this.addClass('reverse');
        } else if (x > rect.width - rect.width * 0.4) {
          this.player_.currentTime(Math.min(this.player_.duration(), this.player_.currentTime() + increment));
          this.removeClass('reverse');
        } else {
          return;
        }

        // Remove play toggle if showing
        this.removeClass('show-play-toggle');

        // Remove and readd class to trigger animation
        this.setAttribute('data-skip-text', `${increment} ${this.localize('seconds')}`);
        this.removeClass('skip');
        window.requestAnimationFrame(() => {
          this.addClass('skip');
        });
      }, this.tapTimeout);
      this.enable();
    }

    /**
     * Builds the DOM element.
     *
     * @return {Element}
     *         The DOM element.
     */
    createEl() {
      const el = dom.createEl('div', {
        className: 'vjs-touch-overlay',
        // Touch overlay is not tabbable.
        tabIndex: -1
      });
      return el;
    }

    /**
    * Debounces to either handle a delayed single tap, or a double tap
     *
     * @param {Event} event
     *        The touch event
     *
     */
    handleTap(event) {
      // Don't handle taps on the play button
      if (event.target !== this.el_) {
        return;
      }
      event.preventDefault();
      this.taps += 1;
      if (this.taps === 1) {
        this.removeClass('skip');
        if (this.player_.userActive()){
          this.player_.userActive(false);
          this.removeClass('show-play-toggle');
        } else {
          this.player_.userActive(true);
          this.addClass('show-play-toggle');
        }
        //this.toggleClass('show-play-toggle');
        //if(!this.player_.tech_.el_.paused) this.player_.userActive(!this.player_.userActive());
      }
      this.handleTaps_(event);
    }

    /**
     * Enables touch handler
     */
    enable() {
      this.firstTapCaptured = false;
      this.on('touchend', this.handleTap);
    }

    /**
     * Disables touch handler
     */
    disable() {
      this.off('touchend', this.handleTap);
    }
  }
  Component.registerComponent('TouchOverlay', TouchOverlay);

  // Default options for the plugin.
  const defaults = {
    fullscreen: {
      enterOnRotate: true,
      exitOnRotate: true,
      lockOnRotate: true,
      lockToLandscapeOnEnter: false,
      disabled: false
    },
    touchControls: {
      seekSeconds: 10,
      tapTimeout: 300,
      disableOnEnd: false,
      disabled: false
    }
  };
  const screen = window.screen;

  /**
   * Gets 'portrait' or 'lanscape' from the two orientation APIs
   *
   * @return {string} orientation
   */
  const getOrientation = () => {
    if (screen) {
      // Prefer the string over angle, as 0° can be landscape on some tablets
      const orientationString = ((screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation || '').split('-')[0];
      if (orientationString === 'landscape' || orientationString === 'portrait') {
        return orientationString;
      }
    }

    // iOS only supports window.orientation
    if (typeof window.orientation === 'number') {
      if (window.orientation === 0 || window.orientation === 180) {
        return 'portrait';
      }
      return 'landscape';
    }
    return 'portrait';
  };

  /**
   * Add UI and event listeners
   *
   * @function onPlayerReady
   * @param    {Player} player
   *           A Video.js player object.
   *
   * @param    {Object} [options={}]
   *           A plain object containing options for the plugin.
   */
  const onPlayerReady = (player, options) => {
    player.addClass('vjs-mobile-ui');
    if (!options.touchControls.disabled) {
      if (options.touchControls.disableOnEnd || typeof player.endscreen === 'function') {
        player.addClass('vjs-mobile-ui-disable-end');
      }

      // Insert before the control bar
      const controlBarIdx = player.children_.indexOf(player.getChild('ControlBar'));
      player.touchOverlay = player.addChild('TouchOverlay', options.touchControls, controlBarIdx);
    }
    LongTab(player);
    if (options.fullscreen.disabled) {
      return;
    }
    let locked = false;
    const rotationHandler = () => {
      const currentOrientation = getOrientation();
      if (currentOrientation === 'landscape' && options.fullscreen.enterOnRotate) {
        if (player.paused() === false) {
          player.requestFullscreen();
          if ((options.fullscreen.lockOnRotate || options.fullscreen.lockToLandscapeOnEnter) && screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').then(() => {
              locked = true;
            }).catch(e => {
              videojs__default["default"].log('Browser refused orientation lock:', e);
            });
          }
        }
      } else if (currentOrientation === 'portrait' && options.fullscreen.exitOnRotate && !locked) {
        if (player.isFullscreen()) {
          player.exitFullscreen();
        }
      }
    };
    if (options.fullscreen.enterOnRotate || options.fullscreen.exitOnRotate) {
      if (videojs__default["default"].browser.IS_IOS) {
        window.addEventListener('orientationchange', rotationHandler);
        player.on('dispose', () => {
          window.removeEventListener('orientationchange', rotationHandler);
        });
      } else if (screen.orientation) {
        // addEventListener('orientationchange') is not a user interaction on Android
        screen.orientation.onchange = rotationHandler;
        player.on('dispose', () => {
          screen.orientation.onchange = null;
        });
      }
    }
    player.on('fullscreenchange', _ => {
      if (player.isFullscreen() && options.fullscreen.lockToLandscapeOnEnter && getOrientation() === 'portrait') {
        screen.orientation.lock('landscape').then(() => {
          locked = true;
        }).catch(e => {
          videojs__default["default"].log('Browser refused orientation lock:', e);
        });
      } else if (!player.isFullscreen() && locked) {
        screen.orientation.unlock();
        locked = false;
      }
    });
    player.on('ended', _ => {
      if (locked === true) {
        screen.orientation.unlock();
        locked = false;
      }
    });
  };

  /**
   * A video.js plugin.
   *
   * Adds a monile UI for player control, and fullscreen orientation control
   *
   * @function mobileUi
   * @param    {Object} [options={}]
   *           Plugin options.
   * @param    {boolean} [options.forceForTesting=false]
   *           Enables the display regardless of user agent, for testing purposes
   * @param    {Object} [options.fullscreen={}]
   *           Fullscreen options.
   * @param    {boolean} [options.fullscreen.disabled=false]
   *           If true no fullscreen handling except the *deprecated* iOS fullwindow hack
   * @param    {boolean} [options.fullscreen.enterOnRotate=true]
   *           Whether to go fullscreen when rotating to landscape
   * @param    {boolean} [options.fullscreen.exitOnRotate=true]
   *           Whether to leave fullscreen when rotating to portrait (if not locked)
   * @param    {boolean} [options.fullscreen.lockOnRotate=true]
   *           Whether to lock orientation when rotating to landscape
   *           Unlocked when exiting fullscreen or on 'ended
   * @param    {boolean} [options.fullscreen.lockToLandscapeOnEnter=false]
   *           Whether to always lock orientation to landscape on fullscreen mode
   *           Unlocked when exiting fullscreen or on 'ended'
   * @param    {Object} [options.touchControls={}]
   *           Touch UI options.
   * @param    {boolean} [options.touchControls.disabled=false]
   *           If true no touch controls are added.
   * @param    {int} [options.touchControls.seekSeconds=10]
   *           Number of seconds to seek on double-tap
   * @param    {int} [options.touchControls.tapTimeout=300]
   *           Interval in ms to be considered a doubletap
   * @param    {boolean} [options.touchControls.disableOnEnd=false]
   *           Whether to disable when the video ends (e.g., if there is an endscreen)
   *           Never shows if the endscreen plugin is present
   */
  const mobileUi = function (options = {}) {
    if (options.forceForTesting || videojs__default["default"].browser.IS_ANDROID || videojs__default["default"].browser.IS_IOS) {
      this.ready(() => {
        change_key_poster();
        onPlayerReady(this, videojs__default["default"].obj.merge(defaults, options));
      });
    }
  };

  // Register the plugin with video.js.
  videojs__default["default"].registerPlugin('mobileUi', mobileUi);

  // Include the version number.
  mobileUi.VERSION = version;

  return mobileUi;

}));


//长按倍速播放
function LongTab(player){
  const overlay_ele=player.touchOverlay.el_;
  if(!video_toast) {window.video_toast=function(){return};console.warn("Cannot find function video_toast. Please include <code>mytoast.js</code> in your html.")}
  const video_ele = overlay_ele.parentElement.getElementsByTagName('video')[0];
  const toast_ele = overlay_ele.parentElement.getElementsByClassName('toast_text')[0];
  let origin_rate=1;
  /*处理代码开始 */
  let origin_time,origin_volume;
  let current_brightness=1,origin_brightness=1;
  let rate_duration_volume_brightness=0;/*1为speed, 2为duration, 3为volume, 4为brightness */
  let startX,startY;
  
  addTabListener(
      overlay_ele,
      function(){ //callback1
          if(player.tech_.el_.paused) return;
          rate_duration_volume_brightness=1;
          origin_rate=video_ele.playbackRate;
          video_ele.playbackRate=origin_rate<=1.25?2:3;
          video_toast(toast_ele , video_ele.playbackRate+"x" , 0);
          overlay_ele.classList.remove('show-play-toggle');
          player.is_longtabing_=true;
          player.userActive(false);
      }, 
      function(){ //callback2
        video_toast(toast_ele , "");
          overlay_ele.classList.remove('show-play-toggle');
          switch(rate_duration_volume_brightness) {
            case 1:
              player.is_longtabing_=false;
              player.userActive(false);
              video_ele.playbackRate=origin_rate;
              break;
            case 2:
              player.userActive(true);
              break;
            case 3:
              origin_brightness=current_brightness;
              break;
          } 
          
      }, 
      duration_volume_brightness //callback3
  );


  /**
   * @description 添加触摸监听
   * @param {dom} target 要监听的dom元素
   * @param {function} callback1 长按开始回调函数
   * @param {function} callback2 结束回调函数
   * @param {function} callback3 滑动回调函数
   */
  function addTabListener(target,callback1,callback2,callback3){
      let dom_w,dom_h;
      let timer=0;   // 初始化
      target.ontouchstart=(event)=>{
          rate_duration_volume_brightness=0;timer=0; //初始化
          startX = event.touches[0].pageX;
          startY = event.touches[0].pageY;
          dom_w=target.clientWidth;
          dom_h=target.clientHeight;
          origin_time=video_ele.currentTime;
          origin_volume=video_ele.volume;
          //event.preventDefault();
          timer=setTimeout(()=>{callback1();timer=null;},450)  // 超时器能成功执行，说明是长按
      }
      target.ontouchmove=(event)=>{
          if (rate_duration_volume_brightness!=1) {
              clearTimeout(timer);    // 如果来到这里，说明是滑动，不执行长按函数
              timer=0;
              let nowX= event.changedTouches[0].pageX;
              let nowY= event.changedTouches[0].pageY;
              let spanX = nowX - startX;/*左正右负 */
              let spanY = nowY - startY;/*下正上负*/
              callback3(target , dom_w,nowX,spanX , dom_h,nowY,spanY);
          } else {
            player.userActive(false);
          }
      }
      target.ontouchend=()=>{
        if(timer){clearTimeout(timer);}  // 到这里如果timer有值，说明此触摸时间不足450ms，是点击
            else{callback2()}
      }
  }

  function duration_volume_brightness(overlay_ele, w,nowX,spanX , h,nowY,spanY){ //callback3
      let nowx_percentage=nowX/w , spanx_percentage=spanX/w;
      let nowy_percentage=nowY/h , spany_percentage=spanY/h;
      function change_duration(){
          function durationTrans(a){
              var b = ""
              var h = parseInt(a/3600),
                  m = parseInt(a%3600/60),
                  s = parseInt(a%3600%60);
              if(h>0){
                b += h+":"
              }
              m = m<10 ? '0'+m : m 
              s = s<10 ? '0'+s : s 
              b+=m+":"+s
              return b;
          }
          rate_duration_volume_brightness=2;
          let duation=video_ele.duration;
          //let newTime=spanx_percentage*duation*0.4;
          let newTime=spanx_percentage*90;
          
          video_ele.currentTime=origin_time+newTime;
          video_toast(toast_ele , durationTrans(video_ele.currentTime) , 0);
          overlay_ele.parentElement.getElementsByClassName('vjs-control-bar')[0].getElementsByClassName('vjs-progress-control')[0].getElementsByClassName('vjs-play-progress')[0].style.width = video_ele.currentTime/duation*100+"%";
      }
      function change_volume(){
          function range_volume(num,min=0,max=1){
              if (num>=max) {
                  startY=nowy_percentage*h;
                  origin_volume=video_ele.volume;
                  return max;
              }
              else if (num<=min) {
                  startY=nowy_percentage*h;
                  origin_volume=video_ele.volume;
                  return min
              }
              else return num.toFixed(2);
          }
          rate_duration_volume_brightness=3;
          video_ele.volume=range_volume(origin_volume-spany_percentage);
          video_toast(toast_ele , "音量: "+parseInt(video_ele.volume*100)+"%" , 0);
      }
      function change_brightness(){
          function range_brightness(num,min=0.5,max=1.2){
              if (num>=max) {
                  startY=nowy_percentage*h;
                  origin_brightness=max;
                  /*超出范围后，亮度声音及时生效*/
                  return max;
              }
              else if (num<=min) {
                  startY=nowy_percentage*h;
                  origin_brightness=min;
                  return min
              }
              else return num;
          }
          rate_duration_volume_brightness=4;
          current_brightness=range_brightness(origin_brightness-(spany_percentage*0.6));
          video_ele.parentElement.style.filter="brightness("+current_brightness+")";
          video_toast(toast_ele , "亮度: "+parseInt(current_brightness*100)+"%" , 0);
      }
      switch(rate_duration_volume_brightness){
          case 0:
              if (Math.abs(spanx_percentage)>0.1) change_duration()
              else if(nowy_percentage>0.25 && nowy_percentage<0.8){
                if (nowx_percentage>0.67 && Math.abs(spany_percentage)>0.1) change_volume();
                else if (nowx_percentage<0.33 && Math.abs(spany_percentage)>0.1) change_brightness();
              }
              break;
          case 2:
              change_duration()
              break;
          case 3:
              change_volume();
              break;
          case 4:
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