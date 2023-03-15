

const AutocompleteBinder = {
  publishes: true,
  bind: function (el) {
    let self = this;
    let data = this.model.data;

    this.callback = (e) => {
      self.publish()
      el.dispatchEvent(new Event("change"))
    }

    this.model.autocomplete = FLUIGC.autocomplete(el, {
      source: substringMatcher(this.model),
      maxTags: 1,
      templates: {
        tag: data.tplSelected || '',
        suggestion: data.tplList || '',
        tip: data.tplTip || '',
      },
      minLength: 0,
      displayKey: data.displaykey,
      tagClass: data.tagClass || 'col-xs-12',
      type: 'tagAutocomplete',
      tagMaxWidth: 800
    });

    if (this.model.value) {
      this.model.autocomplete.add(this.model.value);
    }

    this.model.autocomplete.on('fluig.autocomplete.itemAdded', this.callback);
    this.model.autocomplete.on('fluig.autocomplete.itemRemoved', this.callback);
  },
  routine: function (el, value) {
    let oldValue = this.model.autocomplete.items()[0];
    if (value != oldValue) {
      if (oldValue) {
        if (value) {
          this.model.autocomplete.removeAll();
        } else {
          try {
            this.model.autocomplete.input()[0].parentNode.previousElementSibling.children[0].children[0].style.color = "white"
          } catch (err) { }
        }
      }
      if (value) {
        this.model.autocomplete.add(value)
      } else { }
    }
  },
  getValue: function (el) {
    return this.model.autocomplete.items()[0];
  }
}

const substringMatcher = (model) => (q, cb) => {
  let adapter = fluigbind.adapters['.'];
  let name = model.displaykey;
  let items = adapter.get(model, 'items');

  var matches, substrRegex;

  matches = [];

  substrRegex = new RegExp(q, 'i');
  items.forEach(str => {
    if (substrRegex.test(str[name])) {
      matches.push(str);
    }
  })

  // $.each(items, function (i, str) {
  //   if (substrRegex.test(str[name])) {
  //     matches.push(str);
  //   }
  // });
  cb(matches);
}

export default AutocompleteBinder;