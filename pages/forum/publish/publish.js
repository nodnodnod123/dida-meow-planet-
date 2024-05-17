  // pages/forum/publish.js 
  let tempFilePaths = "" // 选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片   
  let fileid = "" // 云数据库中存储的文件路径 

  Page({
  
    /**
     * 页面的初始数据 
     */ 
    data: { 
      title: '', // 发布标题 
      brief:'', // 发布简介
      content: '', // 发布内容   
      image: '', // 已上传的图片 
    },

    // 从输入框中获得内容 
    bindTitleInput: function (e) {  
      if (e.detail.value == 0) { 
        wx.showToast({
          title: '标题不能为空！', 
          icon: 'none', 
          duration: 2000 
        }); 
      }  
      else {
        this.setData({  
          title: e.detail.value   
        })  
      }
        
    },  
    bindBriefInput: function (e) { 
      this.setData({
        brief: e.detail.value 
      }) 
    },
    bindContentInput: function (e) {   
      if (e.detail.value == 0) {
        wx.showToast({ 
          title: '内容不能为空！', 
          icon: 'none',
          duration: 2000 
        }); 
      } 
      else { 
        this.setData({   
          content: e.detail.value   
        })       
      } 
    },  

    // 上传图片 
    chooseImage: function () {   
      // 选择图片  
      wx.chooseMedia({  
        count: 1, // 只能上传一张图片   
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success (res) {  
          tempFilePaths = res.tempFiles[0].tempFilePath
          // 存储在云数据库
          wx.cloud.uploadFile({
            cloudPath:Date.now()  + ".jpg",
            filePath: tempFilePaths,
            success: res => {
              // get resource ID
              fileid = res.fileID;
              console.log(res.fileID)
            }
          })
        },
        fail: err => {
          wx.showToast({
            title: '上传图片失败！',
            icon: 'none',
            duration: 2000
          });
          console.error('Error post picture:', err);
        }
      })  
    },  
    submitPost: function () {  // 提交撰写的帖子
      const m_content = this.data.content;
      const m_title = this.data.title;
      if (m_content && m_title) {
        this.uploadPost()  
      } else {
        wx.showToast({
          title: '内容不能为空！',
          icon: 'none',
          duration: 2000
        });
      }
    },  
    uploadPost: function () {  
      wx.cloud.database().collection('posts').add({
        data: {
          title: this.data.title,
          Brief: this.data.brief, 
          content: this.data.content,
          picture: fileid,
          up: 0
        },
        success: res => {
          wx.showToast({
            title: '提交成功！',
            icon: 'success',
            duration: 2000
          });
          // 清空输入框
          this.setData({
            content: '',
            title: '',
            brief:'',
            image:''
          });
          // 提交成功后重新打开当前页面，达到刷新的效果
          wx.redirectTo({
            url: '/pages/forum/forum'
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
      })
    } ,
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
  })