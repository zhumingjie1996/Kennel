// 定时关闭今天的几点几狗
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async () => {
    db.collection('timeAndNumber').where({
        isActive:true
    }).update({
        data:{
            isActive:false
        }
    })
}