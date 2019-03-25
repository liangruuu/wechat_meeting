// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    List: [{
        iamges: "/assets/logo_aiqiyi2x.png",
        cont: "爱奇艺影视会员",
        discount: "7.5折",
        down: "/assets/icon_down2x.png",
        hiddena: true,
        id: "0",
        invalidActivty: [{
            price: "2.98元",
            oldPrice: "3元",
            validType: "周卡",
            validTime: '7天有效'
          },
          {
            price: "18.98元",
            oldPrice: "25元",
            validType: "月卡",
            validTime: '30天有效'
          },
        ]
      },
      {
        iamges: "/assets/logo_tengxun2x.png",
        cont: "腾讯视频会员",
        discount: "7折",
        down: "/assets/icon_down2x.png",
        hiddena: true,
        id: "1",
        invalidActivty: [{
            price: "2.98元",
            oldPrice: "3元",
            validType: "周卡",
            validTime: '7天有效'
          },
          {
            price: "18.98元",
            oldPrice: "25元",
            validType: "月卡",
            validTime: '30天有效'
          },
        ]
      },
      {
        iamges: "/assets/logo_youku2x.png",
        cont: "优酷视频黄金会员",
        discount: "8折",
        down: "/assets/icon_down2x.png",
        hiddena: true,
        id: "2",
        invalidActivty: [{
            price: "2.98元",
            oldPrice: "3元",
            validType: "周卡",
            validTime: '7天有效'
          },
          {
            price: "18.98元",
            oldPrice: "25元",
            validType: "月卡",
            validTime: '30天有效'
          },
        ]
      },
      {
        iamges: "/assets/logo_sohu2x.png",
        cont: "搜狐视频黄金会员",
        discount: "8折",
        down: "/assets/icon_down2x.png",
        hiddena: true,
        id: "3",
        invalidActivty: [{
            price: "2.98元",
            oldPrice: "3元",
            validType: "周卡",
            validTime: '7天有效'
          },
          {
            price: "18.98元",
            oldPrice: "25元",
            validType: "月卡",
            validTime: '30天有效'
          },
        ]
      },
    ]
  },
  isOpen: function(e) {
    var that = this;
    var idx = e.currentTarget.dataset.index;
    var List = that.data.List;
    var curId = 0;
    for (var i = 0; i < List.length; i++) {
      if (idx == i) {
        if (List[i].hiddena == true && List[i].down == "/assets/icon_down2x.png") {
          List[i].down = "/assets/icon_up2x.png";
        } else {
          List[i].down = "/assets/icon_down2x.png";
        }
        List[i].hiddena = !List[i].hiddena;
        curId = i;
      } else {
        List[i].hiddena = true;
        List[i].down = "/assets/icon_down2x.png";
      }
    }
    this.setData({
      List: List
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})