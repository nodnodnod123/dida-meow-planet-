// pages/animals_rankings/animals_rankings.js
const db = wx.cloud.database()
Page({
  data: {
      dataList: [],
  },

  onLoad: function () {
      this.get_rank_list();  
  },
  onShow: function () {
      this.get_rank_list();
},
  onPullDownRefresh: function () { //下拉刷新？？？？
      wx.stopPullDownRefresh();
      this.get_rank_list();
  },
  get_rank_list: function(){
    const collection = db.collection('animals').orderBy('likes','desc'); 
    this.setData({  
      loading: true // 开始加载数据时显示加载状态  
    });   
    // 获取集合中的数据  
    collection.get({  
      success: res => {  
        console.log(res.data)
        // 将获取到的数据赋值给页面的data属性  
        this.setData({  
          dataList: res.data,  
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
  
})
