function toast_init(player){
    player.el_.insertAdjacentHTML('beforeend',"<div class='videojs-toast'><span class='toast_text'></span></div>");
}
var t;
function video_toast(ele,text){
    t && clearTimeout(t);
    ele.style.opacity=1;
    ele.innerHTML=text;
    t=setTimeout( () => {
        ele.style.opacity=0;
    },1500);
}