'use strict'

const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '866032024:AAFGQBML2lMv0o5Jb5HoNKj2l5KIgbfj4qA'

const options = {
    webHook: {
        port: process.env.PORT
    }
};

const URL = 'https://rozklad-for-kpi.herokuapp.com/'

const bot = new TelegramBot(TOKEN, options)

bot.setWebhook(`${URL}/bot${TOKEN}`)

bot.onText('*', (msg, match) => {
	bot.sendMessage(msg.chat.id, 'Hello')
	bot.sendMessage(msg.chat.id, match)
})

bot.on('message', function onMessage(msg) {
  bot.sendMessage(msg.chat.id, 'I am alive on Heroku!');
});
