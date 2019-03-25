// pages/order/order.js
const app = getApp()
const baseUrl = app.globalData.baseUrl
let utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    // winHeight: 0,
    // tab切换  
    currentTab: 0,
    // {
    //   date: "2019-04",
    //   orders: [{
    //     meetingID: "2",
    //     meetingRoom: "理四-409",
    //     title: "啦啦啦",
    //     status: 1,
    //     day: 10,
    //     week: "星期日",
    //     startTime: "16:00",
    //     endTime: "17:00"
    //   }]
    // }
    orderLists: [],
    relatedOrderLists: []
  },
  onLoad: function () {
    this.setData({
      userID: wx.getStorageSync("userID"),
      userName: wx.getStorageSync("userName"),
      unitID: wx.getStorageSync("unitID")
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getInfo()
    this.getRelatedOrderInfo()
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  getInfo: function () {
    let orderLists = []
    let that = this
    wx.request({
      url: `${baseUrl}/workunits/${that.data.unitID}/users/${that.data.userID}/meetings`,
      methods: 'GET',
      success(res) {
        console.log(res)
        let monthStr = ''
        let orders = res.data
        for (let item in orders) {
          monthStr = utils.formatMonth(new Date(orders[item].startTime))
          let [startHours, startMinutes, finishHours, finishMinutes] = [utils.addZero(new Date(orders[item].startTime).getHours()),
            utils.addZero(new Date(orders[item].startTime).getMinutes()),
            utils.addZero(new Date(orders[item].finshTime).getHours()),
            utils.addZero(new Date(orders[item].finshTime).getMinutes())
          ]
          let orderItem = {
            meetingID: orders[item].meetingID,
            meetingRoom: orders[item].roomName,
            title: "开会了",
            status: orders[item].status,
            day: new Date(orders[item].startTime).getDate(),
            week: utils.toWeekDay(new Date(orders[item].startTime).getDay()),
            startTime: `${startHours}:${startMinutes}`,
            finishTime: `${finishHours}:${finishMinutes}`
          }
          for (var i = 0; i < orderLists.length; i++) {
            if (monthStr == orderLists[i]['date']) {
              orderLists[i].orders.push(orderItem)
              break
            }
          }
          if (i == orderLists.length) {
            orderLists.push({
              date: monthStr,
              orders: [orderItem]
            })
          }
        }
        that.setData({
          orderLists: orderLists
        })
        console.log(that.data.orderLists)
        that.heightLoad()
      }
    })
  },
  getRelatedOrderInfo: function () {
    let relatedOrderLists = []
    let that = this
    let dateStr = utils.formatDate(new Date())
    console.log(`${baseUrl}/workunits/${that.data.unitID}/users/${that.data.userID}/meetings?timestamp=${dateStr}`)
    wx.request({
      url: `${baseUrl}/workunits/${that.data.unitID}/users/${that.data.userID}/meetings?timestamp=${dateStr}`,
      methods: 'GET',
      success(res) {
        console.log(res)
        let monthStr = ''
        let orders = res.data
        for (let item in orders) {
          monthStr = utils.formatMonth(new Date(orders[item].startTime))
          let [startHours, finishHours, startMinutes, finishMinutes] = [utils.addZero(new Date(orders[item].startTime).getHours()),
            utils.addZero(new Date(orders[item].startTime).getMinutes()),
            utils.addZero(new Date(orders[item].finshTime).getHours()),
            utils.addZero(new Date(orders[item].finshTime).getMinutes())
          ]
          let orderItem = {
            meetingID: orders[item].meetingID,
            meetingRoom: orders[item].roomName,
            title: "开会了",
            status: orders[item].status,
            day: new Date(orders[item].startTime).getDate(),
            week: utils.toWeekDay(new Date(orders[item].startTime).getDay()),
            startTime: `${startHours}:${startMinutes}`,
            finishTime: `${finishHours}:${finishMinutes}`
          }
          for (var i = 0; i < relatedOrderLists.length; i++) {
            if (monthStr == relatedOrderLists[i]['date']) {
              relatedOrderLists[i].orders.push(orderItem)
              break
            }
          }
          if (i == relatedOrderLists.length) {
            relatedOrderLists.push({
              date: monthStr,
              orders: [orderItem]
            })
          }
        }
        that.setData({
          relatedOrderLists: relatedOrderLists
        })
        console.log(that.data.relatedOrderLists)
        that.heightLoad()
      }
    })
  },
  showOperation: function (e) {
    let listIndex = e.currentTarget.dataset.listindex
    let orderIndex = e.currentTarget.dataset.orderindex
    let meetingid = e.currentTarget.dataset.meetingid
    let that = this
    let status = e.currentTarget.dataset.status
    console.log(that.data.orderLists)
    console.log(e.currentTarget.dataset)
    wx.showActionSheet({
      itemList: !status ? ['预约详情', '取消预约'] : ['预约详情', '踩上一个会议'],
      success(res) {
        if (res.tapIndex == 1) {
          let lists = that.data.orderLists
          let orders = lists[listIndex].orders
          orders.splice(orderIndex, 1)
          if (orders == undefined || orders.length == 0) {
            lists.splice(listIndex, 1)
          }
          that.setData({
            orderLists: lists
          })
        } else if (res.tapIndex == 0) {
          let url = status === "1" ?
            `/pages/order-detail/order-detail?meetingId=${meetingid}` :
            `/pages/notice-detail/notice-detail?meetingId=${meetingid}`
          wx.navigateTo({
            url: url
          })
        }
      }
    })
  },
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });

  },
  heightLoad: function () {
    let height = 0;
    let orderLists = this.data.orderLists
    for (let i = 0; i < orderLists.length; i++) {
      for (let j = 0; j < orderLists[i].orders.length; j++) {
        height += 170
      }
      height += 80
    }
    this.setData({
      height: height
    })
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})