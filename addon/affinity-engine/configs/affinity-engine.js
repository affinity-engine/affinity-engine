export default {
  priority: 0,
  globals: {
    classNames: ['et-paper', 'et-block'],
    cps: 25,
    keys: {
      accept: ['Space', 'Enter'],
      cancel: ['Escape'],
      moveDown: ['ArrowDown', 'KeyS', 'Numpad2'],
      moveLeft: ['ArrowLeft', 'KeyA', 'Numpad4'],
      moveRight: ['ArrowRight', 'KeyD', 'Numpad6'],
      moveUp: ['ArrowUp', 'KeyW', 'Numpad8']
    },
    menuColumns: 1,
    transition: {
      duration: 250,
      effect: { opacity: 1 }
    },
    transitionDuration: 200,
    transitionIn: {
      duration: 250,
      effect: { opacity: [1, 0] }
    },
    transitionOut: {
      duration: 250,
      effect: { opacity: 0 }
    },
    tweenEffect: {
      opacity: {
        from: 0,
        to: 1
      }
    },
    tweenRate: 25
  },
  preloader: {
    path: 'service:affinity-engine/stubs/preloader'
  },
  saveStateManager: {
    path: 'service:affinity-engine/stubs/save-state-manager'
  }
};
