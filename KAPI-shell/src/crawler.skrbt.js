const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const puppeteer = require('puppeteer-core')

const searchTexts =
  new Array(20).fill().map((i, index) => `MIMK-${110 + index}`)

const pageMax = 3

const retry = async (callback, count) => {
  var result = false
  var counting = 0

  while (result === false && counting < count) {
    await callback(counting).then((res) => result = res).catch(() => { })
    counting = counting + 1
  }

  return result
}

const run = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false,
  })

  browser.on('targetcreated', async target => {
    const pageDetail = await target.page()

    const url = pageDetail.url()

    if (url.includes('about:blank') === false && url.includes('https://skrbthv.top') === false) {
      await pageDetail.close()
    }

    if (url.includes('https://skrbthv.top/detail')) {
      await pageDetail.waitForSelector('.panel', { timeout: 30000 }).catch(() => { })

      const pageDetailEvaluate = await pageDetail.evaluate(async () => {
        const title = document.querySelector('h3').innerText
        const magnet = document.querySelectorAll('#magnet')[0].href
        const count = document.querySelectorAll('.panel')[0].querySelectorAll('li')[0].innerText.split('：')[1]
        const size = document.querySelectorAll('.panel')[0].querySelectorAll('li')[1].innerText.split('：')[1]
        const time = document.querySelectorAll('.panel')[0].querySelectorAll('li')[2].innerText.split('：')[1]
        const hash = document.querySelectorAll('.panel')[0].querySelectorAll('li')[3].innerText.split('：')[1]
        const files = [...document.querySelectorAll('.panel')[5].querySelectorAll('li')].map(i => [...i.children].map(i => i.innerText.trim())).map(i => ({ name: i[0], size: i[1] }))

        return { title, count, size, time, hash, magnet, files }
      })

      const write = {
        name: pageDetailEvaluate.title,
        description: '',
        hash: 'magnet_skr_' + pageDetailEvaluate.hash,
        extraContent: [
          {
            type: 'magnet_skr',
            count: pageDetailEvaluate.count,
            size: pageDetailEvaluate.size,
            time: pageDetailEvaluate.time,
            files: pageDetailEvaluate.files.filter((i,index) => index < 3),
          }
        ],
        paidContent: [
          {
            type: 'magnet',
            link: pageDetailEvaluate.magnet
          }
        ]
      }

      fs.appendFileSync(path.resolve(__dirname, './crawler.skrbt.json'), JSON.stringify(write) + ',' + '\n')

      await pageDetail.close()
    }
  })


  for (let index = 0; index < searchTexts.length; index++) {
    const searchText = searchTexts[index]

    const pagemain = await browser.newPage()

    await retry(() => pagemain.goto('https://skrbthv.top', { timeout: 30000 }), 5)
    await pagemain.waitForSelector('input.search-input', { timeout: 30000 })
    await pagemain.type('input', searchText, { delay: 100 })
    await pagemain.click('button.search-btn')

    var parsepage = true

    while (parsepage) {
      await pagemain.waitForSelector('a.rrt', { timeout: 30000 })

      await pagemain.evaluate(async () => {
        const links = document.querySelectorAll('a.rrt')
        for (let index = 0; index < links.length; index++) {
          links[index].click()
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      })

      const paginations = await pagemain.$$('.pagination li')

      const paginationsActiveIndex = await pagemain.$$('.pagination li', elements => elements.findIndex(i => i.getAttribute('class') === 'active'))

      const url = pagemain.url()

      if (paginationsActiveIndex !== paginations.length - 2 && url.includes(`p=${pageMax}`) === false) {
        await pagemain.evaluate(async () => {
          const links = document.querySelectorAll('.pagination li a')
          links[links.length - 1].click()
        })

        parsepage = true
      }

      if (paginationsActiveIndex === paginations.length - 2 || url.includes(`p=${pageMax}`) === true) {
        parsepage = false
      }
    }

    await new Promise(resolve => setTimeout(resolve, 8000))

    await pagemain.close()
  }


  browser.close()
}

run()