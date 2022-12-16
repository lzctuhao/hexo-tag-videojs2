const fs = require('hexo-fs');
const pathFn = require('path');


var assets_path=pathFn.join(__dirname,"/assets/");/* */


hexo.extend.generator.register('videojs2-g', function (locals) {
  let return_arr=[];
  fs.listDirSync(assets_path).forEach(function(filename) {
    filename.substring(0, 1) != "_" && return_arr.push({
      path: '/libs/videojs2/'+filename,
      data: () => fs.createReadStream(pathFn.join(assets_path, filename)),
    })
  })
  return return_arr;
});

let index=0;

hexo.extend.tag.register('videojs2', (args) => {
  index++;
  var out_html='<link href="/libs/videojs2/video-js.css" rel="stylesheet"/><video id="video-js'+index+'" class="video-js vjs-16-9" controls preload="auto">';
  var is_chapter=false;has_defalt_subtitle=false;
  args.forEach(function(arg){
    value=get_value(arg);
    if(value){
      switch (get_key(arg)){
        case "video":
          out_html+='<source src="'+value+'" type="video/mp4">';
          break;
        case "audio":
          out_html+='<source src="'+value+'" type="audio/mp3">';
          break;
        case "subtitle":
          out_html+='<track preload="auto" src="'+value+'" kind="subtitles"';
          if (!has_defalt_subtitle) out_html+=' default '
          out_html+='label="'
          break;
        case "label":
          out_html+=value+'">';
          break;
        case "chapters":
          out_html+='<track preload="auto" src="'+value+'" kind="chapters" label="chapters" />';
          is_chapter=true;
          break;

        case "aspect-ratio":
          out_html=out_html.replace(/vjs-16-9/,'vjs-'+value);
          break;
        case "width":
          out_html=out_html.replace(/<video /,'<video width="'+value+'"');
          break;
        case "height":
          out_html=out_html.replace(/<video /,'<video height="'+value+'"');
          break;
        case "poster":
          (value=="key") && (value="/libs/videojs2/key.png");
          out_html=out_html.replace(/<video /,'<video poster="'+value+'"');
          break;
        default :
          out_html+='<source src="'+value+'">';
      }
    } else {
      if(arg.indexOf("loop")>-1) out_html=out_html.replace(/<video /,'<video loop="loop" ');
      if(arg.indexOf("autoplay")>-1) out_html=out_html.replace(/<video /,'<video autoplay="autoplay" ');
    }
  })
  out_html+='</video>';
  out_html+='<script src="/libs/videojs2/video.min.js"></script><script src="/libs/videojs2/zh-CN.min.js"></script><script src="https://cdn.sc.gl/videojs-hotkeys/latest/videojs.hotkeys.min.js"></script><script>player'+index+'=videojs("video-js'+index+'",{language:"zh-CN",responsive:true,plugins:{hotkeys:{alwaysCaptureHotkeys:true},},});</script>';
  out_html+='<link rel="stylesheet" href="/libs/videojs2/mytoast.css"/><script src="/libs/videojs2/mytoast.js"></script><script>toast_init(player'+index+')</script>'
  out_html+='<link rel="stylesheet"href="/libs/videojs2/videojs-mobile-ui.css"/><script src="/libs/videojs2/videojs-mobile-ui.min.js"></script><script>player'+index+'.mobileUi();</script>'

  out_html+='<script src="/libs/videojs2/videojs-remember.js"></script><script>videojs(document.querySelector("video")).remember({"localStorageKey": "videojs.remember.myvideo"});</script>';

  is_chapter && (out_html+='<link rel="stylesheet" href="/libs/videojs2/videojs-chapters.css"/><script src="/libs/videojs2/videojs-chapters.js"></script><script>window.addEventListener("load",function(){videojs(document.querySelector("video")).chapters();})</script>');
  return out_html;
}, { async: true });

function get_key(str){
  str = str.match(/(\S*?)=/)[1];
  return str.toLowerCase();
}
function get_value(str){
  try{
    str = str.match(/=(\S*)/)[1];
    return str;
  } catch(e){/*没有等于号 */
    return null;
  }
  
}