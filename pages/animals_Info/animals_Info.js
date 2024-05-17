// pages/animals_Info/animals_Info.js
let pinglun={}
let newpics={}
Page({
  data: {
    userInfo:null,//用户信息
    finalcomment:[],//更新评论
    animalcontent: [],//评论获取
    animalId:null,//动物id
    animal:null,//动物
    isLiked: false, // 初始状态为未点赞  
  },
  onLoad: function (options) {
    console.log(options.id);  //可以打印一下option查看参数
    var that = this;
    const db = wx.cloud.database();
    db.collection('animals').doc(options.id).get({//评论信息和照片册信息
      success: res => {
        let comments = []; // 创建一个空数组来存储评论信息  
        let pictures = []; // 创建一个空数组来存储照片信息  
        if(res.data.comment.length>0){
        console.log(res.data.comment.length)//评论条数
        for (let j = res.data.comment.length - 1; j >= 0; j--) {  
          const comment = res.data.comment[j]; // 当前遍历到的评论对象  
          console.log(comment.content)//评论
          comments.push({ // 将评论信息推入comments数组  
          name: comment.name, // 评论的name  
          content: comment.content,// 评论的content 
          date:comment.date 
          });  
        }  
        
        }
       if(res.data.pictures.length>0){
        console.log(res.data.pictures.length)//照片个数
         // 遍历当前动物的每个照片
        for (let j = res.data.pictures.length - 1; j >= 0; j--) {  
          const picture = res.data.pictures[j]; // 
          pictures.push({ //  
         uploader: picture.uploader, // 
          imageUrl: picture.imageUrl,// 
          time:picture.time
          });  
        }  
      
      }
      that.setData({  
        comments: comments ,
        pictures:pictures
      }); 
        }
    })

    ///////////////////////////
    if(options.id){
      const db = wx.cloud.database();
    db.collection('animals').doc(options.id).get({
      success:res =>{
        console.log('该小动物点赞量：',res.data.likes);
      this.setData({  
        animalId:options.id,
        animal: res.data // 设置接收到的 id 到 data 中  
      });  
    },
    fail:err =>{
      console.error('查询数据失败：',err);
    }
    });
  　  // 获取传递过来的 id    
  }
},  
go: function() {
  wx.navigateTo({
      url:'/pages/animals_rankings/animals_rankings'
  })
},
getfood: function() {
  console.log("投喂页面");
  wx.navigateTo({
      url:'/pages/animals_Info/animals_feeding/animals_feeding'
  })
},
// 点赞函数 ------------------------
handleLike: function() {  
  const db = wx.cloud.database(); // 调用数据库  
  const animalId = this.data.animalId; // 在data中定义了animalId  
  const currentLikes = this.data.animal.likes; // 当前点赞数  
  // 根据当前是否已点赞来决定执行的操作  
  if (this.data.isLiked) {  
    // 如果已经点过赞，则取消点赞  
    const newLikes = currentLikes - 1; // 点赞数减 1  
    db.collection('animals').doc(animalId).update({  
      data: {  
        likes: newLikes // 更新 likes 字段的值  
      },  
      success: res => {  
        // 更新成功，更新页面状态  
        this.setData({  
          isLiked: false, // 取消点赞状态  
          animal: {  
            ...this.data.animal,  
            likes: newLikes // 页面同步展示新的点赞数  
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
    db.collection('animals').doc(animalId).update({  
      data: {  
        likes: newLikes // 更新 likes 字段的值  
      },  
      success: res => {  
        // 更新成功，更新页面状态  
        this.setData({  
          isLiked: true, // 设置点赞状态  
          animal: {  
            ...this.data.animal,  
            likes: newLikes // 页面同步展示新的点赞数  
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
//获取用户输入评论-----------------------
talkInput:function(event){
this.data.animalcontent=event.detail.value;
},
// 上传图片到云存储并保存到云数据库  
async uploadPicture() {  
  try {  
    const res = await wx.chooseImage({  
      count: 1, // 默认9，这里选择一张图片  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
    });  
    const tempFilePaths = res.tempFilePaths;  
    // 上传图片到云存储  
    const cloudPath = 'images/' + new Date().getTime() + '.png'; // 设置云存储路径  
    const uploadResult = await wx.cloud.uploadFile({  
      cloudPath,  
      filePath: tempFilePaths[0], // 小程序临时文件路径  
    });  
    const fileID = uploadResult.fileID // 获取上传后返回的文件ID  
    const animalId = this.data.animalId // 替换成实际的小动物ID  
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
  date = `${yy}-${mm}-${dd} ${hh}:${mf}:${ss}`;
   // const time = new Date().toISOString() 
    // 构建要追加到 pictures 数组中的对象  
    let pictureObject = {}
    pictureObject. imageUrl=fileID 
    pictureObject.uploader= '未知名铲屎官'
    pictureObject.time=date
    newpics=this.data.animal.pictures
    // 如果 newpics 还不存在或者不是数组，则初始化为空数组  
if (!Array.isArray(newpics)) {  
  newpics = [];  
}  
    newpics.push(pictureObject)
    var that =this;
    const db = wx.cloud.database()// 调用数据库  
    // 将新图片对象追加到对应小动物的 pictures 数组中  
    db.collection('animals').doc(animalId).update({  
      data: {     
        pictures:newpics
      },  
    })
  .then(res => {  
    // 更新成功，更新页面状态  
   let newpics2 = []; //  
   console.log(newpics.length)//条数
   // 
   for (let j = newpics.length - 1; j >= 0; j--) {  
     const newpics22 = newpics[j]; // 
     newpics2.push({ //  
      imageUrl: newpics22.imageUrl, //   
     uploader: newpics22.uploader,// 
     time:newpics22.time 
     });  
    }
   that.setData({
     pictures:newpics2
   })
  })
   // 更新成功提示  
   wx.showToast({  
    title: '图片上传成功',  
    icon: 'success',  
    duration: 2000,  
  });  
} catch (error) {  
  // 上传或保存失败提示  
  wx.showToast({  
    title: '图片上传失败',  
    icon: 'none',  
    duration: 2000,  
  });  
  console.error('图片上传失败：', error);  
}  
},
//发表评论---------------------
submit:function(){
  //const that = this; // 缓存this引用，以便在回调函数中使用 
if(this.data.animalcontent.length==[]){//用户未输入评论
  wx.showToast({
    icon:"error",
    title: '请先输入评论',
  })
  return
}
pinglun=this.data.animal.comment
if (!Array.isArray(pinglun)) {  
  pinglun = [] 
}  
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
  date = `${yy}-${mm}-${dd} ${hh}:${mf}:${ss}`;
/////
//pinglunitem.name=this.data.userInfo.nickName
pinglunitem.name='未知游客'
pinglunitem.date=date
pinglunitem.content=this.data.animalcontent
pinglun.push(pinglunitem)//插入新的评论
console.log('评论：',pinglun)//打印目前的所有评论内容
const db = wx.cloud.database(); // 调用数据库  
const animalId = this.data.animalId; // 在data中定义了animalId  
var that =this;
db.collection('animals').doc(animalId).update({  //更新数据库评论 优先显示新评论
data:{
comment:pinglun
}
})
.then(res => {  
  // 更新成功，更新页面状态  
 this.setData({
  animalcontent:''//评论后清空
 })
 let pinglun2 = []; // 创建一个空数组来存储评论信息  
 console.log(pinglun.length)//评论条数
 // 遍历当前动物的每个评论  
 for (let j = pinglun.length - 1; j >= 0; j--) {  
   const pinglun22 = pinglun[j]; // 当前遍历到的评论对象  
   pinglun2.push({ // 将评论信息推入comments数组  
   name: pinglun22.name, // 评论的name  
   content: pinglun22.content,// 评论的content 
   date:pinglun22.date 
   });  
  }
 that.setData({
   comments:pinglun2
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
   * 生命周期函数--监听页面加载
   */
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  // const { debugPrint } = require("XrFrame/kanata/lib/index");

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