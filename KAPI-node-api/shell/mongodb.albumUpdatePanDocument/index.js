const fs = require('fs')
const path = require('path')

const { Mongo, ObjectId } = require('../../src/utils.mongo')

// Mongo.client.db('KAPIKAPI').collection('Album').find({ name: { $regex: '雨波HaneAme' }, 'paidContent.zip': 'HuangYouCOFFEE' }).toArray().then(res => {
//   console.log(res.length)

//   res.forEach(i => console.log(i.name))
// })

const pan = fs.readFileSync(path.resolve(__dirname, './src/data.pan.txt'), 'utf-8')

const panArray = pan.split('\n\n')
  .map(i => {
    const split = i.replace('【超级会员V4】通过百度网盘分享的文件：', '').replace('通过百度网盘分享的文件：', '').split('\n')

    return {
      dirname: split[0],
      actor: split[0].match(/【.+】/)[0].replace('【', '').replace('】', '').trim(),
      index: split[0].match(/N[Oo]\.\d+/)[0].replace('NO.', '').replace('No.', '').trim(),
      name: split[0].replace(/【.+】/, '').replace(/No\.\d+/, '').replace(/NO\.\d+/, '').replace('  ', ' ').replace('.zip.kapi', '').trim(),
      link: split[1].replace('链接：', '').trim(),
      password: split[2].replace('提取码：', '').trim(),
      origin: i,
    }
  })

Mongo.client.db('KAPIKAPI').collection('Album').find({}).toArray().then(res => {

  panArray.forEach(i => {
    const name = i.actor + ' ' + i.name

    const find = res.find(n => n.name === name)

    if (find) {
      const paidContent = [
        {
          ...find.paidContent.find(i => i.type === 'baidu-7z'),
        },
        {
          type: "baidu-zip",
          link: i.link,
          password: i.password,
          zip: "KAPIKAPI",
          remark: "",
        }
      ]

      Mongo.client.db('KAPIKAPI').collection('Album').updateOne({ name: name }, { $set: { status: 1, paidContent: paidContent } }).then(res => console.log('updateOne', name))
    }

    if (!find) {
      // console.log('ERROR', name)
      fs.appendFileSync(path.resolve(__dirname, './src/data.pan.error.txt'), i.origin + '\n\n')
    }
  })

})
