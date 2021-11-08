// 123
module.exports = Behavior({
  data:{
      fadeClass:true
  },
  methods:{
    addFade:function(){
      this.setData({
        fadeClass:true
      })
    },
    removeFade:function(){
      this.setData({
        fadeClass:false
      })
    }
  }
})