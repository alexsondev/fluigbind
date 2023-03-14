class Section {

  constructor(name) {
    this.name = name;
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
   * @param {String} title
   */
  set title(title) {
    this._title = title;
  }

  get title() {
    return this._title;
  }

  /**
   * @param {Field[]} fields
   */
  set fields(fields) {
    this._fields = fields;
  }

  get fields() {
    return this._fields;
  }

  init() {}
  load() {}
  reset() {}
  change() {}
  validate() {}
  destroy() {}

}

export default Section;