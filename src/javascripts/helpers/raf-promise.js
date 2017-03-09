const requestAnimationFramePromise = function() {
  return new Promise((resolve) => {
    if ('requestAnimationFrame' in window) {
      window.requestAnimationFrame(resolve)
    } else {
      setTimeout(resolve, 0)
    }
  })
}

export { requestAnimationFramePromise, requestAnimationFramePromise as default }
