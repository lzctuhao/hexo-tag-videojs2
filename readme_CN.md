# hexo-tag-videojs2

[![npm version](https://img.shields.io/npm/v/hexo-tag-videojs2.svg)](https://www.npmjs.com/package/hexo-tag-videojs2) [![license](https://img.shields.io/npm/l/hexo-tag-videojs2?style=flat)](https://raw.github.com/lzctuhao/hexo-tag-videojs2/blob/master/LICENSE)

[English Version](https://github.com/lzctuhao/hexo-tag-videojs2/blob/main/readme.md)

在Hexo中使用[video.js](https://videojs.com/advanced?video=disneys-oceans)视频播放器. [样例](https://lzc2002.tk/2022/1210/folder-magazines/touch/mkv-the-power-of-gentle-touch/).

## 安装

```bash
npm install --save hexo-tag-videojs2
```

## 特性

- 基本的video-js播放器功能
- 播放器中文界面 ([video.js/lang](https://github.com/videojs/video.js/tree/main/lang))
- 原版进度条改为可拖动进度条 ([issue](https://github.com/videojs/video.js/issues/4460))
- 保存播放进度 ([videojs-remember](https://github.com/sethjeffery/videojs-remember))
- 移动端:
  - 双击播放器左侧，快退10秒 ([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - 双击播放器右侧，快进10秒 ([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - 单击屏幕，显示播放/暂停切换 ([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - 进入全屏时，始终锁定到横向（即使手机自动旋转未开启） ([videojs-mobile-ui.js](https://github.com/mister-ben/videojs-mobile-ui))
  - 长按播放器屏幕，三倍速播放 (DIY by myself)
  - 视频区域内左右滑动，均可调节视频进度(DIY by myself)

## 用法

完整tag标记格式如下：

```bash
{% videojs2 "key1=value1" "key2=value2" %}
```

| 键           | 值                                     | 值描述                                                                                           |
| ------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| video        | `string`<br />**必填项。**不可重复。 | 视频的URL。                                                                                      |
| audio        | `string`<br />可选项。可重复。       | 音轨的URL。                                                                                      |
| subtitle     | `string`<br />可选项。可重复。       | 字幕的URL。<br />**必须是"`.vtt`"格式。** <br />**其后必须跟随 `label`键值对！** |
| label        | `string`<br />可选项。可重复。       | 字幕的文字说明。<br />**前面必须是 `subtitle`键值对！**                                 |
| aspect-ratio | `string`<br />可选项。不可重复。     | 视频的长宽比。<br />格式： `Width-Height`.                                                     |
| width        | `number`<br />可选项。不可重复。     | DOM元素的宽                                                                                      |
| height       | `number`<br />可选项。不可重复。     | DOM元素的高                                                                                      |
| poster       | `string`<br />可选项。不可重复。     | 视频播放前显示的封面图片URL。<br />*注：如果 `"poster=key"`，则封面将显示快捷键示意图。*     |
| loop         | `null`<br />无需 `value`值。       | 若存在，则循环播放。                                                                             |
| autoplay     | `null`<br />无需 `value`值。       | 若存在，则自动播放。                                                                             |

未来版本中将提供更多选项。

示例：

```bash
{% videojs2 "video=file1.mp4" "subtitle=eng.vtt" "label=English" "subtitle=chs-eng.vtt" "label=双语" "poster=cover.png" %}

{% videojs2 "video=file2.mp4" "aspect-ratio=16-9" "loop" "autoplay" "poster=key" %}
```

## 感谢

- [videojs/video.js: Video.js - open source HTML5 video player (github.com)](https://github.com/videojs/video.js)
- [mister-ben/videojs-mobile-ui: Mobile UI for Video.js (github.com)](https://github.com/mister-ben/videojs-mobile-ui)
- [video.js/zh-CN.json at main · videojs/video.js (github.com)](https://github.com/videojs/video.js/blob/main/lang/zh-CN.json)
- [sethjeffery/videojs-remember: Remembers the last place the user was at when watching a video, using localStorage. (github.com)](https://github.com/sethjeffery/videojs-remember)

## Issues

Bugs & 新功能需求: [issues页](https://github.com/lzctuhao/hexo-tag-videojs2/issues)

## License

&copy; Licensed under the MIT License.
