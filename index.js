'use strict'

const TOKEN = process.env.TELEGRAM_TOKEN || '866032024:AAFGQBML2lMv0o5Jb5HoNKj2l5KIgbfj4qA';
const TelegramBot = require('node-telegram-bot-api');
const options = {
  webHook: {
    port: process.env.PORT
  }
};

const url = process.env.APP_URL || 'https://rozklad-for-kpi.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);

bot.setWebHook(`${url}/bot${TOKEN}`);

bot.on('message', function onMessage(msg) {
  	bot.sendMessage(msg.chat.id, Object.keys(msg).toString());
});

bot.onText(/стадіон/, (msg, match) => {
	bot.sendMessage(msg.chat.id, `${match} так ${match}`);
})

const pRequest = require("promisified-request").create();
const fScraper = require("form-scraper");

let formStructure = fScraper.fetchForm("#aspnetForm", "http://http://rozklad.kpi.ua/Schedules/ScheduleGroupSelection.aspx", pRequest);
let loginDetails = { ctl00$MainContent$ctl00$txtboxGroup: "ІП-71" };

bot.onText(/розклад/, async (msg, match) => {
	await fScraper.submitForm(loginDetails, fScraper.provideForm(formStructure), pRequest).then( function (response) {
    	bot.sendMessage(msg.chat.id, response.body);
	};
})

