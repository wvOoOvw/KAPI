const fs = require('fs')
const path = require('path')

const { Mongo, parseFind, ObjectId } = require('../../src/utils.mongo')

const dirname = path.resolve(__dirname, './src')

const dirs = fs.readdirSync(dirname)

dirs.forEach((dir) => {
  Mongo.client.db('KAPIKAPI').collection('Album').findOne({ name: dir }, { projection: { _id: 1, name: 1 } }).then(res => {
    if (res) {
      const id = String(res._id)

      const files = fs.readdirSync(dirname + '/' + dir)

      var poster = []
      var preivew = []

      files.filter(i => i.endsWith('.jpg')).forEach(i => {
        if (i === 'F.jpg') poster.push(`kapi://remote.oss/static/album/${id}/${i.replace('.jpg', '.txt')}`)
        if (i !== 'F.jpg') preivew.push(`kapi://remote.oss/static/album/${id}/${i.replace('.jpg', '.txt')}`)
      })

      Mongo.client.db('KAPIKAPI').collection('Album').updateOne({ name: dir }, { $set: { poster: poster, preview: preivew } }).then(res => console.log('updateOne-', dir))

      fs.renameSync(dirname + '/' + dir, dirname + '/' + `${id}`)
    }

    if (!res) {
      console.log('ERROR-', dir)
    }
  })
})
