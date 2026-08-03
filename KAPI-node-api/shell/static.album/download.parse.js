const fs = require('fs')

const target_path = '/Users/magneto/Downloads/网盘'

const removeFile = () => {
  fs.readdirSync(target_path)
    .filter(i => fs.statSync(target_path + '/' + i).isDirectory() === true)
    .forEach(i => {
      fs.readdirSync(target_path + '/' + i)
        .forEach(i_ => {
          const k = [
            '.txt',
            '.html',
            '.db',
            '.apk',
            '.gif',
            '.url',
            'gteman.jpg',
            '出售最新写真图.jpg',
            'shenshisucai.top.jpg',
            'lierentushe.top.jpg',
            'coshunter.top超全收集.jpg',
            '更多美图素材.png',
            '超多浮力资源.png',
          ]
          if (k.some(k => i_.includes(k))) fs.unlinkSync(target_path + '/' + i + '/' + i_)
        })
    })
}

const removeDirEmpty = () => {
  fs.readdirSync(target_path)
    .filter(i => fs.statSync(target_path + '/' + i).isDirectory() === true)
    .filter(i => fs.readdirSync(target_path + '/' + i).filter(i => i.includes('.DS_Store') === false).length === 0)
    .forEach(i => {
      fs.readdirSync(target_path + '/' + i).forEach(n => fs.unlinkSync(target_path + '/' + i + '/' + n))
      fs.rmdirSync(target_path + '/' + i)
    })
}

