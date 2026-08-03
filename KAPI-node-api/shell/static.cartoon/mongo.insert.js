const fs = require('fs')
const path = require('path')

const { Mongo, parseFind, ObjectId } = require('../../src/utils.mongo')

const target_path = path.resolve(__dirname, './src-local')

const dirs = fs.readdirSync(target_path).filter(i => !i.includes('.DS_Store'))

dirs.forEach(async dir => {
  Mongo.client.db('KAPIKAPI').collection('Cartoon').findOne({ name: dir }, { projection: { _id: 1 } }).then(res => {
    fs.renameSync(path.resolve(target_path, dir), path.resolve(target_path, String(res._id)));
    console.log('findOne', res._id)
  })
})