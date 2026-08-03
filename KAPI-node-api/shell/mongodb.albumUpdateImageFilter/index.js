const fs = require('fs')
const path = require('path')

const { Mongo, parseFind, ObjectId } = require('../../src/utils.mongo')

const rootdir = path.resolve(__dirname, './src')

''.includes()

// 从数据库对比 删除本地

Mongo.client.db('KAPIKAPI').collection('Album').find({ user_id: new ObjectId('673ddab39e2c2c7eb3bc6640') }, { projection: { _id: 1, preview: 1 } }).toArray().then(res => {

  fs.readdirSync(rootdir).filter(dir => fs.statSync(rootdir + '/' + dir).isDirectory() === true)
    .forEach((dir) => {

      const find = res.find(cosplay => String(cosplay._id) === dir)

      if (find) {
        fs.readdirSync(rootdir + '/' + dir).filter(file => file.endsWith('txt') && file !== 'F.txt')
          .forEach(file => {
            const includes = find.preview.some(i => i.includes(file))

            if (includes === false) {
              fs.unlinkSync(rootdir + '/' + dir + '/' + file)
              console.log('delete file ', dir, file)
            }
          })
      }

      if (!find) {
        fs.readdirSync(rootdir + '/' + dir).forEach(file => fs.unlinkSync(rootdir + '/' + dir + '/' + file))
        fs.rmdirSync(rootdir + '/' + dir)
        console.log('delete dir ', dir)
      }
    })

})

