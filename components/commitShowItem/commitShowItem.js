// components/commitShowItem/commitShowItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openid: {
      type: String,
      default: '',
      observer:function(newVal){
        let _this = this;
        _this.getUserInfoByOpenid(newVal).then(res=>{
         _this.setData({
           nickname:res.result.data[0].userInfo.nickName,
           avatarUrl:res.result.data[0].userInfo.avatarUrl
         }) 
        })
      }
    },
    fileList: {
      type: Array,
      default: function () {
        return []
      },
      observer:function(newVal){
        let _this = this;
        let imgList = [];
        newVal.map((item)=>{
          imgList.push(item.fileID);
        });
        _this.setData({
          imgList
        })
      }
    },
    location: {
      type: String,
      default: ""
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
    nickname:"",
    avatarUrl:"",
    imgList:[]
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
    previewImgs:function(e){
      console.log(e)
      let _this = this;
      let nowImgUrl = e.currentTarget.dataset.imgUrl
      wx.previewImage({
        current:  _this.data.imgList[nowImgUrl], // 当前显示图片的http链接
        urls: _this.data.imgList // 需要预览的图片http链接列表
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
    }
  }
})