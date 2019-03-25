//获取应用实例
// var app = getApp()
var utils = require('../../utils/util.js')
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    dateList: [], // 日历数据数组
    swiperCurrent: 0, // 日历轮播正处在哪个索引位置
    dateCurrent: new Date(), // 正选择的当前日期
    dateCurrentStr: '', // 正选择日期的 id
    dateMonth: '1月', // 正显示的月份
    dateListArray: ['日', '一', '二', '三', '四', '五', '六'],
  },
  lifetimes: {
    attached() {
      this.initDate(); // 日历组件程序
      this.triggerEvent('myevent', this.data.dateCurrentStr)
    }
  },
  methods: {
    // 顶部 tab 部分
    choose1(e) {
      var that = this;
      this.setData({
        activityOrBrand: !that.data.activityOrBrand,
      });
      this.loadList();
    },

    // 日历组件部分
    initDate() {
      var d = new Date();
      var month = utils.addZero(d.getMonth() + 1),
        day = utils.addZero(d.getDate());
      for (var i = -3; i <= 3; i++) {
        this.updateDate(utils.DateAddDay(d, i * 7));
      }
      this.setData({
        swiperCurrent: 3,
        dateCurrent: d,
        dateCurrentStr: d.getFullYear() + '-' + month + '-' + day,
        dateMonth: month + '月',
      });
    },
    // 获取这周从周日到周六的日期
    calculateDate(_date) {
      var first = utils.FirstDayInThisWeek(_date);
      var d = {
        'month': first.getMonth() + 1,
        'days': [],
      };
      for (var i = 0; i < 7; i++) {
        var dd = utils.DateAddDay(first, i);
        var day = utils.addZero(dd.getDate()),
          month = utils.addZero(dd.getMonth() + 1);
        d.days.push({
          'day': day,
          'id': dd.getFullYear() + '-' + month + '-' + day,
        });
      }
      return d;
    },
    // 更新日期数组数据
    updateDate(_date, atBefore) {
      var week = this.calculateDate(_date);
      if (atBefore) {
        this.setData({
          dateList: [week].concat(this.data.dateList),
        });
      } else {
        this.setData({
          dateList: this.data.dateList.concat(week),
        });
      }
    },
    // 日历组件轮播切换
    dateSwiperChange(e) {
      var index = e.detail.current;
      var d = this.data.dateList[index];
      this.setData({
        swiperCurrent: index,
        dateMonth: d.month + '月',
      });
    },
    // 获得日期字符串
    getDateStr: function(arg) {
      if (utils.type(arg) == 'array') {
        return arr[0] + '-' + arr[1] + '-' + arr[2] + ' 00:00:00';
      } else if (utils.type(arg) == 'date') {
        return arg.getFullYear() + '-' + (arg.getMonth() + 1) + '-' + arg.getDate() + ' 00:00:00';
      } else if (utils.type(arg) == 'object') {
        return arg.year + '-' + arg.month + '-' + arg.day + ' 00:00:00';
      }
    },
    // 点击日历某日
    chooseDate(e) {
      var str = e.target.id
      console.log(e)
      this.triggerEvent('myevent', str)
      this.setData({
        dateCurrentStr: str,
      });
    },
    // 列表部分
    // ----------------------------
    onShareAppMessage: function() {
      return {
        title: '优惠尽在青浦奥莱',
        path: 'index'
      }
    }
  }
})