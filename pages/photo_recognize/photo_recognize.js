
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgSrc:'cloud://cloud1-9g18gtfz73103b12.636c-cloud1-9g18gtfz73103b12-1325231975/识图页面/底图缺省页.png',
    imgToBaidu:'',
  },
   getImage:function(e){
    var that = this
    var flag=e.currentTarget.dataset.flag
    if(flag==0)  {var sourceType="camera"}
    else {var sourceType="album"; }
    console.log(sourceType)
    wx.chooseMedia({
      count: 1,
      mediaType: ['image','video'],
      sourceType: [sourceType],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        // console.log(res)
        console.log(res.tempFiles[0].tempFilePath)
        that.setData({
          imgSrc:res.tempFiles[0].tempFilePath
        })
        // wx.getFileSystemManager().readFile为图片编码，调用百度接口也是传这个编码后的数据
        wx.getFileSystemManager().readFile({
          filePath: res.tempFiles[0].tempFilePath, //要读取的文件的路径 (本地路径)
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            console.log(res)
            // console.log(res.data)
            that.setData({
              imgToBaidu:res.data
            })
            console.log("编码base64成功")
          }
          })  
      }
    })
  },
  identify:function(){
    
    //time.sleep(60)
    var that=this;
    wx.showLoading({
      title: '识别中...',
    })
    // 调用接口
    console.log(this.data.imgSrc)
    wx.request({
      //url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/animal?access_token='+that.data.token,
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/animal?access_token=24.ae86941aa5825576de236638de8f2185.2592000.1716636905.282335-63701439',
      data: {
        // 注意：图片需要base64编码、去掉编码头后再进行urlencode。
        image: this.data.imgToBaidu
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
        },
        method: 'POST',
      success (res) {
        wx.hideLoading({
          success: (res) => {},
        })
        // 需要根据score处理相似度最高的一个结果
        let result = res.data.result
        console.log(result)
        let length = result.length
         that.setData({
            animal:result
          })
 
      }
    })
  },
  // 百度AIP开放平台使用OAuth2.0授权调用开放API，调用API时必须在URL中带上access_token参数
// 获取token
getToken:function(){
  console.log("正在创建新的access_token")
  var that=this;
  // client_id：app_key需要自己去百度智能云创建相应的应用后获取
  //client_secret：Secret Key
  const url = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=t8aIWzqTo4J45wKaKpVTrj7x&client_secret=muKZzjvUc5LCjpaRtd5aB2QEu7jmt8MN';
  wx.request({
      url:url,
      method: 'POST',
      success: res => {
        console.log("创建access_token成功")
          console.log(res)
          let thaRres=res.data;
          // 将access_token存储到storage中
          wx.setStorage({
            key:'access_token',
            data:thaRres.access_token
          });
          var date=new Date().getTime();
          let time=date+2592000*1000;
          console.log('三十天后的时间',time);
          console.log('当前时间戳',date)
          wx.setStorage({
            key:'expires_in',
            data:time
          });
          that.setData({token:thaRres.access_token});
              /*
              access_token： 要获取的Access Token；
              expires_in： Access Token的有效期(秒为单位，一般为1个月)；
              */
          },
  });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取storge中的token
    var that=this;
    wx.getStorage({
    key:'expires_in',
    success(res){
      console.log("缓存中有access_token")
      console.log(res)
      console.log(res.data)
      // 获取成功，证明本地已存有相关token
      const newT =new Date().getTime();
      //  // 用当前时间和存储的时间判断，token是否已过期
      if (newT > parseInt(res.data)) {
        console.log("token过期，重新获取token")
          // token过期，重新获取token
          that.getToken();
      } else {
        console.log("获取本地缓存的token")
          // 获取本地缓存的token
          let token=wx.getStorageSync('access_token');
          console.log("access_token为:"+token)
          that.setData({token:token});
          console.log("获取本地缓存的token结束")
      }
    },fail(){
      console.log("缓存中没有access_token")
      that.getToken();
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