//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    title: "豆瓣电影TOP250",
    pageIndex:1,
    pageSize: 20,
    pageCount:13,
    movies:[
      // {
      //   id: 1,
      //   title:"title",
      //   star: 9.5,            image:"https://img3.doubanio.com/view/movie_poster_cover/spst/public/p480747492.jpg",
      //   year: "1993",
      //   casts: "迢阅",
      //   genres: "剧情/爱情",  
      //   directors: "迢阅"      
      // }
    ]
  },

  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    var that = this
    that.getMovies(function() {
      wx.hideLoading()
    })
  },

  jump2Detail: function (e) {
    var movieId = e.currentTarget.id;
    console.log(movieId)
    wx.navigateTo({
      url: '../detail/detail?id=' + movieId
    })
  },

  onPullDownRefresh: function () {
    // Do something when pull down.
    console.log('刷新');
  },

  onReachBottom:function() {
    console.log('circle 下一页');

    var that = this
    var currentPageIndex = this.data.pageIndex
    that.setData({
      pageIndex: currentPageIndex + 1
    })

    wx.showNavigationBarLoading() 
    that.getMovies(function() {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    })
  },

  getMovies: function(callbackAferLoading) {
    var that = this

    var page = that.data.pageIndex 
    var pageCount = that.data.pageCount
    var pageSize = that.data.pageSize

    if(page <= pageCount) {
      wx.request({
        url: 'https://api.douban.com/v2/movie/top250',
        data: {
          start: (page - 1) * pageSize,
          count: pageSize
        },
        header: {
          "Content-Type": "json"
        },
        success: function (res) {
          var subjects = res.data.subjects

          var movies = that.data.movies;
          for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i]
            var movie = {}
            movie.id = subject.id
            movie.title = subject.title
            movie.star = subject.rating.average
            movie.image = subject.images.large
            movie.year = subject.year

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

            movies.push(movie)
          }

          that.setData({
            movies: movies
          })
          console.log(movies)

          callbackAferLoading()
        }
      })
    } else {
      wx.showToast({
        title: '加载完了。。不要再加载了。。兄弟！！',
        icon: 'success',
        duration: 2000
      })
    }
  }
})
