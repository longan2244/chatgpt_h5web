import ajax from '@/util/serve.js'

export const gptAPI = (data) => {
  return ajax({
    method: 'post',
    url: '/api/chatgpt',
    data,
    maxBodyLength: Infinity,
  })
}


