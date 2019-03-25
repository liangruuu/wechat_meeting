// pages/index/login.js
const app = getApp()
const [baseUrl] = [app.globalData.baseUrl]
Page({
  data: {
    jobNumber: "",
    userName: "",
    unitID: ""
  },
  UnitIdInput: function (e) {
    this.setData({
      unitID: e.detail.value
    })
  },
  //获取用户输入的用户名
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  jobNumberInput: function (e) {
    this.setData({
      jobNumber: e.detail.value
    })
  },
  //获取用户输入的密码
  loginBtnClick: function (e) {
    console.log("工号" + this.data.jobNumber + " 名字：" + this.data.userName);
    this.login()
  },
  login: function () {
    let that = this
    console.log(this.data)
    wx.request({
      url: `${baseUrl}/workunits/${that.data.unitID}/users`,
      method: 'PUT',
      data: {
        unitID: that.data.unitID,
        userName: that.data.userName,
        jobNumber: that.data.jobNumber,
        code: wx.getStorageSync('code')
      },
      success(res) {
        console.log("lalal", res)
        if (res.data.userID !== undefined) {
          wx.setStorageSync("token", res.data.token)
          wx.setStorageSync("unitID", res.data.unitID)
          wx.setStorageSync("userName", that.data.userName)
          wx.setStorageSync("jobNumber", that.data.jobNumber)
          wx.setStorageSync("userID", res.data.userID)
          that.getUserLists()
          wx.switchTab({
            url: '/pages/homepage/homepage'
          })
          console.log(wx.getStorageSync("token"))
        } else {
          wx.showToast({
            title: '信息填写错误',
            image: '/img/error.png',
            duration: 2000
          });
        }
      }
    })
  },
  getUserLists: function () {
    let dptmLists = []
    console.log
    let unitID = wx.getStorageSync("unitID");
    wx.request({
      url: `${baseUrl}/workunits/${unitID}/users`,
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
        console.log("hahah", dptmLists)
        wx.setStorageSync('dptmLists', dptmLists)
      }
    })
  }
})