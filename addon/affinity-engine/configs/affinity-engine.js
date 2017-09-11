export default {
  priority: 0,
  children: {
    attrs: {
      animator: 'jquery',
      keys: {
        accept: ['Space', 'Enter'],
        cancel: ['Escape'],
        moveDown: ['ArrowDown', 'KeyS', 'Numpad2'],
        moveLeft: ['ArrowLeft', 'KeyA', 'Numpad4'],
        moveRight: ['ArrowRight', 'KeyD', 'Numpad6'],
        moveUp: ['ArrowUp', 'KeyW', 'Numpad8']
      },
      menu: {
        columns: 1
      },
      transitionIn: {
        effect: { opacity: [1, 0] },
        duration: 100
      },
      transitionOut: {
        effect: { opacity: 0 },
        duration: 100
      },
      lxlAnimation: {
        effect: {
          opacity: 1
        },
        duration: 100,
        rate: 25
      }
    }
  }
};
