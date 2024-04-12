/** @type {import('@grafana/toolkit/src/config/jest.plugin.config').Config} */

// force timezone to UTC to allow tests to work regardless of local timezone
// generally used by snapshots, but can affect specific tests
process.env.TZ = 'UTC';


const config = {
  verbose: true,
};

module.exports = config;
