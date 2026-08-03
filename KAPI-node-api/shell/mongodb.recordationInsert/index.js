const { Mongo, parseFind, ObjectId } = require('../../src/utils.mongo')

const json = require('./src/index.json')

const insert = json.map(i => {
  const name = i.name
  const description = i.description
  const hash = i.hash
  const extraContent = i.extraContent
  const paidContent = i.paidContent

  const user_id = '673ddab39e2c2c7eb3bc6640'
  const status = 1
  const lockCount = 0
  const createTime = new Date().getTime() + Math.round(Math.random() * 10000)
  const updateTime = createTime

  return { name, description, hash, extraContent, paidContent, status, lockCount, createTime, updateTime, user_id: new ObjectId(user_id) }
})

Mongo.client.db('KAPIKAPI').collection('Recordation').insertMany(insert).then(res => console.log('insertMany'))