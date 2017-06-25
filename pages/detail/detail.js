// detail.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:1,
    movie: {
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })

    wx.showLoading({
      title: '加载中',
      mask: true
    })

    var that = this
    that.getMovieDetail(function () {
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getMovieDetail: function (callbackAferLoading) {
    var that = this;
    wx.request({
      url: 'https://api.douban.com/v2/movie/subject/' + that.data.id,
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var subject = res.data
        var movie = {}
        movie.id = subject.id
        movie.title = subject.title
        movie.star = subject.rating.average
        movie.image = subject.images.large
        movie.year = subject.year
        movie.summary = "   " + subject.summary

        var genres = "";
        for (var j = 0; j < subject.genres.length - 1; j++) {
          genres += (subject.genres[j] + "/")
        }
        genres += subject.genres[subject.genres.length - 1]
        movie.genres = genres

        var casts = "";
        for (var j = 0; j < subject.casts.length - 1; j++) {
          casts += (subject.casts[j].name + "/")
        }
        casts += subject.casts[subject.casts.length - 1].name
        movie.casts = casts

        var directors = "";
        for (var j = 0; j < subject.directors.length - 1; j++) {
          directors += (subject.directors[j].name + "/")
        }
        directors += subject.directors[subject.directors.length - 1].name
        movie.directors = directors

        that.setData({
          movie: movie
        })
        console.log(movie)

        callbackAferLoading()
      }
    })
  }
})