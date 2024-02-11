

const cheerio = require("cheerio");
const axios = require("axios");
const ObjectsToCsv = require("objects-to-csv");

companyData = [];

(async function html_scraper() { 
	const response = await axios('https://www.slickcharts.com/sp500');
	const html = await response.data; 
	const $ = cheerio.load(html);
	const allRows = $('table.table.table-hover.table-borderless.table-sm > tbody > tr');

	allRows.each((index, element) => {
	const tds = $(element).find('td');
	const name = $(tds[1]).text();
	const symbol = $(tds[2]).text();
	const portPre = $(tds[3]).text();
	const price = $(tds[4]).text();
	const chg = $(tds[5]).text();
	const Chgp = $(tds[6]).text();



		companyData.push({
		'Company': name,
		'ticker': symbol,
		'Portfolio percent': portPre,
		'Age': price,
		'Change': chg,
		'Change percentage': Chgp,


		})
		
	})
	
	console.log('Saving data to CSV');
	const csv = new ObjectsToCsv(companyData);
 	await csv.toDisk('./companyData.csv')
 	console.log('Saved to CSV')
})();



