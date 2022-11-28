// pages/friends/friends.js
var RemoveFade = require('../../behaviors/removeFade/removeFade.js');
var app = getApp();
Page({
  behaviors: [RemoveFade],
  /**
   * 页面的初始数据
   */
  data: {
    friendList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.getUserList().then(res=>{
      let resList = res.result.data;
      // let friendList = [];
      // resList.map((item)=>{
      //   if(item._openid !== app.globalData.userInfo.openId){
      //     friendList.push(item)
      //   }
      // })
      _this.setData({
        friendList:resList
      })
    })
  },

  toTimeAndDogsNone:function(){
    wx.showToast({
      title: '敬请期待',
      icon:'error'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.addFade();
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.removeFade();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let _this = this;
    _this.setData({
      friendList: [],
    });
    _this.getUserList().then(res=>{
      let resList = res.result.data;
      _this.setData({
        friendList:resList
      })
      wx.stopPullDownRefresh({
        success: (res) => {
          wx.showToast({
            title: '刷新成功😎',
            icon: 'none'
          })
        },
      })
    })
  },
  getUserList:function(){
    return wx.cloud.callFunction({
      name:"getUser"
    })
  },
  toScore:function(){
    // this.toTimeAndDogsNone();
    wx.navigateTo({
      url: '../score/score',
    })
  },
  // 跳转到表白墙
  toWall(){
    wx.navigateTo({
      url: '../wall/wall',
    })
  },
  toCountDown:function(){
    wx.navigateTo({
      url: '../countDown/countDown',
    })
  }
})