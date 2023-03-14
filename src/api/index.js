export const gptAPI = (m) => {
  return fetch('https://chatgpt.quxuetrip.com/api/chatgpt/get?stream=true', {
    headers: {
      "content-type": 'text/event-stream;charset=utf-8',
      m
    }
  })
}


// let a = {
//   a:7
// }
// let obj1 = {
//   a: 6,
//   b() {
//      console.log(++this.a);
//   }
// }
// let obj2 = {
//   a,
//   b: obj1.b,
//   c() {
//     console.log(this.a.a++);
//   }
// }
// obj1.b()
// obj2.b()
// obj2.c()
// obj2.c()

