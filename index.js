'use strict'

const TOKEN = process.env.TELEGRAM_TOKEN || '866032024:AAFGQBML2lMv0o5Jb5HoNKj2l5KIgbfj4qA';
const TelegramBot = require('node-telegram-bot-api');
const options = {
  webHook: {
    port: process.env.PORT
  }
};

const url_lessons = encodeURI('http://api.rozklad.org.ua/v2/groups/іп-71/lessons')
const url = process.env.APP_URL || 'https://rozklad-for-kpi.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);

bot.setWebHook(`${url}/bot${TOKEN}`);

bot.onText(/стадіон/, (msg, match) => {
	bot.sendMessage(msg.chat.id, `${match} так ${match}`);
})

bot.onText(/розклад/, (msg) => {
	request.get(url_lessons, (err, req, res) => {
		res = JSON.parse(res)
		res = res.data[0]
		bot.sendMessage(msg.chat.id, typeof res)
	})
})
