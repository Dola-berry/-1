import db from './db.js';
import {conllections} from './config.js';
// 添加分类数据
const _doManageItem = (typeName)=>{
  return db._add(conllections.recipeTypeName,{
    typeName,
    status:1
  })
}
// 查找全部分类数据
const _findManageItem = () => {
  return db._find(conllections.recipeTypeName,{status:1})
}
//删除分类数据
const _delManageItemId = (id) => {
  return db._findId(
    conllections.recipeTypeName,
    id,
    {status:2}
    )
}
// 更新分类数据
const _editManageItem=(id,typeName)=>{
  return db._findId(
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

// 用户登录的数据添加
const _addUser = (data = {})=>{
  return db._add(
    conllections.userName,
    data
  )
}
// 用户登录的数据查找
const _redireuser = (_openid) => {
  return db._find(
    conllections.userName,
    {
      _openid
    }
  )
}
// 用户登录的数据修改
const _editUser = (id,data = {})=>{
  return db._findId(
    conllections.userName,
    id,
    data
  )
}
//根据用户的openid获取发布的美食
const _userMenus = (_openid => {
  return db._find(
    conllections.recipeName,
    {_openid}
  )
})


// 美食添加
const _doRecipes = (data={})=>{
  return db._add(conllections.recipeName,data)
}

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
  _userMenus
}