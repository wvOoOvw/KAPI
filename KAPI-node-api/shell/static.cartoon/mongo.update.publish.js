const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const { Mongo, parseFind, ObjectId } = require('../../src/utils.mongo')


Mongo.client.db('KAPIKAPI').collection('Cartoon').find({ user_id: new ObjectId('673ddab39e2c2c7eb3bc6640') }).toArray().then(data => {
  data
    .forEach(i => {
      Mongo.client.db('KAPIKAPI').collection('Cartoon').updateOne({ _id: i._id }, { '$set': { price: 40, status: 1 } }).then(res => console.log('updateOne', i._id))
    })
})