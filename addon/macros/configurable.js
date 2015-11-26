import Ember from 'ember';

const {
  computed,
  get
} = Ember;

const configurableGet = function configurableGet(context, category, keys) {
  const config = get(context, 'config');

  const directableOption = keys.find((key) => get(context, `directable.options.${key}`));
  const configCategory = keys.find((key) => get(context, `config.${category}.${key}`));
  const configGlobal = keys.find((key) => get(context, `config.globals.${key}`));

  return directableOption ||
    config.getProperty(category, configCategory) ||
    config.getProperty(category, configGlobal);
}

export function configurableClassNames(category) {
  return computed('directable.options.classNames',
                  `config.${category}.classNames`,
                  'config.globals.classNames', {
    get() {
      return configurableGet(this, category, ['classNames']).join(' ');
    }
  }).readOnly()
};

export default function configurable(category, ...keys) {
  const properties = keys.reduce((properties, key) => {
    properties.push(`directable.options.${key}`);
    properties.push(`config.${category}.${key}`);
    properties.push(`config.globals.${key}`);

    return properties;
  }, []);

  return computed(...properties, {
    get() {
      return configurableGet(this, category, keys);
    }
  }).readOnly()
};
