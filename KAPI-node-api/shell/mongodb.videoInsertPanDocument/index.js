const fs = require('fs')
const path = require('path')

const { Mongo, ObjectId } = require('../../src/utils.mongo')

const pan = fs.readFileSync(path.resolve(__dirname, './src/data.pan.txt'), 'utf-8')
const count = fs.readFileSync(path.resolve(__dirname, './src/data.count.txt'), 'utf-8')

const panArray = pan.split('\n\n')
  .map(i => {
    const split = i.replace(/【超级会员V\d】通过百度网盘分享的文件：/, '').replace('通过百度网盘分享的文件：', '').split('\n')

    return {
      dirname: split[0].replace('.7z.kapi', '').trim(),
      actor: split[0].replace('.7z.kapi', '').replace('.mp4', '').split(' ').slice(1),
      name: split[0].replace('.7z.kapi', '').replace('.mp4', '').split(' ').join(' '),
      link: split[1].replace('链接：', '').trim(),
      password: split[2].replace('提取码：', '').trim(),
    }
  })

count.split('\n').map(i => {
  var dirname = i.split(' @@@ ')[0]
  const item = panArray.find(i => i.dirname === dirname)
  if (item) {
    // item.count = i.split(' @@@ ')[2]
    item.size = i.split(' @@@ ')[1]
  }
})

panArray.forEach(i => {
  if (i.size) {
    const user_id = '673ddab39e2c2c7eb3bc6640'
    const name = i.name
    const description = `包含内容：1V ｜ 存储容量：${i.size}`
    const tag = ['日剧']
    const actor = i.actor
    const price = 0
    const poster = []
    const preview = []
    const paidContent = [{ type: "baidu-7z", link: i.link, password: i.password, zip: 'KAPIKAPI', remark: "" }]

    const status = 0
    const createTime = new Date().getTime() + Math.round(Math.random() * 10000)
    const updateTime = createTime

    const insert = { name, description, tag, actor, price, poster, preview, paidContent, status, createTime, updateTime, user_id: new ObjectId(user_id) }

    Mongo.client.db('KAPIKAPI').collection('Video').findOne({ name: insert.name }).then(res => {
      if (res) {
        console.log('ERROR EXIST', i.name)
      } else {
        Mongo.client.db('KAPIKAPI').collection('Video').insertOne(insert).then(res => console.log('insertOne', insert.name))
      }
    })
  }

  if (!i.size) {
    console.log('ERROR NO SIZE', i.name)
  }
})