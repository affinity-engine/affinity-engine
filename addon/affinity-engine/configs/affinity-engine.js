export default {
  priority: 0,
  keys: {
    accept: ['Space', 'Enter'],
    cancel: ['Escape'],
    moveDown: ['ArrowDown', 'KeyS', 'Numpad2'],
    moveLeft: ['ArrowLeft', 'KeyA', 'Numpad4'],
    moveRight: ['ArrowRight', 'KeyD', 'Numpad6'],
    moveUp: ['ArrowUp', 'KeyW', 'Numpad8']
  },
  cps: 25,
  menuColumns: 1,
  transitionIn: {
    effect: { opacity: [1, 0] },
    duration: 100
  },
  transitionOut: {
    effect: { opacity: 0 },
    duration: 100
  }
};
