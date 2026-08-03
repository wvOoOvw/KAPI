const crypto = require('crypto')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const FormData = require('form-data')

const router = require('express').Router()

const { ObjectId, Mongo, Collection } = require('./utils.mongo')

router.use('/api/app', async (req, res, next) => {

  try {
    if (JSON.stringify(req.body).includes('$')) {
      throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    next()
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.use('/api/app', async (req, res, next) => {
  const { authorization } = req.headers

  try {
    if (authorization) {
      await Mongo.client.db(Collection).collection('User').updateOne({ authorization: authorization }, { $set: { activeTime: new Date().getTime(), activeIp: req.socket.remoteAddress } }).catch(() => { })
    }

    next()
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

/* User API START */

router.post('/api/app/user/find', async (req, res) => {
  const { authorization } = req.headers
  const { user_id } = req.body

  try {
    {
      if (typeof authorization !== 'string' && typeof authorization !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ _id: new ObjectId(user_id) }, { projection: { _id: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const userSelf = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, userFolloweds_id: 1 } })
    const user = await Mongo.client.db(Collection).collection('User').findOne({ _id: new ObjectId(user_id) })

    const pipelineUserFolloweds = [
      { $match: { userFolloweds_id: { $in: [user._id] } } },
      { $unwind: '$userFolloweds_id' },
      { $group: { _id: '$userFolloweds_id', userFolloweds_id: { $sum: 1 } } }
    ]

    const groupUserFolloweds_id = await Mongo.client.db(Collection).collection('User').aggregate(pipelineUserFolloweds).toArray()

    user.self = Boolean(userSelf && String(user._id) === String(userSelf._id))
    user.followed = Boolean(userSelf && userSelf.userFolloweds_id.some(n => String(n) === String(user._id)))
    user.followedCount = groupUserFolloweds_id.find(n => String(n._id) === String(user._id))?.userFolloweds_id || 0
    user.userFollowedCount = user.userFolloweds_id.length

    if (user.self === false) {
      if (user.status !== 1) res.send({ code: 200, data: { _id: user._id, status: user.status } })
      if (user.status === 1) res.send({ code: 200, data: { _id: user._id, name: user.name, description: user.description, avatar: user.avatar, background: user.background, followed: user.followed, followedCount: user.followedCount, userFollowedCount: user.userFollowedCount, self: user.self, status: user.status } })
    }

    if (user.self === true) {
      res.send({ code: 200, data: user })
    }

  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/user/find/list', async (req, res) => {
  const { authorization } = req.headers
  const { filter, skip, limit } = req.body

  try {
    {
      if (typeof authorization !== 'string' && typeof authorization !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter !== 'object' && typeof filter !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && typeof filter.name !== 'string' && typeof filter.name !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && typeof filter.favorited !== 'boolean' && typeof filter.favorited !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof skip !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof limit !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const match = {}

    match.status = { $eq: 1 }

    const userSelf = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, userFolloweds_id: 1 } })

    if (filter) {
      if (filter.name) match.name = { $regex: filter.name }
      if (filter.favorited === true && userSelf) match._id = { $in: userSelf.userFolloweds_id }
    }

    const pipelineUser = [
      { $match: match },
      { $project: { _id: 1, name: 1, description: 1, avatar: 1, background: 1, userFolloweds_id: 1, status: 1 } },
    ]

    const user = await Mongo.client.db(Collection).collection('User').aggregate(pipelineUser).skip(skip).limit(limit).toArray()

    const pipelineUserFolloweds = [
      { $match: { userFolloweds_id: { $in: user.map(i => i._id) } } },
      { $unwind: '$userFolloweds_id' },
      { $group: { _id: '$userFolloweds_id', userFolloweds_id: { $sum: 1 } } }
    ]

    const groupUserFolloweds_id = await Mongo.client.db(Collection).collection('User').aggregate(pipelineUserFolloweds).toArray()

    user.forEach(i => {
      i.followed = Boolean(userSelf && userSelf.userFolloweds_id.some(n => String(n) === String(i._id)))
      i.followedCount = groupUserFolloweds_id.find(n => String(n._id) === String(i._id))?.userFolloweds_id || 0
      i.userFollowedCount = i.userFolloweds_id.length
    })

    res.send({ code: 200, data: user })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/user/find/login/credential', async (req, res) => {
  const { credential, password } = req.body

  try {
    {
      if (typeof credential !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof password !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const user = await Mongo.client.db(Collection).collection('User').findOne({ credential, password }, { projection: { _id: 1, authorization: 1, role: 1 } })

    if (user !== null) res.send({ code: 200, data: user })
    if (user === null) throw { error: new Error(), data: { code: 500, message: '登录失败' } }
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/user/find/login/authorization', async (req, res) => {
  const { authorization } = req.headers

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, authorization: 1, role: 1 } })

    if (user !== null) res.send({ code: 200, data: user })
    if (user === null) res.send({ code: 500 })

  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/user/insert', async (req, res) => {
  const { credential, password } = req.body

  try {
    {
      if (typeof credential !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof password !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (credential.length > 32 || credential.length < 8 || credential.match(/^[a-zA-Z0-9\.\@\#\%\^\&\*]+$/) === null) throw { error: new Error(), data: { code: 500, message: '账号必须由8-32位字母数字组成' } }
      if (password.length > 32 || password.length < 8 || password.match(/^[a-zA-Z0-9\.\@\#\%\^\&\*]+$/) === null) throw { error: new Error(), data: { code: 500, message: '账号必须由8-32位字母数字组成' } }

      const authorization = crypto.createHash('md5').update(credential + '_' + password).digest('hex')
      const credentialRepeat = await Mongo.client.db(Collection).collection('User').findOne({ $or: [{ credential }, { authorization }] }, { projection: { _id: 1 } })

      if (credentialRepeat) throw { error: new Error(), data: { code: 500, message: '注册失败，账号重复' } }
    }

    const authorization = crypto.createHash('md5').update(credential + '_' + password).digest('hex')

    await Mongo.client.db(Collection).collection('User').insertOne({ credential, password, authorization, role: 'user', coin: 0, name: '游客' + Math.floor(Math.random() * 1000000), description: '', avatar: '', background: '', albumPaids_id: [], albumFavoriteds_id: [], cartoonFavoriteds_id: [], cartoonPaids_id: [], userFolloweds_id: [], status: 1, activeTime: new Date().getTime(), activeIp: req.socket.remoteAddress })

    const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, authorization: 1, role: 1 } })

    res.send({ code: 200, data: user })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/user/update', async (req, res) => {
  const { authorization } = req.headers
  const { credential, password, name, description, avatar, background } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof credential !== 'string' && typeof credential !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof password !== 'string' && typeof password !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof name !== 'string' && typeof name !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof description !== 'string' && typeof description !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof avatar !== 'string' && typeof avatar !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof background !== 'string' && typeof background !== 'object' && typeof background !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      if (credential.length > 32 || credential.length < 8 || credential.match(/^[a-zA-Z0-9\.\@\#\%\^\&\*]+$/) === null) throw { error: new Error(), data: { code: 500, message: '账号必须由8-32位字母数字组成' } }
      if (password.length > 32 || password.length < 8 || password.match(/^[a-zA-Z0-9\.\@\#\%\^\&\*]+$/) === null) throw { error: new Error(), data: { code: 500, message: '账号必须由8-32位字母数字组成' } }
      if (typeof name === 'string' && name.length > 20) throw { error: new Error(), data: { code: 500, message: '名称不能超过20个字符' } }
      if (typeof description === 'string' && description.length > 2000) throw { error: new Error(), data: { code: 500, message: '个人描述不能超过2000个字符' } }

      if (typeof avatar === 'string' && avatar.length > 2000) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof background === 'string' && background.length > 2000) throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1 } })
      const credentialExist = await Mongo.client.db(Collection).collection('User').findOne({ $or: [{ credential }, { authorization }] }, { projection: { _id: 1, authorization: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (credentialExist !== null && credentialExist.authorization !== authorization) throw { error: new Error(), data: { code: 500, message: '修改失败，账号重复' } }
    }

    const authorizationMd5 = crypto.createHash('md5').update(credential + '_' + password).digest('hex')

    await Mongo.client.db(Collection).collection('User').updateOne({ authorization: authorization }, { $set: { ...JSON.parse(JSON.stringify({ credential, password, name, description, avatar, background })), authorization: authorizationMd5, status: 1 } })

    const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorizationMd5 }, { projection: { _id: 1, authorization: 1, role: 1 } })

    res.send({ code: 200, data: user })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/user/update/album/pay', async (req, res) => {
  const { authorization } = req.headers
  const { album_id } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof album_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, coin: 1, albumPaids_id: 1 } })
      const albumExist = await Mongo.client.db(Collection).collection('Album').findOne({ _id: new ObjectId(album_id) }, { projection: { price: 1, paidContent: 1, user_id: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (albumExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (albumExist.paidContent.downloadMode === 'none') throw { error: new Error(), data: { code: 500, message: '作品未提供下载方式' } }
      if (String(userExist._id) === String(albumExist.user_id)) throw { error: new Error(), data: { code: 500, message: '无法解锁自己的作品' } }
      if (userExist.albumPaids_id.some(i => String(i) === String(albumExist._id))) throw { error: new Error(), data: { code: 500, message: '无法重复解锁' } }
      if (userExist.coin < albumExist.price) throw { error: new Error(), data: { code: 500, message: '硬币不足' } }
    }

    const album = await Mongo.client.db(Collection).collection('Album').findOne({ _id: new ObjectId(album_id) }, { projection: { _id: 1, price: 1, user_id: 1 } })
    const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, coin: 1 } })

    await Mongo.client.db(Collection).collection('User').updateOne({ authorization: authorization }, { $set: { coin: user.coin - album.price }, $push: { albumPaids_id: album._id } })

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/user/update/album/favorite', async (req, res) => {
  const { authorization } = req.headers
  const { album_id, favorite } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof album_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof favorite !== 'boolean') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, albumFavoriteds_id: 1 } })
      const albumExist = await Mongo.client.db(Collection).collection('Album').findOne({ _id: new ObjectId(album_id) }, { projection: { user_id: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (albumExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (favorite === true && userExist.albumFavoriteds_id.some(i => String(i) === album_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (favorite !== true && userExist.albumFavoriteds_id.every(i => String(i) !== album_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (String(userExist._id) === String(albumExist.user_id)) throw { error: new Error(), data: { code: 500, message: '无法收藏自己的作品' } }
    }

    if (favorite === true) {
      await Mongo.client.db(Collection).collection('User').updateOne({ authorization: authorization }, { $push: { albumFavoriteds_id: new ObjectId(album_id) } })
    }

    if (favorite !== true) {
      await Mongo.client.db(Collection).collection('User').updateOne({ authorization: authorization }, { $pull: { albumFavoriteds_id: new ObjectId(album_id) } })
    }

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/user/update/cartoon/pay', async (req, res) => {
  const { authorization } = req.headers
  const { cartoon_id } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof cartoon_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, coin: 1, cartoonPaids_id: 1 } })
      const cartoonExist = await Mongo.client.db(Collection).collection('Cartoon').findOne({ _id: new ObjectId(cartoon_id) }, { projection: { price: 1, paidContent: 1, user_id: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (cartoonExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (cartoonExist.paidContent.downloadMode === 'none') throw { error: new Error(), data: { code: 500, message: '作品未提供下载方式' } }
      if (String(userExist._id) === String(cartoonExist.user_id)) throw { error: new Error(), data: { code: 500, message: '无法解锁自己的作品' } }
      if (userExist.cartoonPaids_id.some(i => String(i) === String(cartoonExist._id))) throw { error: new Error(), data: { code: 500, message: '无法重复解锁' } }
      if (userExist.coin < cartoonExist.price) throw { error: new Error(), data: { code: 500, message: '硬币不足' } }
    }

    const cartoon = await Mongo.client.db(Collection).collection('Cartoon').findOne({ _id: new ObjectId(cartoon_id) }, { projection: { _id: 1, price: 1, user_id: 1 } })
    const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, coin: 1 } })

    await Mongo.client.db(Collection).collection('User').updateOne({ authorization: authorization }, { $set: { coin: user.coin - cartoon.price }, $push: { cartoonPaids_id: cartoon._id } })

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/user/update/cartoon/favorite', async (req, res) => {
  const { authorization } = req.headers
  const { cartoon_id, favorite } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof cartoon_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof favorite !== 'boolean') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, cartoonFavoriteds_id: 1 } })
      const cartoonExist = await Mongo.client.db(Collection).collection('Cartoon').findOne({ _id: new ObjectId(cartoon_id) }, { projection: { user_id: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (cartoonExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (favorite === true && userExist.cartoonFavoriteds_id.some(i => String(i) === cartoon_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (favorite !== true && userExist.cartoonFavoriteds_id.every(i => String(i) !== cartoon_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (String(userExist._id) === String(cartoonExist.user_id)) throw { error: new Error(), data: { code: 500, message: '无法收藏自己的作品' } }
    }

    if (favorite === true) {
      await Mongo.client.db(Collection).collection('User').updateOne({ authorization: authorization }, { $push: { cartoonFavoriteds_id: new ObjectId(cartoon_id) } })
    }

    if (favorite !== true) {
      await Mongo.client.db(Collection).collection('User').updateOne({ authorization: authorization }, { $pull: { cartoonFavoriteds_id: new ObjectId(cartoon_id) } })
    }

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/user/update/user/follow', async (req, res) => {
  const { authorization } = req.headers
  const { user_id, follow } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof user_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof follow !== 'boolean') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, userFolloweds_id: 1 } })
      const userExistFollow = await Mongo.client.db(Collection).collection('User').findOne({ _id: new ObjectId(user_id) }, { projection: { _id: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (userExistFollow === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (follow === true && userExist.userFolloweds_id.some(i => String(i) === user_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (follow !== true && userExist.userFolloweds_id.every(i => String(i) !== user_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (String(userExist._id) === String(userExistFollow._id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    if (follow === true) {
      await Mongo.client.db(Collection).collection('User').updateOne({ authorization: authorization }, { $push: { userFolloweds_id: new ObjectId(user_id) } })
    }

    if (follow !== true) {
      await Mongo.client.db(Collection).collection('User').updateOne({ authorization: authorization }, { $pull: { userFolloweds_id: new ObjectId(user_id) } })
    }

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

/* User API END */

/* Album API START */

router.post('/api/app/album/find', async (req, res) => {
  const { authorization } = req.headers
  const { album_id } = req.body

  try {
    {
      if (typeof authorization !== 'string' && typeof authorization !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof album_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const albumExist = await Mongo.client.db(Collection).collection('Album').findOne({ _id: new ObjectId(album_id) }, { projection: { _id: 1 } })

      if (albumExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, role: 1, albumFavoriteds_id: 1, albumPaids_id: 1 } })
    const album = await Mongo.client.db(Collection).collection('Album').findOne({ _id: new ObjectId(album_id) })
    const userSelf = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, userFolloweds_id: 1 } })
    const userCreator = await Mongo.client.db(Collection).collection('User').findOne({ _id: album.user_id }, { projection: { _id: 1, name: 1, avatar: 1, status: 1 } })

    const pipelineAlbumPaids = [
      { $match: { albumPaids_id: { $in: [album._id] } } },
      { $unwind: '$albumPaids_id' },
      { $group: { _id: '$albumPaids_id', albumPaids_id: { $sum: 1 } } }
    ]

    const albumPaids_id = await Mongo.client.db(Collection).collection('User').aggregate(pipelineAlbumPaids).toArray()

    const pipelineAlbumFavoriteds = [
      { $match: { albumFavoriteds_id: { $in: [album._id] } } },
      { $unwind: '$albumFavoriteds_id' },
      { $group: { _id: '$albumFavoriteds_id', albumFavoriteds_id: { $sum: 1 } } }
    ]

    const albumFavoriteds_id = await Mongo.client.db(Collection).collection('User').aggregate(pipelineAlbumFavoriteds).toArray()

    album.own = Boolean(user && String(user._id) === String(album.user_id))
    album.favorited = Boolean(user && user.albumFavoriteds_id.some(i => String(i) === String(album._id)))
    album.paid = Boolean(user && user.albumPaids_id.some(i => String(i) === String(album._id)))
    album.paidCount = albumPaids_id.find(i => String(i._id) === String(album._id))?.albumPaids_id || 0
    album.favoritedCount = albumFavoriteds_id.find(i => String(i._id) === String(album._id))?.albumFavoriteds_id || 0
    album.user = userCreator

    album.user.self = Boolean(userSelf && String(album.user._id) === String(userSelf._id))
    album.user.followed = Boolean(userSelf && userSelf.userFolloweds_id.some(n => String(n) === String(album.user._id)))

    if (album.user.status !== 1) {
      album.user = { _id: album.user._id, status: album.user.status }
    }

    if (album.own === false && album.paid === false) {
      album.paidContent = { downloadMode: album.paidContent.downloadMode }
    }

    if (album.own === false) {
      if (album.status !== 1) res.send({ code: 200, data: { _id: album._id, status: album.status } })
      if (album.status === 1) res.send({ code: 200, data: album })
    }

    if (album.own === true) {
      res.send({ code: 200, data: album })
    }
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/album/find/list', async (req, res) => {
  const { authorization } = req.headers
  const { filter, seed, skip, limit } = req.body

  try {
    {
      if (typeof authorization !== 'string' && typeof authorization !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter !== 'object' && typeof filter !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && typeof filter.name !== 'string' && typeof filter.name !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && Array.isArray(filter.tag) !== true && typeof filter.tag !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && Array.isArray(filter.actor) !== true && typeof filter.actor !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && Array.isArray(filter.price) !== true && typeof filter.price !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && Array.isArray(filter.status) !== true && typeof filter.status !== 'number' && typeof filter.status !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && typeof filter.favorited !== 'boolean' && typeof filter.favorited !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && typeof filter.paid !== 'boolean' && typeof filter.paid !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && typeof filter.user_id !== 'string' && typeof filter.user_id !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof seed !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof skip !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof limit !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, role: 1 } })

      if ((typeof filter === 'object' && Array.isArray(filter.status) && (filter.status.length === 0 || filter.status.some(i => i !== 1))) && (userExist === null || String(userExist._id) !== filter.user_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, albumFavoriteds_id: 1, albumPaids_id: 1 } })

    const match = {}

    if (filter) {
      if (filter.name) match.name = { $regex: filter.name }

      if (filter.tag && filter.tag.length > 0) match.tag = { $in: filter.tag }
      if (filter.actor && filter.actor.length > 0) match.actor = { $in: filter.actor }
      if (filter.price && filter.price.length > 0) match.price = { $gte: filter.price[0], $lte: filter.price[1] }

      if (filter.status) {
        if (typeof filter.status === 'number') match.status = { $eq: filter.status }
        if (Array.isArray(filter.status) && filter.status.length > 0) match.status = { $in: filter.status }
      }

      if (user && filter.favorited === true && filter.paid !== true) match._id = { $in: user.albumFavoriteds_id }
      if (user && filter.favorited !== true && filter.paid === true) match._id = { $in: user.albumPaids_id }
      if (user && filter.favorited === true && filter.paid === true) match._id = { $in: user.albumFavoriteds_id.filter(i => user.albumPaids_id.includes(i)) }

      if (filter.user_id === 'nonself' && user) match.user_id = { $not: { $eq: user._id } }
      if (filter.user_id !== 'nonself' && filter.user_id && filter.user_id.length === 24) match.user_id = { $eq: new ObjectId(filter.user_id) }
    }

    const pipelineAlbum = [
      { $match: match },
      { $lookup: { from: "User", localField: "user_id", foreignField: "_id", as: "user" } },
      { $addFields: { user: { $first: "$user" } } },
      { $project: { seed: { $mod: ['$createTime', seed] }, _id: 1, name: 1, poster: 1, price: 1, status: 1, createTime: 1, updateTime: 1, user_id: 1, user: { _id: '$user._id', name: '$user.name', avatar: '$user.avatar', status: '$user.status' } } },
      { $sort: { seed: -1, createTime: -1 } },
    ]

    const album = await Mongo.client.db(Collection).collection('Album').aggregate(pipelineAlbum).skip(skip).limit(limit).toArray()

    const pipelineAlbumPaids = [
      { $match: { albumPaids_id: { $in: album.map(i => i._id) } } },
      { $unwind: '$albumPaids_id' },
      { $group: { _id: '$albumPaids_id', albumPaids_id: { $sum: 1 } } }
    ]

    const albumPaids_id = await Mongo.client.db(Collection).collection('User').aggregate(pipelineAlbumPaids).toArray()

    const pipelineAlbumFavoriteds = [
      { $match: { albumFavoriteds_id: { $in: album.map(i => i._id) } } },
      { $unwind: '$albumFavoriteds_id' },
      { $group: { _id: '$albumFavoriteds_id', albumFavoriteds_id: { $sum: 1 } } }
    ]

    const albumFavoriteds_id = await Mongo.client.db(Collection).collection('User').aggregate(pipelineAlbumFavoriteds).toArray()

    album.forEach(i => {
      i.own = Boolean(user && String(user._id) === String(i.user_id))
      i.favorited = Boolean(user && user.albumFavoriteds_id.some(n => String(n) === String(i._id)))
      i.paid = Boolean(user && user.albumPaids_id.some(n => String(n) === String(i._id)))
      i.paidCount = albumPaids_id.find(n => String(n._id) === String(i._id))?.albumPaids_id || 0
      i.favoritedCount = albumFavoriteds_id.find(n => String(n._id) === String(i._id))?.albumFavoriteds_id || 0
      if (i.user.status !== 1) i.user = { _id: i.user._id, status: i.user.status }
      delete i.seed
    })

    res.send({ code: 200, data: album })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/album/insert', async (req, res) => {
  const { authorization } = req.headers
  const { name, description, tag, actor, price, poster, preview, paidContent, status } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof name !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof description !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(tag) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(actor) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof price !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(poster) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(preview) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof paidContent !== 'object') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof status !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      if (tag.some(i => typeof i !== 'string')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (actor.some(i => typeof i !== 'string')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (poster.some(i => typeof i !== 'object')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (preview.some(i => typeof i !== 'object')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      if (name === '') throw { error: new Error(), data: { code: 500, message: '名称不能为空' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, role: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1 } })

    const album = await Mongo.client.db(Collection).collection('Album').insertOne({ name, description, tag, actor, price, poster, preview, paidContent, status, createTime: new Date().getTime(), updateTime: new Date().getTime(), user_id: user._id })

    res.send({ code: 200, data: album })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/album/update', async (req, res) => {
  const { authorization } = req.headers
  const { album_id, name, description, tag, actor, price, poster, preview, paidContent, status } = req.body

  try {
    {
      if (typeof album_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof name !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof description !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(tag) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(actor) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof price !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(poster) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(preview) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof paidContent !== 'object') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof status !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      if (tag.some(i => typeof i !== 'string')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (actor.some(i => typeof i !== 'string')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (poster.some(i => typeof i !== 'object')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (preview.some(i => typeof i !== 'object')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      if (name === '') throw { error: new Error(), data: { code: 500, message: '名称不能为空' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, role: 1 } })
      const albumExist = await Mongo.client.db(Collection).collection('Album').findOne({ _id: new ObjectId(album_id) }, { projection: { _id: 1, user_id: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (albumExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (String(userExist._id) !== String(albumExist.user_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    await Mongo.client.db(Collection).collection('Album').updateOne({ _id: new ObjectId(album_id) }, { $set: { name, description, tag, actor, price, poster, preview, paidContent, status, updateTime: new Date().getTime() } })

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/album/delete', async (req, res) => {
  const { authorization } = req.headers
  const { album_id } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof album_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, role: 1 } })
      const albumExist = await Mongo.client.db(Collection).collection('Album').findOne({ _id: new ObjectId(album_id) }, { projection: { _id: 1, user_id: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (albumExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (String(userExist._id) !== String(albumExist.user_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    await Mongo.client.db(Collection).collection('Album').deleteMany({ _id: new ObjectId(album_id) })

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/album/find/tag', async (req, res) => {
  const { match } = req.body

  try {
    {
      if (typeof match !== 'string' && typeof match !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const pipeline = [
      { $match: { tag: { $regex: match || '' }, status: 1 } },
      { $unwind: '$tag' },
      { $group: { _id: '$tag', count: { $sum: 1 } } },
      { $project: { _id: 0, tag: '$_id', count: 1 } },
    ]

    const album = await Mongo.client.db(Collection).collection('Album').aggregate(pipeline).toArray()

    res.send({ code: 200, data: album })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/album/find/actor', async (req, res) => {
  const { match } = req.body

  try {
    {
      if (typeof match !== 'string' && typeof match !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const pipeline = [
      { $match: { actor: { $regex: match || '' }, status: 1 } },
      { $unwind: '$actor' },
      { $group: { _id: '$actor', count: { $sum: 1 } } },
      { $project: { _id: 0, actor: '$_id', count: 1 } },
    ]

    const album = await Mongo.client.db(Collection).collection('Album').aggregate(pipeline).toArray()

    res.send({ code: 200, data: album })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

/* Album API END */

/* Cartoon API START */

router.post('/api/app/cartoon/find', async (req, res) => {
  const { authorization } = req.headers
  const { cartoon_id } = req.body

  try {
    {
      if (typeof authorization !== 'string' && typeof authorization !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof cartoon_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const cartoonExist = await Mongo.client.db(Collection).collection('Cartoon').findOne({ _id: new ObjectId(cartoon_id) }, { projection: { _id: 1 } })

      if (cartoonExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, role: 1, cartoonFavoriteds_id: 1, cartoonPaids_id: 1 } })
    const cartoon = await Mongo.client.db(Collection).collection('Cartoon').findOne({ _id: new ObjectId(cartoon_id) })
    const userSelf = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, userFolloweds_id: 1 } })
    const userCreator = await Mongo.client.db(Collection).collection('User').findOne({ _id: cartoon.user_id }, { projection: { _id: 1, name: 1, avatar: 1, status: 1 } })

    const pipelineCartoonPaids = [
      { $match: { cartoonPaids_id: { $in: [cartoon._id] } } },
      { $unwind: '$cartoonPaids_id' },
      { $group: { _id: '$cartoonPaids_id', cartoonPaids_id: { $sum: 1 } } }
    ]

    const cartoonPaids_id = await Mongo.client.db(Collection).collection('User').aggregate(pipelineCartoonPaids).toArray()

    const pipelineCartoonFavoriteds = [
      { $match: { cartoonFavoriteds_id: { $in: [cartoon._id] } } },
      { $unwind: '$cartoonFavoriteds_id' },
      { $group: { _id: '$cartoonFavoriteds_id', cartoonFavoriteds_id: { $sum: 1 } } }
    ]

    const cartoonFavoriteds_id = await Mongo.client.db(Collection).collection('User').aggregate(pipelineCartoonFavoriteds).toArray()

    cartoon.own = Boolean(user && String(user._id) === String(cartoon.user_id))
    cartoon.favorited = Boolean(user && user.cartoonFavoriteds_id.some(i => String(i) === String(cartoon._id)))
    cartoon.paid = Boolean(user && user.cartoonPaids_id.some(i => String(i) === String(cartoon._id)))
    cartoon.paidCount = cartoonPaids_id.find(i => String(i._id) === String(cartoon._id))?.cartoonPaids_id || 0
    cartoon.favoritedCount = cartoonFavoriteds_id.find(i => String(i._id) === String(cartoon._id))?.cartoonFavoriteds_id || 0
    cartoon.user = userCreator

    cartoon.user.self = Boolean(userSelf && String(cartoon.user._id) === String(userSelf._id))
    cartoon.user.followed = Boolean(userSelf && userSelf.userFolloweds_id.some(n => String(n) === String(cartoon.user._id)))

    if (cartoon.user.status !== 1) {
      cartoon.user = { _id: cartoon.user._id, status: cartoon.user.status }
    }

    if (cartoon.own === false && cartoon.paid === false) {
      cartoon.paidContent = { downloadMode: cartoon.paidContent.downloadMode }
    }

    if (cartoon.own === false) {
      if (cartoon.status !== 1) res.send({ code: 200, data: { _id: cartoon._id, status: cartoon.status } })
      if (cartoon.status === 1) res.send({ code: 200, data: cartoon })
    }

    if (cartoon.own === true) {
      res.send({ code: 200, data: cartoon })
    }
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/cartoon/find/list', async (req, res) => {
  const { authorization } = req.headers
  const { filter, seed, skip, limit } = req.body

  try {
    {
      if (typeof authorization !== 'string' && typeof authorization !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter !== 'object' && typeof filter !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && typeof filter.name !== 'string' && typeof filter.name !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && Array.isArray(filter.tag) !== true && typeof filter.tag !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && Array.isArray(filter.actor) !== true && typeof filter.actor !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && Array.isArray(filter.price) !== true && typeof filter.price !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && Array.isArray(filter.status) !== true && typeof filter.status !== 'number' && typeof filter.status !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && typeof filter.favorited !== 'boolean' && typeof filter.favorited !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && typeof filter.paid !== 'boolean' && typeof filter.paid !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof filter === 'object' && typeof filter.user_id !== 'string' && typeof filter.user_id !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof seed !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof skip !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof limit !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, role: 1 } })

      if ((typeof filter === 'object' && Array.isArray(filter.status) && (filter.status.length === 0 || filter.status.some(i => i !== 1))) && (userExist === null || String(userExist._id) !== filter.user_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, cartoonFavoriteds_id: 1, cartoonPaids_id: 1 } })

    const match = {}

    if (filter) {
      if (filter.name) match.name = { $regex: filter.name }

      if (filter.tag && filter.tag.length > 0) match.tag = { $in: filter.tag }
      if (filter.actor && filter.actor.length > 0) match.actor = { $in: filter.actor }
      if (filter.price && filter.price.length > 0) match.price = { $gte: filter.price[0], $lte: filter.price[1] }

      if (filter.status) {
        if (typeof filter.status === 'number') match.status = { $eq: filter.status }
        if (Array.isArray(filter.status) && filter.status.length > 0) match.status = { $in: filter.status }
      }

      if (user && filter.favorited === true && filter.paid !== true) match._id = { $in: user.cartoonFavoriteds_id }
      if (user && filter.favorited !== true && filter.paid === true) match._id = { $in: user.cartoonPaids_id }
      if (user && filter.favorited === true && filter.paid === true) match._id = { $in: user.cartoonFavoriteds_id.filter(i => user.cartoonPaids_id.includes(i)) }

      if (filter.user_id === 'nonself' && user) match.user_id = { $not: { $eq: user._id } }
      if (filter.user_id !== 'nonself' && filter.user_id && filter.user_id.length === 24) match.user_id = { $eq: new ObjectId(filter.user_id) }
    }

    const pipelineCartoon = [
      { $match: match },
      { $lookup: { from: "User", localField: "user_id", foreignField: "_id", as: "user" } },
      { $addFields: { user: { $first: "$user" } } },
      { $project: { seed: { $mod: ['$createTime', seed] }, _id: 1, name: 1, poster: 1, price: 1, status: 1, createTime: 1, updateTime: 1, user_id: 1, user: { _id: '$user._id', name: '$user.name', avatar: '$user.avatar', status: '$user.status' } } },
      { $sort: { seed: -1, createTime: -1 } },
    ]

    const cartoon = await Mongo.client.db(Collection).collection('Cartoon').aggregate(pipelineCartoon).skip(skip).limit(limit).toArray()

    const pipelineCartoonPaids = [
      { $match: { cartoonPaids_id: { $in: cartoon.map(i => i._id) } } },
      { $unwind: '$cartoonPaids_id' },
      { $group: { _id: '$cartoonPaids_id', cartoonPaids_id: { $sum: 1 } } }
    ]

    const cartoonPaids_id = await Mongo.client.db(Collection).collection('User').aggregate(pipelineCartoonPaids).toArray()

    const pipelineCartoonFavoriteds = [
      { $match: { cartoonFavoriteds_id: { $in: cartoon.map(i => i._id) } } },
      { $unwind: '$cartoonFavoriteds_id' },
      { $group: { _id: '$cartoonFavoriteds_id', cartoonFavoriteds_id: { $sum: 1 } } }
    ]

    const cartoonFavoriteds_id = await Mongo.client.db(Collection).collection('User').aggregate(pipelineCartoonFavoriteds).toArray()

    cartoon.forEach(i => {
      i.own = Boolean(user && String(user._id) === String(i.user_id))
      i.favorited = Boolean(user && user.cartoonFavoriteds_id.some(n => String(n) === String(i._id)))
      i.paid = Boolean(user && user.cartoonPaids_id.some(n => String(n) === String(i._id)))
      i.paidCount = cartoonPaids_id.find(n => String(n._id) === String(i._id))?.cartoonPaids_id || 0
      i.favoritedCount = cartoonFavoriteds_id.find(n => String(n._id) === String(i._id))?.cartoonFavoriteds_id || 0
      if (i.user.status !== 1) i.user = { _id: i.user._id, status: i.user.status }
      delete i.seed
    })

    res.send({ code: 200, data: cartoon })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/cartoon/insert', async (req, res) => {
  const { authorization } = req.headers
  const { name, description, tag, actor, price, poster, preview, paidContent, status } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof name !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof description !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(tag) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(actor) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof price !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(poster) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(preview) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof paidContent !== 'object') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof status !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      if (tag.some(i => typeof i !== 'string')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (actor.some(i => typeof i !== 'string')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (poster.some(i => typeof i !== 'object')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (preview.some(i => typeof i !== 'object')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      if (name === '') throw { error: new Error(), data: { code: 500, message: '名称不能为空' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, role: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1 } })

    const cartoon = await Mongo.client.db(Collection).collection('Cartoon').insertOne({ name, description, tag, actor, price, poster, preview, paidContent, status, createTime: new Date().getTime(), updateTime: new Date().getTime(), user_id: user._id })

    res.send({ code: 200, data: cartoon })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/cartoon/update', async (req, res) => {
  const { authorization } = req.headers
  const { cartoon_id, name, description, tag, actor, price, poster, preview, paidContent, status } = req.body

  try {
    {
      if (typeof cartoon_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof name !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof description !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(tag) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(actor) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof price !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(poster) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (Array.isArray(preview) === false) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof paidContent !== 'object') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof status !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      if (tag.some(i => typeof i !== 'string')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (actor.some(i => typeof i !== 'string')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (poster.some(i => typeof i !== 'object')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (preview.some(i => typeof i !== 'object')) throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      if (name === '') throw { error: new Error(), data: { code: 500, message: '名称不能为空' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, role: 1 } })
      const cartoonExist = await Mongo.client.db(Collection).collection('Cartoon').findOne({ _id: new ObjectId(cartoon_id) }, { projection: { _id: 1, user_id: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (cartoonExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (String(userExist._id) !== String(cartoonExist.user_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    await Mongo.client.db(Collection).collection('Cartoon').updateOne({ _id: new ObjectId(cartoon_id) }, { $set: { name, description, tag, actor, price, poster, preview, paidContent, status, updateTime: new Date().getTime() } })

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/cartoon/delete', async (req, res) => {
  const { authorization } = req.headers
  const { cartoon_id } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof cartoon_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, role: 1 } })
      const cartoonExist = await Mongo.client.db(Collection).collection('Cartoon').findOne({ _id: new ObjectId(cartoon_id) }, { projection: { _id: 1, user_id: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (cartoonExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (String(userExist._id) !== String(cartoonExist.user_id)) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    await Mongo.client.db(Collection).collection('Cartoon').deleteMany({ _id: new ObjectId(cartoon_id) })

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/cartoon/find/tag', async (req, res) => {
  const { match } = req.body

  try {
    {
      if (typeof match !== 'string' && typeof match !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const pipeline = [
      { $match: { tag: { $regex: match || '' }, status: 1 } },
      { $unwind: '$tag' },
      { $group: { _id: '$tag', count: { $sum: 1 } } },
      { $project: { _id: 0, tag: '$_id', count: 1 } },
    ]

    const cartoon = await Mongo.client.db(Collection).collection('Cartoon').aggregate(pipeline).toArray()

    res.send({ code: 200, data: cartoon })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/cartoon/find/actor', async (req, res) => {
  const { match } = req.body

  try {
    {
      if (typeof match !== 'string' && typeof match !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const pipeline = [
      { $match: { actor: { $regex: match || '' }, status: 1 } },
      { $unwind: '$actor' },
      { $group: { _id: '$actor', count: { $sum: 1 } } },
      { $project: { _id: 0, actor: '$_id', count: 1 } },
    ]

    const cartoon = await Mongo.client.db(Collection).collection('Cartoon').aggregate(pipeline).toArray()

    res.send({ code: 200, data: cartoon })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

/* Cartoon API END */

/* Configuration API START */

router.post('/api/app/configuration/code', async (req, res) => {
  const { authorization } = req.headers
  const { code, deviceId } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof code !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof deviceId !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1 } })
      const configurationExist = await Mongo.client.db(Collection).collection('Configuration').findOne({ key: 'Code', 'value.code': code }, { projection: { _id: 1, value: 1 } })
      const coinRecordUserId = await Mongo.client.db(Collection).collection('CodeRecord').findOne({ code: code, user_id: userExist._id }, { projection: { _id: 1 } })
      const coinRecordDeviceId = await Mongo.client.db(Collection).collection('CodeRecord').findOne({ code: code, deviceId: deviceId }, { projection: { _id: 1 } })

      if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (configurationExist === null) throw { error: new Error(), data: { code: 500, message: '兑换码不存在' } }
      if (configurationExist.value.time < new Date().getTime()) throw { error: new Error(), data: { code: 500, message: '兑换码已过期' } }
      if (coinRecordUserId !== null) throw { error: new Error(), data: { code: 500, message: '当前账号已使用过兑换码' } }
      if (coinRecordDeviceId !== null) throw { error: new Error(), data: { code: 500, message: '当前设备已使用过兑换码' } }
    }

    const configuration = await Mongo.client.db(Collection).collection('Configuration').findOne({ key: 'Code', 'value.code': code }, { projection: { _id: 1, value: 1 } })

    if (configuration.value.type === 'Coin') {
      const user = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, coin: 1 } })
      await Mongo.client.db(Collection).collection('User').updateOne({ authorization: authorization }, { $set: { coin: user.coin + configuration.value.coin } })
      await Mongo.client.db(Collection).collection('CodeRecord').insertOne({ code: code, user_id: user._id, deviceId: deviceId })
      res.send({ code: 200, data: `已领取 ${configuration.value.coin} 硬币` })
    }
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

/* Configuration API END */

/* File API START */

router.post('/api/app/upload', async (req, res) => {
  try {
    const form = new formidable.IncomingForm()
    const data = await form.parse(req)

    const { authorization } = req.headers
    const dir = data[0].dir[0]
    const name = data[0].name[0]
    const file = data[1].file[0]

    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500 } }
      if (typeof dir !== 'string') throw { error: new Error(), data: { code: 500 } }
      if (typeof name !== 'string') throw { error: new Error(), data: { code: 500 } }
      if (typeof file !== 'object') throw { error: new Error(), data: { code: 500 } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, role: 1 } })

      if (userExist === null || userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (file.size > 1024 * 1024) throw { error: new Error(), data: { code: 500, message: '文件不能超过1mb' } }
    }

    const dirComplete = `/${dir}/${name}`.replace(/\/+/g, '/')

    if (dirComplete.includes('../')) throw { error: new Error(), data: { code: 500 } }

    const targetPath = path.join(__dirname, '../public', dirComplete)
    const parentDir = path.dirname(targetPath)
    const exist = fs.existsSync(targetPath)

    if (exist === true) fs.unlinkSync(targetPath)

    fs.mkdirSync(parentDir, { recursive: true })
    fs.renameSync(file.filepath, targetPath)

    await new Promise(resolve => setTimeout(resolve, 1000))
    
    res.send({ code: 200, data: dirComplete })

  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }
})

/* File API END */

/* Admin API START */

/* user */

router.post('/api/app/admin/user/find', async (req, res) => {
  const { authorization } = req.headers
  const { user_id, credential } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof user_id !== 'string' && typeof user_id !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof credential !== 'string' && typeof credential !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof user_id !== 'string' && typeof credential !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { role: 1 } })

      if (userExist === null || userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      if (typeof user_id === 'string') {
        const userExist = await Mongo.client.db(Collection).collection('User').findOne({ _id: new ObjectId(user_id) }, { projection: { _id: 1 } })
        if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      }

      if (typeof credential === 'string') {
        const userExist = await Mongo.client.db(Collection).collection('User').findOne({ credential: credential }, { projection: { _id: 1 } })
        if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      }
    }

    const userSelf = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { _id: 1, userFolloweds_id: 1 } })

    var user

    if (typeof user_id === 'string') {
      user = await Mongo.client.db(Collection).collection('User').findOne({ _id: new ObjectId(user_id) })
    }

    if (typeof credential === 'string') {
      user = await Mongo.client.db(Collection).collection('User').findOne({ credential: credential })
    }

    const pipelineUserFolloweds = [
      { $match: { userFolloweds_id: { $in: [user._id] } } },
      { $unwind: '$userFolloweds_id' },
      { $group: { _id: '$userFolloweds_id', userFolloweds_id: { $sum: 1 } } }
    ]

    const groupUserFolloweds_id = await Mongo.client.db(Collection).collection('User').aggregate(pipelineUserFolloweds).toArray()

    user.self = Boolean(userSelf && String(user._id) === String(userSelf._id))
    user.followed = Boolean(userSelf && userSelf.userFolloweds_id.some(n => String(n) === String(user._id)))
    user.followedCount = groupUserFolloweds_id.find(n => String(n._id) === String(user._id))?.userFolloweds_id || 0
    user.userFollowedCount = user.userFolloweds_id.length

    res.send({ code: 200, data: user })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/admin/user/update/coin', async (req, res) => {
  const { authorization } = req.headers
  const { user_id, credential, coin } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof user_id !== 'string' && typeof user_id !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof credential !== 'string' && typeof credential !== 'undefined') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof user_id !== 'string' && typeof credential !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof user_id === 'string' && typeof credential === 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof coin !== 'number') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { role: 1 } })

      if (userExist === null || userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      if (typeof user_id === 'string') {
        const userExist = await Mongo.client.db(Collection).collection('User').findOne({ _id: new ObjectId(user_id) }, { projection: { _id: 1 } })
        if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      }

      if (typeof credential === 'string') {
        const userExist = await Mongo.client.db(Collection).collection('User').findOne({ credential: credential }, { projection: { _id: 1 } })
        if (userExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      }
    }

    if (typeof user_id === 'string') {
      const user = await Mongo.client.db(Collection).collection('User').findOne({ _id: new ObjectId(user_id) }, { coin: 1 })
      await Mongo.client.db(Collection).collection('User').updateOne({ _id: new ObjectId(user_id) }, { $set: { coin: user.coin + coin } })
    }

    if (typeof credential === 'string') {
      const user = await Mongo.client.db(Collection).collection('User').findOne({ credential: credential }, { coin: 1 })
      await Mongo.client.db(Collection).collection('User').updateOne({ credential: credential }, { $set: { coin: user.coin + coin } })
    }

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

/* configuration */

router.post('/api/app/admin/configuration/find/list', async (req, res) => {
  const { authorization } = req.headers

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { role: 1 } })

      if (userExist === null || userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    const configurationExist = await Mongo.client.db(Collection).collection('Configuration').find({}).toArray()

    res.send({ code: 200, data: configurationExist })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/admin/configuration/insert', async (req, res) => {
  const { authorization } = req.headers
  const { key, value } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof key !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof value !== 'object') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { role: 1 } })

      if (userExist === null || userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    await Mongo.client.db(Collection).collection('Configuration').insertOne({ key, value })

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/admin/configuration/update', async (req, res) => {
  const { authorization } = req.headers
  const { configuration_id, key, value } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof configuration_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof key !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof value !== 'object') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { role: 1 } })
      const configurationExist = await Mongo.client.db(Collection).collection('Configuration').findOne({ _id: new ObjectId(configuration_id) }, { projection: { _id: 1 } })

      if (userExist === null || userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (configurationExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    await Mongo.client.db(Collection).collection('Configuration').updateOne({ _id: new ObjectId(configuration_id) }, { $set: { key, value } })

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

router.post('/api/app/admin/configuration/delete', async (req, res) => {
  const { authorization } = req.headers
  const { configuration_id } = req.body

  try {
    {
      if (typeof authorization !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (typeof configuration_id !== 'string') throw { error: new Error(), data: { code: 500, message: '异常错误' } }

      const userExist = await Mongo.client.db(Collection).collection('User').findOne({ authorization: authorization }, { projection: { role: 1 } })
      const configurationExist = await Mongo.client.db(Collection).collection('Configuration').findOne({ _id: new ObjectId(configuration_id) }, { projection: { _id: 1 } })

      if (userExist === null || userExist.role !== 'admin') throw { error: new Error(), data: { code: 500, message: '异常错误' } }
      if (configurationExist === null) throw { error: new Error(), data: { code: 500, message: '异常错误' } }
    }

    await Mongo.client.db(Collection).collection('Configuration').deleteOne({ _id: new ObjectId(configuration_id) })

    res.send({ code: 200 })
  } catch (e) {
    if (process.argv.includes('--dev')) { console.log(e?.error || e) }; res.status(e?.data?.status || 500).send({ code: e?.data?.code || 500, message: e?.data?.message || '异常错误' })
  }

})

/* Admin API END */

module.exports = router