var util = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    movies: {},
    navgateTitle: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    var category = options.category;
    var dataUrl = '';
    this.data.navgateTitle = category;
    switch (category) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/in_theaters";
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/coming_soon";
        break;
      case '豆瓣top250':
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData)
  },
  // onScrollLower: function (event) {
  //   var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
  //   util.http(nextUrl, this.processDoubanData);
  //   wx.showNavigationBarLoading()
  // },

  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  onPullDownRefresh: function () {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies={};
    this.data.isEmpty=true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var totalMovires = {};
    if (!this.data.isEmpty) {
      totalMovires = this.data.movies.concat(movies)
    } else {
      totalMovires = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovires
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()


  },
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navgateTitle
    })
  }

})