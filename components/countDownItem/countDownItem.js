// components/countDownItem/countDownItem.js
import { formatTime } from "../../utils/util"
import { formatTimeInterval } from "./utils"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    eventInfo: {
      type: Object,
      default: function () {
        return {}
      },
      observer: function (val) {
        this.setData({
          eventStartDate: formatTime(new Date(val.eventDate))
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //时间开始时间
    eventStartDate: "",
    // 当前时间差
    timeInterval: {},
    // 是否已经过去了
    isGone: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 置顶
    toTop (e) {
      let _this = this;
      let istopnow = e.currentTarget.dataset.istopnow; // 当前是否置顶
      let _id = e.currentTarget.dataset.id
      wx.showModal({
        title: '提示',
        content: `🤔你确定要把它${istopnow ? '取消置顶' : '置顶'}吗🤔`,
        success (res) {
          if (res.confirm) {

            wx.cloud.callFunction({
              name: 'getSomething',
              data: {
                name: 'countDownEvents',
                whereObj: {
                  isTop: true
                }
              }
            }).then((res) => {
              if (res.result.data.length === 0) {
                wx.cloud.callFunction({
                  name: 'updateSomething',
                  data: {
                    name: 'countDownEvents',
                    whereObj: {
                      _id
                    },
                    data: {
                      isTop: true
                    }
                  }
                }).then(() => {
                  _this.triggerEvent('deleteOver')
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: `🤔要把之前的置顶项替换掉吗🤔`,
                  success (res) {
                    if (res.confirm) {
                      wx.cloud.callFunction({
                        name: 'updateSomething',
                        data: {
                          name: 'countDownEvents',
                          whereObj: {
                            isTop: true
                          },
                          data: {
                            isTop: false
                          }
                        }
                      }).then(() => {
                        wx.cloud.callFunction({
                          name: 'updateSomething',
                          data: {
                            name: 'countDownEvents',
                            whereObj: {
                              _id
                            },
                            data: {
                              isTop: true
                            }
                          }
                        }).then(() => {
                          _this.triggerEvent('deleteOver')
                        })
                      })
                    }
                  }
                })
              }
            })

            // wx.cloud.callFunction({
            //   name: 'updateSomethine',
            //   data: {
            //     name: 'countDownEvents',
            //     whereObj: {
            //       isTop:true
            //     }
            //   }
            // }).then(() => {
            //   _this.triggerEvent('deleteOver')
            // })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 首页展示
    toIndex () { },
    // 删除
    delete (e) {
      let _this = this;
      wx.showModal({
        title: '提示',
        content: '🤔你确定要删掉吗🤔',
        success (res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'removeSomething',
              data: {
                name: 'countDownEvents',
                whereObj: {
                  _id: e.currentTarget.dataset.id
                }
              }
            }).then(() => {
              _this.triggerEvent('deleteOver')
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      setInterval(() => {
        let timeInterval = formatTimeInterval(Math.abs(new Date().getTime() - this.data.eventInfo.eventDate))
        let isGone = false;
        if (new Date().getTime() - this.data.eventInfo.eventDate >= 0) {
          isGone = true
        } else {
          isGone = false
        }
        this.setData({
          timeInterval,
          isGone: isGone ? '已经' : '还有'
        })
      }, 1000)
    },
  },
})
