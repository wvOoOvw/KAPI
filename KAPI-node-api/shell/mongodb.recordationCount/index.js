const { Mongo, parseFind, ObjectId } = require('../../src/utils.mongo')

Mongo.client.db('KAPIKAPI').collection('Recordation').find({ lockCount: { $gt: 0 }, }, { projection: { _id: 1, name: 1, lockCount: 1 } }).toArray().then(res => {
    console.log(res.reduce((t, i) => t + i.lockCount, 0))
    // console.log(res)
})