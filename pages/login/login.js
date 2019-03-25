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
          // app.globalData.unitID = that.data.unitID
          // app.globalData.userName = that.data.userName
          // app.globalData.jobNumber = that.data.jobNumber
          // app.globalData.userID = res.data.userID
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
  }
})