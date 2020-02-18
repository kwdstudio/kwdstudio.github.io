var EL = document.documentElement
var IS_POINTER_STATE = 'is-pointer'
var TAB_KEY_CODE = 9

const SetPointerStateController = function() {
  this.setupEvents()
}

SetPointerStateController.prototype = {
  isPointer: false,

  setupEvents: function() {
    EL.addEventListener('mousedown', this.setPointerState, false)
    EL.addEventListener('keydown', this.removePointerState, false)
  },

  setPointerState: function() {
    if (!this.isPointer) {
      EL.classList.add(IS_POINTER_STATE)
      this.isPointer = true
    }
  },

  removePointerState: function(event) {
    var isTab = event.keyCode === TAB_KEY_CODE

    if (isTab && this.isPointer) {
      EL.classList.remove(IS_POINTER_STATE)
      this.isPointer = false
    }
  }
}

SetPointerStateController.init = function() {
  new SetPointerStateController()
}

export { SetPointerStateController, SetPointerStateController as default }
