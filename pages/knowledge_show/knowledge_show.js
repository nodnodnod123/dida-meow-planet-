let pinglun={}
Page({
  data: {
    userInfo:null,
    finalcomment:[],//更新评论
    knowledgecontent: [],//评论获取
    essay: null,
    comments:[],
    isLiked: false, // 当前用户是否点赞，默认是未点赞
    liked: "cloud://cloud1-9g18gtfz73103b12.636c-cloud1-9g18gtfz73103b12-1325231975/知识百科图片/点赞.png",
    unlike: "cloud://cloud1-9g18gtfz73103b12.636c-cloud1-9g18gtfz73103b12-1325231975/知识百科图片/未点赞.png"
  }, 

  onLoad: function (option) {
    // 获取文本、获取点赞数
    const db = wx.cloud.database()    
    const textId = option.textId;
    db.collection('essays').get({  
      success: res => {  
        const essaytmp = res.data[textId];
        // 查询第 textId 个文章的内容
        const textWithNewline = essaytmp.content;
        // 因为粘贴过来的文本\n被换为空格，所以此处替换空格\n换行符
        // 当文章中自带空格时（指作者自己写的空格）则此方法失效
        const processedText = textWithNewline.replace(/\ /g, '\n'); 
        essaytmp.content = processedText;
      // console.log(res.data[textId]);
        const sortedComments = res.data[textId].comments.sort((a, b) => {  
         // 将字符串转换为 Date 对象  
    const dateA = new Date(a.date);  
    const dateB = new Date(b.date);  
    // 逆序排序，如果 dateB 晚于 dateA，则返回正值  
    if (dateB < dateA) {  
      return -1; // 注意这里我们用 -1 来实现逆序，因为 sort 方法的比较函数期望返回负数、零或正数  
    }  
      return 1;  
        });  
        essaytmp.comments=sortedComments;
        this.setData({
          essay: essaytmp
        }); 
      },  
      fail: err => {  
        console.error(err)  
      }  
    })  
  },

  // 点赞函数 ------------------------
  handleLike: function() {  
    const db = wx.cloud.database(); // 调用数据库  
    const essay = this.data.essay;
    // 根据当前是否已点赞来决定执行的操作  
    if (this.data.isLiked) {  
      // 如果已经点过赞，则取消点赞  
      const newLikes = essay.likes - 1; // 点赞数减 1  
      db.collection('essays').doc(essay._id).update({  
        data: {
          likes:newLikes// 更新 likes 字段的值
        },  
        success: res => {  
          // 更新成功，更新页面状态  
          this.setData({  
            isLiked: false, // 取消点赞状态  
            essay:{
              ...this.data.essay,  
            likes:newLikes // 页面同步展示新的点赞数  
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
      const newLikes = essay.likes + 1; // 点赞数加 1  
      essay.likes = newLikes;
      db.collection('essays').doc(essay._id).update({  
        data: {  
          likes: newLikes // 更新 likes 字段的值  
        },  
        success: res => {  
          // 更新成功，更新页面状态  
          this.setData({  
            isLiked: true, // 设置点赞状态  
            essay:{
              ...this.data.essay,  
              likes:newLikes // 页面同步展示新的点赞数  
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

  // 评论函数
  talkInput:function(event){
    this.data.knowledgecontent=event.detail.value;
    },
  // 发表评论
  submit:function(){
    //const that = this; // 缓存this引用，以便在回调函数中使用 
    if(this.data.knowledgecontent.length==[]){//用户未输入评论
      wx.showToast({
        icon:"error",
        title: '请先输入评论',
      })
      return
    }
    pinglun=this.data.essay.comments
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
    pinglunitem.name='未知游客';
    pinglunitem.date=date
    pinglunitem.content=this.data.knowledgecontent
    pinglun.push(pinglunitem)//插入新的评论
    console.log('评论：',pinglun)//打印目前的所有评论内容

    const db = wx.cloud.database(); // 调用数据库  
    const essayId = this.data.essay._id; //  
    var that =this;
    db.collection('essays').doc(essayId).update({  //更新数据库评论 优先显示新评论
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
      essay:{
        ...this.data.essay,    
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
  // 获取用户信息 授权
wxGetUserInfo() {
  wx.getUserInfo({
     success: (res) => {
       this.userInfo = res.userInfo;
       console.log(this.userInfo);
     },
     fail: () => {
       console.log("未授权");
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