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
        date: db.serverDate(),
        id: event.id
    };
    if (event.addOrDel === 'add' && event.pushOrPull === 'push') {
        db.collection('score').where({
            isLaster: true
        }).update({
            data: {
                "add": _.push(eventUse),
                "total": event.total,
            }
        })
    } else if (event.addOrDel === 'del' && event.pushOrPull === 'push') {
        db.collection('score').where({
            isLaster: true
        }).update({
            data: {
                "del": _.push(eventUse),
                "total": event.total,
            }
        })
    } else if (event.addOrDel === 'add' && event.pushOrPull === 'pull') {
        db.collection('score').where({
            isLaster: true
        }).update({
            data: {
                "add": _.pull({
                    score: _.eq(event.score),
                    reason: _.eq(event.reason),
                    id: _.eq(event.id)
                }),
                "total": event.total, 
            }
        })
    } else if (event.addOrDel === 'del' && event.pushOrPull === 'pull') {
        db.collection('score').where({
            isLaster: true
        }).update({
            data: {
                "del": _.pull({
                    score: _.eq(event.score),
                    reason: _.eq(event.reason),
                    id: _.eq(event.id)
                }),
                "total": event.total, 
            }
        })
    }
}