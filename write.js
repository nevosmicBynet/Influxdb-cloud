require('dotenv').config(); // Load environment variables from .env file

'use strict';

const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const fs = require('fs');
const csv = require('csv-parser');

const influxDB = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});

const writeApi = influxDB.getWriteApi(
  process.env.INFLUX_ORG,
  process.env.INFLUX_DATABASE
);

writeApi.useDefaultTags({ region: 'west' });

const dataPoints = [];

fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (data) => {
    const { unit_id, value_curr, value_max, value_min, value_avg, date_time_local } = data;
    console.log('Parsed Data:', data);

    // Ensure the `date_time_local` is in a format that can be parsed into a Date object
    const parsedDate = new Date(date_time_local);

    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date:', date_time_local);
      return;
    }

    // Create a Point for each row and add it to the dataPoints array
    const point = new Point('my_measurement')
      .tag('unit_id', unit_id)
      .floatField('value_curr', parseFloat(value_curr))
      .floatField('value_max', parseFloat(value_max))
      .floatField('value_min', parseFloat(value_min))
      .floatField('value_avg', parseFloat(value_avg))
      .timestamp(parsedDate);

    console.log(parsedDate);
    dataPoints.push(point);
  })
  .on('end', () => {
    // Write all data points to InfluxDB
    writeApi.writePoints(dataPoints);

    // Close the write API when done
    writeApi.close()
      .then(() => {
        console.log('Write API closed.');
      })
      .catch((error) => {
        console.error('Error while closing the write API:', error);
      });
  });
