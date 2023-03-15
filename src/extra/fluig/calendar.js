import Component from "../../binder/component"

class FluigCalendar extends Component {
  constructor() {
    super()
    var self = this;

    self.model = fields[self.getAttribute('field')]
  }

  static get template() {
    return `
    <div flg-class-has-error="model.errors" flg-class-has-warning="model.warnings" class="form-group fs-text-center">
      <label>Início Previsto</label>
      <input class="fs-text-center" type="text" flg-enabled="model.editable" flg-on-change="model.change" flg-calendar="model.value" />
      <p class="help-block" flg-if="model.errors">{model.errors}</p>
      <p class="help-block" flg-if="model.warnings">{model.warnings}</p>
    </div>
    `
  }

  static get properties() {
    return {
      field: true
    }
  }
}

export default FluigCalendar

// customElements.define('fluig-autocomplete', FluigAutocomplete);