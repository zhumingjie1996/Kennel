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
      observer:function(val){
        this.setData({
          eventStartDate:formatTime(new Date(val.eventDate))
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //时间开始时间
    eventStartDate:"",
    // 当前时间差
    timeInterval:{},
    // 是否已经过去了
    isGone:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    delete(e){
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
            }).then(()=>{
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
    attached: function() {
      // 在组件实例进入页面节点树时执行
      setInterval(()=>{
        let timeInterval = formatTimeInterval(Math.abs(new Date().getTime() - this.data.eventInfo.eventDate))
        let isGone = false;
        if(new Date().getTime() - this.data.eventInfo.eventDate >= 0){
          isGone = true
        }else{
          isGone = false
        }
        this.setData({
          timeInterval,
          isGone:isGone ? '已经' : '还有'
        })
      },1000)
    },
  },
})
