// pages/countDown/countDown.js
import {
  formatTime
} from '../../components/countDownItem/utils'
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
    addData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let dateNow = new Date()
    console.log(dateNow.getTime())
    let formatter = formatTime(2330268)
    console.log(formatter)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
  // 点击新增倒计时
  addCountDown() {
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
        isShowIndex: false
      }
    })
  },

  //关闭新增弹窗
  onAddClose() {
    this.setData({
      addShow: false
    })
  },
  // 显示新增选择日期弹窗
  showAddCalendar() {
    this.setData({
      addCalendarShow: true,
    })
  },
  // 关闭新增选择日期弹窗
  onCloseAddCalendar() {
    this.setData({
      addCalendarShow: false
    })
  },
  // 因为输入框的双向绑定不能是表达式a.b所以用事件来监听修改
  changeEventName(event){
    this.setData({
      "addData.eventName":event.detail
    })
  },
  // 点击确定选择日期
  onInput(event) {
    console.log(event)
  },
  // 点击上传
  commit() {
    let _this = this;
    if(_this.data.addData.eventName === ''){
      wx.showToast({
        title: '请输入事件名称',
        icon: 'none'
      })
      return
    }
    console.log(_this.data.addData)
  },
  // 修改是否置顶显示
  onChangeTop() {
    this.setData({
      "addData.isTop":!this.data.addData.isTop
    })
  },
  //修改是否在首页展示
  onChangeShowIndex() {
    this.setData({
      "addData.isShowIndex":!this.data.addData.isShowIndex
    })
  },
})