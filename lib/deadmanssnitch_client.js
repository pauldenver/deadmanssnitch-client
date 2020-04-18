const axios = require('axios');
const has = require('lodash.has');
const isPlainObject = require('lodash.isplainobject');
const isObjectLike = require('lodash.isobjectlike');
const isEmpty = require('lodash.isempty');

// Import the error utils.
const { RequestError, StatusCodeError,
  isAxiosRequestError, isAxiosResponseError } = require('./utils/errors');
const httpStatus = require('./utils/status');
const { version } = require('../package.json');

// Base URL for the Dead Man's Snitch API.
const API_BASE_URL = 'https://api.deadmanssnitch.com';
// Base URL for the Dead Man's Snitch check-ins.
const CHECKIN_BASE_URL = 'https://nosnch.in';
// Client user agent string.
const USER_AGENT = `DeadMansSnitch-Client/${version}`;
// Default API version.
const API_VERSION = 1;

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
 * A library for interacting with Dead Man's Snitch check-ins
 * and the Dead Man's Snitch REST API.
 *
 * @class DeadMansSnitchClient
 */
class DeadMansSnitchClient {
  /**
   * Creates an instance of DeadMansSnitchClient.
   *
   * @param {Object} [options={}] Client options.
   * @memberof DeadMansSnitchClient
   */
  constructor(options = {}) {
    // Check the options.
    if (!isPlainObject(options)) {
      throw new TypeError('The client options must be an object');
    }

    this._options = options;
    this._apiKey = this._getApiKey(this._options) || undefined;

    this.timeout = this._options.timeout || 5000;
    this.apiBaseUrl = this._options.apiBaseUrl || API_BASE_URL;
    this.checkInBaseUrl = this._options.checkInBaseUrl || CHECKIN_BASE_URL;
    this.fullResponse = this._options.fullResponse || false;
    this.maxContentLength = this._options.maxContentLength || 10000;
    this.apiVersion = this._options.apiVersion || API_VERSION;

    // Create the Axios instances for the API and check-ins.
    this._apiInstance = this._getAxiosInstance(this.apiBaseUrl);
    this._checkInInstance = this._getAxiosInstance(this.checkInBaseUrl);
  }

  /**
   * Gets the Api Key from the provided options.
   *
   * @param {Object} options The client options.
   * @returns {String} The Api Key.
   * @memberof DeadMansSnitchClient
   */
  _getApiKey(options) {
    // Get the 'apiKey'.
    if (has(options, 'apiKey') || has(process, 'env.DMS_API_KEY')) {
      return (process.env.DMS_API_KEY || options.apiKey).trim();
    }
  }

  /**
   * Checks if the Api Key was set.
   *
   * @memberof DeadMansSnitchClient
   */
  _checkApiKey() {
    // Check the 'apiKey'.
    if (!this._apiKey) {
      throw new Error(`A Dead Man's Snitch Api Key is ` +
        'required for this action');
    }
  }

  /**
   * Gets the headers for a Dead Man's Snitch request.
   *
   * @param {String} baseURL The base URL for the request.
   * @returns {Object} Request headers.
   * @memberof DeadMansSnitchClient
   */
  _getRequestHeaders(baseURL) {
    // Get the headers for a check-in request.
    if (baseURL === this.checkInBaseUrl) {
      return {
        'Accept': 'text/plain; charset=utf-8',
        'Content-Type': 'text/plain; charset=utf-8',
        'User-Agent': USER_AGENT,
      };
    }

    // Get the headers for an API request.
    if (baseURL === this.apiBaseUrl && this._apiKey) {
      return {
        'Accept': 'application/json; charset=utf-8',
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': USER_AGENT,
      };
    }
  }

  /**
   * Creates an Axios instance.
   *
   * @param {String} baseURL The base URL for the request.
   * @returns {Axios} Axios instance.
   * @memberof DeadMansSnitchClient
   */
  _getAxiosInstance(baseURL) {
    let auth;
    // Get the headers.
    const headers = this._getRequestHeaders(baseURL);
    // Determine the response type.
    const responseType = (baseURL === this.checkInBaseUrl) ?
      'document' : 'json';

    if (baseURL === this.apiBaseUrl && this._apiKey) {
      auth = {
        username: this._apiKey,
        password: '',
      };
    }

    if (headers) {
      return axios.create({
        baseURL,
        headers,
        responseType,
        auth,
        timeout: this.timeout,
        responseEncoding: 'utf8',
        maxContentLength: this.maxContentLength,
      });
    }
  }

