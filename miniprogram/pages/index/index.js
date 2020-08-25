const db = wx.cloud.database();
import Api from '../../router/demo.js'
Page({
  data: {
    currentId:0,
    inputShowed: false,
    inputVal: "",
    menus:[
      {
        id:2,
        cateName:"甜品类",
        url:"../../tabs/index/tp.png"
      },
      {
        id:3,
        cateName:"正餐类",
        url:"../../tabs/index/zc.png"
      },
      {
        id:4,
        cateName:"零食类",
        url:"../../tabs/index/tg.png"
      }
    ],
    con:[
      {
        cid:1,
        ctit:"杏仁姜汁饼干",
        src:"../../tabs/index/1.png",
        s_src:"../../tabs/user1.jpg",
        user:"小樱",
        num:755,
        like:4,
        details:"瑞典经典风味。香甜酥脆，并点缀着优质杏仁碎屑，带有一丝热辣的姜味"
      },
      {
        cid:2,
        ctit:"薄片生姜饼干",
        src:"../../tabs/index/2.png",
        s_src:"../../tabs/user2.jpg",
        user:"美伢",
        num:267,
        like:11,
        details:"瑞典经典风味。香甜酥脆，带有一丝热辣的姜味。"
      },
      {
        cid:3,
        ctit:"扁桃仁姜味饼干",
        src:"../../tabs/index/3.png",
        s_src:"../../tabs/user3.jpg",
        user:"莓莓",
        num:133,
        like:1,
        details:"香甜酥脆的饼干，并点缀着优质杏仁碎屑，带有姜饼香味。"
      },
      {
        cid:4,
        ctit:"覆盆子夹心饼干",
        src:"../../tabs/index/4.png",
        s_src:"../../tabs/user4.jpg",
        user:"小兰",
        num:332,
        like:34,
        details:"香甜酥脆的饼干，点缀少量覆盆子夹心。"
      },
      {
        cid:5,
        ctit:"燕麦饼干",
        src:"../../tabs/index/5.png",
        s_src:"../../tabs/user5.jpg",
        user:"哆啦",
        num:2231,
        like:4,
        details:"香甜、酥脆的美味燕麦饼干。"
      },
      {
        cid:6,
        ctit:"全麦卷饼",
        src:"../../tabs/index/6.png",
        s_src:"../../tabs/user5.jpg",
        user:"哆啦",
        num:2231,
        like:84,
        details:"酥脆的烤全麦卷。早餐时搭配黄油、奶酪和橘子酱食用，或者伴着酸奶享用。"
      }
    ]
  },
  click(){
    wx.navigateTo({
      url:"../../foregroundPage/pages/cate/cate"
    })
  },
  _getlist(){
    wx.navigateTo({
      url:"../../foregroundPage/pages/list/list"
    })
  },
  onLoad() {
    this.setData({
      search: this.search.bind(this)
    })
  },
  search: function (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{
          text: '燕麦饼干',
          value: 1
        }, {
          text: '覆盆子夹心饼干',
          value: 2
        }])
      }, 200)
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
  },
// 跳转到详情页
  _getdetail(e){
    let cid = e.currentTarget.dataset.cid;
    
    wx.navigateTo({
      url: '../../foregroundPage/pages/detail/detail',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  }
  // async click(){
  //  let res = await Api.getDemo();
  //  console.log(res);

  // },
})