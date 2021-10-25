var EL = document.documentElement
var TOGGLE_CLASS = 'navigation-is-open'
var TOGGLE_EL = document.getElementById('MenuToggle')
var TOGGLE_TARGET = document.getElementById('Menu')

const ToggleController = function() {
  this.setup()
}

ToggleController.prototype = {
  setup: function() {
    TOGGLE_EL.addEventListener('click', this.toggle)
  },

  toggle: function() {
    EL.classList.toggle(TOGGLE_CLASS);
    TOGGLE_ELEMENT.blur(); // Chrome will keep focused button within viewport unless blurred.
  },
}

ToggleController.init = function() {
  new ToggleController()
}

export {
  ToggleController,
  ToggleController as default,
};
