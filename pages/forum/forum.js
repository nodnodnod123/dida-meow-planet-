// pages/forum/forum.js
const app = getApp();
 
Page({ 
  /**
   * 页面的初始数据 
   */
  data: {
      posts: [], // 存放帖子列表数据 
  }, 

  onLoad: function () { 
    // 加载帖子列表数据
    this.getPosts(); 
  },
  // 获取帖子列表数据
  getPosts: function () {
    const db = wx.cloud.database();  
db.collection('posts').orderBy('up', 'desc').get().then(res => {  
  // 假设 res.data 是一个帖子数组  
  this.setData({  
    posts: res.data // 这里直接设置 res.data，它已经是按照 up 值降序排列的  
  });  
}).catch(err => {  
  console.error('获取帖子列表失败', err);  
});
    
  }, 
  // 跳转到帖子详情页面
  gotoPostDetail: function (event) {   
    const postId = event.currentTarget.dataset.postId;
    wx.navigateTo({ 
      url: '/pages/forum/post/post?id=' + postId
    }); 
  },
  
  goto_publish:function() {  
    wx.navigateTo({ 
      url: '/pages/forum/publish/publish'
    }) 
  },

    //搜索
  search(e){ 
    const db = wx.cloud.database() 
    const _=db.command 
    let m=e.detail.value
    db.collection('posts').where(_.or([
      { 
        title:db.RegExp({
          regexp: m, 
          options: 'i',
        }) 
      }, 
      {
        content:db.RegExp({
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
        posts:res.data 
      }) 
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