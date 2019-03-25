// pages/order-detail/order-detail.js
const utils = require('../../utils/util.js')
const app = getApp()
const [baseUrl] = [app.globalData.baseUrl]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    contents: "",
    lists: [{
      name: "开始时间",
      data: ""
    }, {
      name: "结束时间",
      data: ""
    }, {
      name: "会议地点",
      data: ""
    }, {
      name: "会议组织人",
      data: ""
    }],
    users: [{
      name: "原定参会人",
      data: []
    }, {
      name: "未到达",
      data: []
    }],
    status: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      meetingId: options.meetingId,
      userID: wx.getStorageSync("userID"),
      userName: wx.getStorageSync("userName"),
      unitID: wx.getStorageSync("unitID")
    })
    this.getInfo()
  },
  getInfo: function () {
    let that = this
    console.log(this.data.lists)
    wx.request({
      url: `${baseUrl}/workunits/${that.data.unitID}/users/${that.data.userID}/meetings/${that.data.meetingId}`,
      success(res) {
        console.log(res)
        let data = that.data
        data.title = res.data.title
        data.contents = res.data.contents
        data.lists[0].data = utils.formatTime(new Date(res.data.startTime))
        data.lists[1].data = utils.formatTime(new Date(res.data.finshTime))
        data.lists[2].data = res.data.meetingRoom.roomName
        data.lists[3].data = that.data.userName
        data.users[0].data = res.data.formers
        data.users[1].data = res.data.laters
        data.status = res.data.status
        that.setData(data)
        console.log(that.data)
      }
    })
  }
})