const run = () => {

  // 改7z后缀名

  fs.readdirSync(target_path)
    .filter(i => i.endsWith('.gz') === true)
    .forEach(i => {
      var r = i
      r = r.replace(/删$/, '')
      r = r.replace(/gz$/, '7z')
      fs.renameSync(
        target_path + '/' + i,
        target_path + '/' + r,
      )
    })

  // 将7z文件移到外层

  fs.readdirSync(target_path)
    .filter(i => fs.statSync(target_path + '/' + i).isDirectory() === true)
    .forEach(i => {
      fs.readdirSync(target_path + '/' + i)
        .filter(i_ => i_.endsWith('.7z') === true || i_.endsWith('.001') === true || i_.endsWith('.002') === true)
        .forEach(i_ => {
          fs.renameSync(
            target_path + '/' + i + '/' + i_,
            target_path + '/' + i_,
          )
        })
    })

  // 清理

  removeFile()
  removeDirEmpty()

  // 重命名文件夹

  fs.readdirSync(target_path)
    .filter(i => i.includes('.DS_Store') === false)
    .filter(i => i.includes('NO') === true || i.includes('No') === true)
    .forEach(i => {
      var r = i
      r = r.replace(/^Natsuko夏夏子/, '【Natsuko夏夏子】')
      r = r.replace(/^AT鲨/, '【AT鲨】')
      r = r.replace(/^蜜汁猫裘/, '【蜜汁猫裘】')
      r = r.replace(/^二阶堂 \(宅绘子\) /, '【二阶堂（宅绘子）】')
      r = r.replace(/^AT鲨/, '【AT鲨】')
      r = r.replace(/^落落Raku/, '【落落Raku】')
      r = r.replace(/^是一只废喵了/, '【是一只废喵了】')
      r = r.replace(/^女主K/, '【女主K】')
      r = r.replace(/^水淼(Aqua)?/, '【水淼Aqua】')
      r = r.replace(/^年年nnian/, '【年年nnian】')
      r = r.replace(/^洛璃 LoLiSAMA/, '【洛璃 LoLiSAMA】')
      r = r.replace(/^KANEKO_咔喵/, '【KANEKO_咔喵】')
      r = r.replace(/^柒柒要乖哦/, '【柒柒要乖哦】')
      r = r.replace(/^咬一口兔娘/, '【咬一口兔娘】')
      r = r.replace(/^是依酱吖/, '【是依酱吖】')
      r = r.replace(/^迷之呆梨/, '【迷之呆梨】')
      r = r.replace(/^麻花麻?花?酱/, '【麻花麻花酱】')
      r = r.replace(/^鹿八岁b?a?b?y?/, '【鹿八岁baby】')
      r = r.replace(/^贝贝琪Becky/, '【贝贝琪Becky】')
      r = r.replace(/^Arty亚缇/, '【Arty亚缇】')
      r = r.replace(/^Azami/, '【Azami】')
      r = r.replace(/^AZAMI/, '【AZAMI】')
      r = r.replace(/^焖焖碳/, '【焖焖碳】')
      r = r.replace(/^眼酱大魔王w/, '【眼酱大魔王w】')
      r = r.replace(/^小瑶幺幺/, '【小瑶幺幺】')
      r = r.replace(/^九言/, '【九言】')
      r = r.replace(/^PoppaChan/, '【PoppaChan】')
      r = r.replace(/^小和甜酒/, '【小和甜酒】')
      r = r.replace(/^不呆猫/, '【不呆猫】')
      r = r.replace(/^Quan冉有点饿/, '【Quan冉有点饿】')
      r = r.replace(/^Hana Bunny/, '【Hana Bunny】')
      r = r.replace(/^虎森森/, '【虎森森】')
      r = r.replace(/^切切celia/, '【切切celia】')
      r = r.replace(/^是三不是世w/, '【是三不是世w】')
      r = r.replace(/^封疆疆v/, '【封疆疆v】')
      r = r.replace(/^前羽_rr/, '【前羽_rr】')
      r = r.replace(/^贞子蜜桃/, '【贞子蜜桃】')
      r = r.replace(/^楊衣Yangyi/, '【楊衣Yangyi】')
      r = r.replace(/^eloise软软/, '【eloise软软】')
      r = r.replace(/^是一只熊仔吗/, '【是一只熊仔吗】')
      r = r.replace(/^星之迟迟/, '【星之迟迟】')
      r = r.replace(/^Aram\(아람\)/, '【Aram(아람)】')
      r = r.replace(/^Puy Puy/, '【Puy Puy】')
      r = r.replace(/^杏仁曲奇/, '【杏仁曲奇】')
      r = r.replace(/^是一只废喵了/, '【是一只废喵了】')
      r = r.replace(/^雪晴Astra/, '【雪晴Astra】')
      r = r.replace(/^雪晴Astar/, '【雪晴Astra】')
      r = r.replace(/^yuuhui玉汇/, '【yuuhui玉汇】')
      r = r.replace(/^ElyEE子/, '【ElyEE子】')
      r = r.replace(/^rioko凉凉子/, '【rioko凉凉子】')
      r = r.replace(/^白莉爱吃巧克力/, '【白莉爱吃巧克力】')
      r = r.replace(/^朝霧愛/, '【朝霧愛】')
      r = r.replace(/^狐洛洛子/, '【狐洛洛子】')
      r = r.replace(/^艾西Aiwest/, '【艾西Aiwest】')
      r = r.replace(/^星澜是澜澜叫澜妹呀/, '【星澜是澜澜叫澜妹呀】')
      r = r.replace(/^蠢沫沫/, '【蠢沫沫】')
      r = r.replace(/^雨波HaneAme/, '【雨波HaneAme】')
      r = r.replace(/^桜井宁宁/, '【桜井宁宁】')
      r = r.replace(/^Byoru/, '【Byoru】')
      r = r.replace(/^二佐Nisa/, '【二佐Nisa】')
      r = r.replace(/^Umeko J/, '【Umeko J】')
      r = r.replace(/^雨波HaneAme/, '【雨波HaneAme】')
      r = r.replace(/^雨波_HaneAme/, '【雨波_HaneAme】')
      r = r.replace(/^Kuuko W/, '【Kuuko W】')
      r = r.replace(/^いくみ/, '【いくみ】')
      r = r.replace(/^Tiny Asa/, '【Tiny Asa】')
      r = r.replace(/^九柒喵/, '【九柒喵】')
      r = r.replace(/^伊喵君_Nya/, '【伊喵君_Nya】')
      r = r.replace(/^香草喵露露/, '【香草喵露露】')
      r = r.replace(/^半半子/, '【半半子】')
      r = r.replace(/^51酱/, '【51酱】')
      r = r.replace(/^糖果果Candy/, '【糖果果Candy】')
      r = r.replace(/^七七娜娜子/, '【七七娜娜子】')
      r = r.replace(/^纸悦Etsu_ko/, '【纸悦Etsu_ko】')
      r = r.replace(/^\d\d\d\.CatDemon 喵崽/, '【CatDemon 喵崽】')
      r = r.replace(/^\d\d\d\.Cat Demon喵崽/, '【CatDemon 喵崽】')
      r = r.replace(/^上杉绘梨落/, '【上杉绘梨落】')
      r = r.replace(/^喜欢爱理吗/, '【喜欢爱理吗】')
      r = r.replace(/^葛生w/, '【葛生w】')
      r = r.replace(/^矢量鱼/, '【矢量鱼】')
      r = r.replace(/^\s矢量鱼/, '【矢量鱼】')
      r = r.replace(/^白栎Shirly/, '【白栎Shirly】')
      r = r.replace(/^Seele麦麦/, '【Seele麦麦】')
      r = r.replace(/^いくみ/, '【いくみ】')
      r = r.replace(/^双木扶苏/, '【双木扶苏】')
      r = r.replace(/^一色雨/, '【一色雨】')
      r = r.replace(/^Zyra秋/, '【Zyra秋】')
      r = r.replace(/^幼水铃衣/, '【幼水铃衣】')
      r = r.replace(/^楊衣Yangyi/, '【楊衣Yangyi】')
      r = r.replace(/^宮本桜/, '【宮本桜】')
      r = r.replace(/^阿包也是兔娘/, '【阿包也是兔娘】')
      r = r.replace(/^可可小白兔/, '【可可小白兔】')
      
      r = r.replace(' ', ' ')
      r = r.replace('–', ' ')
      r = r.replace('-', ' ')
      r = r.replace(/\[.+\]/, '')
      r = r.replace('  ', ' ')
      r = r.replace('  ', ' ')
      r = r.replace('】 ', '】')
      r = r.replace(/\s+$/, '')
      r = r.replace(/\s+/, ' ')
      r = r.replace(/Vol\.\d\d\d/, '')
      
      if (r.match(/NO\.\d+/)) r = r.replace(/NO\.\d+/, 'NO.' + r.match(/NO\.\d+/)[0].replace('NO.', '').padStart(3, '0'))
      if (r.match(/No\.\d+/)) r = r.replace(/No\.\d+/, 'NO.' + r.match(/No\.\d+/)[0].replace('No.', '').padStart(3, '0'))

      r = r.replace(/NO.NO./, '')

      fs.renameSync(
        target_path + '/' + i,
        target_path + '/' + r,
      )
    })


  // 文件夹外移

  fs.readdirSync(target_path)
    .filter(i => i.includes('NO') === true || i.includes('No') === true)
    .filter(i => fs.statSync(target_path + '/' + i).isDirectory() === true)
    .forEach(i => {
      fs.readdirSync(target_path + '/' + i)
        .filter(i_ => fs.statSync(target_path + '/' + i + '/' + i_).isDirectory() === true)
        .forEach(i_ => {
          fs.renameSync(
            target_path + '/' + i + '/' + i_,
            target_path + '/' + i + ' ' + i_,
          )
        })
    })

  // 清理

  removeFile()
  removeDirEmpty()

  // 文件编号

  fs.readdirSync(target_path)
    .filter(i => fs.statSync(target_path + '/' + i).isDirectory() === true)
    .forEach(i => {
      const map = {}
      fs.readdirSync(target_path + '/' + i)
        .filter(i_ => fs.statSync(target_path + '/' + i + '/' + i_).isDirectory() === false)
        .filter(i_ => i_.endsWith('.DS_Store') === false)
        .filter(i_ => i_.endsWith('.7z') === false)
        .forEach(i_ => {
          var extra = i_.slice(i_.lastIndexOf('.') + 1).toLowerCase()
          if (extra === 'jpeg') extra = 'jpg'
          if (map[extra] === undefined) map[extra] = 1
          fs.renameSync(
            target_path + '/' + i + '/' + i_,
            target_path + '/' + i + '/' + '___' + map[extra].toString().padStart(3, '0') + '.' + extra,
          )
          map[extra] = map[extra] + 1
        })

      fs.readdirSync(target_path + '/' + i)
        .filter(i_ => fs.statSync(target_path + '/' + i + '/' + i_).isDirectory() === false)
        .filter(i_ => i_.endsWith('.DS_Store') === false)
        .filter(i_ => i_.endsWith('.7z') === false)
        .forEach(i_ => {
          fs.renameSync(
            target_path + '/' + i + '/' + i_,
            target_path + '/' + i + '/' + i_.replace('___', ''),
          )
        })
    })
}

run()