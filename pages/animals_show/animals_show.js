// pages/animals_show/animals_show.js
//云数据库初始化
// const db = wx.cloud.database({ env:"cloud1-9g18gtfz73103b12"});
//const cont = db.collection('animals');
const db = wx.cloud.database()
const _=db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
  advertising:true,
    time:5,//倒计时 秒
    //开屏广告

  },
  handleTimerUpdate: function(e) {  
  // 处理组件发送的 timerUpdate 事件  
  // 根据需要更新 canMove 标志位  
  this.setData({  
    canMove: e.detail.second > 0 ? false : true  
  });  
},  
preventTouchMove: function(e) {  
  if (!this.data.canMove) {  
    e.stopPropagation(); // 阻止滑动  
  }  
},  
  search(e){
    console.log("当前输入"+e.detail.value);
    let m=e.detail.value
    db.collection('animals').where(_.or([
      {
        name:db.RegExp({
          regexp: m,
          options: 'i',
        })
      },
      {
        character:db.RegExp({
          regexp: m,
          options: 'i',
      })
    },
    {
      else:db.RegExp({
        regexp: m,
        options: 'i',
    })
  }
    ])).get().then(res=>{
      console.log(res.data);
      this.setData({
        items:res.data
      })
    })
  },
  AllArea(){
    db.collection("animals").get()
    .then(res=>{
      console.log(res.data);
      this.setData({
        items:res.data
      })
    })
  },
  WestArea(){
    db.collection("animals").where({
      area:1
    }).get()
    .then(res=>{
      console.log(res.data);
      this.setData({
        items:res.data
      })
    })
  },
  NorthArea(){
    db.collection("animals").where({
      area:2
    }).get()
    .then(res=>{
      console.log(res.data);
      this.setData({
        items:res.data
      })
    })
  },
  EastArea(){
    db.collection("animals").where({
      area:3
    }).get()
    .then(res=>{
      console.log(res.data);
      this.setData({
        items:res.data
      })
    })
  },
  FutureArea(){
    db.collection("animals").where({
      area:4
    }).get()
    .then(res=>{
      console.log(res.data);
      this.setData({
        items:res.data
      })
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
  //在有TabBar的情况下默认是不会隐藏的，所以我们手动隐藏一下
  wx.hideTabBar();
  var that =this;
  this.x=setInterval(function() { 
    that.setData({
      time:that.data.time-1
    })
    if(that.data.time==0)
    that.jmp()
  }, 1000)//每秒执行一次  

    console.log('页面加载，携带的参数是：'); 
    //const db = wx.cloud.database();  
    const collection = db.collection('animals'); 
    this.setData({  
      loading: true // 开始加载数据时显示加载状态  
    });   
    // 获取集合中的数据  
    collection.get({ 
      success: res => {  
        console.log(res.data)
        // 将获取到的数据赋值给页面的data属性  
        this.setData({  
          items: res.data,  
          loading: false // 数据加载完成，隐藏加载状态 
        });  
      },  
      fail: err => {  
        console.error(err);  
        this.setData({  
          loading: false, // 加载失败，也隐藏加载状态  
          error: '加载数据失败' // 可以设置一个错误提示  
        });  
      }  
    });  
  }, 
  jmp:function()
  {
    this.setData({
      advertising:false
    });
    wx.showTabBar({
      animation:true//动画效果
    });
    clearInterval(this.x);//清除定时器
  },//跳过广告

 
  // 假设你有一个函数从数据库加载数据并更新 items 数组  
  loadDataFromDatabase: function() {  
    // 这里是加载数据的逻辑，例如使用 wx.cloud.database.collection().get() 或其他方法  
    // 加载完成后，更新 items 数组  
    this.setData({  
      items: loadedData // loadedData 是从数据库加载的数据数组  
    });  
  },  
    
  // 图片加载完成时的处理函数（可选）  
  imageLoaded: function(e) {  
    console.log('图片加载完成', e.detail);  
    // 你可以在这里添加额外的逻辑，例如更新 UI 或状态  
  },  
    
  // 图片加载失败时的处理函数（可选）  
  imageError: function(e) {  
    console.log('图片加载失败', e.detail);  
    // 你可以在这里添加逻辑来处理错误情况，例如显示一个占位符或错误提示  
  } ,
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