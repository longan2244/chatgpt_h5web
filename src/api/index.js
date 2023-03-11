export const gptAPI = (m) => { 
 return fetch('https://chatgpt.quxuetrip.com/api/chatgpt/get?stream=true', {
    headers: {
      "content-type": 'text/event-stream;charset=utf-8',
      m
    }
  })
}





