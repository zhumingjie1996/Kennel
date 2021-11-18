// pages/timeAndDogs/timeAndDogs.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        datetimePickerShow: false,
        xiuReasonShow: false,
        minHour: 9,
        maxHour: 22,
        textData: [{
            value: 20,
            name: 'Perfect',
            title: {
                offsetCenter: ['0%', '-30%']
            },
            detail: {
                valueAnimation: true,
                offsetCenter: ['0%', '-20%']
            }
        }],
        nowUserInfo: {}, //当前用户是否已经参战
        xiuList: [],//暂休人员列表
        notXiuList: [],//参战人员列表
        reasonRadio: "",//选择的暂休理由
        xiuReasonList: ["加班", "相亲", "旅游", "参加婚礼", "放半个月假且没有电脑", "看海贼王", "线下gank"],//暂休理由泪飙
        xiuReasonInputValue:"",//暂休的自定义理由
    },

    // 暂休理由选择
    xiuReasonOnClick: function (val) {
        const { name } = val.currentTarget.dataset;
        this.setData({
            reasonRadio: name,
            xiuReasonInputValue:""
          });
    },
    onXiuListRadioChange: function (event) {
        this.setData({
            reasonRadio: event.detail,
        });
    },
    inputXiuReason:function(){
        // 当自定义暂休理由的时候去除已经选中的radio
        this.setData({
            reasonRadio:""
        })
    },

    commit: function () {
        let _this = this;
        if (!_this.data.isActive) return;
        // 打开时间选择器
        _this.setData({
            datetimePickerShow: true
        })
        console.log(app.globalData.userInfo.openId)
    },

    // 暂休
    commitXiu: function () {
        let _this = this;
        wx.showModal({
            title: '????????',
            content: '确定要丑陋地暂休吗',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                    _this.setData({
                        xiuReasonShow: true
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 确定暂休理由
    commitXiuReason:function(){
        let _this = this;
        if(_this.data.reasonRadio === '' && _this.data.xiuReasonInputValue === ''){
            wx.showToast({
              title: '未选择理由',
              icon:'error'
            })
            return
        };
        wx.showLoading();

        // 获取用户的头像和昵称信息
        wx.cloud.callFunction({
            name: 'getSomething',
            data: {
                name: "users",
                whereObj: {
                    _openid: app.globalData.userInfo.openId
                }
            }
        }).then((res) => {
            let userInfo = res.result.data[0].userInfo;
            return wx.cloud.callFunction({
                name: 'addSomething',
                data: {
                    name: "timeAndNumberList",
                    addData: {
                        time:'', // 选择的参战时间
                        openId: app.globalData.userInfo.openId, //用户openid
                        avatarUrl: userInfo.avatarUrl,
                        nickName: userInfo.nickName,
                        activityId: _this.data.lasterId, //最新的活动id
                        xiu: true, //是否暂休
                        xiuReason: _this.data.reasonRadio === '' ? _this.data.xiuReasonInputValue : _this.data.reasonRadio //暂休理由
                    }
                }
            })
        }).then(() => {
            wx.hideLoading();
            wx.showToast({
                icon: 'success'
            })
            _this.onCloseXiuReason();
            _this.onShow();
        }) 
    },

    // 关闭时间选择弹出层
    onClose: function () {
        let _this = this;
        _this.setData({
            datetimePickerShow: false
        })
    },
    // 关闭暂休原因选择弹出层
    onCloseXiuReason: function () {
        let _this = this;
        _this.setData({
            xiuReasonShow: false
        })
    },

    // 点击取消选择时间
    cancelTime: function () {
        this.onClose();
    },

    // 点击确定时间
    confirmTime: function (val) {
        let _this = this;
        let time = val.detail;
        wx.showLoading();
        // 获取用户的头像和昵称信息
        wx.cloud.callFunction({
            name: 'getSomething',
            data: {
                name: "users",
                whereObj: {
                    _openid: app.globalData.userInfo.openId
                }
            }
        }).then((res) => {
            let userInfo = res.result.data[0].userInfo;
            return wx.cloud.callFunction({
                name: 'addSomething',
                data: {
                    name: "timeAndNumberList",
                    addData: {
                        time, // 选择的参战时间
                        openId: app.globalData.userInfo.openId, //用户openid
                        avatarUrl: userInfo.avatarUrl,
                        nickName: userInfo.nickName,
                        activityId: _this.data.lasterId, //最新的活动id
                        xiu: false,
                        xiuReason: ''
                    }
                }
            })
        }).then(() => {
            wx.hideLoading();
            wx.showToast({
                icon: 'success'
            })
            _this.onClose();
            _this.onShow();
        })
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
        let _this = this;
        wx.cloud.callFunction({
            name: "getNumberStatistic",
        }).then(res => {
            // 最新活动的id
            let lasterId = res.result.data[0]._id;
            // 是否已经截至
            _this.setData({
                isActive: res.result.data[0].isActive,
                lasterId
            })
            return lasterId;
        }).then(res => {
            // 获取已经参与当前活动的用户（参战的和暂休的）
            return wx.cloud.callFunction({
                name: 'getSomething',
                data: {
                    name: "timeAndNumberList",
                    whereObj: {
                        activityId: res
                    }
                }
            })
        }).then(res => {
            // 拆分查询到的参与当前活动的用户到不同的数组中
            // console.log(res);
            _this.setData({
                xiuList: [],
                notXiuList: []
            })
            let userList = res.result.data
            userList.map((item) => {
                if (item.openId === app.globalData.userInfo.openId) {
                    // 判断当前用户是否已经参赛
                    _this.setData({
                        nowUserInfo: item
                    })
                }
                if (item.xiu) {
                    let list = _this.data.xiuList;
                    list.push(item)
                    _this.setData({
                        xiuList: list
                    })
                } else {
                    let list = _this.data.notXiuList;
                    list.push(item)
                    _this.setData({
                        notXiuList: list
                    })
                }
            })
        })
    },

    removeNowInfo:function(){
        let _this = this;
        wx.showModal({
            title:'提示',
            content:"是否重新选择",
            success:function(res){
                if(res.confirm){
                    wx.showLoading();
                    wx.cloud.callFunction({
                        name:'removeSomething',
                        data:{
                            name:'timeAndNumberList',
                            whereObj:{
                                openId:app.globalData.userInfo.openId
                            }
                        }
                    }).then(()=>{
                        wx.hideLoading();
                        wx.showToast({
                            icon:'success'
                        });
                        _this.setData({
                            nowUserInfo:{}
                        });
                        _this.onShow();
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

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