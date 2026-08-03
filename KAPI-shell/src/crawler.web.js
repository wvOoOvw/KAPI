const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const URL = require('url');

const config = {
  baseUrl: 'http://lsh.1833mu.com:10009/', // 替换为你要爬取的网站
  outputDir: './dist', // 输出目录
  maxDepth: 5, // 最大爬取深度
  timeout: 10000, // 请求超时时间(ms)
  concurrentRequests: 5, // 并发请求数
  excludePatterns: [/\.php/, /\.asp/, /\.jsp/] // 排除的URL模式
};

if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

const visitedUrls = new Set();
const processingUrls = new Set();
const requestQueue = [];
let activeRequests = 0;

async function crawlSite() {
  try {
    // 从首页开始
    await enqueueUrl(config.baseUrl, 0);

    // 处理队列
    while (requestQueue.length > 0 || activeRequests > 0) {
      if (activeRequests < config.concurrentRequests && requestQueue.length > 0) {
        const { url, depth } = requestQueue.shift();
        processUrl(url, depth);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('爬取完成！');
  } catch (error) {
    console.error('爬取过程中出错:', error);
  }
}

async function enqueueUrl(url, depth) {
  const normalizedUrl = normalizeUrl(url);
  if (visitedUrls.has(normalizedUrl) || processingUrls.has(normalizedUrl)) {
    return;
  }

  if (depth > config.maxDepth) {
    return;
  }

  if (config.excludePatterns.some(pattern => pattern.test(url))) {
    return;
  }

  requestQueue.push({ url, depth });
}

async function processUrl(url, depth) {
  const normalizedUrl = normalizeUrl(url);
  processingUrls.add(normalizedUrl);
  activeRequests++;

  try {
    console.log(`正在处理: ${url} (深度: ${depth})`);

    const response = await axios.get(url, {
      timeout: config.timeout,
    });

    const contentType = response.headers['content-type'] || '';

    if (contentType.includes('text/html')) {
      await handleHtml(response.data, url, depth);
    } else if (contentType.includes('javascript') ||
      contentType.includes('css') ||
      isResourceType(url)) {
      await saveResource(response.data, url);
    }

    visitedUrls.add(normalizedUrl);
  } catch (error) {
    console.error(`处理URL失败: ${url}`, error.message);
  } finally {
    processingUrls.delete(normalizedUrl);
    activeRequests--;
  }
}

async function handleHtml(htmlData, baseUrl, depth) {
  const html = htmlData.toString('utf-8');
  const $ = cheerio.load(html);
  const baseUrlObj = new URL.URL(baseUrl);

  const htmlPath = getLocalPath(baseUrl);
  await saveFile(htmlPath, html);

  const resourceSelectors = [
    'script[src]',
    'link[rel="stylesheet"]',
    'img[src]',
    'image[xlink:href]',
    '[style*="url("]'
  ];

  resourceSelectors.forEach(selector => {
    $(selector).each((i, el) => {
      const $el = $(el);
      let resourceUrl;

      if (selector === '[style*="url("]') {
        const style = $el.attr('style') || '';
        const urlMatch = style.match(/url\(['"]?(.*?)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          resourceUrl = resolveUrl(baseUrl, urlMatch[1]);
          enqueueResourceDownload(resourceUrl, baseUrl);
        }
      } else if (selector === 'link[rel="stylesheet"]') {
        resourceUrl = resolveUrl(baseUrl, $el.attr('href'));
        enqueueUrl(resourceUrl, depth + 1);
      } else {
        const attr = selector === 'script[src]' ? 'src' :
          selector === 'img[src]' ? 'src' : 'xlink:href';
        resourceUrl = resolveUrl(baseUrl, $el.attr(attr));
        enqueueUrl(resourceUrl, depth + 1);
      }
    });
  });

  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
      const resolvedUrl = resolveUrl(baseUrl, href);
      enqueueUrl(resolvedUrl, depth + 1);
    }
  });
}

function resolveUrl(baseUrl, relativeUrl) {
  if (!relativeUrl) return;

  if (relativeUrl.startsWith('data:') || relativeUrl.startsWith('#')) {
    return;
  }

  try {
    return new URL.URL(relativeUrl, baseUrl).href;
  } catch (e) {
    console.warn(`无法解析URL: ${relativeUrl} (基于 ${baseUrl})`);
    return;
  }
}

function isResourceType(url) {
  const ext = path.extname(new URL.URL(url).pathname).toLowerCase();
  return ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot']
    .includes(ext);
}

async function enqueueResourceDownload(url, referrer) {
  if (!url) return;

  const normalizedUrl = normalizeUrl(url);
  if (visitedUrls.has(normalizedUrl) || processingUrls.has(normalizedUrl)) {
    return;
  }

}

async function saveResource(data, url) {
  try {
    const filePath = getLocalPath(url);
    await saveFile(filePath, data);
    console.log(`已保存资源: ${url} -> ${filePath}`);
  } catch (error) {
    console.error(`保存资源失败: ${url}`, error.message);
  }
}

function getLocalPath(url) {
  const urlObj = new URL.URL(url);
  const pathname = urlObj.pathname;

  let localPath = path.join(config.outputDir, urlObj.hostname, pathname);

  if (path.extname(localPath) === '' && !localPath.endsWith('/')) {
    localPath += '/';
  }
  if (localPath.endsWith('/')) {
    localPath = path.join(localPath, 'index.html');
  }

  localPath = './' + localPath;

  const dirname = path.dirname(localPath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  return localPath;
}

async function saveFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function normalizeUrl(url) {
  if (!url) return '';
  try {
    const urlObj = new URL.URL(url);
    return urlObj.origin + urlObj.pathname;
  } catch (e) {
    return url;
  }
}

crawlSite()