  /**
   * Gets the request options for a Healthchecks.io API request.
   *
   * @param {String} method HTTP method.
   * @param {String} path HTTP request path.
   * @param {Object} [qs=null] Query parameters.
   * @param {Object|Array} [body=null] Request body.
   * @returns {Object} Request options.
   * @memberof DeadMansSnitchClient
   */
  _getRequestOptions(method, path, qs = null, body = null) {
    // Set the request options.
    const options = {
      method,
      url: path,
      params: (qs && isPlainObject(qs)) ? qs : undefined,
    };

    // Add body value (if needed).
    if (/put|post|patch|delete/i.test(method) &&
      (body && (isPlainObject(body) || Array.isArray(body)))
    ) {
      options.data = body;
    }

    return options;
  }

  /**
   * Performs a Dead Man's Snitch check-in or API request.
   *
   * @param {String} requestType The request to perform.
   * @param {Object} options Request options.
   * @returns {Promise<Object|Array>} The response from the API request.
   * @memberof DeadMansSnitchClient
   */
  async _performRequest(requestType, options) {
    let response;

    // Check the options.
    if (!options || !isPlainObject(options) || isEmpty(options)) {
      throw new Error('A request options object must be provided');
    }

    // Get the response.
    if (requestType === 'check-in') {
      response = await this._checkInInstance.request(options);
    } else if (requestType === 'api') {
      response = await this._apiInstance.request(options);
    } else {
      throw new Error('Received an unknown request type. Valid request types' +
        ` are 'check-in' or 'api'`);
    }

    // Should the full response be returned.
    if (this.fullResponse) {
      // Get the status message.
      const statusMessage = response.statusText || httpStatus[response.status];

      return {
        statusCode: response.status,
        statusMessage,
        headers: response.headers,
        data: response.data,
      };
    }

    return response.data;
  }

  /**
   * Creates a custom error from an Axios error.
   *
   * @param {Error} err The 'axios' Error.
   * @returns {Error} The custom error.
   * @memberof DeadMansSnitchClient
   */
  _handleError(err) {
    // Check for Axios errors.
    if (isAxiosRequestError(err)) {
      return new RequestError(err);
    } else if (isAxiosResponseError(err)) {
      return new StatusCodeError(err);
    }

    return err;
  }

  /**
   * Processes/executes the given callback function.
   *
   * @param {Error} err Error object.
   * @param {String|Object|Array} resp Response data.
   * @param {Function} callback Callback function.
   * @returns {String|Object|Array} Response data.
   * @memberof DeadMansSnitchClient
   */
  _processCallback(err, resp, callback) {
    if (callback) {
      // Execute the callback.
      callback(err, resp);
    } else {
      if (resp !== undefined && !err) {
        return resp;
      } else {
        throw err;
      }
    }
  }

