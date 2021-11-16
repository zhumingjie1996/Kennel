// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    // 获取当前操作用户的openid
    const openid = wxContext.OPENID;
    // 获取参数里的操作类型和当前操作动态id
    const {
        commitId,
        operateName,
        addOrRemove
    } = event;
    if (addOrRemove === 'add') { //添加一条记录
        db.collection('operateCommits').add({
            data: {
                type: operateName, // tian 或 ken
                openId: openid, //操作者openid
                commitId
            }
        })
    } else if (addOrRemove === 'remove') { //删除一条记录
        db.collection('operateCommits').where({
            commitId
        }).remove()
    }
}