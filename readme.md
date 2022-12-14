# hexo-tag-videojs2

[![npm version](https://img.shields.io/npm/v/hexo-tag-videojs2.svg)](https://www.npmjs.com/package/hexo-tag-videojs2) [![license](https://img.shields.io/npm/l/hexo-tag-videojs2?style=flat)](https://raw.github.com/lzctuhao/hexo-tag-videojs2/blob/master/LICENSE)

[中文文档](https://github.com/lzctuhao/hexo-tag-videojs2/blob/main/readme_CN.md)

Use [video.js](https://videojs.com/advanced?video=disneys-oceans) player in Hexo. [Demo](https://lzc2002.tk/2022/1210/folder-magazines/touch/mkv-the-power-of-gentle-touch/).

## Installation

```bash
npm install --save hexo-tag-videojs2
```

## Features

- Basic video-js functions
- I18N ([video.js/lang](https://github.com/videojs/video.js/tree/main/lang))
- Draggable progress bar ([issue](https://github.com/videojs/video.js/issues/4460))
- On mobile:
  - Double-tap the left side of the player to rewind ten seconds ([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - Double-tap the right side of the player to fast-forward ten seconds([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - Single-tap the screen to show a play/pause toggle([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - Always lock to landscape when entering fullscreen (works even when device rotation is disabled/non-functional) ([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - Triple speed playback when long pressing the screen (DIY by myself)

## Usage

The full tag format is as follows:

```bash
{% videojs2 "key1=value1" "key2=value2" %}
```

| Key          | Value                                          | Description                                                                                                   |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| video        | `string`<br />**Required.** Non repeatable. | URL of the video.                                                                                             |
| audio        | `string`<br />Optional. Repeatable.          | URL of audio track.                                                                                           |
| subtitle     | `string`<br />Optional. Repeatable.          | URL of subtitle.<br />**".vtt" format required.**<br />**Must followed by a `label` k-v pair!** |
| label        | `string`<br />Optional. Repeatable.          | Label text for subtitle.<br />**Must follow a `subtitle` k-v pair!**                                  |
| aspect-ratio | `string`<br />Optional. Non repeatable.      | The aspect-ratio of the video.<br />Format: `Length-Width`.                                                 |
| width        | `number`<br />Optional. Non repeatable.      | Width of DOM.                                                                                                 |
| height       | `number`<br />Optional. Non repeatable.      | Height of DOM.                                                                                                |
| poster       | `string`<br />Optional. Non repeatable.      | URL of the poster picture shown before playing.                                                               |
| loop         | `null`<br />No  `value` required.        | If it exists, video plays in a loop.                                                                         |
| autoplay     | `null`<br />No  `value` required.        | If it exists, video plays automatically.                                                                     |

More options will be available in future releases.

Simple example:

```bash
{% videojs2 "video=file.mp4" "subtitle=eng.vtt" "label=English" "subtitle=chs-eng.vtt" "label=双语" "aspect-ratio=16-9" "loop" "autoplay" "poster=https://source.unsplash.com/1920x1080" %}

```

## Thanks to

- [videojs/video.js: Video.js - open source HTML5 video player (github.com)](https://github.com/videojs/video.js)
- [mister-ben/videojs-mobile-ui: Mobile UI for Video.js (github.com)](https://github.com/mister-ben/videojs-mobile-ui)
- [video.js/zh-CN.json at main · videojs/video.js (github.com)](https://github.com/videojs/video.js/blob/main/lang/zh-CN.json)

## License

&copy; Licensed under the MIT License.
