const fs = require('fs')
const path = require('path')

const { Mongo, parseFind, ObjectId } = require('../../src/utils.mongo')

// 批量发布

Mongo.client.db('KAPIKAPI').collection('Video').find({ poster: { $size: 0 } }).toArray().then(data => {
    data
        .forEach(i => {
            fs.mkdirSync(__dirname + '/src/' + i.name, { recursive: true })
        })
})
