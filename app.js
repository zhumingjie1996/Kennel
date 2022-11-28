// app.js
App({
  onLaunch() {
    // 初始化云函数
    if (!wx.cloud) {
      console.error('此版本不支持云函数')
    } else {
      wx.cloud.init({
        env: 'pokeball-0gh5ucug38950eb7'
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
      .then(res=>{
        // 记录最新一次的登陆时间
        wx.cloud.callFunction({
          name: 'updateRecord',
          data: {
            userInfo: {
              lastLoginDate: new Date().getTime()
            }
          }
        })
      })
  },
  globalData: {
    userInfo: {
      openId: ''
    },
    openIdList:[{name:'葛欣怡',openid:'oY4HQ5Ic7aWRXxQiQO1Jz7amAvC8'},{name:'朱明杰',openid:'oY4HQ5MPUUzLuJEJOofl9iPtwl9w'}],
  }
})