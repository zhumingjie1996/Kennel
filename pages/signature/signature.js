// pages/signature/signature.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultText: "",
    text: ""
  },

  getText: function (e) {
    let text = e.detail.value;
    this.setData({
      text
    })
  },
  commit: function () {
    let text = this.data.text;
    wx.cloud.callFunction({
        name: 'updateRecord',
        data: {
          userInfo: {
            signature: text
          }
        }
      })
      .then(() => {
        let tempPage = getCurrentPages(); // 当前页变量
        let prevPage = tempPage[tempPage.length - 2]; // 上一页变量
        // 这里给要打开的页面传递数据.
        prevPage.setData({
          signature: text, //对前一页数据渲染
        })
        wx.navigateBack({ //返回前一页
          delta: 1
        })
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let _this = this;
    const eventChannel = _this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      _this.setData({
        defaultText: data.data
      })
    })
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