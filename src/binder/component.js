
import fluigbind from './fluigbind'

class Component extends HTMLElement {
  static get observedAttributes() {
    const template = this.template
    if (!template) {
      throw new Error(`No template declared for ${this.name}`)
    }

    this.__templateEl = document.createElement('template')
    this.__templateEl.innerHTML = template
    
    const propAttributeMap = this.__propAttributeMap = {}
    const attributes = []
    const properties = this.properties
    if (properties) {
      Object.keys(properties).forEach(propName => {
        const propConfig = properties[propName]
        const attrName = typeof propConfig === 'string' ? propConfig : propName
        propAttributeMap[attrName] = propName
        attributes.push(attrName)
      })
    }    
    return attributes
  }

  connectedCallback() {
    const nodes = this.constructor.__templateEl.content.cloneNode(true)
    this.__fluigbindView = fluigbind.bind(nodes, this)    
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.appendChild(nodes)
  }

  disconnectedCallback() {
    this.__fluigbindView.unbind()    
  }

  attributeChangedCallback(name, old, value) {
    if (old !== value) {      
      const propName = this.constructor.__propAttributeMap[name]
      this[propName] = value
    }
  }  
}

export default Component