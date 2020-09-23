import db from './db.js';
import {conllections} from './config.js';
// 状态
const _findStatus = (where={}) => {
  return db._find(conllections.statusName,where)
}
// 分类管理*****************************************************************
// 添加分类数据
const _doManageItem = (typeName)=>{
  return db._add(conllections.recipeTypeName,{
    typeName,
    status:1
  })
}
// 查找分类数据
const _findManageItem = (where={}) => {
  return db._find(conllections.recipeTypeName,where)
}
//删除分类数据
const _delManageItemId = (id) => {
  return db._updateId(
    conllections.recipeTypeName,
    id,
    {status:2}
    )
}
// 更新分类数据
const _editManageItem=(id,typeName)=>{
  return db._updateId(
    conllections.recipeTypeName,
    id,
    {
      typeName
    }
  )
}
//查找分类重复数据
const _redireManageItem=(typeName)=>{
  return db._find(
    conllections.recipeTypeName,
    {
      status:1,
      typeName
    }
  )
}
// 用户页面***************************************************************************************
// 用户登录的数据添加
const _addUser = (data = {})=>{
  return db._add(
    conllections.userName,
    data
  )
}
// 用户登录的数据查找
const _redireuser = (where={}) => {
  return db._find(
    conllections.userName,
    where
  )
}
// 用户登录的数据修改
const _editUser = (where={},data = {})=>{
  return db._update(
    conllections.userName,
    where,
    data
  )
}
//根据用户的openid获取发布的美食
const _foodList = ((where={},pagesize,skip,key,value) => {
  return db._getPage(
    conllections.recipeName,
    where,
    pagesize,
    skip,
    key,
    value
)})
// 不分页获取用户发布的零食
const _foodLists = ((where={}) => {
  return db._find(
    conllections.recipeName,
    where,
)})
// 修改用户发布的零食
const _Editfood = ((where={},data={}) => {
  return db._update(
    conllections.recipeName,
    where,
    data
)})
// 根据分类id查找分类
const _getCate = (id => {
  return db._findId(
        conllections.recipeName,
        id
      )
})
// 根据分类id删除美食
const _delRecipes = ((id,data={}) => {
  return db._updateId(
        conllections.recipeName,
        id,
        data
      )
})

//获取用户关注的美食
const _getFoodLike = (where={}) => {
  return db._find(
    conllections.fllowsName,
    where
  )
}
//获取美食具体信息
const _getLikeList = (where={}) => {
  return db._find(
    conllections.recipeName,
    where
  )
}

// 美食添加页面************************************************************************************
// 美食添加
const _doRecipes = (data={})=>{
  return db._add(conllections.recipeName,data)
}
//根据用户的openid获取发布的美食的分类
const _userDbTypes = ((where={} )=> {
  return db._find(
    conllections.userPdTypesName,
    where,
  )
})
//根据用户的openid添加发布的美食的分类
const _userAddDbTypes = ((data={})=> {
  return db._add(
    conllections.userPdTypesName,
    data
  )
})
//根据用户的openid删除发布的美食的分类
const _userDelDbTypes = ((where={})=> {
  return db._del(
    conllections.userPdTypesName,
    where
  )
})
//菜单**************************************************************
const _getMenus = ((where={},pagesize,skip,key,value) => {
  return db._getPage(
    conllections.recipeTypeName,
    where,pagesize,skip,key,value
  )
})


// 首页***********************************************************
const _getHotFood = ((where={},pagesize,skip,key,value) => {
  return db._getPage(
    conllections.recipeName,where,pagesize,skip,key,value
  )
})

const _getOrderFood = ((where={},key,value) => {
  return db._getOrderBy(
    conllections.recipeName,where,key,value
  )
})
// 搜索页*******************************************
const _getHotSearch = ((where={},limit) => {
  return db._getLimit(
    conllections.recipeName,where,limit
  )
})


// 列表页***********************************************************
const _getFoodList = ((where={},pagesize,skip,key,value)=>{
  return db._getPage(
    conllections.recipeName,
    where,
    pagesize,
    skip,
    key,
    value
  )
})

// 详情页****************************************************************
// 更新
const _editDetail = (where={},data = {})=>{
  return db._update(
    conllections.recipeName,
    where,
    data
  )
}

/*
  数据表：re-Discuss
  _id:当前详情页的id
  _openid:当前用户的id
  addtime：发表的时间
  avatarUrl:用户头像
  detailId：当前详情页id
  message：评论语
  nickName：用户昵称
*/
// 留言添加
const _addDiscuss = (data={})=>{
  return db._add(conllections.discussName,data)
}

// 留言查询
const _getDiscuss = (where={},key,value)=>{
  return db._getOrderBy(conllections.discussName,where,key,value)
}

// 留言删除
const _delDiscuss = (where={})=>{
  return db._del(conllections.discussName,where)
}

// 关注****************************************************************
// 查询
const _getFllows = ((where = {}) => {
  return db._find(
    conllections.fllowsName,
     where
  )
})
// 添加
const _addFllows = ((data = {}) => {
  return db._add(
    conllections.fllowsName,
    data
  )
})
// 删除
const _delFllows = ((where = {}) => {
  return db._del(
    conllections.fllowsName,
    where
  )
})

export default{
  _doManageItem,
  _findManageItem,
  _delManageItemId,
  _editManageItem,
  _redireManageItem,
  _addUser,
  _redireuser,
  _editUser,
  _doRecipes,
  _foodList,
  _userDbTypes,
  _userAddDbTypes,
  _getCate,
  _delRecipes,
  _getHotFood,
  _getMenus,
  _getFoodList,
  _getFllows,
  _addFllows,
  _delFllows,
  _getFoodLike,
  _getLikeList,
  _getHotSearch,
  _editDetail,
  _userDelDbTypes,
  _foodLists,
  _Editfood,
  _getOrderFood,
  _addDiscuss,
  _getDiscuss,
  _delDiscuss,
  _findStatus
}