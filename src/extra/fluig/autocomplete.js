import Component from "../../binder/component"

class FluigAutocomplete extends Component {
  constructor() {
    super()
    var self = this;

    self.model = fields[self.getAttribute('field')]
  }

  static get template() {
    return `
      <div flg-show="model.visible" flg-class-has-error="model.errors" flg-class-has-warning="model.warnings" class="form-group">
        <label class="control-label">{model.label}</label>
        <div flg-show="model.loading" class="fs-skeleton-loader fs-skeleton-loader-input"></div>
        <input flg-autocomplete="model.value" flg-enabled="model.editable" flg-show="model.loading | !" type="text" rv-class="model.classes" flg-on-change="model.change">
        <p class="help-block" flg-if="model.errors"><i class="flaticon flaticon-global-error icon-sm" aria-hidden="true"></i>{model.errors}</p>
        <p class="help-block" flg-if="model.warnings"><i class="flaticon flaticon-alert icon-sm" aria-hidden="true"></i>{model.warnings}</p>
      </div>
    `
  }

  static get properties() {
    return {
      field: true
    }
  }
}

export default FluigAutocomplete

// customElements.define('fluig-autocomplete', FluigAutocomplete);