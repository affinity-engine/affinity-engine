import Ember from 'ember';

const {
  assign,
  computed,
  get,
  isPresent,
  typeOf
} = Ember;

const createKeyPriorityPairs = function createKeyPriorityPairs(priorities, ...keys) {
  return keys.reduce((props, key) => {
    props.push(`configuration.${key}`);
    priorities.forEach((priority) => props.push(`config.attrs.${priority}.attrs.${key}`));

    return props;
  }, []);
};

const deepMerge = function deepMerge(properties, context, initial = {}) {
  const mergedProperty = properties.reduce((accumulator, property) => {
    const nextValue = get(context, property) || {};

    return assign({}, nextValue, accumulator);
  }, initial);

  return Ember.Object.create(mergedProperty);
};

export default function configurable(priorities, keys) {
  const properties = createKeyPriorityPairs(priorities, keys);

  return computed(...properties, {
    get() {
      const priorityProperty = properties.find((property) => get(this, property));

      return isPresent(priorityProperty) ? get(this, priorityProperty) : undefined;
    }
  });
}

export function deepConfigurable(priorities, keys) {
  const properties = createKeyPriorityPairs(priorities, keys);

  return computed(...properties, {
    get() {
      return deepMerge(properties, this);
    }
  });
}

export function deepArrayConfigurable(priorities, primaryKey, keys) {
  const properties = createKeyPriorityPairs(priorities, keys);

  return computed(`${primaryKey}.[]`, ...properties, {
    get() {
      const array = (get(this, primaryKey) || []).map((item) => {
        return deepMerge(properties, this, item);
      });

      return Ember.A(array);
    }
  });
}

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

const mergeObjects = function mergeObjects(priorityProperties, context) {
  const values = priorityProperties.map((property) => {
    return get(context, property);
  }).filter((value) => typeOf(value) === 'object' || typeOf(value) === 'instance').reverse();

  return assign({}, ...values);
}

export function classNamesConfigurable(priorities, keys) {
  const properties = createKeyPriorityPairs(priorities, keys);

  return computed(...properties, {
    get() {
      const priorityProperties = properties.filter((property) => get(this, property));
      const firstTier = isPresent(priorityProperties) ? get(this, priorityProperties[0]) : undefined;
      const isObject = typeOf(firstTier) === 'object' || typeOf(firstTier) === 'instance';
      const value = isObject ? mergeObjects(priorityProperties, this) : firstTier;

      return switchClassNamesContainer(value).join(' ');
    }
  });
}
