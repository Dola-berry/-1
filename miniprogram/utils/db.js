let db = wx.cloud.database();
// 封装公共代码的数据增、删、改、查

// 增加数据
const _add = (collectionname,data={}) => {
  return db.collection(collectionname).add({data})
};
// 条件查找数据
const _find = (collectionname,where={}) => {
  return db.collection(collectionname).where(where).get()
}
// 条件id查找数据
const _findId = (collectionname,id) => {
  
  return db.collection(collectionname).doc(id).get()
}
// 根据id更新数据
const _updateId = (collectionname,id,data={}) => {
  return db.collection(collectionname).doc(id).update({data})
}
//根据条件更新数据
const _update = (collectionname,where={},data={}) => {
  return db.collection(collectionname).where(where).update({data})
}
// 删除数据
const _del = (collectionname,where={}) => {
  return db.collection(collectionname).where(where).remove()
};

//分页
const _getPage = ((collectionname,where={},pagesize,skip,key,value) =>{
  return db.collection(collectionname).where(where).limit(pagesize).skip(skip).orderBy(key,value).get()
})

// 只显示几条
const _getLimit = ((collectionname,where={},limit) =>{
  return db.collection(collectionname).where(where).limit(limit).get()
})
// 排序
const _getOrderBy = ((collectionname,where={},key,value) =>{
  return db.collection(collectionname).where(where).orderBy(key,value).get()
})
export default {
  _add,
  _find,
  _findId,
  _update,
  _updateId,
  _getPage,
  _del,
  _getLimit,
  _getOrderBy
}