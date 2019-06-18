'use strict'

const TOKEN = process.env.TELEGRAM_TOKEN || '866032024:AAFGQBML2lMv0o5Jb5HoNKj2l5KIgbfj4qA';
const TelegramBot = require('node-telegram-bot-api');
const Group = require('./src/Group.js')
const options = {
  webHook: {
    port: process.env.PORT
  }
};

const url_lessons = encodeURI('http://api.rozklad.org.ua/v2/groups/іп-71/lessons')
const url = process.env.APP_URL || 'https://rozklad-for-kpi.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);

const make_request = (u) => {
	request.get(u, (err, req, res) => {
		return res
	})
}

let group = new Group()

bot.setWebHook(`${url}/bot${TOKEN}`);

bot.onText(/стадіон/, (msg, match) => {
	bot.sendMessage(msg.chat.id, `${match} так ${match}`);
})

bot.onText(/група (.*)/, (msg, match) => {
	const groupName = match[1]
	group.addGroup(msg.chat.id, groupName)
	bot.sendMessage(msg.chat.id, `Ваша група ${groupName}`)
})

bot.onText(/сьогодні/, async (msg, match) => {
	let lessons = await group.today(msg.chat.id)
	let resmsg = ""
	for (let i = 0; i < lessons.length; ++i) {
		resmsg += (i + 1).toString() + ') '
		if (lessons[i][0] === undefined) {
			resmsg += '-\n'
		} else {
			resmsg += 'Предмет: ' + lessons[i][0] + '\n'
			resmsg += 'Викладач: ' + lessons[i][1] + '\n'
			resmsg += 'Аудиторія: ' + lessons[i][2] + '\n'
		}
	}
	bot.sendMessage(msg.chat.id, resmsg)
})

bot.onText(/завтра/, async (msg, match) => {
	let lessons = await group.tomorrow(msg.chat.id)
	let resmsg = ""
	for (let i = 0; i < lessons.length; ++i) {
		resmsg += (i + 1).toString() + ') '
		if (lessons[i][0] === undefined) {
			resmsg += '-\n'
		} else {
			resmsg += 'Предмет: ' + lessons[i][0] + '\n'
			resmsg += 'Викладач: ' + lessons[i][1] + '\n'
			resmsg += 'Аудиторія: ' + lessons[i][2] + '\n'
		}
	}
	bot.sendMessage(msg.chat.id, resmsg)	
})
