const CalendarBinder = {
  bind: function (el) {
    this.changeDate = e => {
      if (Date.parse(this.model.value) !== this.model.calendar.getTimestampDate()) {
        this.model.value = this.model.calendar.getDate().format('YYYY-MM-DD HH:MM:SS.s');
        el.dispatchEvent(new Event("change"))
      }
    };

    this.model.calendar = FLUIGC.calendar(el);
    el.addEventListener('focusout', this.changeDate);
  },
  unbind: function (el) {
    el.removeEventListener('focusout', this.changeDate);
  },
  routine: function (el, value) {
    if (value) {
      let date = Date.parse(value);
      this.model.calendar.setDate(new Date(date));
    }
  }
};

export default CalendarBinder;