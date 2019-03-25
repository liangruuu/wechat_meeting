//app.js
App({
  // onLaunch: function () {
  //   //调用API从本地缓存中获取数据
  //   var logs = wx.getStorageSync('logs') || []
  //   logs.unshift(Date.now())
  //   wx.setStorageSync('logs', logs)
  // },
  onLaunch: function () {
    this.login()
  },
  login: function () {
    wx.login({
      success(res) {
        wx.setStorageSync("code", res.code)
      }
    })
  },
  globalData: {
    userInfo: null,
    arrows_r: "/img/arrows-r.png",
    arrows_d: "/img/arrows-d.png",
    // http://10.66.4.112:8082
    // http://ttt.nat300.top
    baseUrl: 'http://ttt.nat300.top',
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTU5MTk0ODMwNjEsInBheWxvYWQiOiJ7XCJ1c2VySURcIjoyLFwidXNlck5hbWVcIjpcImpqalwiLFwib3BlbklEXCI6bnVsbCxcInVpZFwiOm51bGwsXCJqb2JOdW1iZXJcIjpcIjEyM1wiLFwiZGVsYXlJbmRleFwiOjAsXCJmYWNlSW5mb1wiOm51bGwsXCJkZWxldGVUYWdcIjpudWxsLFwiZGVwYXJ0bWVudFwiOlwi5YmN56uvXCIsXCJ1bml0SURcIjoxfSJ9.gzxuv7LKIg9KofaFRiY7mdoBCUXvVofbjAk6bZZWbbg"
  }
})