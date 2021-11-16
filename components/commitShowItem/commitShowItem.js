// components/commitShowItem/commitShowItem.js
import {
  formatTime
} from '../../utils/util.js'
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
      default: ''
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
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let _this = this;
      Promise.all([
        _this.getOperateCommits('tian'),
        _this.getOperateCommits('ken')
      ]).then(res => {
        let tianNum = res[0].result.data.length;
        let kenNum = res[1].result.data.length;
        _this.setData({
          tianNum,
          kenNum
        })
      })
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
    operateCommit: function (operateName) {
      // 舔或啃
      // 可以同时舔和啃，但是只能每条最多一次
      let _this = this;
      if (!_this.data.commitId || _this.data.commitId === "") {
        wx.showToast({
          title: '为获取到动态id',
          icon: 'none'
        })
        return;
      }
      return wx.cloud.callFunction({
        name: 'operateCommit',
        data: {
          operateName,
          commitId: _this.data.commitId,
          addOrRemove: 'add'
        }
      })
    },
    tian: function () {
      let _this = this;
      _this.operateCommit('tian').then(()=>{
        _this.setData({
          tianNum:_this.data.tianNum + 1
        })
      })
    },
    ken: function () {
      let _this = this;
      _this.operateCommit('ken').then(()=>{
        _this.setData({
          kenNum:_this.data.kenNum + 1
        })
      })
    },
    getOperateCommits: function (operateType) { //operateType:tian/ken
      // 获取当前动态的啃和舔的数据
      let _this = this;
      return wx.cloud.callFunction({
        name: 'getOperateCommit',
        data: {
          commitId: _this.data.commitId,
          operateType
        }
      })
    }
  }
})