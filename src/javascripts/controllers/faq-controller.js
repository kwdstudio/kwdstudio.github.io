import closest from 'helpers/closest'
import defer from 'helpers/defer'
import requestAnimationFramePromise from 'helpers/raf-promise'

const FAQ_SELECTOR = '[data-controller="faq"]'
const FAQ_GROUP_SELECTOR = '[data-behavior="faq-group"]'
const FAQ_TOGGLE_SELECTOR = '[data-behavior="faq-toggle"]'
const FAQ_TOGGLEABLE_SELECTOR = '[data-behavior="faq-toggleable"]'
const FAQ_ACTIVE_PREPARE_CLASS = 'will-be-active'
const FAQ_ACTIVE_CLASS = 'is-active'
const FAQ_INACTIVE_PREPARE_CLASS = 'will-be-inactive'

const supportsTransitionEvents = (function() {
  let result

  return function() {
    if (typeof result === 'undefined') {
      result = !!('ontransitionend' in window)
    }

    return result
  }
}())

const FaqController = function(element, options) {
  this.element = element
  this.groupElements = [].slice.call(element.querySelectorAll(FAQ_GROUP_SELECTOR))
}

FaqController.prototype = {
  isAnimating: false,

  onToggle(e) {
    let groupElement = closest(e.target, FAQ_GROUP_SELECTOR)

    if (this.isAnimating || groupElement.classList.contains(FAQ_ACTIVE_PREPARE_CLASS)) {
      return
    } else if (groupElement.classList.contains(FAQ_ACTIVE_CLASS)) {
      this.deactivate(groupElement)
    } else {
      this.deactivate()
        .then(() => {
          this.activate(groupElement)
        })
    }
  },

  activate(groupElement) {
    let toggleable = groupElement.querySelector(FAQ_TOGGLEABLE_SELECTOR)
    let groupHeight = groupElement.getBoundingClientRect().height
    let toggleableHeight = 0

    let beginTransition = () => {
      this.isAnimating = true

      groupElement.style.height = `${groupHeight}px`

      groupElement.classList.add(FAQ_ACTIVE_PREPARE_CLASS)
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
      groupElement.classList.add(FAQ_ACTIVE_CLASS)
      groupElement.classList.remove(FAQ_ACTIVE_PREPARE_CLASS)
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
      toggleable = groupElement.querySelector(FAQ_TOGGLEABLE_SELECTOR)
    }

    let beginTransition = () => {
      this.isAnimating = true

      groupElement.style.height = `${groupHeight}px`

      groupElement.classList.add(FAQ_INACTIVE_PREPARE_CLASS)
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
      groupElement.classList.remove(FAQ_ACTIVE_CLASS)
      groupElement.classList.remove(FAQ_INACTIVE_PREPARE_CLASS)
      groupElement.style.height = ''

      this.isAnimating = false
    }

    if (groupElement) {
      groupElements = [groupElement]
      groupElement = undefined
    }

    i = groupElements.length

    while (i-- && !groupElement) {
      if (groupElements[i].classList.contains(FAQ_ACTIVE_CLASS)) {
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

FaqController.init = function() {
  document.documentElement.addEventListener('click', (e) => {
    if ((e.target.matches || e.target.matchesSelector).call(e.target, FAQ_TOGGLE_SELECTOR)) {
      let faqElement = closest(e.target, FAQ_SELECTOR)
      let faqInstance

      if (faqElement) {
        faqInstance = faqElement.faqInstance
      }

      if (!faqInstance) {
        faqInstance = faqElement.faqInstance = new FaqController(faqElement)
      }

      faqInstance.onToggle.call(faqInstance, e)
    }
  }, true)
}

export { FaqController, FaqController as default }
