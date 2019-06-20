'use strict'

const getSchedule = require('./schedule.js')

function Group() {
	this.groups = []
	this.addGroup = function(chatID, groupName) {
		if (this.groups.includes({
			"chatID": chatID,
			"groupName": groupName
		})) {
			for (let i = 0; i < this.groups.length; ++i) {
				if (this.groups[i].chatID === chatID) {
					this.groups[i].groupName = groupName
				}
			}
		} else {
			this.groups.push({
				"chatID": chatID,
				"groupName": groupName
			})
		}
	}
	this.getGroupName = function(chatID) {
		let groupName = ""
		this.groups.forEach(element => {
			if (element.chatID === chatID) {
				groupName = element.groupName
			}
		})
		return groupName
	}
	this.today = async function(chatID) {
		let groupName = this.getGroupName(chatID)
		let schedule = await getSchedule(groupName)
		let ans = []
		let f = true
		schedule.firstWeek.forEach(day => {
			day.forEach(element => {
				if (element.today && f) {
					ans.push(day)
					f = false
				}
			})
		})
		schedule.secondWeek.forEach(day => {
			day.forEach(element => {
				if (element.today && f) {
					ans.push(day)
					f = false
				}
			})
		})
		let lessons = []
		ans.forEach(element => element.forEach(lesson => lessons.push(lesson.lesson)))
		lessons.shift()
		return lessons
	}
	this.tomorrow = async function(chatID) {
		let groupName = this.getGroupName(chatID)
		let schedule = await getSchedule(groupName)
		let ans = []
		for (let i = 0; i < schedule.firstWeek.length; ++i) {
			let day = schedule.firstWeek[i]
			if (day[0].today || day[5].today) {
				if (i < schedule.firstWeek.length - 1) {
					ans.push(schedule.firstWeek[i + 1])
				} else {
					ans.push(schedule.secondWeek[0])
				}
			}
		}
		for (let i = 0; i < schedule.secondWeek.length; ++i) {
			let day = schedule.secondWeek[i]
			if (day[0].today || day[5].today) {
				if (i < schedule.secondWeek.length - 1) {
					ans.push(schedule.secondWeek[i + 1])
				} else {
					ans.push(schedule.firstWeek[0])
				}
			}
		}
		let lessons = []
		ans.forEach(element => element.forEach(lesson => lessons.push(lesson.lesson)))
		lessons.shift()
		return lessons	
	}
	this.week = async function(chatID) {
		let groupName = this.getGroupName(chatID)
		let schedule = await getSchedule(groupName)
		let ans = []
		let f = true
		schedule.firstWeek.forEach(day => {
			day.forEach(element => {
				if (element.today && f) {
					ans.push(schedule.firstWeek)
					f = false
				}
			})
		})
		schedule.secondWeek.forEach(day => {
			day.forEach(element => {
				if (element.today && f) {
					ans.push(schedule.secondWeek)
					f = false
				}
			})
		})
		return ans
	}
}

// const dosmth = async () => {
// 	let group = new Group()
// 	group.addGroup(1234, 'ІП-71')
// 	let roz = await group.week(1234)
// 	console.log(roz)
// }

// dosmth()

module.exports = Group