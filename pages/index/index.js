// index.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
var RemoveFade = require('../../behaviors/removeFade/removeFade.js');
Page({
  behaviors: [RemoveFade],
  data: {
    pageNum: 0, //当前页码
    commitList: [],
    bottomTip: '你已经扒拉到底了～'
  },
  getCommits: function () {
    let _this = this;
    wx.cloud.callFunction({
        name: 'getCommit',
        data: {
          pageNum: _this.data.pageNum
        }
      })
      .then(res => {
        console.log(res);
        _this.setData({
          commitList: _this.data.commitList.concat(res.result.data)
        });
      })
      .catch(error => {
        console.log(error);
      })
  },
  onLoad() {
    let _this = this;
    _this.getCommits()
  },
  onShow: function () {
    this.addFade();
  },
  onHide(){
    this.removeFade();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let _this = this;
    _this.setData({
      commitList:[],
      pageNum: 0
    });
    _this.getCommits();
    wx.stopPullDownRefresh({
      success: (res) => {
        Notify({
          message: '刷新成功',
          color: '#fff',
          background: '#000',
          duration:"1000" 
        });
      },
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let _this = this;
    _this.setData({
      pageNum: _this.data.pageNum + 1
    });
    _this.getCommits();
  },
})