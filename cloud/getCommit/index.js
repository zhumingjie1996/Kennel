// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext();
  // const openid = wxContext.OPENID;
  // const rest = null;
  let pageNum = event.pageNum;
  return await db.collection('commits').orderBy('date', 'desc').skip(pageNum*5).limit(5).get()
}