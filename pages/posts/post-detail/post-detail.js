var postsData = require('../../../data/post-data.js');
var app = getApp();
Page({
    data: {
        isplayingMusic: false

    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        console.log(app.globalData)
        var postId = options.id;
        console.log(postId)
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        // this.data.postsData=postsData;
        this.setData({
            postsData: postData
        });
        // 假设有缓存缓存
        // var posts_collected={
        //   1:"true",
        //   2:'flase',
        //   3:'true'
        // }
        // 第一次进入页面执行执行，判断是否收藏过，设置默认值
        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            this.setData({
                collected: postCollected
            })
        }
        else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }
        if(app.globalData.g_isPlayingMusic&&app.globalData.g_currentMusicPostId===postId){
            // this.data.isplayingMusic=true;
            this.setData({
                isplayingMusic:true
            })
        }
this.setMusicMonitor()
    },
    setMusicMonitor: function () {
        // 监听音乐播放播放
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isplayingMusic: true
            })
           app.globalData.g_isPlayingMusic=true;
           app.globalData.g_currentMusicPostId=that.data.currentPostId
        })
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isplayingMusic: false
            })
        })
            wx.onBackgroundAudioStop(function () {
            that.setData({
                isplayingMusic: false
            })
            app.globalData.g_isPlayingMusic=false;
            app.globalData.g_currentMusicPostId=null;
        })
    },
    // 点击收藏按钮j，控制是否收藏
    onCollectionTap: function () {
        this.getPostsCollected();
        // this.getPostsCollectedSyc();
    },
    getPostsCollected: function () {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected)

            }

        })
    },
    getPostsCollectedSyc: function (event) {
        var that = this;
        var postsCollected = wx.getStorageSync('posts_collected');
        console.log(postsCollected)
        var postCollected = postsCollected[that.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        that.showToast(postsCollected, postCollected)
    },
    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
            showCancel: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    wx.setStorageSync('posts_collected', postsCollected);
                    // 更新数据绑定变量，从而实现切换图片
                    that.setData({
                        collected: postCollected
                    });
                }
            }
        });
    },

    showToast: function (postsCollected, postCollected) {
        // 更新文章是否的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        // 更新数据绑定变量，从而实现切换图片
        this.setData({
            collected: postCollected
        });
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        });
    },
    onShareTap: function (event) {
        wx.showActionSheet({
            itemList: ['分享到朋友圈', '分享到QQ'],
            itemColor: '#4034054',
            success: function (res) {
                wx.showModal({
                    title: '提示',
                    content: '这是一个模态弹窗',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                    }
                })
                console.log(res.tapIndex)
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },
    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isplayingMusic = this.data.isplayingMusic;
        if (isplayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isplayingMusic: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title ,
                coverImgUrl: postData.music.coverImg
            });
            this.setData({
                isplayingMusic: true
            })
        }

    }

})