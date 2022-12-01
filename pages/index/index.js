// index.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
var RemoveFade = require('../../behaviors/removeFade/removeFade.js');
Page({
  behaviors: [RemoveFade],
  data: {
    pageNum: 0, //当前页码
    commitList: [],
    bottomTip: '你已经扒拉到底了～',
    isOperate: false,
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
  getTopCountDown(){
    wx.cloud.callFunction({
      name:'getSomething',
      data:{
        name:'countDownEvents',
        whereObj:{isTop:true}
      }
    }).then(res=>{
      this.setData({
        topCountDownItem:res.result.data[0]
      })
    })
  },
  deleteOver: function () {
    let _this = this;
    _this.setData({
      commitList: [],
      pageNum: 0
    });
    _this.getCommits();
  },
  onLoad() {
    let _this = this;
    _this.getCommits();
  },
  onShow: function () {
    this.addFade();
    this.getTopCountDown()
  },
  onHide() {
    this.removeFade();
  },
  operate() {
    this.setData({
      isOperate: !this.data.isOperate
    })
    wx.vibrateShort({
      type: 'light'
    });
  },
  toEdit() {
    // 直接去编辑
    wx.vibrateShort({type: 'heavy'});
    this.setData({
      isOperate:false
    })
    wx.navigateTo({
      url: '../../pages/write/write',
    })
  },
  operateButton(e) {
    let operateName = e.currentTarget.dataset.operatename;
    if (operateName === 'edit') {
      // 编辑
      wx.navigateTo({
        url: '../../pages/write/write',
      })
    } else if (operateName === 'top') {
      // 回到顶部
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300,
        success: function () {
          wx.showToast({
            title: '已置顶😎',
            icon: "none"
          })
        }
      })
    } else if (operateName === 'refresh') {
      // 刷新页面
      wx.startPullDownRefresh()
    }
  },

  closeOperate() {
    this.setData({
      isOperate: false
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let _this = this;
    _this.setData({
      commitList: [],
      pageNum: 0
    });
    _this.getCommits();
    wx.stopPullDownRefresh({
      success: (res) => {
        wx.showToast({
          title: '刷新成功😎',
          icon: 'none'
        })
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