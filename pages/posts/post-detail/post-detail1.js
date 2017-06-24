var postsData = require('../../../data/post-data.js');
Page({
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var postId = options.id;
     this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    // this.data.postsData=postsData;
    this.setData({
      postsData: postData
    });
// 获取所有文章缓存信息
    var postsCollected = wx.getStorageSync('posts_collected');
    console.log(postsCollected)
    if (postsCollected) {
      // 当前文章
      console.log(1)
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
        // 第二次进入页面页面，没点击走这里
      })
    } else {
      var postsCollected = {}
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
      console.log(2)
      // 第一次走了这里
    }
  },
  onCollectionTap: function () {
    // 获取全部缓存信息
    var postsCollected = wx.getStorageSync('posts_collected');
    console.log(postsCollected)
    console.log(this.data.currentPostId)
    // 获取当前文章是否收藏的缓存信息
    var postCollected = postsCollected[this.data.currentPostId];
        console.log(postCollected)
    // 对当前文章是否收藏取反
    postCollected = ! postCollected;
    console.log(postCollected)
    // 取反之后更新当前文章的缓存信息
    postsCollected[this.data.currentPostId] = postCollected;
    // 更新所以文章的缓存
   wx.setStorageSync('posts_collected', postsCollected);
    // 绑定页面的变量
    this.setData({
      collected: postCollected
    })
    
  },
  onShareTap: function () {
    // wx.removeStorageSync('key');
    wx.clearStorageSync();
  }

})