  /**
   * Performs a check-in request for a snitch.
   *
   * @param {String} token The snitch token.
   * @param {String|Object|Array} message The snitch message.
   * @param {Function} callback Callback function.
   * @returns {Promise<Object|String>} The check-in response.
   * @memberof DeadMansSnitchClient
   */
  async checkIn(token, message, callback) {
    const params = {};

    // Determine if there is a message included.
    if (message && isObjectLike(message)) {
      // Turn any object or array into a string if provided.
      params.m = JSON.stringify(message);
    } else if (message && typeof message === 'string') {
      params.m = message;
    }

    try {
      // Get the request options.
      const options = this._getRequestOptions('GET', `/${token}`, params);
      // Peform the request.
      const resp = await this._performRequest('check-in', options);
      // Process the callback.
      return this._processCallback(undefined, resp, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Gets a list of snitches.
   *
   * @param {Array<String>} [tags=[]] Filter tags.
   * @param {Function} callback Callback function.
   * @returns {Promise<Array<Object>>} List of snitches.
   * @memberof DeadMansSnitchClient
   */
  async getSnitches(tags = [], callback) {
    let params;

    // Check for the Api key.
    this._checkApiKey();

    // Get the tags.
    if (tags && Array.isArray(tags)) {
      if (tags.length > 0) {
        const hasTags = tags.every((value) => {
          return typeof value === 'string';
        });

        if (hasTags) {
          params = {
            tags: (tags.length > 1) ? tags.join(',') : tags[0],
          };
        }
      }
    }

    try {
      // Get the request options.
      const options = this._getRequestOptions('GET',
        `/v${this.apiVersion}/snitches`, params);
      // Peform the request.
      const resp = await this._performRequest('api', options);
      // Process the callback.
      return this._processCallback(undefined, resp, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Filters snitches by status.
   *
   * @param {String} status Snitch status value.
   * @param {Function} callback Callback function.
   * @returns {Promise<Array<Object>>} List of filtered snitches.
   * @memberof DeadMansSnitchClient
   */
  async filterByStatus(status, callback) {
    // Check for the Api key.
    this._checkApiKey();

    // Check the status value.
    if (status && typeof status === 'string') {
      if (!SNITCH_STATUSES.includes(status)) {
        throw new Error('Received an invalid snitch status value');
      }
    } else {
      throw new Error(`The 'status' value must be a string`);
    }

    try {
      // Get the snitches.
      const resp = await this.getSnitches();

      // Filter by the status.
      const snitches = resp.reduce((filtered, snitch) => {
        // Check the status.
        if (snitch.status === status) {
          // Add the snitch.
          filtered.push(snitch);
        }

        return filtered;
      }, []);

      // Process the callback.
      return this._processCallback(undefined, snitches, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Filters snitches by interval.
   *
   * @param {String} interval Snitch interval value.
   * @param {Function} callback Callback function.
   * @returns {Promise<Array<Object>>} List of filtered snitches.
   * @memberof DeadMansSnitchClient
   */
  async filterByInterval(interval, callback) {
    // Check for the Api key.
    this._checkApiKey();

    // Check the interval value.
    if (interval && typeof interval === 'string') {
      if (!SNITCH_INTERVALS.includes(interval)) {
        throw new Error('Received an invalid snitch interval value');
      }
    } else {
      throw new Error(`The 'interval' value must be a string`);
    }

    try {
      // Get the snitches.
      const resp = await this.getSnitches();

      // Filter by the interval.
      const snitches = resp.reduce((filtered, snitch) => {
        // Check the interval.
        if (snitch.interval === interval) {
          // Add the snitch.
          filtered.push(snitch);
        }

        return filtered;
      }, []);

      // Process the callback.
      return this._processCallback(undefined, snitches, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Filters snitches by alert type.
   *
   * @param {String} alertType Snitch alert type value.
   * @param {Function} callback Callback function.
   * @returns {Promise<Array<Object>>} List of filtered snitches.
   * @memberof DeadMansSnitchClient
   */
  async filterByAlertType(alertType, callback) {
    // Check for the Api key.
    this._checkApiKey();

    // Check the alert type value.
    if (alertType && typeof alertType === 'string') {
      if (!SNITCH_ALERT_TYPES.includes(alertType)) {
        throw new Error('Received an invalid snitch alert type value');
      }
    } else {
      throw new Error(`The 'alertType' value must be a string`);
    }

    try {
      // Get the snitches.
      const resp = await this.getSnitches();

      // Filter by the alert type.
      const snitches = resp.reduce((filtered, snitch) => {
        // Check the alert type.
        if (snitch.alert_type === alertType) {
          // Add the snitch.
          filtered.push(snitch);
        }

        return filtered;
      }, []);

      // Process the callback.
      return this._processCallback(undefined, snitches, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Get the information for a snitch.
   *
   * @param {String} token The snitch token.
   * @param {Function} callback Callback function.
   * @returns {Promise<Object>} Snitch information.
   * @memberof DeadMansSnitchClient
   */
  async getSnitch(token, callback) {
    // Check for the Api key.
    this._checkApiKey();

    try {
      // Get the request options.
      const options = this._getRequestOptions('GET',
        `/v${this.apiVersion}/snitches/${token}`);
      // Peform the request.
      const resp = await this._performRequest('api', options);
      // Process the callback.
      return this._processCallback(undefined, resp, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Creates a new snitch.
   *
   * @param {Object} [snitchInfo={}] Snitch information.
   * @param {Function} callback Callback function.
   * @returns {Promise<Object>} Information for the snitch.
   * @memberof DeadMansSnitchClient
   */
  async createSnitch(snitchInfo = {}, callback) {
    // Check for the Api key.
    this._checkApiKey();

    try {
      // Get the request options.
      const options = this._getRequestOptions('POST',
        `/v${this.apiVersion}/snitches`, null, snitchInfo);
      // Peform the request.
      const resp = await this._performRequest('api', options);
      // Process the callback.
      return this._processCallback(undefined, resp, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Updates a snitch.
   *
   * @param {String} token The snitch token.
   * @param {Object} [snitchInfo={}] Snitch information.
   * @param {Function} callback Callback function.
   * @returns {Promise<Object>} Snitch information.
   * @memberof DeadMansSnitchClient
   */
  async updateSnitch(token, snitchInfo = {}, callback) {
    // Check for the Api key.
    this._checkApiKey();

    try {
      // Get the request options.
      const options = this._getRequestOptions('PATCH',
        `/v${this.apiVersion}/snitches/${token}`, null, snitchInfo);
      // Peform the request.
      const resp = await this._performRequest('api', options);
      // Process the callback.
      return this._processCallback(undefined, resp, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Adds tags to a snitch.
   *
   * @param {String} token The snitch token.
   * @param {Array<String>} [tags=[]] Snitch tags.
   * @param {Function} callback Callback function.
   * @returns {Promise<Array<String>>} The current snitch tags.
   * @memberof DeadMansSnitchClient
   */
  async addTags(token, tags = [], callback) {
    // Check for the Api key.
    this._checkApiKey();

    try {
      // Get the request options.
      const options = this._getRequestOptions('POST',
        `/v${this.apiVersion}/snitches/${token}/tags`,
        null, tags);
      // Peform the request.
      const resp = await this._performRequest('api', options);
      // Process the callback.
      return this._processCallback(undefined, resp, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Remove a tag from a snitch.
   *
   * @param {String} token The snitch token.
   * @param {String} tagName The tag to remove.
   * @param {Function} callback Callback function.
   * @returns {Promise<Array<String>>} The current snitch tags.
   * @memberof DeadMansSnitchClient
   */
  async removeTag(token, tagName, callback) {
    // Check for the Api key.
    this._checkApiKey();

    try {
      // Get the request options.
      const options = this._getRequestOptions('DELETE',
        `/v${this.apiVersion}/snitches/${token}/tags/${tagName}`);
      // Peform the request.
      const resp = await this._performRequest('api', options);
      // Process the callback.
      return this._processCallback(undefined, resp, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Changes/replaces the tags of a snitch.
   *
   * @param {String} token The snitch token.
   * @param {Array<String>} [tags=[]] Snitch tags.
   * @param {Function} callback Callback function.
   * @returns {Promise<Object>} Snitch information.
   * @memberof DeadMansSnitchClient
   */
  async changeTags(token, tags = [], callback) {
    // Check for the Api key.
    this._checkApiKey();

    // Get the tags.
    if (tags && Array.isArray(tags)) {
      // Check the tag length.
      if (tags.length === 0) {
        throw new Error('At least one tag must be provided');
      }
    } else {
      throw new Error(`The 'tags' value must be an array with at least ` +
        'one string');
    }

    try {
      // Update the snitch tags.
      const resp = await this.updateSnitch(token, { tags });
      // Process the callback.
      return this._processCallback(undefined, resp, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Removes all of the tags from a snitch.
   *
   * @param {String} token The snitch token.
   * @param {Function} callback Callback function.
   * @returns {Promise<Object>} Snitch information.
   * @memberof DeadMansSnitchClient
   */
  async removeAllTags(token, callback) {
    // Check for the Api key.
    this._checkApiKey();

    try {
      // Remove all of the snitch tags.
      const resp = await this.updateSnitch(token, { tags: [] });
      // Process the callback.
      return this._processCallback(undefined, resp, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Pauses an active snitch.
   *
   * @param {String} token The snitch token.
   * @param {Function} callback Callback function.
   * @returns {Promise<String>} An empty string.
   * @memberof DeadMansSnitchClient
   */
  async pauseSnitch(token, callback) {
    // Check for the Api key.
    this._checkApiKey();

    try {
      // Get the request options.
      const options = this._getRequestOptions('POST',
        `/v${this.apiVersion}/snitches/${token}/pause`);
      // Peform the request.
      const resp = await this._performRequest('api', options);
      // Process the callback.
      return this._processCallback(undefined, resp, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }

  /**
   * Deletes a snitch.
   *
   * @param {String} token The snitch token.
   * @param {Function} callback Callback function.
   * @returns {Promise<String>} An empty string.
   * @memberof DeadMansSnitchClient
   */
  async deleteSnitch(token, callback) {
    // Check for the Api key.
    this._checkApiKey();

    try {
      // Get the request options.
      const options = this._getRequestOptions('DELETE',
        `/v${this.apiVersion}/snitches/${token}`);
      // Peform the request.
      const resp = await this._performRequest('api', options);
      // Process the callback.
      return this._processCallback(undefined, resp, callback);
    } catch (err) {
      // Get the custom error.
      const error = this._handleError(err);
      // Process the callback.
      this._processCallback(error, undefined, callback);
    }
  }
}

module.exports = DeadMansSnitchClient;
