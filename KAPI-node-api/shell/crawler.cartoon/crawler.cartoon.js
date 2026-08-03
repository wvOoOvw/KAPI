var request = async (props) => {
  const index = props.index
  const src = props.src
  const name = props.name

  var retry = true
  var retryCount = 0
  var url

  while (retry && retryCount < 5) {
    try {
      console.log(`🚀 开始请求第 ${name} 张 ${src}`);
      const response = await fetch(src);
      const blob = await response.blob();
      url = URL.createObjectURL(blob);
      retry = false
    } catch {
      retryCount = retryCount + 1
      console.log(`🚀 重试请求第 ${name} 张 ${src}`);
    }
  }

  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  if (!url) throw new Error('')
}

var _run = async () => {

  var imagesFilter = []
  var images = document.querySelectorAll('li img');
  var imagesSuccess = []
  var imagesFail = []

  console.log(`🥬 共计 ${images.length} 张图片；过滤后 ${images.length - imagesFilter.length} 张图片`);

  await new Promise(resolve => setTimeout(resolve, 2000))

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const src = image.src;
    const index = i + 1
    const name = String(index).padStart(3, '0')

    try {
      if (imagesFilter.includes(name) !== true) {
        await request({ index, src, name })
        imagesSuccess.push(src)
        console.log(`✅ 第 ${name} 张成功`);
      }
    }
    catch (e) {
      imagesFail.push(src)
      console.error(`❌ 第 ${name} 张失败 ${e.message}`);
    }
  }

  const name = document.querySelector('.flex-1.min-h-0.flex.flex-col a').innerText

  console.log(`🥬 ${name}`);
  console.log(`🥬 成功 ${imagesSuccess.length} 张图片；失败 ${imagesFail.length} 张图片`);
  console.log(`🥬 控制台输入window._查看详情`);

  window._ = { imagesSuccess, imagesFail }

}

_run()