require('dotenv').config(); // Load environment variables from .env file

'use strict'
/** @module write
 * Writes a data point to InfluxDB using the JavaScript client library with Node.js.
**/

//import {InfluxDB, Point} from '@influxdata/influxdb-client'
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

/**
 * Instantiate the InfluxDB client
 * with a configuration object.
 **/
const influxDB = new InfluxDB({url: process.env.INFLUX_URL,
    token: process.env.INFLUX_TOKEN})

/**
 * Create a write client from the getWriteApi method.
 * Provide your org and database.
 **/
const writeApi = influxDB.getWriteApi(process.env.INFLUX_ORG,
    process.env.INFLUX_DATABASE)

/**
 * Apply default tags to all points.
 **/
writeApi.useDefaultTags({region: 'west'})

/**
 * Create a point and write it to the buffer.
 **/
// Create the first point
const point1 = new Point('test_measurement')
  .tag('unit_id', 'ckx4h0gtk4074720xr1kgblvnnh')
  .floatField('value_curr', 17.05)
  .floatField('value_max', 17.05)
  .floatField('value_min', 17.05)
  .floatField('value_avg', 17.05)
  .timestamp(new Date('2023-11-07 18:14:25').getTime() * 1000000); // Convert timestamp to nanoseconds

// Create the second point
const point2 = new Point('test_measurement')
  .tag('unit_id', 'ckx4h0gtk4074720xr1kgblvnnh')
  .floatField('value_curr', 0.51)
  .floatField('value_max', 0.51)
  .floatField('value_min', 0.51)
  .floatField('value_avg', 0.51)
  .timestamp(new Date('2023-11-08 18:14:25').getTime() * 1000000); // Convert timestamp to nanoseconds

writeApi.writePoint(point1)
writeApi.writePoint(point2)

/**
 * Flush pending writes and close writeApi.
 **/
writeApi.close().then(() => {
    console.log('WRITE FINISHED')
})
