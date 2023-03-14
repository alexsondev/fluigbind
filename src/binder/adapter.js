/**
 * The default `.` adapter that comes with fluigbind.js. 
 * Allows subscribing to properties on plain objects, implemented in 
 * ES5 natives using `Object.defineProperty`.
 *
 * @summary The default `.` adapter that comes with fluigbind.js
 * @author Alexson Ferreira
 *
 * Created at     : 2023-03-09 09:22:27 
 * Last modified  : 2023-03-10 09:27:15
 */

const ARRAY_METHODS = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice'
]

const adapter = {
  counter: 0,
  weakmap: {},

  weakReference: function (obj) {
    if (!obj.hasOwnProperty('__flg')) {
      let id = this.counter++

      Object.defineProperty(obj, '__flg', {
        value: id
      })
    }

    if (!this.weakmap[obj.__flg]) {
      this.weakmap[obj.__flg] = {
        callbacks: {}
      }
    }

    return this.weakmap[obj.__flg]
  },

  cleanupWeakReference: function(data, refId) {
    if (!Object.keys(data.callbacks).length) {
      if (!(data.pointers && Object.keys(data.pointers).length)) {
        delete this.weakmap[refId]
      }
    }
  },

  stubFunction: function(obj, fn) {
    const original = obj[fn]
    const data = this.weakReference(obj)
    const weakmap = this.weakmap

    obj[fn] = (...args) => {
      let response = original.apply(obj, args)

      Object.keys(data.pointers).forEach(refId => {
        let k = data.pointers[refId]

        if (weakmap[refId]) {
          if (weakmap[refId].callbacks[k] instanceof Array) {
            weakmap[refId].callbacks[k].forEach(callback => {
              callback.sync()
            })
          }
        }
      })

      return response
    }
  },

  observeArray: function(value, refId, keypath) {
    if (value instanceof Array) {
      let data = this.weakReference(value)

      if (!data.pointers) {
        data.pointers = {}

        ARRAY_METHODS.forEach(fn => {
          this.stubFunction(value, fn)
        })
      }

      if (!data.pointers[refId]) {
        data.pointers[refId] = []
      }

      if (data.pointers[refId].indexOf(keypath) === -1) {
        data.pointers[refId].push(keypath)
      }
    }
  },

  unobserveArray: function (value, refId, keypath) {
    if ((value instanceof Array) && (value.__flg != null)) {
      let data = this.weakmap[value.__flg]

      if (data) {
        let pointers = data.pointers[refId]

        if (pointers) {
          let idx = pointers.indexOf(keypath)

          if (idx > -1) {
            pointers.splice(idx, 1)
          }

          if (!pointers.length) {
            delete data.pointers[refId]
          }

          this.cleanupWeakReference(data, value.__flg)
        }
      }
    }
  },

  observe: function(obj, keypath, callback) {
    let value    
    const callbacks = this.weakReference(obj).callbacks

    if (!callbacks[keypath]) {
      callbacks[keypath] = []
      let desc = Object.getOwnPropertyDescriptor(obj, keypath)

      if (!desc || !(desc.get || desc.set || !desc.configurable)) {
        value = obj[keypath]

        Object.defineProperty(obj, keypath, {
          enumerable: true,

          get: () => {
            return value
          },

          set: newValue => {
            if (newValue !== value) {
              this.unobserveArray(value, obj.__flg, keypath)
              value = newValue
              const data = this.weakmap[obj.__flg]

              if (data) {
                let callbacks = data.callbacks[keypath]

                if (callbacks) {
                  callbacks.forEach(cb => {
                      cb.sync()
                  })
                }

                this.observeArray(newValue, obj.__flg, keypath)
              }
            }
          }
        })
      }
    }

    if (callbacks[keypath].indexOf(callback) === -1) {
      callbacks[keypath].push(callback)
    }

    this.observeArray(obj[keypath], obj.__rv, keypath)
  },

  unobserve: function(obj, keypath, callback) {
    let data = this.weakmap[obj.__rv]

    if (data) {
      let callbacks = data.callbacks[keypath]

      if (callbacks) {
        let idx = callbacks.indexOf(callback)

        if (idx > -1) {
          callbacks.splice(idx, 1)

          if (!callbacks.length) {
            delete data.callbacks[keypath]
            this.unobserveArray(obj[keypath], obj.__flg, keypath)
          }
        }

        this.cleanupWeakReference(data, obj.__flg)
      }
    }
  },

  get: function(obj, keypath) {
    return obj[keypath]
  },

  set: (obj, keypath, value) => {
    obj[keypath] = value
  }
}

export default adapter
