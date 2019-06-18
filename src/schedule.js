'use strict'

const Scraper = require('./scraper.js')

const URL = 'http://rozklad.kpi.ua/Schedules/ScheduleGroupSelection.aspx'

const formId = '#aspnetForm'
const inputId = '#ctl00_MainContent_ctl00_txtboxGroup'

const additionalParameters = {
  ctl00_ToolkitScriptManager_HiddenField:
    ';;AjaxControlToolkit, ' +
    'Version=3.5.60623.0, Culture=neutral, ' +
    'PublicKeyToken=28f01b0e84b6d53e::834c499a-b613-' +
    '438c-a778-d32ab4976134:22eca927:ce87be9:2d27a0fe:23389d96:' +
    '77aedcab:1bd6c8d4:7b704157',
}

const createTransposedWeekSchedule = (weekSchedule) => {
  const transposedWeekSchedule = [];
  weekSchedule[0].forEach((el, i) => {
    const newRow = weekSchedule.reduce((acc, val, j) =>
      // push new value and return the accumulator in one line
      (acc.push(weekSchedule[j][i]), acc)
    , []);
    transposedWeekSchedule.push(newRow);
  });
  return transposedWeekSchedule;
};

const createWeekSchedules = (tables) => {
  const transposedWeekTables = tables.map(createTransposedWeekSchedule);
  transposedWeekTables.forEach(             // remove first row with lessons
    weekTable => weekTable.shift() // starting time and lessons number
  );                                        //

  let [firstWeek, secondWeek] = transposedWeekTables.map(
    weekTable => weekTable.map(day => day.map(element => {
    	return {
    		"today": element.className === 'day_backlight',
    		"lesson": Array.from(element.querySelectorAll('a')).map(childElement => childElement.innerHTML)
   		}
  	})
    )
);
  return {
  	firstWeek, 
  	secondWeek
  }
  
};

const scrapeTablesFromDOM = async (groupName) => {
  const scraper = await new Scraper(URL, additionalParameters);
  await scraper.renderDOM();

  const [form] = scraper.select(formId);
  const [input] = scraper.select(inputId);
  input.setAttribute('value', groupName);

  const response = await scraper.sendForm(form, additionalParameters);

  scraper.setURL(response.url);
  await scraper.renderDOM();

  let tables = scraper.scrape();
  return tables;
};

const getSchedule = async (groupName) => {
	const tables = await scrapeTablesFromDOM(groupName)
	const schedules = createWeekSchedules(tables)
	return schedules
}

module.exports = getSchedule