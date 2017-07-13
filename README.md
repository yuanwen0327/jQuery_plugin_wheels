# jQuery插件轮子
工作中用到的jQuery插件集合，基于jQuery1.11.3开发，支持IE8+。

- 楼梯
- 页签切换
- 自定义下拉框
- aside、nav浮动效果
- 自定义滚动条

[查看文档](https://yuanwen0327.github.io/jQuery_plugin_wheels/)

## 使用方法

### 编译
```bash
git clone https://github.com/yuanwen0327/jQuery_plugin_wheels.git
```

```bash
cnpm i
```

```bash
npm run build
```

### 引入
`build`后会在目录下dist文件夹中生成js插件，将其引入到html中
```html
<script src="http://cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
<script src="../dist/jquery.anchormove.min.js"></script>
```

## 演示
首先产出开发环境下的js
```bash
npm run dev
```
在demo文件下打开相应的html即可