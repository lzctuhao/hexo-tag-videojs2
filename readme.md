# hexo-tag-videojs2

[![npm version](https://img.shields.io/npm/v/hexo-tag-videojs2.svg)](https://www.npmjs.com/package/hexo-tag-videojs2) [![license](https://img.shields.io/npm/l/hexo-tag-videojs2?style=flat)](https://raw.github.com/lzctuhao/hexo-tag-videojs2/master/LICENSE)

[中文文档](https://github.com/lzctuhao/hexo-tag-videojs2/blob/main/readme_CN.md)

Use [video.js](https://videojs.com/advanced?video=disneys-oceans) player in Hexo. [Demo](https://lzc2002.tk/2022/1210/folder-magazines/touch/mkv-the-power-of-gentle-touch/).

## Installation

```bash
npm install --save hexo-tag-videojs2
```

## Features

- Basic video-js functions

Advanced features:

- I18N ([video.js/lang](https://github.com/videojs/video.js/tree/main/lang))
- Muti audio and subtitle tracks supported
- Toast when changing volume (DIY by myself)
- Draggable progress bar ([issue](https://github.com/videojs/video.js/issues/4460))
- Save playback progress ([videojs-remember](https://github.com/sethjeffery/videojs-remember))
- Show markers for chapters on progress bar
- Playlist supported
- On mobile:
  - Double-tap the left side of the player to rewind ten seconds ([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - Double-tap the right side of the player to fast-forward ten seconds([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - Single-tap the screen to show a play/pause toggle([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - Always lock to landscape when entering fullscreen (works even when device rotation is disabled/non-functional) ([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - Triple speed playback when long pressing the screen (DIY by myself)
  - Slide left and right within the WHOLE video area to adjust the video progress (DIY by myself)
  - Swipe up-and-down on the left half of the screen to adjust the brightness (DIY by myself)
  - Swipe up-and-down on the right half of the screen to adjust the volume (DIY by myself)

> **Note**
>
> If advanced features are not needed, use [hexo-tag-video-js](https://github.com/Meta-Network/hexo-tag-video-js) instead for a faster loading speed.

## Usage

### Single Video

The full tag format is as follows:

```bash
{% vjs2 "key1=value1" "key2=value2" %}
```

| Key          | Value                                               | Description                                                                                                                              |
| ------------ | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| video        | `string`<br />**Required.** Non repeatable. | URL of the video.                                                                                                                        |
| audio        | `string`<br />Optional. Repeatable.               | URL of audio track.                                                                                                                      |
| subtitles    | `string`<br />Optional. Repeatable.               | URL of subtitles.<br />**".vtt" format required.**<br />**Must followed by a `label` k-v pair!**                           |
| captions     | `string`<br />Optional. Repeatable.               | URL of captions.<br />**".vtt" format required.**<br />**Must followed by a `label` k-v pair!**                            |
| label        | `string`<br />Optional. Repeatable.               | Label text for subtitle.<br />**Must follow a `subtitle` or `captions` k-v pair!**                                             |
| chapters     | `string`<br />Optional. Non repeatable.           | URL of chapters.<br />**".vtt" format required.**                                                                                  |
| aspect-ratio | `string`<br />Optional. Non repeatable.           | The aspect-ratio of the video.<br />Format: `Width-Height`.                                                                            |
| width        | `number`<br />Optional. Non repeatable.           | Width of DOM.                                                                                                                            |
| height       | `number`<br />Optional. Non repeatable.           | Height of DOM.                                                                                                                           |
| poster       | `string`<br />Optional. Non repeatable.           | URL of the poster picture shown before playing.<br />Note: If `"poster=key"`, a shortcut key guide will be shown on the cover picture. |
| loop         | `null`<br />No  `value` required.             | If it exists, video plays in a loop.                                                                                                    |
| autoplay     | `null`<br />No  `value` required.             | If it exists, video plays automatically.                                                                                                |

More options will be available in future releases.

Simple example:

```bash
{% vjs2 "video=file1.mp4" "subtitle=eng.vtt" "label=English" "subtitle=chs-eng.vtt" "label=双语" "poster=cover.png" %}
```

```bash
{% vjs2 "video=file2.mp4" "chapters=touch_chapter.vtt" "aspect-ratio=16-9" "loop" "autoplay" "poster=key" %}
```

```bash
{% vjs2 
"video=https://sbw0104-my.sharepoint.com/:v:/g/personal/013_sbw0104_onmicrosoft_com/ERQD08cGcYhLotmoQ6q-LKEB6bCfHhe865Htq7NvLkHkMA?e=1T1Wu0&download=1"
"chapters=touch_chapter.vtt"
"subtitle=touch.vtt"  "label=English"
"subtitle=touch2.vtt" "label=双语"
"poster=key" %}
```

> **Note**
>
> `.vtt` file for chapters may be like:
>
> ```vtt
> WEBVTT
>
> 00:00:00.000 --> 00:00:30.000
> Chapter I
>
> 00:00:30.000 --> 00:00:56.000
> Chapter II
>
> 00:00:56.000 --> 00:05:34.000
> Chapter III
>
> 00:05:34.000 --> 00:07:16.000
> Credits
> ```

### Playlist

```
{% vjs2list %}
content
{% endvjs2list %}

```

'content' is a list containing information of all videos. For example:

```js
{% vjs2list %}
[{
  sources: [{
    src: 'url.mp4',
    type: 'video/mp4'
  }],
  poster: 'poster.png',
  name: "Name of the video",
  description: "Description of the video",
  textTracks: [{src:"captions.vtt",label:"text",kind:"captions"}],
}, {
  sources: [{
    src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
    type: 'video/mp4'
  }],
  poster: 'http://media.w3.org/2010/05/bunny/poster.png'
}, {
  sources: [{
    src: 'http://vjs.zencdn.net/v/oceans.mp4',
    type: 'video/mp4'
  }],
  poster: 'http://www.videojs.com/img/poster.jpg'
}, {
  sources: [{
    src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
    type: 'video/mp4'
  }],
  poster: 'http://media.w3.org/2010/05/bunny/poster.png'
}, {
  sources: [{
    src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
    type: 'video/mp4'
  }],
  poster: 'http://media.w3.org/2010/05/video/poster.png'
}]
{% endvjs2list %}
```

## Thanks to

- [videojs/video.js: Video.js - open source HTML5 video player (github.com)](https://github.com/videojs/video.js)
- [ctd1500/videojs-hotkeys: Adds more hotkey support to video.js (github.com)](https://github.com/ctd1500/videojs-hotkeys)
- [mister-ben/videojs-mobile-ui: Mobile UI for Video.js (github.com)](https://github.com/mister-ben/videojs-mobile-ui)
- [video.js/zh-CN.json at main · videojs/video.js (github.com)](https://github.com/videojs/video.js/blob/main/lang/zh-CN.json)
- [sethjeffery/videojs-remember: Remembers the last place the user was at when watching a video, using localStorage. (github.com)](https://github.com/sethjeffery/videojs-remember)
- [videojs/videojs-playlist: Playlist plugin for videojs (github.com)](https://github.com/videojs/videojs-playlist)
- [videojs/videojs-playlist-ui: A playlist video picker for video.js (github.com)](https://github.com/videojs/videojs-playlist-ui)

## Issues

Bugs & feature requests: [issues page](https://github.com/lzctuhao/hexo-tag-videojs2/issues)

## License

&copy; Licensed under the MIT License.
