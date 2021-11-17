// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

// 每天九点定时开启新的几点几狗

// 云函数入口函数
exports.main = async (event, context) => {
    db.collection('timeAndNumber').where({laster:true}).update({
        data:{
            laster:false
        }
    })
    db.collection('timeAndNumber').add({
        data:{
            isActive:true,
            laster:true
        }
    })
}