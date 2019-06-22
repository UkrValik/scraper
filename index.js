'use strict'

const TOKEN = '815359260:AAEs9sLQO8S6teExJXTg9zCUJbO6mdNr17M';
const TelegramBot = require('node-telegram-bot-api');
const Group = require('./src/Group.js')
const options = {
  webHook: {
    port: process.env.PORT
  }
};

const url_lessons = encodeURI('http://api.rozklad.org.ua/v2/groups/іп-71/lessons')
const url = 'https://rozklad-for-kpi.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);

let group = new Group()

bot.setWebHook(`${url}/bot${TOKEN}`);

bot.onText(/.*/, (msg) => {
	bot.sendMessage(msg.chat.id, "Im alive")
})

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
		resmsg += lessons[i][1] ? '    Викладач: ' + lessons[i][1] + '\n' : '    -\n'
		resmsg += lessons[i][2] ? '    Аудиторія: ' + lessons[i][2] + '\n' : '    -\n'
	}
	if (resmsg == "-\n-\n-\n") {
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
		resmsg += lessons[i][1] ? '    Викладач: ' + lessons[i][1] + '\n' : '    -\n'
		resmsg += lessons[i][2] ? '    Аудиторія: ' + lessons[i][2] + '\n' : '    -\n'
	}
	if (resmsg == "-\n-\n-\n") {
		resmsg = "Ви вказали невірний номер групи."
	}
	bot.sendMessage(msg.chat.id, resmsg)	
})

bot.onText(/тиждень/, async (msg, match) => {
	let lessons = await group.week(msg.chat.id)

	let resmsg = ""
	lessons.forEach(day => {
		resmsg += day[0].lesson[0]
		day.shift()
		let i = 0
		day.forEach(lesson => {
			i++
			resmsg += (i).toString() + ') '
			resmsg += lesson.lesson[0] ? 'Предмет: ' + lesson.lesson[0] + '\n' : '-\n'
			resmsg += lesson.lesson[1] ? '    Викладач: ' + lesson.lesson[1] + '\n' : '    -\n'
			resmsg += lesson.lesson[2] ? '    Аудиторія: ' + lesson.lesson[2] + '\n' : '    -\n'
		})
	})
	// let resmsg = "    Понеділок\n"
	// for (let i = 1; i < lessons[0].length; ++i) {
		// resmsg += (i).toString() + ') '
		// resmsg += lessons[0][i].lesson[0] ? 'Предмет: ' + lessons[0][i].lesson[0] + '\n' : '-\n'
		// resmsg += lessons[0][i].lesson[1] ? '    Викладач: ' + lessons[0][i].lesson[1] + '\n' : '    -\n'
		// resmsg += lessons[0][i].lesson[2] ? '    Аудиторія: ' + lessons[0][i].lesson[2] + '\n' : '    -\n'
	// }
	// resmsg += "       Вівторок\n"
	// for (let i = 1; i < lessons[1].length; ++i) {
	// 	resmsg += (i).toString() + ') '
	// 	resmsg += lessons[1][i].lesson[0] ? 'Предмет: ' + lessons[1][i].lesson[0] + '\n' : '-\n'
	// 	resmsg += lessons[1][i].lesson[1] ? '    Викладач: ' + lessons[1][i].lesson[1] + '\n' : '    -\n'
	// 	resmsg += lessons[1][i].lesson[2] ? '    Аудиторія: ' + lessons[1][i].lesson[2] + '\n' : '    -\n'
	// }
	// resmsg += "      Середа\n"
	// for (let i = 1; i < lessons[2].length; ++i) {
	// 	resmsg += (i).toString() + ') '
	// 	resmsg += lessons[2][i].lesson[0] ? 'Предмет: ' + lessons[2][i].lesson[0] + '\n' : '-\n'
	// 	resmsg += lessons[2][i].lesson[1] ? '    Викладач: ' + lessons[2][i].lesson[1] + '\n' : '    -\n'
	// 	resmsg += lessons[2][i].lesson[2] ? '    Аудиторія: ' + lessons[2][i].lesson[2] + '\n' : '    -\n'
	// }
	// resmsg += "    Четвер\n"
	// for (let i = 1; i < lessons[3].length; ++i) {
	// 	resmsg += (i).toString() + ') '
	// 	resmsg += lessons[3][i].lesson[0] ? 'Предмет: ' + lessons[3][i].lesson[0] + '\n' : '-\n'
	// 	resmsg += lessons[3][i].lesson[1] ? '    Викладач: ' + lessons[3][i].lesson[1] + '\n' : '    -\n'
	// 	resmsg += lessons[3][i].lesson[2] ? '    Аудиторія: ' + lessons[3][i].lesson[2] + '\n' : '    -\n'
	// }
	// resmsg += `       П'ятниця\n`
	// for (let i = 1; i < lessons[4].length; ++i) {
	// 	resmsg += (i).toString() + ') '
	// 	resmsg += lessons[4][i].lesson[0] ? 'Предмет: ' + lessons[4][i].lesson[0] + '\n' : '-\n'
	// 	resmsg += lessons[4][i].lesson[1] ? '    Викладач: ' + lessons[4][i].lesson[1] + '\n' : '    -\n'
	// 	resmsg += lessons[4][i].lesson[2] ? '    Аудиторія: ' + lessons[4][i].lesson[2] + '\n' : '    -\n'
	// }
	// resmsg += "      Субота\n"
	// for (let i = 1; i < lessons[5].length; ++i) {
	// 	resmsg += (i).toString() + ') '
	// 	resmsg += lessons[5][i].lesson[0] ? 'Предмет: ' + lessons[5][i].lesson[0] + '\n' : '-\n'
	// 	resmsg += lessons[5][i].lesson[1] ? '    Викладач: ' + lessons[5][i].lesson[1] + '\n' : '    -\n'
	// 	resmsg += lessons[5][i].lesson[2] ? '    Аудиторія: ' + lessons[5][i].lesson[2] + '\n' : '    -\n'
	// } 
	bot.sendMessage(msg.chat.id, resmsg)	
})
