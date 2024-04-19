/* toast */
function toast_init(player) {
    player.el_.insertAdjacentHTML('beforeend', "<div class='videojs-toast'><span class='toast_text'></span></div>");
    player.on('volumechange', () => {
        video_toast(player.player_.el_.getElementsByClassName('toast_text')[0], '音量: ' + (player.muted() ? "静音" : parseInt(player.volume() * 100) + "%"))
    })
}
var timer;
function video_toast(ele, text = "", time = 1500) {
    timer && clearTimeout(timer);
    if (text != "" && text != null) { /*展现1500秒，或不限时展现 */
        ele.style.opacity = 1;
        ele.innerHTML = text;
        if (time && time > 0) { /*time=0意为限时展现 */
            timer = setTimeout(() => {
                ele.style.opacity = 0;
            }, time);
        }

    } else { //text为空，意为隐藏toast
        ele.style.opacity = 0;
    }

}

(function () {
    /* draggable-progressbar */
    //https://github.com/videojs/video.js/issues/4460
    let SeekBar = videojs.getComponent('SeekBar');
    SeekBar.prototype.handleMouseMove = function handleMouseMove(event) {
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
        let newTime = this.calculateDistance(event) * this.player_.duration();
        
        if (newTime === this.player_.duration()) {
            newTime = newTime - 0.1
        }
        this.player_.currentTime(newTime);
        video_toast(this.player_.el_.querySelector('.toast_text') , durationTrans(newTime) );
        this.update();
    }
})();