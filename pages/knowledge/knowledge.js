// pages/knowledge/knowledge.js

Page({

  data: {
    items:[]
  },
 
  search(e){
    const db = wx.cloud.database(); 
    const _=db.command;
    console.log("当前输入"+e.detail.value);
    let m=e.detail.value
    db.collection('essays').where(_.or([
      {
        title:db.RegExp({
          regexp: m,
          options: 'i',
        })
      },
      {
        details:db.RegExp({
          regexp: m,
          options: 'i',
      })
    },
    {
      else:db.RegExp({
        regexp: m,
        options: 'i',
    })
  }
    ])).get().then(res=>{
      console.log(res.data);
      this.setData({
        items:res.data
      })
    })
  },

  onLoad : function (options) {
    const db = wx.cloud.database();  
    db.collection('essays').get({
      success: res => {
        console.log(res.data);
        this.setData({
          items:res.data
        })
      },
      fail: err => {  
        console.log("错误");
        console.error(err);
      }  
    }) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})