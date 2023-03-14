import fluigbind from './binder/fluigbind'
import View from './binder/view'
import {OPTIONS, EXTENSIONS} from './binder/constants'
import adapter from './binder/adapter'
import binders from './binder/binders'
import formatters from './binder/formatters'
import Observer from './binder/observer'
import Component from './binder/component'


// Returns the public interface.

fluigbind.binders = binders
fluigbind.formatters = formatters
fluigbind.adapters['.'] = adapter

fluigbind.Component = Component

// Binds some data to a template / element. Returns a fluigbind.View instance.
fluigbind.bind = (el, models, options) => {
  let viewOptions = {}
  models = models || {}
  options = options || {}

  EXTENSIONS.forEach(extensionType => {
    viewOptions[extensionType] = Object.create(null)

    if (options[extensionType]) {
      Object.keys(options[extensionType]).forEach(key => {
        viewOptions[extensionType][key] = options[extensionType][key]
      })
    }

    Object.keys(fluigbind[extensionType]).forEach(key => {
      if (!viewOptions[extensionType][key]) {
        viewOptions[extensionType][key] = fluigbind[extensionType][key]
      }
    })
  })

  OPTIONS.forEach(option => {
    let value = options[option]
    viewOptions[option] = value != null ? value : fluigbind[option]
  })

  viewOptions.starBinders = Object.keys(viewOptions.binders).filter(function (key) {
    return key.indexOf('*') > 0
  })

  Observer.updateOptions(viewOptions)

  let view = new View(el, models, viewOptions)
  view.bind()
  return view
}

exports.fluigbind = fluigbind
