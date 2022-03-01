// pages/me/me.js
var RemoveFade = require('../../behaviors/removeFade/removeFade.js');
var talks = require('./behaviors/talk.js');
var DB = wx.cloud.database().collection('users');
var app = getApp();
Page({
  behaviors: [RemoveFade, talks],
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    nickname: 'nickname',
    avatarUrl: '',
    avatarUrlDefault: '../../assets/icons/avatar_default.png',
    signature: '',
    tian:0
  },

  test() {
    wx.cloud.callFunction({
      name: 'testCloudFunc'
    }).then(res => {
      console.log(res)
    })
  },
  getUserProfile: function () {
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          isLogin: true,
          nickname: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        });
        wx.cloud.callFunction({
          name: 'updateRecord',
          data: {
            userInfo: {
              nickName: this.data.nickname,
              avatarUrl: this.data.avatarUrl,
              isAuthorize: true
            }
          }
        }).then(res => {
          console.log(res)
        })
      }
    })
  },
  // 编辑个签
  writeSignature: function () {
    let _this = this;
    wx.navigateTo({
      url: '/pages/signature/signature',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: _this.data.signature
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
        name: 'getRecord',
        data: {
          openid: app.globalData.openid
        }
      })
      .then(res => {
        let userInfo = res.result.data[0].userInfo
        if (userInfo.isAuthorize) {
          this.setData({
            isLogin: true,
            nickname: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            signature: userInfo.signature
          })
        }
      })
  },

  touchAvatar: function () {
    wx.vibrateShort({
      type: 'heavy'
    });
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    if (this.data.touchNum) {
      animation.rotate(360).step()
    } else {
      animation.rotate(-360).step()
    }
    this.setData({
      animationData: animation.export(),
      touchNum:!this.data.touchNum
    })
  },

  // 获取赞和被赞的次数
  getTian(){
    wx.cloud.callFunction({
      name: 'getSomething',
      data: {
        name:'operateCommits',
        whereObj:{
          openid: app.globalData.openid
        }
      }
    })
    .then(res => {
      this.setData({
        tian:res.result.data.length
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
    this.addFade();
    this.getTian();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.removeFade();
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