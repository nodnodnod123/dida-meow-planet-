// pages/personal_information/subpage/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title_value:'',      //反馈标题
    content_value:'',    //反馈内容
  },

  title:function(e){// 处理标题输入框的输入事件
    this.setData({
      title_value: e.detail.value//赋值给title_value
    })
  },
  content:function(e){// 处理内容输入框的输入事件
    this.setData({
      content_value: e.detail.value//赋值给content_value
    })
  },

  // 提交反馈
  submit: function() {
    const titleValue = this.data.title_value;
    const contentValue = this.data.content_value;

    if (titleValue && contentValue) {
      // 调用云数据库添加记录的函数
      this.uploadFeedback(titleValue, contentValue);
    } else {
      wx.showToast({
        title: '标题和内容不能为空！',
        icon: 'none',
        duration: 2000
      });
    }
    wx.redirectTo({      //刷新页面
      url: '/pages/personal_information/subpage/feedback/feedback'
    });
  },

  // 上传反馈到云数据库
  uploadFeedback: function(title, content) {
    wx.cloud.database().collection('feedback').add({
      data: {
        title: title,
        content: content
      },
      success: res => {
        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 2000
        });
        // 清空输入框
        this.setData({
          title_value: '',
          content_value: ''
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("completed="+this.data.completed);
    
    // 页面加载时获取所有反馈
    this.getFeedback();
  },

  // 获取所有反馈数据
  getFeedback: function() {
    const db = wx.cloud.database();
    db.collection('feedback').get({
      success: res => {
        // 将获取到的反馈数据设置到页面的data中
        this.setData({
          feedbacks: res.data.reverse()
        });
      },
      fail: err => {
        console.error('Error fetching feedbacks:', err);
      }
    });
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



