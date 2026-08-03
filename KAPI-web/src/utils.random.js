const random = (n = 4, l = 3, mode = 'toUpperCase') => {
  return new Array(l).fill(undefined).map(i => Array.from(Array(n), () => Math.floor(Math.random() * 36).toString(36)).join('')).join('-')[mode]()
}

export { random }