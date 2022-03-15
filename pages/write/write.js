// pages/write/write.js
var RemoveFade = require('../../behaviors/removeFade/removeFade.js');
var app = getApp();
import {
  formatTime
} from '../../utils/util.js';
Page({
  behaviors: [RemoveFade],
  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    location: "",
    textValue: "",
    toName: '',
    isSendMessage: true
  },

  beforeRead(event) {
    const {
      file,
      callback
    } = event.detail;
    console.log(file)
    callback(true);
  },
  afterRead(event) {
    let _this = this;
    console.log(event);
    _this.setData({
      fileList: _this.data.fileList.concat(event.detail.file)
    })
  },
  // 删除
  deleteImg(event) {
    let index = event.detail.index;
    let fileList = this.data.fileList;
    fileList.splice(index, 1);
    this.setData({
      fileList
    })
    // this.data.fileList.splice(index,1)
  },

  chooseLocation() {
    let _this = this;
    wx.choosePoi({
      success: function (res) {
        _this.setData({
          location: res.type === 1 ? res.city : res.name
        })
      }
    })
  },
  commit: function () {
    let _this = this;
    if (_this.data.textValue === "") {
      wx.showToast({
        title: '说点什么吧',
        icon: 'error'
      })
      return
    } else if (_this.data.fileList.length === 0) {
      wx.showModal({
        title: '提示',
        content: '是否不添加图片或视频',
        success: function (e) {
          if (e.confirm) {
            _this.commit()
          } else {
            return;
          }
        }
      })
    } else {
      _this.commit()
    }
  },

  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.url,
    });
  },

  commit: function () {
    let _this = this;
    if(_this.data.textValue === ''){
      wx.showToast({
        title: '你啥也没写👀',
        icon:'none'
      });
      return;
    }
    var datahash = Date.parse(new Date());
    wx.showLoading({
      title: '正在上传',
    })
    const {
      fileList
    } = _this.data;
    const uploadTasks = fileList.map((file, index) => _this.uploadFilePromise(`my-photo${datahash}${index}-${file.type === 'image'?'image':'video'}`, file));
    console.log(fileList)
    Promise.all(uploadTasks)
      .then(data => {
        console.log(data)
        return wx.cloud.callFunction({
          name: 'addCommit',
          data: {
            fileList: data,
            location: _this.data.location,
            textValue: _this.data.textValue
          }
        })
      })
      .then(res => {
        wx.showToast({
          title: '上传成功😋',
          icon: 'none',
          success: function () {
            _this.setData({
              fileList: [],
              location: "",
              textValue: "",
            });
            if (_this.data.isSendMessage) {
              // 消息推送
              let openIdList = app.globalData.openIdList;
              let openid = app.globalData.userInfo.openId;
              let anotherOpenid = '';
              openIdList.map((item, index) => {
                if (openid !== item.openid) {
                  anotherOpenid = item.openid;
                } else {
                  _this.setData({
                    toName: item.name
                  })
                }
              });
              _this.send(anotherOpenid);
            }
          }
        });
      })
      .catch(e => {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
        console.log(e);
      });
  },
  onChangeSendMessage() {
    let _this = this;
    wx.vibrateShort({
      type: 'light'
    });
    _this.setData({
      isSendMessage: !_this.data.isSendMessage
    })
  },
  //发送模板消息给指定的openId用户
  send: function (openid) {
    let _this = this;
    console.log(openid, _this.data.toName, formatTime(new Date()))
    wx.cloud.callFunction({
      name: "message",
      data: {
        openid: openid,
        title: '😘😎😊😉😍',
        name: _this.data.toName,
        time: formatTime(new Date()),
      }
    }).then(res => {
      console.log("发送通知成功", res)
    }).catch(res => {
      console.log("发送通知失败", res)
    });
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
    this.addFade();
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