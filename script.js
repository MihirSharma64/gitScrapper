require('chromedriver');

let wd = require('selenium-webdriver');
let urls = [];
let finalData = [];

async function pages(url,i){
   let browser = 
}

async function main() {
	let browser = new wd.Builder().forBrowser('chrome').build();
	await browser.get('https://www.github.com/topics');

	let lists = await browser.findElements(wd.By.css('.col-12.col-sm-6.col-md-4.mb-4'));

	for (i in lists) {
		let anchortag = await lists[i].findElement(wd.By.css('div a'));
      let topicName = await anchortag.findElement(wd.By.css('p')).getAttribute('innerText');
		let url = await anchortag.getAttribute('href');
		urls.push(url);
      finalData.push({"topicName" : topicName});
	}

   console.log(finalData);
   
   for(let i in urls){
      pages(urls[i],i);
   }

   browser.close();
}

main();
