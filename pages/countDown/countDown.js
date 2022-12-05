// pages/countDown/countDown.js
import {
  formatTime
} from '../../components/countDownItem/utils'
import { formatTimeInterval } from "./utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //新增弹窗
    addShow: false,
    //新增的时间
    addDate: undefined,
    // 新增倒计时的日历弹窗
    addCalendarShow: false,
    // 新增表单
    addData: {},
    // 是否正在上传
    isUploadNow: false,
    // 数据列表
    dataList: [],
    // 置顶项
    topItem: undefined,
    // 已经/还有
    isGone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // 获取列表
  getDataList () {
    // 获取
    wx.cloud.callFunction({
      name: 'getSomething',
      data: {
        name: 'countDownEvents',
        whereObj: {}
      }
    }).then(res => {
      this.setData({
        dataList: res.result.data
      })
      // 置顶
      let topItem = this.data.dataList.filter(item => {
        return item.isTop === true
      })
      // 如果没有置顶项
      if (topItem.length === 0) return
      this.setData({
        topItem: topItem[0]
      })
      if (this.data.int) {
        this.setData({
          int: undefined,
          timeInterval: undefined,
          isGone: '',
        })
      }
      this.setData({
        int: setInterval(() => {
          let timeInterval = formatTimeInterval(Math.abs(new Date().getTime() - this.data.topItem.eventDate))
          let isGone = false;
          if (new Date().getTime() - this.data.topItem.eventDate >= 0) {
            isGone = true
          } else {
            isGone = false
          }
          this.setData({
            timeInterval,
            isGone: isGone ? '已经' : '还有',
          })
        }, 1000)
      })
    })
  },
  // 点击新增倒计时
  addCountDown () {
    this.setData({
      addShow: true,
      addData: {
        // 事件名称
        eventName: '',
        // 事件时间
        eventDate: new Date().getTime(),
        // 事件是否置顶当前页面
        isTop: false,
        // 事件是否在首页显示
        isShowIndex: false,
      }
    })
  },

  //关闭新增弹窗
  onAddClose () {
    this.setData({
      addShow: false
    })
  },
  // 显示新增选择日期弹窗
  showAddCalendar () {
    this.setData({
      addCalendarShow: true,
    })
  },
  // 关闭新增选择日期弹窗
  onCloseAddCalendar () {
    this.setData({
      addCalendarShow: false
    })
  },
  // 因为输入框的双向绑定不能是表达式a.b所以用事件来监听修改
  changeEventName (event) {
    this.setData({
      "addData.eventName": event.detail
    })
  },
  // 点击确定选择日期
  onInput (event) {
    this.setData({
      "addData.eventDate": event.detail
    });
    this.onCloseAddCalendar()
  },
  // 点击取消选择日期
  onCancel () {
    this.onCloseAddCalendar()
  },
  // 点击上传
  commit () {
    let _this = this;
    if (_this.data.addData.eventName === '') {
      wx.showToast({
        title: '请输入事件名称',
        icon: 'none'
      })
      return
    }
    // 显示正在上传
    this.setData({
      isUploadNow: true
    })
    wx.cloud.callFunction({
      name: 'addSomething',
      data: {
        name: 'countDownEvents',
        addData: _this.data.addData
      }
    }).then(res => {
      this.setData({
        isUploadNow: false
      })
      wx.showToast({
        icon: 'success',
        title: '上传成功'
      });
      // 关闭新增弹窗
      this.onAddClose();
      this.getDataList()
    })
  },
  // 修改是否置顶显示
  onChangeTop () {
    this.setData({
      "addData.isTop": !this.data.addData.isTop
    })
  },
  //修改是否在首页展示
  onChangeShowIndex () {
    this.setData({
      "addData.isShowIndex": !this.data.addData.isShowIndex
    })
  },
  //子组件删除成功后调用事件
  deleteOver: function () {
    let _this = this;
    _this.setData({
      dataList: [],
      topItem:{}
    });
    _this.getDataList();
  },
})