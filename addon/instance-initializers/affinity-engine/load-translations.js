import en from 'affinity-engine/locales/affinity-engine/en/translations'

export function initialize(appInstance) {
  const i18n = appInstance.lookup('service:i18n');

  i18n.addTranslations('en', en);
}

export default {
  name: 'affinity-engine/load-translations',
  initialize
};
