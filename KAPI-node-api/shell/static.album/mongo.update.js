const fs = require('fs')
const path = require('path')

const { Mongo, parseFind, ObjectId } = require('../../src/utils.mongo')

const target_path = path.resolve(__dirname, './build')

const dirs = fs.readdirSync(target_path).filter(i => !i.includes('.DS_Store'))

dirs.forEach(dir => {
    const files = fs.readdirSync(path.join(target_path, dir)).filter(i => !i.includes('.DS_Store'))

    Mongo.client.db('KAPIKAPI').collection('Album').updateOne(
        { _id: new ObjectId(dir) },
        {
            '$set': {
                poster: files.filter((i, index) => index < 1).map((i, index) => {
                    return {
                        posterFileType: 'Image',
                        posterFileLink: `kapi://remote.oss/static/album/${dir}/${i}`,
                    }
                }),
                preview: files.map((i, index) => {
                    return {
                        previewFileType: 'Image',
                        previewFileLink: `kapi://remote.oss/static/album/${dir}/${i}`,
                    }
                }),
            }
        }
    ).then(res => console.log('updateOne'))
})


