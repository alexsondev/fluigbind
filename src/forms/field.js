
import Dataset from "./dataset";

class Field {

  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  /**
   * @param {any} value
   */
  set value(value) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  /**
   * @param {Boolean} visible
   */
  static set visible(visible) {
    this._visible = visible;
  }

  static get visible() {
    return this._visible;
  }

  /**
   * @param {Boolean} mandatory
   */
  static set mandatory(mandatory) {
    this._mandatory = mandatory;
  }

  static get mandatory() {
    return this._mandatory;
  }

  /**
   * @param {Dataset} dataset
   */
  static set dataset(dataset) {
    this._dataset = dataset;
  }

  static get dataset() {
    return this._dataset;
  }

  init() { }
  load() { }
  reset() { }
  change() { }
  validate() { }
  destroy() { }

}

export default Field