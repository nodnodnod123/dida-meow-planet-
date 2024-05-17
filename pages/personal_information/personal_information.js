// pages/personal_information/personal_information.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
  },

  onChooseAvatar(e) {      /*获取头像*/
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },


  changeNickName(e) {     /*获取名称*/
    let name = e.detail.value;
    if (name.length === 0) return;
    this.setData({
  ['userInfo.nickName']: e.detail.value
    })
    Name(name);
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
  feedback:function(){
    wx.navigateTo({
      url: '/pages/personal_information/subpage/feedback/feedback',
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

var database={ 
  //在数据库里添加名称
  Name:function(name){
    return new Promise((resolve, reject) => {
      wx.cloud.database().collection('user')
      .where({//条件查询
        ID: id
      })
      .add({//添加数据
        data:{
          name:name
        }
      })
      resolve(1); // 添加成功返回1
      })
    .catch(err => {
      resolve(0); // 添加失败返回0
    });
  },

  //在数据库里添加头像
  Headportrait:function(avatarUrl){
    return new Promise((resolve, reject) => {
      wx.cloud.database().collection('user')
      .where({//条件查询
        ID: id
      })
      .add({//添加数据
        data:{
          headportrait:avatarUrl
        }
      })
      resolve(1); // 添加成功返回1
      })
    .catch(err => {
      resolve(0); // 添加失败返回0
    });
  },
}