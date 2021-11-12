// components/commitShowItem/commitShowItem.js
import {formatTime} from '../../utils/util.js'
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
        let dateAndTimeAfterFormat = formatTime(new Date(newVal));
        console.log(dateAndTimeAfterFormat)
        this.setData({
          date:dateAndTimeAfterFormat
        })
      }
    },
    textValue: {
      type: String,
      default: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    nickname: "",
    avatarUrl: "",
    imgList: [],
    date: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfoByOpenid: function (openid) {
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
    tian: function () {
      wx.showToast({
        title: '不许舔',
        icon: 'none'
      })
    },
    ken: function () {
      wx.showToast({
        title: '不许啃',
        icon: 'none'
      })
    },
  }
})