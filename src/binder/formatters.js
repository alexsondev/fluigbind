import fluigbind from './fluigbind'

const formatters = {
  watch: function(value) {
    return value;
  },

  not: function(value) {
    return !value;
  },

  json: function(value) {
    return JSON.stringify(value)
  },

  number: {
    read: function (value, style, locale, currency) {
      
      style = style || 'decimal';
      // "decimal" for plain number formatting.
      // "currency" for currency formatting.
      // "percent" for percent formatting.
      // "unit" for unit formatting.

      locale = locale || fluigbind.defaults.locale;
      currency = currency || fluigbind.defaults.currency;

      return new Intl.NumberFormat(locale, { style, currency }).format(value)
    },
    publish: function (value) {

      const exp = /^\w{0,3}\W?\s?(\d+)[.,](\d+)?,?(\d+)?$/g
      const replacer = (f, group1, group2, group3) => {
        return group3 ? `${group1}${group2}.${group3}` : `${group1}.${group2}`
      }
      return parseFloat(value.replace(exp, replacer))
    }
  }
}

export default formatters