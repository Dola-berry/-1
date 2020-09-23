// pages/mine/mine.js
import Api from '../../utils/person.js';
import {
  openid
} from '../../utils/config.js'
Page({
  /**
   * 页面的初始数据
   * 
   * 数据库中
   * status:///1为正常 2删除 3待审核 4审核不通过
   */
  data: {
    currentId: 1, //选项卡当前所在id
    isLogin: false, //判断是否登录
    foodList: [], //发布的美食
    // page: 1, //当前第几页
    // pagesize: 4, //一页显示条数
    // isMore: true, //默认有下一页
    cateList: [], //发布过美食的分类
    _openid: '', //当前用户openid
    likeFood: [], //关注的美食
    auditList: [], //审核数据
    isUser: true, //判断是否用户
    isShow: false
  },

  //页面显示触发
  onShow() {
    this._isLogin()
  },
  // 滑到底部，下一页
  onReachBottom() {
    // this.data.page++;
    // this._getfoodList()
    wx.showToast({
      title: '没有更多了',
      icon: 'none'
    })
  },
  //判断是否登录状态
  _isLogin() {
    // 获取当前用户userInfo
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo._openid == openid) {
      this.setData({
        isUser: false
      })
    } else {
      this.setData({
        isUser: true
      })
    }
    // 如果缓存中存在则无需在手动登录
    if (userInfo) {
      this.setData({
        isLogin: true,
        userInfo,
        sawButtons: [{
          type: 'warn',
          text: '查看',
          extClass: 'test',
        }],
        delButtons: [{
          type: 'warn',
          text: '删除',
          extClass: 'test',
        }],
        auditButtons: [{
            type: 'warn',
            text: '查看',
            extClass: 'test',
          },
          {
            type: "warn",
            text: '通过',
            extClass: 'test',
          },
          {
            text: '不通过',
            extClass: 'test',
          }
        ],
        userButtons: [{
            type: 'warn',
            text: '查看',
            extClass: 'test',
          },
          {
            type: 'warn',
            text: '删除',
            extClass: 'test',
          }
        ]
      })
      // 获取美食列表
      this._getfoodList();
      this._getcate();
      this._getLikeFood();
      this._getAuditList();
      this._showAdd()
    }
  },
  // 选项卡部分
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
  _audit(e) {
    this.setData({
      currentId: e.currentTarget.dataset.id
    })
  },
  // 登录操作
  async _getInfo(e) {
    //获取用户信息
    let userInfo = e.detail.userInfo;
    wx.login({
      success: async () => {
        // 云函数获取当前用户的openid
        let res = await wx.cloud.callFunction({
          name: "wx-login"
        })
        let _openid = res.result.openid;

        // 定义一个变量接收需要存储的个人信息
        let data = {
          _openid,
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName
        }
        // 存储到storage
        wx.setStorageSync('userInfo', data);
        // 查询是否有该用户
        let user = await Api._redireuser({
          _openid
        })
        // 如果有，则更新相关信息
        if (user.data.length == 1) {
          user = await Api._editUser({
            _openid
          }, {
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName
          })
        } else { //没有则添加用户
          user = await Api._addUser({
            _openid,
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName
          })
        }
        this.setData({
          isLogin: true,
          userInfo: data,
          _openid
        })

        this._isLogin()
      }
    })
  },
  // 只有管理员才能跳转到分类管理
  _navpb() {
    // 如果当前登录的用户openid为管理员的openid即可跳转
    if (this.data.userInfo._openid == openid) {
      wx.navigateTo({
        url: '../../personPage/pages/management/management',
      })
    } else {
      return
    }
  },
  async _showAdd() {
    let res = await Api._findStatus({
      status: 1
    });
    if (res.data.length > 0) {
      this.setData({
        isShow: true
      })
    } else {
      this.setData({
        isShow: false
      })
    }
  },
  // 跳转到发布页面
  async _getAdd() {
    wx.navigateTo({
      url: '../../personPage/pages/publish/publish',
    })
  },
  // 获取当前用户所发布的美食
  async _getfoodList() {
    let foodList = await Api._foodLists({
      _openid: this.data.userInfo._openid,
      status: 1
    });
    let userDbTypes = []
    // 向数据中添加userInfo属性，便于跳转详情页获取个人信息
    foodList.data.forEach(async item => {
      item.userInfo = this.data.userInfo
      userDbTypes = await Api._userDbTypes({
        recipeId:item.recipeId,
        _openid:item.userInfo._openid
      })
      if (userDbTypes.data.length == 0) {
         await Api._userAddDbTypes({
          recipeId:item.recipeId,
          _openid:item.userInfo._openid
        });
      }else{

      }
    })
    this.setData({
      foodList: foodList.data
    })
  },
  // 删除当前用户所发布的美食
  async _delButtonTap(e) {
    // 获取当前点击的参数
    let {
      id,
      idx
    } = e.currentTarget.dataset;
    // 根据id去删除数据  (更新数据的方法)
    await Api._delRecipes(id, {
      status: 2
    });
    let _id = id
    let cate = await Api._getCate(_id);
    let recipeId = cate.data.recipeId;
    let {
      _openid
    } = wx.getStorageSync('userInfo')
    this.data.foodList.splice(idx, 1)
    // 查找
    let pbMenus = await Api._getLikeList({
      _openid,
      recipeId,
      status: 1
    });
    // 删除没有数据的菜单
    if (pbMenus.data.length == 0) {
      await Api._userDelDbTypes({
        _openid,
        recipeId
      })
    }
    this.setData({
      foodList: this.data.foodList
    })
  },
  // 跳转到详情页
  async _getFoodDetail(e) {
    // 获取当前点击的id
    let id = e.currentTarget.dataset.id;
    // 通过id获取当前的美食的具体信息
    let detailInfo = this.data.foodList.find(item => {
      return item._id == id;
    })
    this._getdetail(detailInfo)
  },
  //获取当前用户所发布的美食的分类
  async _getcate() {
    // 根据当前用户的openid获取所发布的美食相关的商品信息
    let cateList = await Api._userDbTypes({
      _openid: this.data.userInfo._openid,
    });
    // 根据获取的商品信息的分类id查询获取分类信息
    cateList = await Promise.all(
      cateList.data.map(async item => {
         let res = await Api._findManageItem({
          _id: item.recipeId
        })
        return res
      })
    )
    cateList = cateList.map(item => {
      return item.data[0]
    })
    cateList.map(async item => {
      let _openid = wx.getStorageSync('userInfo')._openid
      let pbMenus = await Api._getLikeList({
        _openid,
        recipeId: item._id,
        status: 1
      });
      // 删除没有数据的菜单
      if (pbMenus.data.length == 0) {
        await Api._userDelDbTypes({
          _openid,
          recipeId: item._id,
        })
        
      }
    })
    this.setData({
      cateList: cateList
    })
  },
  // 跳转到对应列表页
  async _navigateList(e) {
    let data = e.currentTarget.dataset
    data.openid = this.data.userInfo._openid
    wx.navigateTo({
      url: './../../foregroundPage/pages/list/list',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', data)
      }
    })
  },
  // 获取所关注的美食
  async _getLikeFood() {
    // 通过当前openid获取关注的
    let _openid = this.data.userInfo._openid
    let likeList = await Api._getFoodLike({
      _openid
    });
    likeList = await Promise.all(
      likeList.data.map(async item => {
        return await Api._getLikeList({
          _id: item.recipeTypeId
        })
      })
    )
    // 向数据中添加userInfo属性，便于跳转详情页获取个人信息
    likeList.forEach((item, idx) => {
      likeList[idx] = item.data[0];
    })
    this.setData({
      likeFood: likeList
    })

  },
  // 从关注跳转到详情页
  async _getLikedetail(e) {
    // 获取当前点击的id
    let id = e.currentTarget.dataset.id;
    // 通过id获取当前的美食的具体信息
    let detailInfo = this.data.likeFood.find(item => {
      return item._id == id
    });
    // 通过_openid获取发布当前的美食的个人信息
    let _openid = detailInfo._openid;
    let res = await Api._redireuser({
      _openid
    })
    let {
      nickName,
      avatarUrl
    } = res.data[0]
    let userInfo = {
      nickName,
      avatarUrl
    }
    // 给detailInfo添加userInfo属性
    detailInfo.userInfo = userInfo;
    this._getdetail(detailInfo)
  },
  // 跳转到对应详情页面
  _getdetail(detailInfo) {
    // return
    wx.navigateTo({
      url: '../../foregroundPage/pages/detail/detail',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          detailInfo
        })
      }
    })
  },
  // 获取审核数据  status:3
  async _getAuditList() {
    let res = null;
    if (this.data.userInfo._openid == openid) {
      res = await Api._foodLists({
        status: 3
      });
      // 通过_openid获取发布当前的美食的个人信息
      let auditList = res.data.map(async item => {
        return await Api._redireuser({
          _openid: item._openid
        })
      })
      auditList = await Promise.all(auditList);
      // 将用户相关信息与发布的关联
      auditList.forEach((item, idx) => {
        res.data[idx].userInfo = item.data[0]
      })
    } else {
      // 获取到审核中及审核不通过的数据
      res = await Api._foodLists({
        status: 3,
        _openid: this.data.userInfo._openid
      });
      let res1 = await Api._foodLists({
        status: 4,
        _openid: this.data.userInfo._openid
      })
      res.data = res.data.concat(res1.data)
      res.data.forEach(item => {
        item.userInfo = this.data.userInfo
      })
    }
    this.setData({
      auditList: res.data
    })
  },

  //审核
  async _auditList(e) {
    // 获取待审核数据
    // 判断点击哪个操作
    let detailId = e.detail.index;
    // 获取当前点击的id
    let id = e.currentTarget.dataset.id;
    let detailInfo = this.data.auditList.find(item => {
      return item._id == id
    })
    // 查看
    if (detailId == 0) {
      wx.showLoading({
        title: '加载中..'
      })
      this._getdetail(detailInfo)
      wx.hideLoading()
    } else if (detailId == 1) {
      if (!this.data.isUser) { //通过
        wx.showToast({
          title: '操作成功',
        })
        await Api._Editfood({
          _id: id
        }, {
          status: 1
        });
        this._getAuditList()
      } else { //删除
        wx.showToast({
          title: '操作成功',
        })
        await Api._Editfood({
          _id: id
        }, {
          status: 2
        })
        this._getAuditList()
        this._getcate()
      }

    } else {
      //不通过
      await Api._Editfood({
        _id: id
      }, {
        status: 4
      })
      wx.showToast({
        title: '操作成功',
      })
      this._getAuditList()
    }

  },
})