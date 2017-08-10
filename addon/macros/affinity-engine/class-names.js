import Ember from 'ember';

const {
  computed,
  get,
  typeOf
} = Ember;

const extractClassNames = function extractClassNames(classNamesContainer) {
  return Object.values(classNamesContainer).reduce((classNames, childContainer) => {
    switchClassNamesContainer(childContainer).forEach((className) => classNames.push(className));

    return classNames;
  }, []);
};

const switchClassNamesContainer = function switchClassNamesContainer(classNamesContainer) {
  switch (typeOf(classNamesContainer)) {
    case 'array': return classNamesContainer;
    case 'string': return [classNamesContainer];
    case 'object': return extractClassNames(classNamesContainer);
    case 'instance': return extractClassNames(classNamesContainer);
    default: return [];
  }
};

export default function className(key) {
  return computed(key, {
    get() {
      return switchClassNamesContainer(get(this, key)).join(' ');
    }
  })
}
