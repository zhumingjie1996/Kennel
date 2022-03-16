// pages/score/score.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addReasonShow: false,
    delReasonShow: false,
    total: 0,
    addScore: 5,
    delScore:-5,
    reason: ""
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    wx.cloud.callFunction({
      name: 'getNumberStatistic',
    }).then(res => {
      let item = res.result.data[0];
      _this.setData({
        total: item.total
      })
    })
  },

  // 点击加分
  addScore() {
    let _this = this;
    _this.setData({
      addReasonShow: true
    })
  },

  // 点击扣分
  delScore() {
    let _this = this;
    _this.setData({
      delReasonShow: true
    })
  },

  // 点击确定加分按钮
  commitScore() {
    let _this = this;
    if (_this.data.reason === '') {
      wx.showToast({
        title: '填个理由吧',
        icon: 'none'
      });
      return;
    }
    let addObject = {
      score: _this.data.addScore,
      reason: _this.data.reason,
      total: _this.data.total + (_this.data.addReasonShow ? _this.data.addScore : _this.data.delScore),
      addOrDel:_this.data.addReasonShow?'add':'del'
    };
    wx.cloud.callFunction({
      name: 'updateScore',
      data: addObject
    }).then(res => {
      _this.onShow();
      _this.onCloseAddReason();
      _this.onCloseDelReason();
      _this.setData({
        addScore: 5,
        delScore: -5,
        reason: "",
      })
    })
  },

  // 关闭理由弹窗
  onCloseAddReason() {
    let _this = this;
    _this.setData({
      addReasonShow: false,
      addScore: 5,
      reason: ""
    })
  },
  onCloseDelReason() {
    let _this = this;
    _this.setData({
      delReasonShow: false,
      delScore:-5,
      reason:""
    })
  },

  // 加分分值变化
  onAddScoreChange(e) {
    let _this = this;
    _this.setData({
      addScore: e.detail
    })
  },
  // 扣分分值变化
  onDelScoreChange(e){
    let _this = this;
    _this.setData({
      delScore: e.detail
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})