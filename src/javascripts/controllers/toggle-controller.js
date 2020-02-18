import closest from '../helpers/closest'
import defer from '../helpers/defer'
import requestAnimationFramePromise from '../helpers/raf-promise'

const TOGGLE_SELECTOR = '[data-controller="toggle"]'
const TOGGLE_GROUP_SELECTOR = '[data-behavior="toggle-group"]'
const TOGGLE_TOGGLE_SELECTOR = '[data-behavior="toggle-toggle"]'
const TOGGLE_TOGGLEABLE_SELECTOR = '[data-behavior="toggle-toggleable"]'
const TOGGLE_ACTIVE_PREPARE_CLASS = 'will-be-active'
const TOGGLE_ACTIVE_CLASS = 'is-active'
const TOGGLE_INACTIVE_PREPARE_CLASS = 'will-be-inactive'

const supportsTransitionEvents = (function() {
  let result

  return function() {
    if (typeof result === 'undefined') {
      result = !!('ontransitionend' in window)
    }

    return result
  }
}())

const ToggleController = function(element, options) {
  this.element = element
  this.groupElements = [].slice.call(element.querySelectorAll(TOGGLE_GROUP_SELECTOR))
}

ToggleController.prototype = {
  isAnimating: false,

  onToggle(e) {
    let groupElement = closest(e.target, TOGGLE_GROUP_SELECTOR)

    e.preventDefault()

    if (this.isAnimating || groupElement.classList.contains(TOGGLE_ACTIVE_PREPARE_CLASS)) {
      return
    } else if (groupElement.classList.contains(TOGGLE_ACTIVE_CLASS)) {
      this.deactivate(groupElement)
    } else {
      this.activate(groupElement)
    }
  },

  activate(groupElement) {
    let toggleable = groupElement.querySelector(TOGGLE_TOGGLEABLE_SELECTOR)
    let groupHeight = groupElement.getBoundingClientRect().height
    let toggleableHeight = 0

    let beginTransition = () => {
      this.isAnimating = true

      groupElement.style.height = `${groupHeight}px`

      groupElement.classList.add(TOGGLE_ACTIVE_PREPARE_CLASS)
    }

    let getToggleableHeight = () => {
      toggleableHeight = toggleable.getBoundingClientRect().height
    }

    let setNewGroupHeight = () => {
      groupElement.style.height = `${groupHeight + toggleableHeight}px`
    }

    let waitForTransition = () => {
      let timestamp = Date.now()

      return new Promise(function(resolve) {
        if (supportsTransitionEvents()) {
          groupElement.addEventListener('transitionend', function onTransitionEnd() {
            groupElement.removeEventListener('transitionend', onTransitionEnd, true)
            resolve()
          }, true)
        } else {
          resolve()
        }
      })
    }

    let endTransition = () => {
      groupElement.classList.add(TOGGLE_ACTIVE_CLASS)
      groupElement.classList.remove(TOGGLE_ACTIVE_PREPARE_CLASS)
      groupElement.style.height = ''

      this.isAnimating = false
    }


    return Promise.resolve()
      .then(beginTransition)
      .then(defer)
      .then(getToggleableHeight)
      .then(requestAnimationFramePromise)
      .then(setNewGroupHeight)
      .then(waitForTransition)
      .then(requestAnimationFramePromise)
      .then(endTransition)
  },

  deactivate(groupElement) {
    let groupElements = this.groupElements
    let i

    let toggleable
    let groupHeight
    let toggleableHeight

    let getGroupHeight = () => {
      groupHeight = groupElement.getBoundingClientRect().height
    }

    let getToggleableElement = () => {
      toggleable = groupElement.querySelector(TOGGLE_TOGGLEABLE_SELECTOR)
    }

    let beginTransition = () => {
      this.isAnimating = true

      groupElement.style.height = `${groupHeight}px`

      groupElement.classList.add(TOGGLE_INACTIVE_PREPARE_CLASS)
    }

    let getToggleableHeight = () => {
      toggleableHeight = toggleable.getBoundingClientRect().height
    }

    let setNewGroupHeight = () => {
      groupElement.style.height = `${groupHeight - toggleableHeight}px`
    }

    let waitForTransition = () => {
      let timestamp = Date.now()

      return new Promise(function(resolve) {
        if (supportsTransitionEvents()) {
          groupElement.addEventListener('transitionend', function onTransitionEnd() {
            groupElement.removeEventListener('transitionend', onTransitionEnd, true)
            resolve()
          }, true)
        } else {
          resolve()
        }
      })
    }

    let endTransition = () => {
      groupElement.classList.remove(TOGGLE_ACTIVE_CLASS)
      groupElement.classList.remove(TOGGLE_INACTIVE_PREPARE_CLASS)
      groupElement.style.height = ''

      this.isAnimating = false
    }

    if (groupElement) {
      groupElements = [groupElement]
      groupElement = undefined
    }

    i = groupElements.length

    while (i-- && !groupElement) {
      if (groupElements[i].classList.contains(TOGGLE_ACTIVE_CLASS)) {
        groupElement = groupElements[i]
      }
    }

    if (!groupElement) {
      return Promise.resolve()
    } else {
      return Promise.resolve()
        .then(getGroupHeight)
        .then(beginTransition)
        .then(getToggleableElement)
        .then(getToggleableHeight)
        .then(requestAnimationFramePromise)
        .then(setNewGroupHeight)
        .then(waitForTransition)
        .then(requestAnimationFramePromise)
        .then(endTransition)
    }
  }
}

ToggleController.init = function() {
  document.documentElement.addEventListener('click', (e) => {
    if ((e.target.matches || e.target.matchesSelector).call(e.target, TOGGLE_TOGGLE_SELECTOR)) {
      let toggleElement = closest(e.target, TOGGLE_SELECTOR)
      let toggleInstance

      if (toggleElement) {
        toggleInstance = toggleElement.toggleInstance
      }

      if (!toggleInstance) {
        toggleInstance = toggleElement.toggleInstance = new ToggleController(toggleElement)
      }

      toggleInstance.onToggle.call(toggleInstance, e)
    }
  }, true)
}

export { ToggleController, ToggleController as default }
