// component/room-item/room-item.js
var utils = require('../../utils/util.js')
const app = getApp()
const baseUrl = app.globalData.baseUrl
let date = new Date()
let currentHours = date.getHours(),
  currentMinutes = date.getMinutes()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timeStr: {
      type: String,
      observer(newVal, oldVal, changedPath) {
        this.loadMeetings()
      }
    },
    timeParams: Object,
    roomParams: {
      type: Object,
      observer(newVal, oldVal, changedPath) {
        this.loadMeetings()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeLists: new Array(48),
    curHours: new Date().getHours() == 0 ? 24 : new Date().getHours(),
    curMinutes: new Date().getMinutes() >= 30 ? 1 : 0,
    curTimeStamp: "",
    curTimeStampMinutes: "",
    meetings: [],
    multiArray: [
      // startHours
      // startMinutes
      // finishHours
      // finishMinutes
    ],
    multiIndex: [0, 0, 0, 0, 0, 0, 0],
  },

  lifetimes: {
    attached() {
      console.log(app.globalData)
      this.setData({
        userID: wx.getStorageSync("userID"),
        unitID: wx.getStorageSync("unitID")
      })
      console.log(this.data)
    },
    ready() {
      this.setTime()
      this.setData({
        curTimeStamp: utils.toTimeStamp(this.properties.timeParams.curYear, this.properties.timeParams.curMonth, this.properties.timeParams.curDay)
      })
    }
  },
  pageLifetimes: {
    show() {
      this.loadMeetings()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadTime: function (hours, minutes) {
      let minuteIndex
      if (currentMinutes <= 30)
        minuteIndex = 30
      else
        minuteIndex = 60
      if (minuteIndex == 60) {
        for (let i = currentHours + 1; i < 24; i++)
          hours.push(i)
        for (let i = 0; i < 60; i += 30)
          minutes.push(i)
      } else {
        for (let i = currentHours; i < 24; i++)
          hours.push(i)
        for (let i = minuteIndex; i < 60; i += 30)
          minutes.push(i)
      }
    },
    setTime: function () {
      let startHours = []
      let startMinutes = []
      let finishHours = []
      let finishMinutes = []
      this.loadTime(startHours, startMinutes)
      this.loadTime(finishHours, finishMinutes)
      this.setData({
        multiArray: [
          startHours, [':'],
          startMinutes, ['~'],
          finishHours, [':'],
          finishMinutes
        ]
      })
    },
    bindMultiPickerColumnChange: function (e) {
      var hours = [],
        minutes = [],
        data = {
          multiArray: this.data.multiArray,
          multiIndex: this.data.multiIndex
        }
      this.loadTime(hours, minutes)
      if (e.detail.value != 0)
        minutes = [0, 30]
      data.multiIndex[e.detail.column] = e.detail.value;
      if (e.detail.column == 0) {
        data.multiArray[0] = hours
        data.multiArray[2] = minutes
        data.multiIndex[2] = 0
      } else if (e.detail.column == 4) {
        data.multiArray[4] = hours
        data.multiArray[6] = minutes
        data.multiIndex[6] = 0
      }
      this.setData(data)
    },

    // i dont know why so many variables
    bindStartMultiPickerChange: async function (e) {
      let startHours = this.data.multiArray[0][this.data.multiIndex[0]]
      let startMinutes = this.data.multiArray[2][this.data.multiIndex[2]]
      let finishHours = this.data.multiArray[4][this.data.multiIndex[4]]
      let finishMinutes = this.data.multiArray[6][this.data.multiIndex[6]]
      let startTimeStamp = utils.toTimeStampMinutes(this.data.timeParams.curYear, this.data.timeParams.curMonth, this.data.timeParams.curDay, startHours, startMinutes)
      let finishTimeStamp = utils.toTimeStampMinutes(this.data.timeParams.curYear, this.data.timeParams.curMonth, this.data.timeParams.curDay, finishHours, finishMinutes)
      let roomParams = this.data.roomParams
      if (!this.orderIsOk(startTimeStamp, finishTimeStamp)) {
        wx.showToast({
          title: '本端时间已被占用，请选择其他时间',
          icon: "none"
        })
      } else {
        let meetingID = await this.applyForMeeting(startTimeStamp, finishTimeStamp)
        console.log(meetingID)
        let positionStr = JSON.stringify(roomParams)
        wx.showModal({
          title: "提示",
          content: "预约成功",
          cancelText: "完成",
          confirmText: "通知人员",
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: `/pages/notice-detail/notice-detail?startTime=${startTimeStamp}
                &endTime=${finishTimeStamp}&position=${positionStr}&meetingId=${meetingID}`,
              })
            }
          }
        })
      }
    },
    loadMeetings: function () {
      console.log("运行了loadMeetings方法")
      let meetingroomID = this.data.roomParams.roomID
      let that = this
      let meetings = this.data.meetings
      let unitID = wx.getStorageSync("unitID");
      console.log("url", `${baseUrl}/workunits/${unitID}/meetingrooms/${meetingroomID}?timestamp=${this.properties.timeStr}`)
      wx.request({
        url: `${baseUrl}/workunits/${unitID}/meetingrooms/${meetingroomID}?timestamp=${that.properties.timeStr}`,
        method: "GET",
        success(res) {
          console.log("会议室", res)
          let data = res.data
          meetings = []
          for (let item in data) {
            meetings.push({
              meetingId: data[item].meetingID,
              startTime: data[item].startTime,
              startHours: utils.toHours(data[item].startTime),
              startMinutes: utils.toMinutes(data[item].startTime) == 30 ? 1 : 0,
              finishTime: data[item].finshTime,
              finishHours: utils.toHours(data[item].finshTime),
              finishMinutes: utils.toMinutes(data[item].finshTime) == 30 ? 1 : 0,
              userName: data[item].userName,
              delayIndex: data[item].delayIndex
            })
          }
          that.setData({
            meetings: meetings
          })
        }
      })
    },
    orderIsOk(startTime, finishTime) {
      let curMeetings = this.data.meetings
      console.log(curMeetings)
      for (let i = 0; i < curMeetings.length; i++) {
        if (finishTime >= Date.parse(curMeetings[i].startTime) && startTime <= Date.parse(curMeetings[i].finishTime)) {
          return false
        }
      }
      return true
    },
    applyForMeeting: function (startTimeStamp, finishTimeStamp) {
      return new Promise((resolve, reject) => {
        let that = this
        let userID = this.data.userID,
          unitID = this.data.unitID
        console.log(`${baseUrl}/workunits/${unitID}/users/${userID}/meetings/1`)
        wx.request({
          url: `${baseUrl}/workunits/${unitID}/users/${userID}/meetings/1`,
          method: 'POST',
          data: {
            "startTime": utils.toTTime(new Date(startTimeStamp)),
            "finshTime": utils.toTTime(new Date(finishTimeStamp)),
            "status": "未通知",
            "roomID": this.properties.roomParams.roomID,
            "userID": userID,
            "subscribedTime": utils.toTTime(new Date())
          },
          success(res) {
            console.log("我是applyForMeeting方法的返回值", res)
            resolve(res.data)
            that.loadMeetings()
          }
        })
      })
    }
  }
})