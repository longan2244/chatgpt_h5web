<template>
  <div class="home-container">
    <div class="nav-bar">
      <div class="back">←</div>
      <div class="title">GTP机器人</div>
      <div class="menu">:</div>
    </div>
    <!-- <div class="top" v-if="false">
      <div class="gpt avatar">
        <img src="./../../assets/image/g.svg" alt="">
      </div>
      <div class="my avatar">
        <img src="./../../assets/image/me.svg" alt="">
      </div>
      <div class="intimacies">Match 90%</div>
      <div class="info">
        历史
      </div>
    </div> -->
    <div class="GPT">
      <div class="main" ref="main">
        <ul class="talk_list" style="top: 0px;" id="talk_list">
          <li :class="item.Isrobot ? 'left_word' : 'right_word'" v-for="(item, index) in MSGdata" :key="index">

            <img :src="item.Isrobot ? './../../../public/image/g.svg' : './../../../public/image/me.svg'" />

            <!-- <span style="white-space: pre-wrap">
              {{ item.text }}
            </span> -->

            <!-- 正文输出 -->
            <div class="entry-content">
              <div class="content" v-highlight id="content" v-html="item.text">
              </div>
            </div>

          </li>
        </ul>
        <div class="drag_bar" style="display: none;">
          <div class="drager ui-draggable ui-draggable-handle" style="display: none; height: 412.628px;"></div>
        </div>
      </div>
    </div>
    <!-- 底部 消息编辑区域 -->
    <div class="footer">
      <input type="text" v-model="message" placeholder="说的什么吧..." class="input_txt" id="ipt" />
      <input type="button" @click="send" value="发 送" class="input_sub" id="btnSend" />
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { gptAPI } from '@/api/index.js'
import { crt } from '@/util/index.js'
import { marked } from 'marked';
// let decoder = new TextDecoder() //构建文本解析器
let flage = true //全局flage
let decoder = new TextDecoder()
let message = ref('') //自己的对话
let messageId = ref('') //GPTid
let MSGdata = reactive([{
  Isrobot: true,
  text: '你好v3.0,我是ChatGPT,一个由OpenAI训练的大型语言模型。'
}]) //聊天数据
let main = ref() //主界面 dom元素
//发送GTP数据之前
const send = async () => {
  if (!message.value) {
    return alert('请输入内容')
  }
  //添加自己的对话
  MSGdata.push({
    text: message.value
  })
  MSGdata.push({
    text: '思考中..',
    Isrobot: true
  })
  //清空聊天框
  let usermsg = message.value
  message.value = ''
  //发送GTP数据
  sendgtp(crt({
    messageId: messageId.value,
    idx: 999,
    message: usermsg
  }))
}
//发送GTP数据
const sendgtp = async (m) => {
  let fetchdata = await gptAPI(m)
  //数据读流
  let reader = fetchdata.body.getReader();
  chunk(reader)
  //全部数据请求完成
}
//数据读流
const chunk = async (reader) => {
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log('数据请求完成');
      break;
    }
    // 数据处理
    try {
      parsedata(parseStream(value))
    } catch (error) {

    }
  }
}
//通过正则表达式-进行数据处理
const parseStream = (value) => {
  let results = {}
  let data = decoder.decode(value);
  let regex = /"text":"(.*?)","messageId":"(.*?)"/g;
  let match;
  while ((match = regex.exec(data)) !== null) {
    let text = match[1];
    let messageId = match[2];
    results.text = text
    results.messageId = messageId
  }
  console.log(results);
  return results;
}
//数据处理
const parsedata = (data) => {
  let { text, messageId: msgid } = data
  if (flage) {
    console.log('进来了+++++++', flage);
    messageId.value = msgid
    MSGdata.splice(MSGdata.length - 1, 1)
    MSGdata.push({
      text: marked(text),
      Isrobot: true
    })
    flage = true
  }
  MSGdata[MSGdata.length - 1].text = marked(text.replace(/\\n/g, "\n"))

  // MSGdata[MSGdata.length - 1].text = marked('以下是一个简单的 JavaScript 代码示例，用于将页面上的所有段落文本都转换为大写字母：\n\n```javascript\nlet paragraphs = document.getElementsByTagName(\"p\");\n\nfor (let i = 0; i < paragraphs.length; i++) {\n  paragraphs[i].textContent = paragraphs[i].textContent.toUpperCase();\n}\n```\n\n这段代码首先通过 `document.getElementsByTagName()` 方法获取到页面上所有的 `<p>` 标签元素，并将其存储在 `paragraphs` 变量中。然后使用 for 循环遍历每个段落元素，并将其文本内容转换为大写字母，最后将其重新赋值给 `textContent` 属性。')
  // MSGdata[MSGdata.length - 1].text = marked('以下是一个简单的 JavaScript 代码段，它将创建一个包含 \"Hello, World!\" 文本的新段落，并将其添加到 HTML 页面的主体部分中：\n\n```javascript\n// 获取 body 元素\nconst body = document.querySelector("body");\n\n// 创建新的 p 元素\nconst paragraph = document.createElement("p");\nparagraph.textContent = "Hello, World!"";\n\n// 将 p 元素添加到 body 中\nbody.appendChild(paragraph);\n```\n\n该代码首先使用 `document.querySelector()` 方法获取页面中的 `body` 元素。然后，它使用 `document.createElement()` 方法创建一个新的 `p` 元素，并为其设置文本内容。最后，它使用 `appendChild()` 方法将该元素添加到 `body` 元素中，以便在页面上显示出来。')
}
//兼容安卓端-保证每次出现新消息在底部
watch(MSGdata, () => {
  main.value.scrollTop = main.value.scrollHeight
}, {
  deep: true
})



