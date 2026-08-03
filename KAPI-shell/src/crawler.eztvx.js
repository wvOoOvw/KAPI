const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const puppeteer = require('puppeteer-core')

const url = `https://eztvx.to/search/${name}`

const elementTableObject = $('table.forum_header_border')[2]

// $(elementTableObject).find('tr.forum_header_border').each((index, object) => {
//   if (index > 0) return

//   const item = {}

//   $(object).find('.forum_thread_post').each((index, object) => {
//     if (index === 1) {
//       item.name = $(object).find('a').text()
//     }
//     if (index === 2) {
//       $(object).find('a').each((index, object) => {
//         if (index === 0) item.magnet = object.attribs.href
//         if (index === 1) item.recordation = object.attribs.href
//       })
//     }
//     if (index === 3) {
//       item.size = $(object).text()
//     }
//     if (index === 4) {
//       item.updateTime = $(object).text()
//     }
//     if (index === 5) {
//       item.seed = $(object).find('font').text()
//     }
//   })

//   result.push(item)
// })

const goto = async (page, count, props) => {
  var success = false
  var counting = 0

  while (success === false && counting < count) {
    await page.goto(...props).then(() => success = true).catch(() => { })
    counting = counting + 1
  }
}

const run = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false,
  })

  try {
    const page = await browser.newPage()

    await goto(page, 4, [url, { timeout: 30000 }])

    await page.waitForSelector('.m-list ul li a', { timeout: 5000 })

    const hrefs = await page.$$eval('.m-list ul li a', elements => elements.map(el => el.href))

    const result = []

    for (let index = 0; index < hrefs.length; index++) {
      const href = hrefs[index]

      await page.goto(href, { timeout: 30000 })
      await page.waitForSelector('.position .w1200', { timeout: 5000 })
      await page.waitForSelector('.Title111 h1 a', { timeout: 5000 })

      const name = await page.$$eval('.position .w1200', elements => elements[0].childNodes[8].textContent.replace('>', '').trim())
      const link = await page.$$eval('.Title111 h1 a', elements => elements[1].href)

      const object = {
        name: name,
        price: 0,
        extraContent: [
          {
            hash: crypto.createHash('md5').update('ku138' + name).digest('hex')
          }
        ],
        paidContent: [
          {
            type: 'link',
            link: link
          }
        ]
      }

      result.push(object)
    }

    fs.writeFileSync(path.resolve(__dirname, './ku138.crawler.json'), JSON.stringify(result))

  } catch (error) {
    console.error(error)
  } finally {
    await browser.close()
  }
}

run()