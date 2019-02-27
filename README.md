# music

一个 jQuery 网站 app 应用，主要界面仿(chao)照(xi) [music.163.com/m](music.163.com/m)

## 在线预览
[PC 页面预览](http://strugglebak.com/music/src/admin)

[手机页面预览](http://strugglebak.com/music/src)

> 注意，本项目仅支持 Firefox,Chrome 新版浏览器，微信或者其他浏览器内核打开页面可能有 bug,预览页面请尽量用 Firefox 或 Chrome 浏览器打开!!!

## 安装
```
git clone https://github.com/strugglebak/music.git
```
安装 `http-server`
```
sudo npm i -g http-server
```

## 使用
先到 `music` 项目目录安装依赖
```
cd music
npm i -D
```
在项目 `music` 目录开启 `node server` 跑上传文件后台
```
node server.js 8888
```
**在 music 项目**上一级目录开启 `http-server` 跑移动端页面
```
cd ..
http-server -c-1
```
打开管理端页面
```
open http://127.0.0.1:8080/music/admin
```
打开移动端页面
```
open http://127.0.0.1:8080/music/src
```
> 注意，在本项目中需要用到七牛云的密钥，所以要启动本项目的全部功能你需要去七牛云注册一个账号，并将你的 bucket 名字命名为 **music**

## 项目说明
项目的功能主要分两个部分

1. PC 端

    PC 端的主要功能有如下
    - 支持本地歌曲文件上传
    - 支持本地歌曲拖拽上传
    - 支持上传文件的选中
    - 支持音乐标题、歌手、歌曲外链、歌曲封面、歌词的编辑和保存
    - 文件上传时自动播放 loading 动画

PC 端页面如下
<div align="center">
    <img src="https://i.loli.net/2019/02/26/5c753ed21e6db.png" width="800">
</div>
<div align="center">
    <img src="https://i.loli.net/2019/02/26/5c7543ceafb8a.png" width="800">
</div>

2. 移动端

    移动端的主要功能有如下
    - 显示上传的歌曲(最近 10 条保存的)
    - 上传歌曲可点击播放
    - 音乐有暂停和播放切换的功能
    - 音乐播放时滚动显示歌词
    - 音乐播放时有碟形旋转动画
    - 音乐播放有即时暂停功能

移动端页面如下
<div align="left">
    <img src="https://i.loli.net/2019/02/26/5c754191ac919.png" width="250">
    <img src="https://i.loli.net/2019/02/26/5c75418c75197.png" width="250">
    <img src="https://i.loli.net/2019/02/26/5c75418c95c21.png" width="250">
</div>
<div align="left">
    <img src="https://i.loli.net/2019/02/26/5c75418c930f9.png" width="250">
    <img src="https://i.loli.net/2019/02/26/5c75418ab0cb1.png" width="250">
    <img src="https://i.loli.net/2019/02/27/5c7639252d53d.jpg" width="250">
</div>

## 项目优势
项目主要采用的技术栈 `jQuery` + `AJAX` + `MVC`设计模式 + `原生ES5/ES6` + `正则` + `LeanCloud` + `七牛云`
- `jQuery` 写起来，能让代码变得更清晰和易懂，全程不用太多原生 JS 的感觉不要太爽
- `MVC` 设计模式，又一个写代码的贴心小棉袄来了，代码结构需要那么复杂干什么，你写的这些谁懂啊，用上 `MVC` 你甚至可以做到 '无脑式写代码'
- `AJAX` 发送请求？当然了，我跟服务器打交道, 必须得分析 api 接口然后伪造请求阿，这中间将会用到 `promise` 的一些功能
- `正则` 用到好，全家吃到饱啊，从网易云上扒的歌词是有时间段和回车的，必须用正则将他们一条一条解析出来，然后结合 css 实现滚动
- `LeanCloud` + `七牛云` 后端存储，可以让你体会到数据是如何从前端传输到后端，再从后端传输到前端的，体会一把全栈的滋味!
- `ES5+ES6`,当然不得不承认的一点，有时候 `ES5/ES6` 语法可以让我们的代码少些 for 循环，在一些数组和字符串操作的场合，简直就是神器一般

## 项目架构
<div align="center">
    <img src="https://i.loli.net/2019/02/26/5c753d97106e3.png">
</div>

如图所示的架构,架构图中说明了以下几点
- 管理页面通过七牛云 api 来存储文件，然后把该文件的外链存放到 LeanCloud 中
- 利用 LeanCloud api 作为后端 api,前端通过 jQuery 发送 AJAX 请求来获取歌曲文件的外链，也就得到了歌曲文件的地址
- 拿到歌曲文件的外链就可以对文件进行播放的操作了
- 七牛云作为后端的数据库部分，起到存储文件的作用
- LeanCloud api 同时也承担着文件的 curd 操作

## 疑问
1. 这个项目为什么要采用 `jQuery` ?
众所周知，`jQuery` 是一个拥有 '历史悠久' 的前段框架，它是对原有 `dom` 操作的一层封装，免去了原生 `dom` 操作中那些烦人的 api 各路神奇的调用，真正实现用最小的代码完成最多的任务(人生苦短，我用。。。当然是 jQuery 拉),相比原生 JS, 它的 api 更简洁，文档规范且友好,最喜人的是，它支持 AJAX。

2. `jQuery` 已经过时了，为何不使用更先进的框架?
很简单，`jQuery` 虽然已经成为过去，但这不妨碍我们去理解它的设计思想和设计模式，并且，在真正接触一个大型框架之前，用 `jQuery` 来学习和过渡是一个不错的选择。怎么学习? 现在哪个大型框架不用 `MVVM` 模式? 我用 `jQuery` + `MVC` 这种模式能让我更好的理解其他框架的底层在干什么，框架毕竟只是个适应时代和项目适用场景的玩意儿，会其精髓便对其他有融会贯通之感。

## 项目改进
项目可以改进的点有很多，比如
- 管理页面可以加个搜索框，实现文件的查找
- 在管理页面的列表项旁可以加个删除 icon, hover 之后浮现，点击确认即可删除
- 移动端页面可以增加歌单列表页面、热歌榜的两首歌曲、搜索页面的查找功能
- 甚至还可以添加评论，将功能向着移动端的网易客户端迈进
- ...

当然这个项目还在完善中，我觉得要完成以上的功能需要调用到一些 api 来做，目前找到的一个开源的项目很不错,地址在[这里](https://github.com/Binaryify/NeteaseCloudMusicApi), 直接在服务器上跑一个 node.js 的服务，通过这个强大的 api，还是可以逐渐做好的。

## 更新日志
- 2019.02.17
完成项目初始版本
