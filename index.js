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

hexo.extend.tag.register('vjs2', (args) => {
  index++;

  var out_html=`<video id="videojs${index}" class="video-js vjs-16-9" controls preload="auto">`;
  var has_chapter=false;has_defalt_subtitle=false;
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
        case "subtitles":
        case "captions":
          out_html+=`<track preload="auto" src="${value}" kind="${get_key(arg)}"`;
          if (!has_defalt_subtitle) out_html+=' default '
          out_html+='label="'
          break;
        case "label":
          out_html+=value+'">';
          break;
        case "chapters":
          out_html+='<track preload="auto" src="'+value+'" kind="chapters" label="chapters" />';
          has_chapter=true;
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
          if (value=="key") value="/libs/videojs2/key.png";
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
  

  out_html+=get_plugins(has_chapter);

  return out_html;
}, { async: true });

hexo.extend.tag.register('vjs2list', (args, content) => {
  index++;
  var out_html=`<link href="/libs/videojs2/videojs.css" rel="stylesheet"/>
  <div class="vjs-playlist-video-wrap"><div class="vjs-playlist-video"><video id="videojs${index}" class="video-js vjs-16-9" controls preload="auto">video</video></div><div class="vjs-playlist"></div><div class="vjs-list-desc-box"></div></div>`

  var has_chapter=content.indexOf("chapters")>-1 ? true : false;
  out_html+=get_plugins(has_chapter);

  out_html+=`<link href="/libs/videojs2/playlist-ui.min.css" rel="stylesheet"/><script src="/libs/videojs2/videojs-playlist.js"></script><script src="/libs/videojs2/playlist-ui.min.js"></script>`
  out_html+=`<script>player${index}.playlist(${content});player${index}.playlistUi();</script>`;

  return out_html;
}, { ends: true });

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

function get_plugins(has_chapter){
  // /*初始化(等待videojs主函数加载完毕后立即执行) */
  // let html=`<script>function init_player${index}(){player${index}=videojs("videojs${index}",{language:"zh-CN",playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],responsive:true,plugins:{hotkeys:{alwaysCaptureHotkeys:true}}});}</script>`;

  // /*主组件、汉化、hotkeys */
  // html+=`<link href="/libs/videojs2/videojs.css" rel="stylesheet"/><script defer src="/libs/videojs2/video.min.js"></script><script defer src="/libs/videojs2/zh-CN.min.js"></script><script defer src="/libs/videojs2/videojs.hotkeys.min.js" onload="init_player${index}()"></script>`;

  // /* toast及进度条拖动 */
  // html+=`<link rel="stylesheet" href="/libs/videojs2/videojs-workaround.min.css"/><script defer src="/libs/videojs2/videojs-workaround.min.js" onload="toast_init(player${index})"></script>`

  // /* mobile-ui */
  // html+=`<link rel="stylesheet" href="/libs/videojs2/videojs-mobile-ui.css"/><script defer src="/libs/videojs2/videojs-mobile-ui.min.js" onload="player${index}.mobileUi();"></script>`

  // /* remember */
  // html+=`<script defer src="/libs/videojs2/videojs-remember.min.js" onload='videojs(player${index}).remember({"localStorageKey":"videojs.remember.myvideo"});'></script>`;

  // /* chapter */
  // has_chapter && (html+='<link rel="stylesheet" href="/libs/videojs2/videojs-chapters.css"/><script src="/libs/videojs2/videojs-chapters.min.js"></script><script>window.addEventListener("load",function(){videojs(document.querySelector("video")).chapters();})</script>');

  // return html;
  
  let html=`<script>function init_player${index}(){player${index}=videojs("videojs${index}",{language:"zh-CN",playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],responsive:true,plugins:{hotkeys:{alwaysCaptureHotkeys:true}}});}</script><link href="/libs/videojs2/videojs.css" rel="stylesheet"/><link rel="stylesheet" href="/libs/videojs2/videojs-workaround.min.css"/><link rel="stylesheet" href="/libs/videojs2/videojs-mobile-ui.css"/>`;

  html+=`<script>
  function loadScriptsSequentially(scripts) {
    function loadNext(index) {
      if (index >= scripts.length) return;
  
      var script = document.createElement('script');
      script.src = scripts[index][0];
      script.defer = true;
      script.onload = function() {
        if (scripts[index][1]) {
          scripts[index][1]();
        }
        loadNext(index + 1);
      };
      document.head.appendChild(script);
    }
  
    loadNext(0);
  }
  
  var scriptsToLoad = [
    ['/libs/videojs2/video.min.js', null],
    ['/libs/videojs2/zh-CN.min.js', null],
    ['/libs/videojs2/videojs.hotkeys.min.js', init_player${index}],
    ['/libs/videojs2/videojs-workaround.min.js', function(){toast_init(player${index})}],
    ['/libs/videojs2/videojs-mobile-ui.min.js',function(){player${index}.mobileUi()}],
    ['/libs/videojs2/videojs-remember.min.js',function(){player${index}.remember({"localStorageKey":"videojs.remember.myvideo"})}]
  ];
  
  loadScriptsSequentially(scriptsToLoad);
  </script>`;
  has_chapter && (html+='<link rel="stylesheet" href="/libs/videojs2/videojs-chapters.css"/><script src="/libs/videojs2/videojs-chapters.min.js"></script><script>window.addEventListener("load",function(){videojs(document.querySelector("video")).chapters();})</script>');

  return html;
}