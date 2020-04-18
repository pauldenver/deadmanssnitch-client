const randomSentence = require('random-sentence');

// Status values for snitches.
const SNITCH_STATUSES = [
  'pending',
  'healthy',
  'failed',
  'errored',
  'paused',
];

// Interval values for snitches.
const SNITCH_INTERVALS = [
  '15_minute',
  '30_minute',
  'hourly',
  'daily',
  'weekly',
  'monthly',
];

// Alert type values for snitches.
const SNITCH_ALERT_TYPES = [ 'basic', 'smart' ];

/**
 * Generates a random snitch token.
 *
 * @returns {String} The snitch token.
 */
function getMockToken() {
  return Math.random().toString(36).substr(2, 5) +
    Math.random().toString(36).substr(2, 5);
}

/**
 * Gets an ISO string from a random date generated
 * from a starting date and end date.
 *
 * @param {Date} start Start date.
 * @param {Date} end End date.
 * @returns {String} Date string
 */
function getRandomDate(start, end) {
  const randomDate = new Date(start.getTime() + Math.random() *
    (end.getTime() - start.getTime()));
  return randomDate.toISOString();
}

/**
 * Generates a random number.
 *
 * @param {Number} total Max number.
 * @returns {Number} Random number.
 */
function getRandomNumber(total) {
  return Math.floor(Math.random() * total);
}

/**
 * Creates an array of mock snitch values.
 *
 * @param {Number} total Total number of snitches.
 * @param {Array<String>} [tags=[]] Snitch tags.
 * @param {String} status Snitch status.
 * @param {String} interval Snitch interval.
 * @param {String} alertType Snitch alert type.
 * @returns {Array<Object>} Mock snitches.
 */
function getMockSnitches(total, tags = [], status, interval, alertType) {
  const snitches = [];

  for (let i = 0; i < total; i++ ) {
    const token = getMockToken();
    status = (status ||
      SNITCH_STATUSES[getRandomNumber(SNITCH_STATUSES.length)]);
    interval = (interval ||
      SNITCH_INTERVALS[getRandomNumber(SNITCH_INTERVALS.length)]);
    alertType = (alertType ||
      SNITCH_ALERT_TYPES[getRandomNumber(SNITCH_ALERT_TYPES.length)]);

    snitches.push({
      token,
      href: `/v1/snitches/${token}`,
      name: randomSentence({ min: 3, max: 8 }),
      tags,
      notes: randomSentence({ min: 8, max: 12 }),
      status,
      created_at: getRandomDate(new Date(2019, 0, 1), new Date(2020, 0, 1)),
      check_in_url: `https://nosnch.in/${token}`,
      checked_in_at: getRandomDate(new Date(2020, 0, 1), new Date()),
      type: {
        interval,
      },
      interval,
      alert_type: alertType,
    });
  }

  return snitches;
}

module.exports = {
  getMockToken,
  getMockSnitches,
};