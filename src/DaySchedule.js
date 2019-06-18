'use strict';

const Lesson = require('./Lesson.js');

/*
  dayInfo is an array in which
  first element is day of week name
  and rest elements are lessons of this day
 */
class DaySchedule {
  constructor(dayInfo) {
    this.dayName = dayInfo.shift().innerText;
    this.lessons = dayInfo.map(element => new Lesson(element));
  }

  getLessons() {
    return this.lessons;
  }

  toString() {
    let string = `${this.dayName}`;
    this.lessons.forEach(
      (lesson, i) =>
          string +=
            `${lesson.toString().length > 1 ? '\n' + ++i + ')\n' : ''}` +
            `${lesson.toString() ? lesson.toString() : ''}`
    );
    return string;
  }
}

module.exports = DaySchedule;