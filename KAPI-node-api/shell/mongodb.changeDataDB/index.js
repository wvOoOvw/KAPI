const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const { Mongo, parseFind, ObjectId } = require('../../src/utils.mongo')


Mongo.client.db('KAPIKAPI').collection('Cartoon').find().toArray().then(data => {
  data
    .forEach(i => {
      Mongo.client.db('KAPIKAPI').collection('Cartoon').updateOne({ _id: i._id }, { '$set': { user_id: ObjectId(String(i.user_id)) } }).then(res => console.log('updateOne', i._id))
    })
})

// 批量发布

// Mongo.client.db('KAPIKAPI').collection('Album').find({ user_id: new ObjectId('673ddab39e2c2c7eb3bc6640'), status: 0 }).toArray().then(data => {
//   data
//     .forEach(i => {
//       if (i.price === 0) {
//         Mongo.client.db('KAPIKAPI').collection('Album').updateOne({ _id: i._id }, { '$set': { price: 40, status: 1 } }).then(res => console.log('updateOne', i._id))
//       }
//       if (i.price !== 0) {
//         Mongo.client.db('KAPIKAPI').collection('Album').updateOne({ _id: i._id }, { '$set': { status: 1 } }).then(res => console.log('updateOne', i._id))
//       }
//     })
// })

// Mongo.client.db('KAPIKAPI').collection('Video').find({ user_id: new ObjectId('673ddab39e2c2c7eb3bc6640'), status: 0 }).toArray().then(data => {
//     data
//         .forEach(i => {
//             if (i.price === 0) {
//                 Mongo.client.db('KAPIKAPI').collection('Video').updateOne({ _id: i._id }, { '$set': { price: 200, status: 1 } }).then(res => console.log('updateOne', i._id))
//             }
//         })
// })

// Mongo.client.db('KAPIKAPI').collection('Recordation').updateMany({ user_id: new ObjectId('673ddab39e2c2c7eb3bc6640'), status: 0 }, { '$set': { status: 1 } }).then(res => console.log('updateMany'))

// 修改创建时间

// Mongo.client.db('KAPIKAPI').collection('Album').updateOne({ _id: new ObjectId('68bc3f9363d61ee6f3b380e6') }, { '$set': { createTime: new Date().getTime(), updateTime: new Date().getTime() } }).then(res => console.log('updateOne'))

// 修改标签 添加包含视频标签

// Mongo.client.db('KAPIKAPI').collection('Album').find().toArray().then(data => {
//     data
//         .filter(i => {
//             return i.description.includes('V') && i.tag.every(i => i !== '包含视频')
//         })
//         .forEach(i => {
//             const tag = [...i.tag.filter(i => i !== '包含视频'), '包含视频']
//             Mongo.client.db('KAPIKAPI').collection('Album').updateOne({ _id: i._id }, { '$set': { tag: tag } }).then(res => console.log('updateOne', i._id))
//         })
// })

// 替换图片cdn

// https://wvooovw.github.io/KAPI-STATIC/src
// https://amazing-mermaid-5b3c41.netlify.app/src
// https://superlative-froyo-ee8e6b.netlify.app/src
// http://kapikapi.club/src
// http://kapikapi.asia/src

// Mongo.client.db('KAPIKAPI').collection('User').find().toArray().then(data => {
//     data.forEach(i => {
//         if (i.avatar || i.background) {
//             Mongo.client.db('KAPIKAPI').collection('User').updateOne({ _id: i._id }, { '$set': { avatar: '', background: '' } }).then(res => console.log('updateOne', i._id))
//         }
//     })
// })

// Mongo.client.db('KAPIKAPI').collection('Album').find().toArray().then(data => {
//     data.forEach(i => {
//         if (i.poster.some(i => i.includes('kapifile://')) || i.preview.some(i => i.includes('kapifile://'))) {
//             const poster = i.poster.map(i => i.replace('kapifile://', 'kapi://remote.oss/'))
//             const preview = i.preview.map(i => i.replace('kapifile://', 'kapi://remote.oss/'))
//             Mongo.client.db('KAPIKAPI').collection('Album').updateOne({ _id: i._id }, { '$set': { poster, preview } }).then(res => console.log('updateOne', i._id))
//         }
//     })
// })

// 查找不存在的收藏购买

// Mongo.client.db('KAPIKAPI').collection('User').find().toArray().then(data => {
//   data.forEach(async i => {
//     const user_id = i._id

//     const resourcePaids_id = i.resourcePaids_id
//     const resourceFavoriteds_id = i.resourceFavoriteds_id

//     const resourcePaids_id_new =
//       await Promise.all(
//         resourcePaids_id.map(i => {
//           return new Promise(resolve => {
//             Mongo.client.db('KAPIKAPI').collection('Album').findOne({ _id: i }).then(data => {
//               if (data) resolve(i)
//               if (!data) resolve()
//             })
//           })
//         })
//       ).then(res => res.filter(Boolean))

//     const resourceFavoriteds_id_new =
//       await Promise.all(
//         resourceFavoriteds_id.map(i => {
//           return new Promise(resolve => {
//             Mongo.client.db('KAPIKAPI').collection('Album').findOne({ _id: i }).then(data => {
//               if (data) resolve(i)
//               if (!data) resolve()
//             })
//           })
//         })
//       ).then(res => res.filter(Boolean))

//     if (resourcePaids_id.length !== resourcePaids_id_new.length || resourceFavoriteds_id.length !== resourceFavoriteds_id_new.length) {
//       Mongo.client.db('KAPIKAPI').collection('User').updateOne({ _id: user_id }, { '$set': { resourcePaids_id: resourcePaids_id_new, resourceFavoriteds_id: resourceFavoriteds_id_new } })
//       console.log(user_id, resourcePaids_id_new, resourceFavoriteds_id_new)
//     }
//   })
// })