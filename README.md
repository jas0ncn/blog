# Jason's Blog

> My new blog powered by Vue.js

## 目录生成命令指导

```bash
# link command first time
# 仅第一次执行这个命令
npm link
mkdir articles

# build for production
# 创建线上版本
jblog build

# mock data for development
# 创建本地测试文件，每次修改 .md 文件之后都得执行
jblog dev

# create a Markdown articles
# 创建新博文
# 本命令会在 articles 目录里创建 .md 文件
jblog new 'article title'
```

## Vue.js 构建指导

``` bash
# install dependencies
# 安装依赖
npm install

# serve with hot reload at localhost:8080
# 在 localhost:8080 建热更新服务器
npm run dev

# build for production with minification
# 构建线上代码
npm run build

# build for production and view the bundle analyzer report
# 构建线上代码并且查看 bundle 分析报告
npm run build --report

# run unit tests
# 运行单元测试
npm run unit

# run all tests
# 运行所有测试
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
