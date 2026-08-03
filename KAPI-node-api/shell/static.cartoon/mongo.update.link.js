const fs = require('fs')
const path = require('path')

const { Mongo, parseFind, ObjectId } = require('../../src/utils.mongo')

const target_path = path.resolve(__dirname, './build')

const dirs = fs.readdirSync(target_path).filter(i => !i.includes('.DS_Store'))

dirs.forEach(dir => {
    const files = fs.readdirSync(path.join(target_path, dir)).filter(i => !i.includes('.DS_Store'))

    Mongo.client.db('KAPIKAPI').collection('Cartoon').updateOne(
        { _id: new ObjectId(dir) },
        {
            '$set': {
                poster: files.filter((i, index) => index < 1).map((i, index) => {
                    return {
                        posterFileType: 'Image',
                        posterFileLink: `kapi://remote.oss/static/cartoon/${dir}/${i}`,
                    }
                }),
                preview: files.filter((i, index) => index < 5).map((i, index) => {
                    return {
                        previewFileType: 'Image',
                        previewFileLink: `kapi://remote.oss/static/cartoon/${dir}/${i}`,
                    }
                }),
                paidContent: {
                    downloadMode: 'Internal',
                    downloadContent:
                        files.map((i, index) => {
                            return {
                                downloadFileType: 'Image',
                                downloadFileLink: `kapi://remote.oss/static/cartoon/${dir}/${i}`,
                            }
                        })
                },
            }
        }
    ).then(res => console.log('updateOne'))
})