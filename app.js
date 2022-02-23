// app.js
App({
  onLaunch() {
    // 初始化云函数
    if (!wx.cloud) {
      console.error('此版本不支持云函数')
    } else {
      wx.cloud.init({
        env: 'zhumingjie-wxcloud-0dmpke1424a47'
      })
    };
    // 用户入库
    var DB = wx.cloud.database().collection('users');
    wx.cloud.callFunction({
        name: 'testCloudFunc',
      })
      .then(res => {
        this.globalData.userInfo.openId = res.result.openid
        return res.result._openid
      })
      .then(openid => {
        return DB.where({
          openid
        }).get()
      })
      .then(res => {
        if (res.data.length === 0) {
          return DB.add({
            data: {
              userInfo: {
                openid: this.globalData.userInfo.openId,
                nickName: "",
                avatarUrl: "",
                isAuthorize: false
              }
            }
          })
        }
      })
  },
  globalData: {
    userInfo: {
      openId: ''
    }
  }
})