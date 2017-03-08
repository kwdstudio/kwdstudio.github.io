import * as controllers from 'controllers'

// Check if browser cuts the mustard
if ('querySelector' in document && 'classList' in document.documentElement) {
  Object.keys(controllers).forEach(key => {
    let controller = controllers[key]

    if (typeof controller.init === 'function') {
      controller.init()
    }
  })
}
