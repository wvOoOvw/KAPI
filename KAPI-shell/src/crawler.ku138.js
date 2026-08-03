const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const puppeteer = require('puppeteer-core')

const urls = new Array(1).fill().map((i, index) => {
  return `https://www.ku138.cc/b/9/list_9_${index + 39}.html`
})

// fs.writeFileSync(path.resolve(__dirname, './ku138.crawler.json'), '')

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

    for (let index = 0; index < urls.length; index++) {
      const url = urls[index]

      await goto(page, 4, [url, { timeout: 30000 }])

      await page.waitForSelector('.m-list ul li a', { timeout: 5000 })

      const hrefs = await page.$$eval('.m-list ul li a', elements => elements.map(el => el.href))

      for (let index = 0; index < hrefs.length; index++) {
        const href = hrefs[index]

        await goto(page, 4, [href, { timeout: 30000 }])
        await page.waitForSelector('.position .w1200', { timeout: 5000 })
        await page.waitForSelector('.Title111 h1 a', { timeout: 5000 })

        const name = await page.$$eval('.position .w1200', elements => elements[0].childNodes[8].textContent.replace('>', '').trim())
        const link = await page.$$eval('.Title111 h1 a', elements => elements[1].href)

        const item = {
          name: name.replace(/\[.+?\]/g, '').trim(),
          description: '模特专辑',
          hash: crypto.createHash('md5').update('ku138' + link).digest('hex'),
          paidContent: [
            {
              type: 'link',
              link: link
            }
          ]
        }

        fs.appendFileSync(path.resolve(__dirname, './ku138.crawler.json'), JSON.stringify(item) + ',' + '\n')
      }

      console.log('Finish', url)
    }

  } catch (error) {
    console.error(error)
  } finally {
    await browser.close()
  }
}

run()