import axios from "axios";
const ajax = axios.create({
  baseURL: 'http://192.168.31.205:5139',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
export default ajax
