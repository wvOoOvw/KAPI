const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const input = document.createElement('input')
    input.style.position = 'absolute'
    input.style.left = '0px'
    input.style.right = '0px'
    input.style.top = '0px'
    input.style.bottom = '0px'
    input.style.maigin = 'auto'
    input.style.padding = 'auto'
    input.style.zIndex = '10000px'
    document.body.appendChild(input)
    input.value = text
    if (input.createTextRange) {
      const range = input.createTextRange()
      range.collapse(true)
      range.moveStart('character', 0)
      range.moveEnd('character', text.length - 0)
      range.select()
    } else {
      input.setSelectionRange(0, text.length)
      input.focus()
    }
    if (document.execCommand('copy')) document.execCommand('copy')
    input.blur()
    document.body.removeChild(input)
  }
}

export { copy }