</script>
<style lang='less' scpoed>
.home-container {
  background: rgba(255, 255, 255, 1);
}

.nav-bar {
  padding: 30px 20px 12px 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(241, 240, 243, 1);
  font-size: 18px;
  font-weight: 700;
}

.top {
  padding: 16px 0 16px 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(241, 240, 243, 1);

  img {
    width: 100%;
  }

  .intimacies {
    width: 85px;
    height: 27px;
    line-height: 27px;
    border-radius: 40px;
    text-align: center;

    background: linear-gradient(91.6deg, rgba(255, 95, 176, 1) 0%, rgba(255, 66, 136, 1) 100%);
  }

  .info {
    width: 86px;
    height: 36px;
    font-size: 14px;
    text-align: center;
    line-height: 36px;
    opacity: 1;
    border-top-left-radius: 22px;
    border-bottom-left-radius: 22px;
    background: linear-gradient(90.34deg, rgba(217, 136, 255, 1) 0%, rgba(139, 92, 255, 1) 100%);
  }
}

.main {
  position: absolute;
  left: 0;
  right: 0;
  top: 64px;
  bottom: 55px;
  box-sizing: border-box;
  padding: 10px 0;
  overflow: scroll;
}

.talk_list {
  position: absolute;
  width: 100%;
  left: 0px;
  top: 0px;

}

.talk_list li {
  overflow: hidden;
  margin: 20px 0px 30px;
}

.talk_list .left_word img {
  float: left;
  margin-left: 16px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.talk_list .left_word .content {
  float: left;
  background: rgba(241, 240, 243, 1);
  padding: 10px 15px;
  max-width: 290px;
  border-radius: 12px;
  font-size: 16px;
  color: rgba(85, 76, 95, 1);
  margin-left: 13px;
  position: relative;
  line-height: 24px;
}

.talk_list .right_word img {
  float: right;
  margin-right: 16px;
  width: 50px;
  height: 50px;
  border-radius: 50%;

}

.talk_list .right_word .content {
  float: right;
  background: rgba(139, 92, 255, 1);
  padding: 10px 15px;
  max-width: 290px;
  border-radius: 12px;
  font-size: 16px;
  color: white;
  margin-right: 13px;
  position: relative;
  line-height: 24px;
}

.drag_bar {
  position: absolute;
  right: 0px;
  top: 0px;
  background-color: #fff;
  height: 100%;
  width: 6px;
  box-sizing: border-box;
  border-bottom: 1px solid #f4f3f3;
}

.drager {
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: #cdcdcd;
  height: 100px;
  width: 6px;
  border-radius: 3px;
  cursor: pointer;
}

.footer {
  width: 100%;
  height: 55px;
  left: 0px;
  bottom: 0px;
  background-color: #fff;
  position: absolute;
  display: flex;
  justify-content: space-between;
  padding: 8px;
}

.footer img {
  float: left;
  margin: 8px 0 0 20px;
}

.input_txt {
  float: left;
  width: 270px;
  height: 37px;
  border: 0px;
  background-color: #f4f3f3;
  border-radius: 8px;
  padding: 0px;
  outline: none;
  text-indent: 15px;
}

.input_sub {
  float: left;
  width: 70px;
  height: 37px;
  border: 0px;
  background: rgba(139, 92, 255, 1);
  border-radius: 8px;
  padding: 0px;
  outline: none;
  color: #fff;
  cursor: pointer;
}


.content pre {
  border-radius: 8px;
  overflow: hidden;

  code {
    padding: 24px 16px 16px 16px;

  }

}
</style>