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
	let resmsg = `Ваша група ${groupName}`
	bot.sendMessage(msg.chat.id, resmsg)
})

bot.onText(/сьогодні/, async (msg, match) => {
	let lessons = await group.today(msg.chat.id)
	let resmsg = ""
	for (let i = 0; i < lessons.length; ++i) {
		resmsg += (i + 1).toString() + ') '
		resmsg += lessons[i][0] ? 'Предмет: ' + lessons[i][0] + '\n' : '-\n'
		resmsg += lessons[i][1] ? '   Викладач: ' + lessons[i][1] + '\n' : '   -\n'
		resmsg += lessons[i][2] ? '   Аудиторія: ' + lessons[i][2] + '\n' : '   -\n'
	}
	if (resmsg == "") {
		resmsg = "Ви вказали невірний номер групи."
	}
	bot.sendMessage(msg.chat.id, resmsg)
})

bot.onText(/завтра/, async (msg, match) => {
	let lessons = await group.tomorrow(msg.chat.id)
	let resmsg = ""
	for (let i = 0; i < lessons.length; ++i) {
		resmsg += (i + 1).toString() + ') '
		resmsg += lessons[i][0] ? 'Предмет: ' + lessons[i][0] + '\n' : '-\n'
		resmsg += lessons[i][1] ? '   Викладач: ' + lessons[i][1] + '\n' : '   -\n'
		resmsg += lessons[i][2] ? '   Аудиторія: ' + lessons[i][2] + '\n' : '   -\n'
	}
	if (resmsg == "") {
		resmsg = "Ви вказали невірний номер групи."
	}
	bot.sendMessage(msg.chat.id, resmsg)	
})

bot.onText(/тиждень/, async (msg, match) => {
	let lessons = await group.week(msg.chat.id)
	let resmsg = "     Понеділок\n"
	for (let i = 0; i < lessons[0].lesson.length; ++i) {
		resmsg += (i + 1).toString() + ') '
		resmsg += lessons[0].lesson[i][0] ? '  Предмет: ' + lessons[0].lesson[i][0] + '\n' : '-\n'
		resmsg += lessons[0].lesson[i][1] ? '  Викладач: ' + lessons[0].lesson[i][1] + '\n' : '-\n'
		resmsg += lessons[0].lesson[i][2] ? '  Аудиторія: ' + lessons[0].lesson[i][2] + '\n' : '-\n'
	}
	resmsg = JSON.stringify(lessons)
	bot.sendMessage(msg.chat.id, resmsg)	
})
