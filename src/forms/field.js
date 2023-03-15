
import Dataset from "./dataset";

class Field {

  constructor(label, type) {
    this.label = label;
    this.type = type;
  }

  /**
   * @param {any} data
   */
  set data(data) {
    this._data = data;
  }

  get data() {
    return this._data;
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
  set visible(visible) {
    this._visible = visible;
  }

  get visible() {
    return this._visible;
  }

  /**
   * @param {Boolean} mandatory
   */
  set mandatory(mandatory) {
    this._mandatory = mandatory;
  }

  get mandatory() {
    return this._mandatory;
  }

  /**
   * @param {Dataset} dataset
   */
  set dataset(dataset) {
    this._dataset = dataset;
  }

  get dataset() {
    return this._dataset;
  }

  init() { }
  load() { }
  reset() { }
  change() { }
  validate() { }
  destroy() { }

  clone() {
    const clone = Object.assign( {}, this );

    return Object.setPrototypeOf( clone, Field.prototype );
  }
}

export default Field