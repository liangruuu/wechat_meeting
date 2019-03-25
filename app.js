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
    this.getUserLists()
  },
  login: function () {
    wx.login({
      success(res) {
        wx.setStorageSync("code", res.code)
      }
    })
  },
  getUserLists: function () {
    let dptmLists = []
    wx.request({
      url: `${this.globalData.baseUrl}/workunits/${this.globalData.unitID}/users`,
      success(res) {
        let userLists = res.data
        for (let i = 0; i < userLists.length; i++) {
          let userItem = userLists[i]
          for (var j = 0; j < dptmLists.length; j++) {
            if (dptmLists[j].department === userLists[i].department) {
              dptmLists[j].userLists.push({
                "jobNumber": userItem.jobNumber,
                "userName": userItem.userName,
                "userID": userItem.userID,
                "delayIndex": userItem.delayIndex
              })
              break
            }
          }
          if (j === dptmLists.length) {
            dptmLists.push({
              "department": userItem.department,
              "userLists": []
            })
            dptmLists[j].userLists.push({
              "jobNumber": userItem.jobNumber,
              "userName": userItem.userName,
              "userID": userItem.userID,
              "delayIndex": userItem.delayIndex
            })
          }
        }
        console.log("hahah",dptmLists)
        wx.setStorageSync('dptmLists',dptmLists)
      }
    })
  },
  globalData: {
    userInfo: null,
    arrows_r: "/img/arrows-r.png",
    arrows_d: "/img/arrows-d.png",
    // http://10.66.4.112:8082
    // http://6jejfu.natappfree.cc
    baseUrl: 'http://ttt.nat300.top',
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTU5MTk0ODMwNjEsInBheWxvYWQiOiJ7XCJ1c2VySURcIjoyLFwidXNlck5hbWVcIjpcImpqalwiLFwib3BlbklEXCI6bnVsbCxcInVpZFwiOm51bGwsXCJqb2JOdW1iZXJcIjpcIjEyM1wiLFwiZGVsYXlJbmRleFwiOjAsXCJmYWNlSW5mb1wiOm51bGwsXCJkZWxldGVUYWdcIjpudWxsLFwiZGVwYXJ0bWVudFwiOlwi5YmN56uvXCIsXCJ1bml0SURcIjoxfSJ9.gzxuv7LKIg9KofaFRiY7mdoBCUXvVofbjAk6bZZWbbg"
  }
})