# GPTweb 介绍
采用第三方接口
对数据进行可读流获取 （获取效率高！）
```
"content-type": 'text/event-stream;charset=utf-8',
```
 后端（v3后已弃用）：https://github.com/longan2244/chatgpt_serve

请求需要对明文加密  已调用（src\util\index.js） 的 crt 方法
## 请求接口实例（v3后已弃用）
``` js

let usersmg = {
  messageId: 'xxxxxxxxxx',
  idx: 999,
  message: '你好，帮我写段代码'
}



export const gptAPI = (data) => {
  return ajax({
    method: 'post',
    url: '/api/chatgpt',
    data:{
    m: crts(usermsg) //加密密文
    }
    maxBodyLength: Infinity,
  })
}
```

