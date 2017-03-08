import closest from 'helpers/closest'

const FAQ_SELECTOR = '[data-controller="faq"]'
const FAQ_GROUP_SELECTOR = '[data-behavior="faq-group"]'
const FAQ_TOGGLE_SELECTOR = '[data-behavior="faq-toggle"]'
const FAQ_TOGGLEABLE_SELECTOR = '[data-behavior="faq-toggleable"]'
const FAQ_ACTIVE_CLASS = 'is-active'

const FaqController = function(element, options) {
  this.element = element
  this.groupElements = [].slice.call(element.querySelectorAll(FAQ_GROUP_SELECTOR))
}

FaqController.prototype = {
  onToggle(e) {
    let groupElement = closest(e.target, FAQ_GROUP_SELECTOR)

    if (groupElement.classList.contains(FAQ_ACTIVE_CLASS)) {
      this.deactivate(groupElement)
    } else {
      this.deactivate()
      this.activate(groupElement)
    }
  },

  activate(groupElement) {
    groupElement.classList.add(FAQ_ACTIVE_CLASS)
  },

  deactivate(groupElement) {
    let groupElements = this.groupElements

    if (groupElement) {
      groupElements = [groupElement]
    }

    groupElements.forEach((el) => {
      el.classList.remove(FAQ_ACTIVE_CLASS)
    })
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
