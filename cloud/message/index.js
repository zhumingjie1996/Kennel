// 云函数入口文件

const cloud = require('wx-server-sdk')
cloud.init()

//订阅推送通知
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, //接收用户的openId
      page: 'pages/index/index', //订阅通知 需要跳转的页面
      data: {   //设置通知的内容
        thing1: {
          value: event.title
        },
        thing3: {
          value: event.name
        },
        time4: {
          value: event.time
        }
      },
      templateId: 'UmONsbNHnNGVMR_rFlvtBRplnxD8mz25vMfEc5BMwkg' //模板id
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}