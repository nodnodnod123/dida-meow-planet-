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
    db.collection('posts').get().then(res => {
      this.setData({
        posts: res.data
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
  

  /**
   * 生命周期函数--监听页面加载
   */
  /*onLoad(options) {

  },
 */

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