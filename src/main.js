import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css' //样式
const app = createApp(App)
import '@/styles/base.less'
app.use(createPinia())
app.use(router)
//创建v-highlight全局指令
app.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

app.mount('#app')
