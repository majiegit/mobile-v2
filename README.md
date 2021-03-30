# checkout

> 友人才hr_wap

## Build Setup

``` bash
# clone
git@git.yonyou.com:nccloud_hr/hr_mwap.git

#checkout
git checkout develop

# install dependencies
npm install
#start
npm start 
# serve with hot reload at localhost:8090
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

##工程结构
```$xslt
├── README.md
├── build            // 开发和生产的webpack配置文件
├── config           // 配置目录
├── dist             // 经webpack打包的产出文件，用于生产环境部署
├── node_modules     // 依赖的nodejs模块
├── src              // 源码
├── static           // 静态文件目录，e.g 图片等
├── .babelrc         // babel-loader配置文件
├── index.html
├── package.json     // 定义依赖的nodejs模块

```

##源码结构
```$xslt
├── App.vue          // vue启动文件
├── components       // 公共组件
├── main.js          // 入口文件
├── pages            // 功能节点
├── router           // 路由
├── store            // vuex
├── utils            // 工具库

```
