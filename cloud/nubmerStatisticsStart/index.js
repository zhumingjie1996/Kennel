// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    db.collection('score').where({isLaster:true}).update({
        data:{
            isLaster:false
        }
    }).then(()=>{
        db.collection('score').add({
            data:{
                isLaster:true,
                date:db.serverDate(),
                total:60
            }
        })
    })
}