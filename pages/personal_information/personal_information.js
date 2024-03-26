// pages/personal_information/personal_information.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  post:function(){  
    wx.navigateTo({  
      url: '/pages/personal_information/subpage/post/post',  
    })  
  },
  comment:function(){  
    wx.navigateTo({  
      url: '/pages/personal_information/subpage/comment/comment',  
    })  
  },
  picture:function(){  
    wx.navigateTo({  
      url: '/pages/personal_information/subpage/picture/picture',  
    })  
  },
  Modifyphoto:function(){  
    wx.navigateTo({  
      url: '/pages/personal_information/subpage/Modifyphoto/Modifyphoto',  
    })  
  },
  about:function(){  
    wx.navigateTo({  
      url: '/pages/personal_information/subpage/about/about',  
    })  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
  goto:function(){
    wx.navigateTo({
      url: '/pages/Developer-Info/Developer-Info',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})