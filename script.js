require('chromedriver');
let wd = require('selenium-webdriver');
const fs = require('fs');

let finalData = [];
let totalProjects = 0;
let projectsCovered = 0;

async function getProjectUrls(url, i) {
	let browser = new wd.Builder().forBrowser('chrome').build();
	await browser.get(url);
	let projectBoxes = await browser.findElements(wd.By.css('a.text-bold'));
	totalProjects+=projectBoxes.length > 8 ? 8 : projectBoxes.length;

	finalData[i]['projects'] = [];
	for (let j in projectBoxes) {

		if (j == 8) {
			break;
		}
		finalData[i].projects.push({projectURL: await projectBoxes[j].getAttribute('href')});
	}

	let projects = finalData[i].projects;
	for (let j in projects) {
		getIssues(projects[j].projectURL, i, j);
	}
	browser.close();
}

async function getIssues(url, i, j) {
	let browser = new wd.Builder().forBrowser('chrome').build();

	finalData[i].projects[j]['issues'] = [];
	await browser.get(url + '/issues');
	let currURL = await browser.getCurrentUrl();
	let issueBoxes = await browser.findElements(wd.By.css('.Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title'));
	if (currURL == url + '/issues' && issueBoxes.length!=0) {

		for (let k in issueBoxes) {
			if (k == 8) {
				break;
			}
			let heading = await issueBoxes[k].getAttribute('innerText');
			let url = await issueBoxes[k].getAttribute('href');
			
			finalData[i].projects[j].issues.push({heading: heading, url: url});
		}
		
	}
	
	projectsCovered += 1;
	if (projectsCovered == totalProjects) {
		fs.writeFileSync('finalData.json', JSON.stringify(finalData));
	}
	browser.close();
}

let browser = new wd.Builder().forBrowser('chrome').build();
async function main() {
	await browser.get('https://www.github.com/topics');
	await browser.wait(wd.until.elementLocated(wd.By.css('.no-underline.d-flex.flex-column.flex-justify-center')));

	let topicBoxes = await browser.findElements(wd.By.css('.no-underline.d-flex.flex-column.flex-justify-center'));

	for (let i in topicBoxes) {
		finalData.push({topicUrl: await topicBoxes[i].getAttribute('href')});
	}

	for (let i in finalData) {
		getProjectUrls(finalData[i].topicUrl, i);
	}

	browser.close();
}

main();