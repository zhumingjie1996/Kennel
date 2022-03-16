// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    let eventUse = {
        score: event.score,
        reason: event.reason,
        date: db.serverDate()
    };
    if (event.addOrDel === 'add') {
        db.collection('score').where({
            isLaster: true
        }).update({
            data: {
                "add": _.push(eventUse),
                "total": event.total,
            }
        })
    } else {
        db.collection('score').where({
            isLaster: true
        }).update({
            data: {
                "del": _.push(eventUse),
                "total": event.total,
            }
        })
    }
}