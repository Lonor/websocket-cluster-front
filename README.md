# Demo front-end project for WebSocket cluster

此项目为[实战 Spring Cloud 的 WebSocket 集群](https://github.com/Lonor/websocket-cluster)的前端页面。

## 本地运行

新建 `.env.development.local` 文件，添加相关环境变量：

```
REACT_APP_REST_URL=http://127.0.0.1
REACT_APP_WS_URL=ws://127.0.0.1
```

启动项目

```
yarn
yarn start
```

访问 `http://localhost:3000` 即可查看效果。

## React Hooks

组件中以 `_hook` 结尾的 js 是使用了 React Hooks 重构。原始的 Class 式组件均保留而未使用。

## 效果图

WebSocket servers or clients status:

- `#ffff00` Unhealthy (being started / shut down)
- `#0cb00c` Healthy (available for accepting request)
- `#ff0102` Down (disconncted)

![WebSocket Cluster Demo GIF](./image/demo.gif)
