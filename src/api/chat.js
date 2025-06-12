import request from './http'

export const chatWithAI = async (messages,model) => {
  return request({
    url: 'http://localhost:3000/deepseek-proxy',
    method: 'post',
    data: {
      messages,
      model: model,
      temperature: 0.7,
      max_tokens: 2000
    }
  })
}
export const getChatModels = async (messages) => {
  return request({
    url: 'http://localhost:3000/deepseek-models',
    method: 'get',
  })
}

// export const getMessageHistory = async () => {
//   return await http.get('/api/chat/history')
// }
