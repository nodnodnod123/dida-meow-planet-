// pages/forum/post/post.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postId: '',
    post: null,
    comments: [], // 存放评论列表数据
    newCommentContent: '', // 新评论内容
  },
  onLoad: function (options) {
    const postId = options.id;
    this.setData({
      postId: postId
    });
    // 加载帖子详情和评论列表
    this.getPostDetail();
    this.getComments();
  },
  // 获取帖子详情
  getPostDetail: function () {
    const db = wx.cloud.database();
    db.collection('posts').doc(this.data.postId).get().then(res => {
      this.setData({
        post: res.data
      });
    }).catch(err => {
      console.error('获取帖子详情失败', err);
    });
  },

  // 处理输入评论内容
  Comment: function (e) {
    this.setData({
      newCommentContent: e.detail.value
    });
  },


  // 获取评论列表
  getComments: function () {
    const db = wx.cloud.database();
    db.collection('Post_comments').where({
    post_id: this.data.postId
  }).get({
    success: res => {
      // 将获取到的反馈数据设置到页面的data中
      this.setData({
        comments: res.data.reverse()
      });
    },
    fail: err => {
      console.error('Error fetching feedbacks:', err);
    }
  });
  },

  //发布评论
  publishComment: function () {
    const id = this.data.postId;
    const Comment = this.data.newCommentContent;

    if (Comment && id) {
      // 调用云数据库添加记录的函数
      this.uploadpost(id, Comment);
    } else {
      wx.showToast({
        title: '内容不能为空！',
        icon: 'none',
        duration: 2000
      });
    }
  },
  // 上传反馈到云数据库
  uploadpost: function(id, Comment) {
    wx.cloud.database().collection('Post_comments').add({
      data: {
        post_id: id,
        comments: Comment
      },
      success: res => {
        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 2000
        });
        // 清空输入框
        this.setData({
          newCommentContent: '',
        });
        // 提交成功后重新打开当前页面，达到刷新的效果
      wx.redirectTo({
        url: '/pages/forum/post/post?id=' + id
      });
      },
      fail: err => {
        wx.showToast({
          title: '提交失败！',
          icon: 'none',
          duration: 2000
        });
        console.error('Error submitting feedback:', err);
      }
    });
  },


  // 处理点赞
  likePost: function (event) {
    const postId = event.currentTarget.dataset.postId;
    const db = wx.cloud.database();
    db.collection('posts').doc(postId).update({
      data: {
        up: db.command.inc(1) // 点赞数加一
      }
    }).then(res => {
      // 点赞成功后重新打开当前页面，达到刷新的效果
      wx.redirectTo({
        url: '/pages/forum/post/post?id=' + postId
      });
    }).catch(err => {
      console.error('点赞失败', err);
    });
  },





  /**
   * 生命周期函数--监听页面加载
   */
  /*onLoad(options) {

  },*/

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