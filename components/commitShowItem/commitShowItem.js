// components/commitShowItem/commitShowItem.js
import {
  formatTime
} from '../../utils/util.js';
import {
  timeago
} from '../../utils/timeAgo'
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openid: {
      type: String,
      default: '',
      observer: function (newVal) {
        let _this = this;
        _this.getUserInfoByOpenid(newVal).then(res => {
          _this.setData({
            nickname: res.result.data[0].userInfo.nickName,
            avatarUrl: res.result.data[0].userInfo.avatarUrl
          })
        });
        // 如果openid和当前登陆的openid相同，则显示删除按钮
        _this.setData({
          showDelete: newVal === app.globalData.userInfo.openId
        })
      }
    },
    fileList: {
      type: Array,
      default: function () {
        return []
      },
      observer: function (newVal) {
        let _this = this;
        let imgList = [];
        let imgsrcList = [];
        newVal.map((item) => {
          let arrSplit = item.fileID.split('-');
          imgList.push({
            url: item.fileID,
            type: arrSplit[arrSplit.length - 1]
          });
          imgsrcList.push(item.fileID);
        });
        //如果图片只有一张，那么判断图片的长宽大小
        if (imgList.length === 1) {
          wx.getImageInfo({
            src: imgList[0].url,
            success (res) {
              if (res.height >= res.width) {
                imgList[0].isWidthBig = false
              } else {
                imgList[0].isWidthBig = true
              }
              _this.setData({
                imgList,
                imgsrcList
              });
            }
          })
          return
        }
        _this.setData({
          imgList,
          imgsrcList
        });
      }
    },
    location: {
      type: String,
      default: ""
    },
    dateAndTime: {
      type: String,
      default: "",
      observer: function (newVal) {
        // console.log(new Date(newVal).getTime())
        let timeTamp = timeago(new Date(newVal).getTime())
        // let dateAndTimeDetail = this.timeFormatter(newVal);
        let dateAndTimeAfterFormat = timeTamp
        this.setData({
          date: dateAndTimeAfterFormat
        })
      }
    },
    textValue: {
      type: String,
      default: ""
    },
    commitId: {
      type: String,
      default: '',
      observer: function () {
        this.getComments(0);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    nickname: "",
    avatarUrl: "",
    imgList: [],
    date: "",
    tianNum: 0,
    kenNum: 0,
    commentList: [],
    commontValue: '',
    showDelete: false,
    showComment: false, //显示评论框
    isShowTimeDetail: false, // 是否显示完整时间
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let _this = this;
      // Promise.all([
      //   _this.getOperateCommits('tian'),
      //   _this.getOperateCommits('ken')
      // ]).then(res => {
      //   let tianNum = res[0].result.data.length;
      //   let kenNum = res[1].result.data.length;
      //   _this.setData({
      //     tianNum,
      //     kenNum
      //   })
      // })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfoByOpenid: function (openid) {
      // 通过openid获取发布动态者的头像和昵称信息
      return wx.cloud.callFunction({
        name: 'getUserInfoByOpenid',
        data: {
          openid
        }
      })
    },
    previewImgs: function (e) {
      let _this = this;
      let nowImgIndex = e.currentTarget.dataset.nowindex;
      wx.previewMedia({
        current: nowImgIndex, // 当前显示图片的http链接
        sources: _this.data.imgList // 需要预览的图片http链接列表
      })
    },
    // operateCommit: function (operateName) {
    //   // 舔或啃
    //   // 可以同时舔和啃，但是只能每条最多一次
    //   let _this = this;
    //   if (!_this.data.commitId || _this.data.commitId === "") {
    //     wx.showToast({
    //       title: '未获取到动态id',
    //       icon: 'none'
    //     })
    //     return;
    //   }
    //   return wx.cloud.callFunction({
    //     name: 'operateCommit',
    //     data: {
    //       operateName,
    //       commitId: _this.data.commitId,
    //       addOrRemove: 'add'
    //     }
    //   })
    // },
    // tian: function () {
    //   let _this = this;
    //   _this.operateCommit('tian').then(() => {
    //     _this.setData({
    //       tianNum: _this.data.tianNum + 1
    //     });
    //   })
    // },
    // ken: function () {
    //   let _this = this;
    //   _this.operateCommit('ken').then(() => {
    //     _this.setData({
    //       kenNum: _this.data.kenNum + 1
    //     })
    //   })
    // },
    // getOperateCommits: function (operateType) { //operateType:tian/ken
    //   // 获取当前动态的啃和舔的数据
    //   let _this = this;
    //   return wx.cloud.callFunction({
    //     name: 'getOperateCommit',
    //     data: {
    //       commitId: _this.data.commitId,
    //       operateType
    //     }
    //   })
    // },
    getComments: function (type) {
      // 获取当前动态的评论列表
      let _this = this;
      wx.cloud.callFunction({
        name: 'getComment',
        data: {
          commitId: _this.data.commitId
        }
      }).then(res => {
        _this.setData({
          commentList: type === 0 ? _this.data.commentList.concat(res.result.list) : res.result.list
        })
      })
    },
    confirmComment: function (e) {
      let _this = this;
      wx.showLoading({
        title: '加载中',
      });
      let commentValue = e.detail.value;
      _this.setData({
        commentValue
      })
      wx.cloud.callFunction({
        name: 'addComment',
        data: {
          value: _this.data.commentValue,
          openid: app.globalData.userInfo.openId,
          commitId: _this.data.commitId
        }
      }).then(() => {
        _this.getComments(1);
        _this.setData({
          commentValue: '',
          showComment: false
        });
        wx.hideLoading();
        // 消息推送
        // let openIdList = app.globalData.openIdList;
        // let openid = app.globalData.userInfo.openId;
        // let anotherOpenid = '';
        // openIdList.map((item, index) => {
        //   if (openid !== item.openid) {
        //     anotherOpenid = item.openid;
        //   } else {
        //     _this.setData({
        //       toName: item.name
        //     })
        //   }
        // });
        // _this.send(anotherOpenid);
      })
    },
    delete () {
      let _this = this;
      wx.showModal({
        title: '提示',
        content: '🤔你确定要删掉吗🤔',
        success (res) {
          if (res.confirm) {
            console.log(_this.data.commitId)
            wx.cloud.callFunction({
              name: 'getSomething',
              data: {
                name: 'commits',
                whereObj: {
                  _id: _this.data.commitId
                }
              }
            })
              .then(res => {
                console.log(res)
                let fileList = [];
                res.result.data[0].fileList.map(item => {
                  fileList.push(item.fileID);
                });
                return fileList
              })
              .then(res => {
                console.log(res)
                wx.cloud.deleteFile({
                  fileList: res,
                });
              })
            //   // 1.删除当前动态
            // 2.删除点赞
            // 3.删除相关的评论
            // 4.删除存储的照片
            wx.cloud.callFunction({
              name: 'removeSomething',
              data: {
                name: 'commits',
                whereObj: {
                  _id: _this.data.commitId
                }
              }
            })
              .then(res => {
                wx.cloud.callFunction({
                  name: 'removeSomething',
                  data: {
                    name: 'operateCommits',
                    whereObj: {
                      commitId: _this.data.commitId
                    }
                  }
                })
              })
              .then(res => {
                wx.cloud.callFunction({
                  name: 'removeSomething',
                  data: {
                    name: 'commentList',
                    whereObj: {
                      commitId: _this.data.commitId
                    }
                  }
                })
              })
              .then(res => {
                wx.showToast({
                  title: '删除成功啦😉',
                  icon: 'none'
                });
                _this.triggerEvent('deleteOver')
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    timeFormatter: function (time) {
      return formatTime(new Date(time))
    },
    // 查看评论时间
    operateComment: function (data) {
      wx.showToast({
        title: data.currentTarget.dataset.date,
        icon: 'none'
      })
    },
    // 点击显示评论框
    showHideComment () {
      this.setData({
        showComment: !this.data.showComment
      })
    },
    // 评论失去焦点
    commentBlur () {
      this.setData({
        showComment: !this.data.showComment
      })
    },
    // 删除评论
    deleteComment: function (data) {
      let openid = data.currentTarget.dataset.openid;
      let commentId = data.currentTarget.dataset.id;
      if (openid !== app.globalData.userInfo.openId) {
        return
      } else {
        let _this = this;
        wx.showModal({
          title: '提示',
          content: '🤔你确定要删掉吗🤔',
          success (res) {
            if (res.confirm) {
              wx.cloud.callFunction({
                name: 'removeSomething',
                data: {
                  name: 'commentList',
                  whereObj: {
                    _id: commentId
                  }
                }
              }).then(res => {
                wx.showToast({
                  title: '删除成功啦😉',
                  icon: 'none'
                });
                _this.triggerEvent('deleteOver')
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    //发送模板消息给指定的openId用户
    // send: function (openid) {
    //   let _this = this;
    //   console.log(openid, _this.data.toName, formatTime(new Date()))
    //   wx.cloud.callFunction({
    //     name: "commentMessage",
    //     data: {
    //       openid: openid,
    //       tips: '有新的评论啦！',
    //       time: formatTime(new Date()),
    //     }
    //   }).then(res => {
    //     console.log("发送通知成功", res)
    //   }).catch(res => {
    //     console.log("发送通知失败", res)
    //   });
    // },
    showTimeDetail () {
      // let timeTamp = timeago(new Date(newVal).getTime())
      // // let dateAndTimeDetail = this.timeFormatter(newVal);
      this.setData({
        isShowTimeDetail: !this.data.isShowTimeDetail
      })
    }
  },
  observers: {
    isShowTimeDetail: function (isShowTime) {
      let timeTamp = timeago(new Date(this.data.dateAndTime).getTime())
      let dateAndTimeDetail = this.timeFormatter(this.data.dateAndTime);
      this.setData({
        date: isShowTime ? dateAndTimeDetail : timeTamp
      })
    }
  }
})