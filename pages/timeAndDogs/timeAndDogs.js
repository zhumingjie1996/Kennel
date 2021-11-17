// pages/timeAndDogs/timeAndDogs.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        datetimePickerShow: false,
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
        }]
    },

    commit: function () {
        let _this = this;
        // 打开时间选择器
        _this.setData({
            datetimePickerShow: true
        })
        console.log(app.globalData.userInfo.openId)
    },

    // 关闭时间选择器弹出层
    onClose: function () {
        let _this = this;
        _this.setData({
            datetimePickerShow: false
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
        
        _this.onClose();
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
        wx.cloud.callFunction({
            name: "getNumberStatistic",
        }).then(res => {
            // 最新活动的id
            let lasterId = res.result.data[0]._id;
            return lasterId;
        }).then(res => {

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