'use strict'

const jsdom = require('jsdom')
const qs = require('querystring')
const fetch = require('node-fetch')

const { JSDOM } = jsdom

function Scraper(url, options) {
	this.url = url
	this.options = options
	this.renderDOM = async function() {
		this.dom = await JSDOM.fromURL(this.url, this.options)
		this.document = this.dom.window.document
	}
	this.setURL = function(_url) {
		this.url = _url
	}
	this.sendForm = async function(form, additionalParameters) {
		const formParameters = Array.from(form.elements)
			.reduce((args, element) => {
				args[element.name] = element.value
				return args
			}, {})
		const allParameters = Object.assign(formParameters, additionalParameters)
		const requestParameters = qs.stringify(allParameters)
		const response = await fetch(form.action, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: requestParameters
		})
		return response
	}
	this.getWeekSchedule = function(table) {
		const tableRows = Array.from(table.childNodes)
		tableRows.pop()
		const weekSchedule = []
		tableRows.forEach(row => {
			const scheduleRow = Array.from(row.childNodes)
			weekSchedule.push(scheduleRow)
		})
		weekSchedule.forEach(row => (row.shift(), row.pop()))
		return weekSchedule
	}
	this.scrape = function() {
		let tables = this.select('tbody')
		return Array.from(tables, this.getWeekSchedule)
	}
	this.select = function(query) {
		return this.document.querySelectorAll(query)
	}
}

module.exports = Scraper
