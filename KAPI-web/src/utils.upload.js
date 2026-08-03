import { Fetch } from './utils.fetch'

const upload = async (file, dir, name) => {
  const fileBase64 = await new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = function (e) {
      const base64String = e.target.result.split(',')[1]

      const extension = file.name.split('.').pop()

      const mimeTypes = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml' }
      const mimeType = mimeTypes[extension] || 'application/octet-stream'

      const base64 = `data:${mimeType};base64,${base64String}`

      const txtBlob = new Blob([base64], { type: 'text/plain' })
      const txtFile = new File([txtBlob], 'image.txt', { type: 'text/plain' })

      resolve(txtFile)
    }

    reader.readAsDataURL(file)
  })

  const formData = new FormData()
  formData.append('file', fileBase64)
  formData.append('dir', dir)
  formData.append('name', name)

  const res = await Fetch.form('/api/app/file/insert', formData)

  return res
}

export { upload }
