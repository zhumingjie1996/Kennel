// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let collectionName = event.name;
    let whereObj = event.whereObj;
    db.collection(collectionName).where(whereObj).remove()
}