import axios from "axios";
const ajax = axios.create({
  baseURL: 'https://chatgpt.quxuetrip.com',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    // "Referer": "https://chatgpt.quxuetrip.com/"
  },
})

ajax.interceptors.request.use(config => {
  config.headers.Referer = 'https://chatgpt.quxuetrip.com/'
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error);
});


export default ajax
