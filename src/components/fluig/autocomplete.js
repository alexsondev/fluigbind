class Autocomplete extends fluigbind.Component {
  static get template() {
    return `
    <div>Hello {message}</div>
    `
  }

  static get properties() {
    return {
      message: true
    }
  }
}

customElements.define('fluig-autocomplete', Autocomplete);