// pages/userlists/userlists.js
var app = getApp()
const baseUrl = app.globalData.baseUrl
const unitID = app.globalData.unitID
const userID = app.globalData.userID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chosedStatus: [],
    chosedLists: [],
    // {
    //   "department": "市场部",
    //   "userLists": [{
    //     "jobNumber": "31601352",
    //     "userName": "liangruuu"
    //   }, {
    //     "jobNumber": "31601351",
    //     "userName": "weibooo"
    //   }, {
    //     "jobNumber": "31601353",
    //     "userName": "jiyanggg"
    //   }]
    // }
    dptmLists: [],
    hiddenLists: [],
    imgLists: ["/img/arrows-r.png", "/img/arrows-r.png", "/img/arrows-r.png"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDptmLists()
    this.initHiddenLists()
    console.log(this.data.dptmLists)
    let chosedlists = wx.getStorageSync('chosedLists')
    console.log(chosedlists)
    if (chosedlists) {
      this.setData({
        chosedLists: chosedlists
      })
    }
  },
  isOpen: function (e) {
    let that = this
    let idx = e.currentTarget.dataset.dptmindex
    let curId = 0
    let hiddenlists = this.data.hiddenLists
    let imglists = this.data.imgLists
    for (let i = 0; i < this.data.dptmLists.length; i++) {
      if (idx == i) {
        hiddenlists[i] = !hiddenlists[i]
        imglists[i] = hiddenlists[i] == true ? app.globalData.arrows_r : app.globalData.arrows_d
        curId = i;
      } else {
        hiddenlists[i] = true;
        imglists[i] = app.globalData.arrows_r
      }
    }
    this.setData({
      hiddenLists: hiddenlists,
      imgLists: imglists
    })
  },
  changeActivate: function (e) {
    let chosedLists = this.data.chosedLists
    let chosedStatus = this.data.chosedStatus
    let user = this.data.dptmLists[e.detail.dptmIndex].userLists[e.detail.userIndex]
    if (e.detail.selected == true) {
      chosedLists.push(user)
      chosedStatus.push({
        dptmIndex: e.detail.dptmIndex,
        userIndex: e.detail.userIndex
      })
    } else {
      let index = -1
      for (let i = 0; i < chosedLists.length; i++) {
        if (chosedLists[i].jobNumber === user.jobNumber) {
          index = i
          break
        }
      }
      if (index > -1) {
        chosedLists.splice(index, 1)
        chosedStatus.splice(index, 1)
      }
    }
    wx.setStorageSync("chosedStatus", chosedStatus)
    wx.setStorageSync('chosedLists', chosedLists)
    this.setData({
      chosedLists: chosedLists,
      chosedStatus: chosedStatus
    })
    console.log(chosedLists)
  },
  initDptmLists: function () {
    let dptmLists = wx.getStorageSync('dptmLists')
    this.setData({
      dptmLists: dptmLists
    })
  },
  initHiddenLists: function () {
    let hiddenLists = this.data.hiddenLists
    let dptmLists = this.data.dptmLists
    for (let i = 0; i < dptmLists.length; i++) {
      hiddenLists.push("true")
    }
    this.setData({
      hiddenLists: hiddenLists
    })
  }
})