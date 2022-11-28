// components/firendsListItem/friendsListItem.js
import {
  timeago
} from '../../utils/timeAgo'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  observers: {
    userInfo: function (val) {
      if(!val.lastLoginDate) return
      this.setData({
        userInfoUse: val
      })
      let lastLoginDate = timeago(val.lastLoginDate)
      this.setData({
        "userInfoUse.lastLoginDate": lastLoginDate || ""
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfoUse: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
})