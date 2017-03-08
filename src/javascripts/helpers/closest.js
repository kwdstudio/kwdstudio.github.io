const closest = function(element, selector) {
  let matches = (element.document || element.ownerDocument).querySelectorAll(selector)
  let i

  do {
    i = matches.length
    while (--i >= 0 && matches.item(i) !== element) {}
  } while ((i < 0) && (element = element.parentElement))

  return element
}

export { closest, closest as default }
