// pages/homepage.js
const app = getApp()
let date = new Date()
let currentHours = date.getHours(),
  currentMinutes = date.getMinutes()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationArray: [],
    // {
    //   "roomID": 1,
    //   "roomName": "理4-409",
    //   "location": "4楼",
    //   "config": "投影，白板,投影，白板,投影，白板投影，白板投影，白板投影，白板",
    //   "capacity": 10,
    //   "statusTag": 1,
    //   "workUnit": {
    //     "unitID": 0,
    //     "unitName": "zucc"
    //   }
    // }

    // {
    //   "roomID": 2,
    //   "roomName": "1号会议室",
    //   "location": "SecondFloor",
    //   "capacity": 11,
    //   "config": "笔",
    //   "statusTag": "在线",
    //   "padID": null,
    //   "unitID": 1
    // }
    meetingRooms: [],
    // {
    //   "roomID": 1,
    //   "meetingid": 1,
    //   "startTime": 1,
    //   "endTime": 0,
    //   "userName": "string",
    //   "delay": true
    // },
    meetings: [],
    timeParams: {
      curYear: parseInt(date.getFullYear()),
      curMonth: parseInt(date.getMonth()) + 1,
      curDay: parseInt(date.getDate())
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      unitID:wx.getStorageSync("unitID")
    })
    console.log(wx.getStorageSync("unitID"))
    this.getLocation()
  },
  // 在homePage页面获取当前日期
  onMyEvent: function (e) {
    let dateStr = e.detail
    let arr = dateStr.split('-')
    this.setData({
      timeStr: dateStr,
      timeParams: {
        curYear: parseInt(arr[0]),
        curMonth: parseInt(arr[1]),
        curDay: parseInt(arr[2])
      }
    })
    console.log('时间的e', e)
  },
  getLocation: function () {
    let baseUrl = app.globalData.baseUrl
    let that = this
    console.log(`${baseUrl}/workunits/${this.data.unitID}/locations`)
    wx.request({
      url: `${baseUrl}/workunits/${that.data.unitID}/locations`,
      // header: {
      //   "Authorization": app.globalData.token
      // },
      success(res) {
        console.log(res)
        that.setData({
          locationArray: res.data.locations
        })
      }
    })
  },
  forMeetingRooms: function (e) {
    let baseUrl = app.globalData.baseUrl
    let that = this
    console.log(`${baseUrl}/workunits/${this.unitID}/meetingrooms?location=${e.detail.locationParam}`)
    wx.request({
      url: `${baseUrl}/workunits/${that.data.unitID}/meetingrooms?location=${e.detail.locationParam}`,
      method: "GET",
      success(res) {
        console.log(res)
        that.setData({
          selectedLocation: e.detail.locationParam,
          meetingRooms: res.data
        })
      }
    })
  }
})