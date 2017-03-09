function defer(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

export { defer, defer as default }
