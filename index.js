const fs = require('hexo-fs');
const pathFn = require('path');


var assets_path=pathFn.join(__dirname,"/assets/");/* */


hexo.extend.generator.register('videojs2-g', function (locals) {
  let return_arr=[];
  fs.listDirSync(assets_path).forEach(function(filename) {
    return_arr.push({
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
  args.forEach(function(arg){
    value=get_value(arg);
    switch (get_key(arg)){
      case "video":
          out_html+='<source src="'+value+'" type="video/mp4">';
          break;
      case "audio":
          out_html+='<source src="'+value+'" type="video/ogg">';
          break;
      case "subtitle":
          out_html+='<track src="'+value+'" kind="subtitles" label="';
          break;
      case "label":
          out_html+=value+'">';
          break;
      case "aspect-ratio":
          out_html=out_html.replace(/vjs-16-9/,"vjs-"+value)
      default :
          out_html+='<source src="'+value+'">';
  }
  })
  out_html+='</video>';
  out_html+='<script src="/libs/videojs2/video.min.js"></script><script src="/libs/videojs2/zh-CN.min.js"></script><script src="https://cdn.sc.gl/videojs-hotkeys/latest/videojs.hotkeys.min.js"></script><link rel="stylesheet"href="/libs/videojs2/videojs-mobile-ui.css"/><script src="/libs/videojs2/videojs-mobile-ui.min.js"></script><script>player'+index+'=videojs("video-js'+index+'",{language:"zh-CN",plugins:{hotkeys:{},},});player'+index+'.mobileUi();</script>';
  return out_html;
   
}, { async: true });

function get_key(str){
  str = str.match(/(\S*?)=/)[1];
  return str.toLowerCase();
}
function get_value(str){
  str = str.match(/=(\S*)/)[1];
  return str;
}