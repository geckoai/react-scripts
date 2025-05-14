# react-scripts

### install

```shell
npm i @geckoai/gecko-cli
# or
yarn add @geckoai/gecko-cli
```

### create app

1. Global install the package `@geckoai/gecko-cli`;

```shell
# mac/ubuntu
sudo npm i -g @geckoai/gecko-cli
# windows
npm i -g @geckoai/gecko-cli
```

2. Create a app

```shell
# input your app-name
gecko create app-name

# in your app-name
cd app-name

# start the app
yarn start
# or
npm start
```
### start

```shell
npm start
# or
yarn start
```

### build

```shell
npm build
# or
yarn build
```

### ENV

包含以下三个配置文件

.env
.env.production
.env.development

```shell
# 开发主机地址
HOST=127.0.0.1
# 开发端口
PORT=3012

# websocket主机地址 默认主机地址
# WDS_SOCKET_HOST=0.0.0.0

# websocket主机地址 默认开发端口
# WDS_SOCKET_PORT=3012

# websocket path 默认/ws
# WDS_SOCKET_PATH=/ws

# 内存分配默认4G 可以设置为1024的倍数
MAX_OLD_SPACE_SIZE='4096'

# 运行平台 默认electron 可选值有web
# APP_RUNTIME_ENV=web
APP_RUNTIME_ENV=electron

# electron生产时需要使用./ 因为走的是file协议 默认web版本的使用/
PUBLIC_URL=/
```