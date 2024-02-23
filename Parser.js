
const fs = require('fs');
const csv = require('csv-parser');

const data = [];

fs.createReadStream('companyData.csv')
  .pipe(csv())
  .on('data', (row) => {
    data.push(row);
  })
  .on('end', () => {
    fs.writeFile('output.txt', JSON.stringify(data, null, 2), (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
  });

