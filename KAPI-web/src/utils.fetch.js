var ipApi = 'http://119.28.215.218'
var ipOss = 'http://115.190.230.137'
var ipOnnx = 'http://115.190.230.137'
var ipWasm = 'http://115.190.230.137'

// ipApi = window.location.origin
// ipApi = 'http://localhost'
// ipOss = 'http://localhost:8001'
// ipOnnx = 'http://localhost:8001'
// ipWasm = 'http://localhost:8001'

const urlDecode = (url) => {
  if (typeof url === 'string') {
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    if (url.startsWith('kapi://remote.oss')) return url.replace('kapi://remote.oss', ipOss)

    return ipApi + url
  }

  return url
}

function FetchConstructor(url) {
  this.authorization = ''
}

FetchConstructor.prototype.connect = async function (authorization) {
  this.authorization = authorization
}

FetchConstructor.prototype.json = async function (url, body, signal,) {
  return window.fetch
    (
      urlDecode(url),
      {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Authorization': this.authorization, 'Content-Type': 'application/json' },
        signal: signal
      }
    )
    .then(res => {
      return res.json()
    })
    .then(res => {
      if (res.code === 200) return res
      if (res.code !== 200) throw res
    })
}

FetchConstructor.prototype.form = async function (url, body, signal) {
  return window.fetch
    (
      urlDecode(url),
      {
        method: 'post',
        body: body,
        headers: { 'Authorization': this.authorization },
        signal: signal
      }
    )
    .then(res => {
      return res.json()
    })
    .then(res => {
      if (res.code === 200) return res
      if (res.code !== 200) throw res
    })
}

FetchConstructor.prototype.textUnauth = async function (url, body, signal) {
  return window.fetch
    (
      urlDecode(url),
      {
        method: 'get',
        body: JSON.stringify(body),
        signal: signal
      }
    )
    .then(res => {
      return res.text()
    })
}

const Fetch = new FetchConstructor()

export { ipApi, ipOnnx, ipWasm, urlDecode, Fetch }
