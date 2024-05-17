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
    finalcomment:[],//更新评论
    knowledgecontent: [],//评论获取
    isLiked: false, // 初始状态为未点赞  
  },
  onLoad: function (options) {
    const postId = options.id;
    this.setData({
      postId: postId
    });
    // 加载帖子详情和评论列表
    this.getPostDetail();
    // this.getComments();
    // 获取评论
    const db = wx.cloud.database();
    db.collection('posts').doc(postId).get({ // 注意这里我假设您有一个具体的 postId 来查询  
      success: res => {  
        const essaytmp = res.data; // 假设 postId 对应的文档直接就是整篇文章  
        if (essaytmp && essaytmp.comments) { // 检查数据是否存在  
          const sortedComments = essaytmp.comments.sort((a, b) => {  
            // 将字符串转换为 Date 对象  
            const dateA = new Date(a.date);  
            const dateB = new Date(b.date);  
            // 逆序排序，如果 dateB 晚于 dateA，则返回正值  
            if (dateB < dateA) { // 注意这里应该使用 > 来实现逆序  
              return -1; // 注意这里我们用 -1 来实现逆序  
            }          
            return 1; //
          });  
          console.log(sortedComments);  
          // 如果需要更新 essaytmp 中的 comments，可以这样做：  
          essaytmp.comments = sortedComments;  
          // 假设您是在页面的某个方法中调用这个查询，您可以直接更新页面数据  
          this.setData({  
            post: essaytmp // 这里您可能需要重新构造 post 对象，因为您修改了 comments 数组  
          });  
        } else {  
          console.error('评论数据不存在');  
        }  
      },  
      fail: err => {  
        console.error(err);  
      }  
    });
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
      knowledgecontent: e.detail.value
    });
  },


  // 获取评论列表
  getComments: function () {
    const db = wx.cloud.database();
    db.collection('posts').get({  
    success: res => {
      // 将获取到的反馈数据设置到页面的data中
      this.setData({
        comments: res.data[postId].comments.reverse()
      });
    },
    fail: err => {
      console.error('Error fetching feedbacks:', err);
    }
  });
  },

  //发布评论
  publishComment: function () {
    //const that = this; // 缓存this引用，以便在回调函数中使用 
    if(this.data.knowledgecontent.length==[]){//用户未输入评论
      wx.showToast({
        icon:"error",
        title: '请先输入评论',
      })
      return
    }
    let pinglun=this.data.post.comments
    console.log("pinglun:", pinglun);
    let pinglunitem={}
    // 获取当前时间  
    let date
    let yy = new Date().getFullYear()
    let mm = new Date().getMonth()+1
    let dd = new Date().getDate()
    let hh = new Date().getHours()
    let mf = new Date().getMinutes()<10?'0'+new Date().getMinutes():
      new Date().getMinutes()
    let ss = new Date().getSeconds()<10?'0'+new Date().getSeconds():
      new Date().getSeconds()
      date = `${yy}/${mm}/${dd} ${hh}:${mf}:${ss}`;
  ///
    pinglunitem.name='游客';
    pinglunitem.date=date
    pinglunitem.content=this.data.knowledgecontent
    pinglun.push(pinglunitem)//插入新的评论
    console.log('评论：',pinglun)//打印目前的所有评论内容

    const db = wx.cloud.database(); // 调用数据库  
    const Id = this.data.postId; //  
    var that =this;
    db.collection('posts').doc(Id).update({  //更新数据库评论 优先显示新评论
      data:{
        comments: pinglun
      }
    })
    .then(res => {  
    // 更新成功，更新页面状态  
    this.setData({
    knowledgecontent:''//评论后清空
    })
    let pinglun2 = []; // 创建一个空数组来存储评论信息  
    console.log(pinglun.length)//评论条数
    // 每个评论  
    const pinglun22 = pinglun[pinglun.length-1]; // 当前遍历到的评论对象  
      pinglun2.push({ // 将评论信息推入comments数组  
      name: pinglun22.name, // 评论的name  
      content: pinglun22.content,// 评论的content 
      date:pinglun22.date 
      });  
    for (let j = 0; j <=pinglun.length-2; j++) {  
      const pinglun22 = pinglun[j]; // 当前遍历到的评论对象  
      pinglun2.push({ // 将评论信息推入comments数组  
      name: pinglun22.name, // 评论的name  
      content: pinglun22.content,// 评论的content 
      date:pinglun22.date 
      });  
    }
    that.setData({
      post:{
        ...this.data.post,    
      comments:pinglun2
      }
    })
    wx.showToast({  
      title: '评论成功',  
      icon: 'success',  
      duration: 2000  
    });  
    })  
    .catch(err => {  
    // 更新失败，处理错误  
    wx.showToast({  
      title: '评论失败',  
      icon: 'none',  
      duration: 2000  
    });  
    console.error('更新数据库失败', err);  
    })
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


  // 点赞函数 ------------------------
handleLike: function() {  
  const db = wx.cloud.database(); // 调用数据库  
  const Id = this.data.postId; //  
  const currentLikes = this.data.post.up; // 当前点赞数  
  // 根据当前是否已点赞来决定执行的操作  
  if (this.data.isLiked) {  
    // 如果已经点过赞，则取消点赞  
    const newLikes = currentLikes - 1; // 点赞数减 1  
    db.collection('posts').doc(Id).update({  
      data: {  
        up: newLikes // 更新 likes 字段的值  
      },  
      success: res => {  
        // 更新成功，更新页面状态  
        this.setData({  
          isLiked: false, // 取消点赞状态  
          post: {  
            ...this.data.post,  
            up: newLikes // 页面同步展示新的点赞数  
          }  
        });  
        wx.showToast({  
          title: '取消点赞成功',  
          icon: 'success',  
          duration: 2000  
        });  
      },  
      fail: err => {  
        // 更新失败，处理错误  
        wx.showToast({  
          title: '取消点赞失败',  
          icon: 'none',  
          duration: 2000  
        });  
        console.error('更新数据库失败', err);  
      }  
    });  
  } else {  
    // 如果未点赞，则执行点赞操作  
    const newLikes = currentLikes + 1; // 点赞数加 1  
    db.collection('posts').doc(Id).update({  
      data: {  
        up: newLikes // 更新 likes 字段的值  
      },  
      success: res => {  
        // 更新成功，更新页面状态  
        this.setData({  
          isLiked: true, // 设置点赞状态  
          post: {  
            ...this.data.post,  
            up: newLikes // 页面同步展示新的点赞数  
          }  
        });  
        wx.showToast({  
          title: '点赞成功',  
          icon: 'success',  
          duration: 2000  
        });  
      },  
      fail: err => {  
        // 更新失败，处理错误  
        wx.showToast({  
          title: '点赞失败',  
          icon: 'none',  
          duration: 2000  
        });  
        console.error('更新数据库失败', err);  
      }  
    });  
  }  
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