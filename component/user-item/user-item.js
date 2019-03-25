// component/user-item/user-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userName: String,
    userIndex: Number,
    dptmIndex: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: false
  },
  lifetimes: {
    attached() {
      this.judgeChosed()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    activate: function() {
      let selected = this.data.selected
      selected = !selected
      this.setData({
        selected: selected
      })
      this.triggerEvent('myevent', {
        selected: this.data.selected,
        userIndex: this.data.userIndex,
        dptmIndex: this.data.dptmIndex
      })
    },
    judgeChosed: function() {
      let chosedStatus = wx.getStorageSync("chosedStatus")
      if (chosedStatus) {
        for (let i = 0; i < chosedStatus.length; i++) {
          let dptmIndex = chosedStatus[i].dptmIndex
          let userIndex = chosedStatus[i].userIndex
          if (dptmIndex == this.data.dptmIndex && userIndex == this.data.userIndex) {
            this.setData({
              selected: true
            })
          }
        }
      }
    }
  }
})