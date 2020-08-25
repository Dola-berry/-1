// pages/mine/mine.js
import Api from '../../utils/person.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentId: 1,
    isLogin: false,
    userInfo: {
      avatarUrl: "../../tabs/people.png",
      nickName: "",
    },
    userMenus:[]
  },
  onShow() {
    this._isLogin()
  },
  async _isLogin() {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        isLogin: true,
        openId:userInfo.openid,
        userInfo: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
        }
      })
      let menus = await Api._userMenus(this.data.openId);
      this.setData({
        userMenus:menus.data
      })
      console.log(this.data.userMenus);
      
    }
  },
  _getAdd() {
    wx.navigateTo({
      url: '../../personPage/pages/publish/publish',
    })
  },
  // 获取用户登录信息
  _getInfo(e) {
    let userInfo = e.detail.userInfo;
    wx.login({
      success: async () => {
        let res = await wx.cloud.callFunction({
          name: "v-login"
        })
        let _openid = res.result.openid;
        let data = {
          _openid,
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName
        }
        // 存储到storage
        wx.setStorageSync('userInfo', data);
        res = await Api._redireuser(_openid);
        // console.log(res.data[0]._id);
        let id = res.data[0]._id
       if(res.data.length == 0) {
         // 添加用户
       await Api._addUser({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
        })
       }else {
         //修改用户
         await Api._editUser(
          id, 
          {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName
          })
           
       }
        

        this.setData({
          isLogin: true,
          openId:data._openid,
          userInfo: data
        })
      }
    })
  },
  
// 管理员跳转
_navpb(){
  if(this.data.openId != opensid) return;
  wx.navigateTo({
    url: '../../personPage/pages/management/management',
  })
},
  _food(e) {
    this.setData({
      currentId: e.currentTarget.dataset.id
    })
  },
  _cate(e) {
    this.setData({
      currentId: e.currentTarget.dataset.id
    })
  },
  _like(e) {
    this.setData({
      currentId: e.currentTarget.dataset.id
    })
  },

  onLoad: function () {
    this.setData({
      slideButtons: [{
        type: 'warn',
        text: '查看',
        extClass: 'test',
      }],
    });

  },
  slideButtonTap(e) {
    console.log('slide button tap', e.detail)
  }
})