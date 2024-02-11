const cheerio = require("cheerio");
const axios = require("axios");

const url = "https://www.slickcharts.com/sp500";

async function getIndex(){
	try{


		const response = await axios.get(url);
		const $=cheerio.load(response.data);
		const index = $("h1").text();

		console.log(index);

	}

	catch(error){
		console.error(error);
	}




}

getIndex();
