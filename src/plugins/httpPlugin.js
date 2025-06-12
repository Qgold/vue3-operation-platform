import http from '../api/http'

export default {
  install: (app) => {
    app.config.globalProperties.$http = http
    app.provide('http', http)
  }
}