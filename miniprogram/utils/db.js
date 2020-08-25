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
// 根据id更新数据
const _findId = (collectionname,id,data={}) => {
  return db.collection(collectionname).doc(id).update({data})
}
//根据条件更新数据
const _update = (collectionname,where={},data={}) => {
  return db.collection(collectionname).where(where).update({data})
}
export default {
  _add,
  _find ,
  _findId,
  _update
}