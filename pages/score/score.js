// pages/score/score.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isZiYue:false,
    addReasonShow: false,
    delReasonShow: false,
    total: 0,
    addScore: 5,
    delScore: -5,
    reason: "",
    addList: [],
    delList: [],
    listActiveNames: [],
    addAllScore: 0,
    delAllScore: 0,
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
    // 判断是否显示加减分按钮
      _this.setData({isZiYue:app.globalData.userInfo.openId === 'o9v6H5ABKYC6huP9uvO7AAT511Tc'});
    wx.cloud.callFunction({
      name: 'getNumberStatistic',
    }).then(res => {
      let item = res.result.data[0];
      _this.setData({
        total: item.total,
        addList: item.add.reverse(),
        delList: item.del.reverse(),
        addAllScore: _this.addDelSocreAll(item.add, 'add'),
        delAllScore: _this.addDelSocreAll(item.del, 'del'),
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
    wx.showLoading({
      title: '加载中'
    })
    let addObject = {
      score: _this.data.addReasonShow ? _this.data.addScore : _this.data.delScore,
      reason: _this.data.reason,
      total: _this.data.total + (_this.data.addReasonShow ? _this.data.addScore : _this.data.delScore),
      addOrDel: _this.data.addReasonShow ? 'add' : 'del',
      id:_this.randomString(10),
      pushOrPull:'push'
    };
    wx.cloud.callFunction({
      name: 'uploadScoreList',
      data: addObject
    }).then(res => {
      wx.hideLoading({
        success: (res) => {
          _this.onShow();
          _this.onCloseAddReason();
          _this.onCloseDelReason();
          _this.setData({
            addScore: 5,
            delScore: -5,
            reason: "",
          })
        },
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
      delScore: -5,
      reason: ""
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
  onDelScoreChange(e) {
    let _this = this;
    _this.setData({
      delScore: e.detail
    })
  },

  // 格式化时间
  formatTimer(time) {
    return formatTime(time)
  },

  // 点击列表展开
  listOnChange(event) {
    this.setData({
      listActiveNames: event.detail,
    });
  },

  // 计算本月总加分
  addDelSocreAll(arr, flag) {
    let total = 0;
    if (flag === 'add') {
      arr.map(item => {
        total += item.score
      });
    } else {
      arr.map(item => {
        total -= item.score
      });
    }
    return total;
  },
  // 删除列表内容
  onDeleteAddList(event) {
    let _this = this;
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'right':
        wx.showModal({
          title: '提示',
          content: '确定要删除吗😉',
          success(res) {
            if (res.confirm) {
              instance.close();
              wx.showLoading({
                title:'删除中...'
              })
              wx.cloud.callFunction({
                name:"uploadScoreList",
                data:{
                  ...event.currentTarget.dataset,
                  addOrDel:event.currentTarget.dataset.addordel,
                  pushOrPull:'pull',
                  total: _this.data.total - event.currentTarget.dataset.score,
                }
              }).then(res=>{
                wx.hideLoading();
                _this.onShow();
              })
            } else if (res.cancel) {
              instance.close()
            }
          }
        })
        break;
    }
  },

  // 生成随机lsit的id
  randomString(len) {
    len = len || 32;
    let timestamp = new Date().getTime();
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let $chars = 'ABCDEFGHJKMNOPQRSTUVWXYZabcdefhijkmnprstwxyz2345678';
    let maxPos = $chars.length;
    let randomStr = '';
    for (let i = 0; i < len; i++) {
      randomStr += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return randomStr + timestamp;
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