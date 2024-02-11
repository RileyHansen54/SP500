

const cheerio = require("cheerio");
const axios = require("axios");
const ObjectsToCsv = require("objects-to-csv");

companyData = [];

(async function html_scraper() { 
	const response = await axios('https://www.slickcharts.com/sp500');
	const html = await response.data; 
	const $ = cheerio.load(html);
	const allRows = $('table.table.table-hover.table-borderless.table-sm > tbody > tr').get();

	//allRows.each((index, element) => {
	for (const element of allRows) {
	const tds = $(element).find('td');
	const name = $(tds[1]).text();
	const symbol = $(tds[2]).text();
	const symbolLink = $(tds[2]).find('a').attr('href');
  	const baseUrl = 'https://www.slickcharts.com'; // Define the base URL
	const portPre = $(tds[3]).text();
	const price = $(tds[4]).text();
	const chg = $(tds[5]).text();
	const Chgp = $(tds[6]).text();

	let additionalDataArray = [];
	if (symbolLink) {
		const Link = baseUrl + symbolLink;
		//console.log("Link appears for:", name, "with link:", Link);

		additionalDataArray = await html_scraper2(Link);


	}else{
		console.log("No link found for:", name, "- Stopping iteration.");
  	 	
	}
		
		companyData.push({
			'Company': name,
			'ticker': symbol,
			'Portfolio percent': portPre,
			'Price': price,
			'Change': chg,
			'Change percentage': Chgp,
			'Volume': additionalDataArray[0],
			'MarketCap': additionalDataArray[1], 
			'P/ETail': additionalDataArray[2],
			'P/Efuture': additionalDataArray[3],
			'EarningsPerShareTail': additionalDataArray[4],
			'EarningsPerShareFuture': additionalDataArray[5],
			'DividendYield': additionalDataArray[6],
			'Division': additionalDataArray[7],
			
			

			});
	}
	
	console.log('Saving data to CSV');
	const csv = new ObjectsToCsv(companyData);
 	await csv.toDisk('./companyData.csv')
 	console.log('Saved to CSV')
})();


	async function html_scraper2(Link) { 
			try{
			const response2 = await axios(Link);
			const html2 = await response2.data; 
			const $$ = cheerio.load(html2);
			//console.log("Fetched data from:", Link);

			const allRows2 = $$('table.table-sm.table-borderless > tbody > tr');
		

       			
				const dataValues = [
						$$(allRows2).find('td').eq(17).text().trim(), // Volume
						$$(allRows2).find('td').eq(21).text().trim(), // MarketCap
						$$(allRows2).find('td').eq(3).text().trim(),  // PET
						$$(allRows2).find('td').eq(7).text().trim(),  // PEF
						$$(allRows2).find('td').eq(11).text().trim(), // EPST
						$$(allRows2).find('td').eq(15).text().trim(), // EPSF
						$$(allRows2).find('td').eq(19).text().trim(), // DivY
						$$(allRows2).find('td').eq(23).text().trim()  // Div
				];
				
				console.log("MarketCap:", dataValues[1]);
				
				return dataValues;
			}catch (error) {
        console.error("An error occurred:", error);
        //return []; // Return an empty object in case of error
    }
}
