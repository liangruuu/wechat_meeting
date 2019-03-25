// pages/order-detail/order-detail.js
const utils = require('../../utils/util.js')
const app = getApp()
const [baseUrl] = app.globalData.baseUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultData: [{
      name: "开始时间",
      data: ""
    }, {
      name: "结束时间",
      data: ""
    }, {
      name: "会议地点",
      data: ""
    }],
    title: "",
    contents: "",
    createUser: {
      name: "会议组织人",
      data: {
        name: "",
        jobNumber: ""
      }
    },
    joinUser: {
      count: 0,
      data: []
    }
  },
  meetingTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  meetingContents: function (e) {
    this.setData({
      contents: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let createUser = this.data.createUser
    createUser.data = {
      name: app.globalData.userName,
      jobNumber: app.globalData.jobNumber
    }
    wx.setStorageSync('chosedLists', '')
    wx.setStorageSync('chosedStatus', '')
    this.setData({
      userID: wx.getStorageSync("userID"),
      meetingId: options.meetingId,
      unitID: wx.getStorageSync("unitID"),
      createUser: createUser
    })
    console.log(this.data)
    this.getInfo()
    this.loadUsersNumber()
  },
  onShow: function (options) {
    this.loadUsersNumber()
  },
  chooseUser: function () {
    wx.navigateTo({
      url: '/pages/userlists/userlists'
    })
  },
  loadUsersNumber: function () {
    let chosedLists = wx.getStorageSync('chosedLists')
    if (chosedLists) {
      this.setData({
        joinUser: {
          count: chosedLists.length,
          data: chosedLists
        }
      })
    }
  },
  loadDefault: function (startTime, finishTime, roomName) {
    let defaultData = this.data.defaultData
    defaultData[0].data = utils.formatTime(new Date(startTime))
    defaultData[1].data = utils.formatTime(new Date(finishTime))
    defaultData[2].data = roomName
    this.setData({
      defaultData: defaultData
    })
  },
  finish: function () {
    let that = this
    wx.request({
      url: `${baseUrl}/workunits/${that.data.unitID}/users/${that.data.userID}/meetings/${that.data.meetingId}`,
      method: 'PUT',
      data: {
        "startTime": that.data.startTime,
        "finish": that.data.finishTime,
        "subscribedTime": that.data.subscribedTime,
        "roomID": that.data.roomID,
        "userID": that.data.userID,
        "status": "已通知",
        "title": that.data.title,
        "contents": that.data.contents
      },
      success(res) {
        let chosedLists = wx.getStorageSync('chosedLists')
        let chosedIDLists = []
        for (let i = 0; i < chosedLists.length; i++) {
          chosedIDLists.push(chosedLists[i].userID)
        }
        if (chosedLists.length !== 0) {
          wx.request({
            url: `${baseUrl}/workunits/${that.data.unitID}/users/${that.data.userID}/meetings/${that.data.meetingId}/attend`,
            method: 'POST',
            data: {
              "userIDList": chosedIDLists
            },
            success(res) {
              console.log(res)
              wx.showToast({
                title: '預約成功',
                success() {
                  wx.switchTab({
                    url: '/pages/homepage/homepage'
                  })
                }
              })
            }
          })
        }
      }
    })

  },
  getInfo: function () {
    let that = this
    let url = `${baseUrl}/workunits/${that.data.unitID}/users/${that.data.userID}/meetings/${this.data.meetingId}`
    console.log(url)
    wx.request({
      url: url,
      method: 'GET',
      success(res) {
        let data = res.data
        console.log(data)
        that.setData({
          title: data.title,
          contents: data.contents,
          startTime: data.startTime,
          finishTime: data.finshTime,
          subscribedTime: data.subscribedTime,
          roomID: data.roomID,
          status: data.status,
          userID: data.userID
        })
        that.loadDefault(data.startTime, data.finshTime, data.meetingRoom.roomName)
      }
    })
  }
})