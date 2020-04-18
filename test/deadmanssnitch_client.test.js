const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const rewire = require('rewire');
const nock = require('nock');
const DeadMansSnitchClient = require('../lib');
const { getMockSnitches, getMockToken } = require('./helpers');

// Use 'chai-as-promised'.
chai.use(chaiAsPromised);
// Get 'expect'.
const expect = chai.expect;

const clientRewire = rewire('../lib/deadmanssnitch_client');
const apiBaseUrl = clientRewire.__get__('API_BASE_URL');
const checkInBaseUrl = clientRewire.__get__('CHECKIN_BASE_URL');
const userAgent = clientRewire.__get__('USER_AGENT');

describe(`Dead Man's Snitch Client Tests`, () => {
  let client;

  const clientOptions = {
    apiKey: 'vX7nv5RtIIPfMU9U1p4G8k'
  };

  beforeEach(() => {
    client = new DeadMansSnitchClient(clientOptions);
  });
  
  context(`'DeadMansSnitchClient' Class instance`, () => {
    it(`should be an instance of 'DeadMansSnitchClient'`, () => {
      expect(client).to.be.an('object');
      expect(client).to.be.an.instanceof(DeadMansSnitchClient);
    });

    it(`should have a public 'constructor' method`, () => {
      expect(client.constructor).to.be.an('function');
      expect(client.constructor).to.be.an.instanceof(Function);
    });

    it(`should have a private '_getApiKey' method`, () => {
      expect(client._getApiKey).to.be.an('function');
      expect(client._getApiKey).to.be.an.instanceof(Function);
    });

    it(`should have a private '_checkApiKey' method`, () => {
      expect(client._checkApiKey).to.be.an('function');
      expect(client._checkApiKey).to.be.an.instanceof(Function);
    });

    it(`should have a private '_getRequestHeaders' method`, () => {
      expect(client._getRequestHeaders).to.be.an('function');
      expect(client._getRequestHeaders).to.be.an.instanceof(Function);
    });

    it(`should have a private '_getAxiosInstance' method`, () => {
      expect(client._getAxiosInstance).to.be.an('function');
      expect(client._getAxiosInstance).to.be.an.instanceof(Function);
    });

    it(`should have a private '_getRequestOptions' method`, () => {
      expect(client._getRequestOptions).to.be.an('function');
      expect(client._getRequestOptions).to.be.an.instanceof(Function);
    });

    it(`should have a private '_performRequest' method`, () => {
      expect(client._performRequest).to.be.an('function');
      expect(client._performRequest).to.be.an.instanceof(Function);
    });

    it(`should have a private '_handleError' method`, () => {
      expect(client._handleError).to.be.an('function');
      expect(client._handleError).to.be.an.instanceof(Function);
    });

    it(`should have a private '_processCallback' method`, () => {
      expect(client._processCallback).to.be.an('function');
      expect(client._processCallback).to.be.an.instanceof(Function);
    });

    it(`should have a public 'checkIn' method`, () => {
      expect(client.checkIn).to.be.an('function');
      expect(client.checkIn).to.be.an.instanceof(Function);
    });

    it(`should have a public 'getSnitches' method`, () => {
      expect(client.getSnitches).to.be.an('function');
      expect(client.getSnitches).to.be.an.instanceof(Function);
    });

    it(`should have a public 'filterByStatus' method`, () => {
      expect(client.filterByStatus).to.be.an('function');
      expect(client.filterByStatus).to.be.an.instanceof(Function);
    });

    it(`should have a public 'filterByInterval' method`, () => {
      expect(client.filterByInterval).to.be.an('function');
      expect(client.filterByInterval).to.be.an.instanceof(Function);
    });

    it(`should have a public 'filterByAlertType' method`, () => {
      expect(client.filterByAlertType).to.be.an('function');
      expect(client.filterByAlertType).to.be.an.instanceof(Function);
    });

    it(`should have a public 'getSnitch' method`, () => {
      expect(client.getSnitch).to.be.an('function');
      expect(client.getSnitch).to.be.an.instanceof(Function);
    });

    it(`should have a public 'createSnitch' method`, () => {
      expect(client.createSnitch).to.be.an('function');
      expect(client.createSnitch).to.be.an.instanceof(Function);
    });

    it(`should have a public 'updateSnitch' method`, () => {
      expect(client.updateSnitch).to.be.an('function');
      expect(client.updateSnitch).to.be.an.instanceof(Function);
    });

    it(`should have a public 'addTags' method`, () => {
      expect(client.addTags).to.be.an('function');
      expect(client.addTags).to.be.an.instanceof(Function);
    });

    it(`should have a public 'removeTag' method`, () => {
      expect(client.removeTag).to.be.an('function');
      expect(client.removeTag).to.be.an.instanceof(Function);
    });

    it(`should have a public 'changeTags' method`, () => {
      expect(client.changeTags).to.be.an('function');
      expect(client.changeTags).to.be.an.instanceof(Function);
    });

    it(`should have a public 'removeAllTags' method`, () => {
      expect(client.removeAllTags).to.be.an('function');
      expect(client.removeAllTags).to.be.an.instanceof(Function);
    });

    it(`should have a public 'pauseSnitch' method`, () => {
      expect(client.pauseSnitch).to.be.an('function');
      expect(client.pauseSnitch).to.be.an.instanceof(Function);
    });

    it(`should have a public 'deleteSnitch' method`, () => {
      expect(client.deleteSnitch).to.be.an('function');
      expect(client.deleteSnitch).to.be.an.instanceof(Function);
    });
  });

  context('#constructor()', () => {
    it(`should have a private '_options' property`, () => {
      expect(client).to.have.property('_options');
      expect(client._options).to.be.an('object');
      expect(client._options).to.eql(clientOptions);
    });

    it(`should have a private '_apiKey' property`, () => {
      const otherClient = new DeadMansSnitchClient();

      expect(client).to.have.property('_apiKey');
      expect(client._apiKey).to.be.a('string');
      expect(client._apiKey).to.eql(clientOptions.apiKey);
      expect(otherClient).to.have.property('_apiKey');
      expect(otherClient._apiKey).to.be.undefined;
    });

    it(`should throw an error when given a non-object for options`, () => {
      expect(() => new DeadMansSnitchClient([])).to.throw(TypeError);
      expect(() => new DeadMansSnitchClient('test')).to.throw(TypeError);
      expect(() => new DeadMansSnitchClient(999)).to.throw(TypeError);
    });
  });

  context('#_getApiKey()', () => {
    it(`should return the API key from the options`, () => {
      const apiKey = client._getApiKey(clientOptions);

      expect(apiKey).to.be.a('string');
      expect(apiKey).to.eql(clientOptions.apiKey);
    });

    it(`should return the API key from the environment variables`, () => {
      process.env.DMS_API_KEY = 'TEST-API-KEY';
      const apiKey = client._getApiKey({});

      expect(apiKey).to.be.a('string');
      expect(apiKey).to.eql(process.env.DMS_API_KEY);

      delete process.env.DMS_API_KEY;
    });
  });

  context('#_checkApiKey()', () => {
    it(`should not throw an error when '_apiKey' is present`, () => {
      expect(() => client._checkApiKey()).to.not.throw();
    });

    it(`should throw an error when missing '_apiKey'`, () => {
      expect(() => {
        client._apiKey = undefined;
        client._checkApiKey();
      }).to.throw(Error);
    });
  });

  context('#_getRequestHeaders()', () => {
    it('should get the check-in request headers', () => {
      const expectedHeaders = {
        'Accept': 'text/plain; charset=utf-8',
        'Content-Type': 'text/plain; charset=utf-8',
        'User-Agent': userAgent,
      };

      const headers = client._getRequestHeaders(checkInBaseUrl);

      expect(headers).to.be.an('object');
      expect(headers).to.eql(expectedHeaders);
    });

    it('should get the API request headers', () => {
      const expectedHeaders = {
        'Accept': 'application/json; charset=utf-8',
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': userAgent,
      };

      const headers = client._getRequestHeaders(apiBaseUrl);

      expect(headers).to.be.an('object');
      expect(headers).to.eql(expectedHeaders);
    });
  });

  context('#_getRequestOptions()', () => {
    it('should get the request options without query parameters or body', () => {
      // Get the options.
      const options = client._getRequestOptions('GET', '/v1/snitches');

      expect(options).to.be.an('object');
      expect(options).to.have.property('url', '/v1/snitches');
      expect(options).to.have.property('method', 'GET');
      expect(options.params).to.be.undefined;
      expect(options.data).to.be.undefined;
    });

    it('should get the request options with query parameters and without a body', () => {
      const query = {
        tags: 'prod,app'
      };

      // Get the options.
      const options = client._getRequestOptions('GET',
        '/v1/snitches', query);

      expect(options).to.be.an('object');
      expect(options).to.have.property('url', '/v1/snitches');
      expect(options).to.have.property('method', 'GET');
      expect(options).to.have.property('params');
      expect(options.params).to.be.an('object');
      expect(options.params).to.eql(query);
      expect(options.data).to.be.undefined;
    });

    it('should get the request options with a body and without query parameters', () => {
      const body = [ 'prod', 'app', 'www' ];
  
      // Get the options.
      const options = client._getRequestOptions('POST',
        '/v1/snitches/some-token-here/tags', null, body);
  
      expect(options).to.be.an('object');
      expect(options).to.have.property('url',
        '/v1/snitches/some-token-here/tags');
      expect(options).to.have.property('method', 'POST');
      expect(options).to.have.property('data');
      expect(options.data).to.be.an('array');
      expect(options.data).to.eql(body);
      expect(options.params).to.be.undefined;
    });
  });

  context('#_performRequest()', () => {
    const token = getMockToken();

    const checkInResponse = 'Got it, thanks!\n';

    const checkInFullResponse = {
      statusCode: 202,
      statusMessage: 'Accepted',
      headers: {},
      data: checkInResponse
    };

    const apiResponse = getMockSnitches(1, [ 'golden', 'snitch' ])[0];

    const apiFullResponse = {
      statusCode: 200,
      statusMessage: 'OK',
      headers: { 'content-type': 'application/json' },
      data: apiResponse,
    };

    it(`should return a Dead Man's Snitch check-in response`, async () => {
      // Mock the API request.
      nock(checkInBaseUrl)
        .get(`/${token}`)
        .reply(202, checkInResponse);

      // Get the options.
      const options = client._getRequestOptions('GET', `/${token}`);

      // Perform the request.
      const resp = await client._performRequest('check-in', options);

      expect(resp).to.be.a('string');
      expect(resp).to.eql(checkInResponse);

      nock.cleanAll();
    });

    it(`should return a full Dead Man's Snitch check-in response`, async () => {
      // Mock the API request.
      nock(checkInBaseUrl)
        .get(`/${token}`)
        .reply(202, checkInResponse);

      // Set the full response option.
      client.fullResponse = true;

      // Get the options.
      const options = client._getRequestOptions('GET', `/${token}`);

      // Perform the request.
      const resp = await client._performRequest('check-in', options);

      expect(resp).to.be.an('object');
      expect(resp).to.have.property('statusCode');
      expect(resp).to.have.property('statusMessage');
      expect(resp).to.have.property('headers');
      expect(resp).to.have.property('data');
      expect(resp).to.eql(checkInFullResponse);

      nock.cleanAll();
    });

    it(`should return a Dead Man's Snitch API response`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get(`/v1/snitches/${apiResponse.token}`)
        .reply(200, apiResponse);

      // Get the options.
      const options = client._getRequestOptions('GET',
        `/v1/snitches/${apiResponse.token}`);

      // Perform the request.
      const snitch = await client._performRequest('api', options);

      expect(snitch).to.be.an('object');
      expect(snitch).to.eql(apiResponse);

      nock.cleanAll();
    });

    it(`should return a full Dead Man's Snitch API response`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get(`/v1/snitches/${apiResponse.token}`)
        .reply(200, apiResponse);

      // Set the full response option.
      client.fullResponse = true;

      // Get the options.
      const options = client._getRequestOptions('GET',
        `/v1/snitches/${apiResponse.token}`);

      // Perform the request.
      const resp = await client._performRequest('api', options);

      expect(resp).to.be.an('object');
      expect(resp).to.have.property('statusCode');
      expect(resp).to.have.property('statusMessage');
      expect(resp).to.have.property('headers');
      expect(resp).to.have.property('data');
      expect(resp).to.eql(apiFullResponse);

      nock.cleanAll();
    });

    it('should throw an error when missing the request options', async () => {
      await expect(client._performRequest('api', undefined)).to.be.rejectedWith(Error);
      await expect(client._performRequest('api', 'something')).to.be.rejectedWith(Error);
      await expect(client._performRequest('api', [])).to.be.rejectedWith(Error);
      await expect(client._performRequest('api', {})).to.be.rejectedWith(Error);
    });

    it('should throw an error for an invalid request type', async () => {
      await expect(
        client._performRequest('something', { method: 'GET' })
      ).to.be.rejectedWith(Error);
    });
  });

  context('#_handleError()', () => {
    it(`should return a 'StatusCodeError' error`, () => {
      const statusCode = 403;
      const statusText = 'Authentication failed or rate-limit reached';

      const err = new Error(`Request failed with status code ${statusCode}`);

      // Mock Axios response object.
      err.response = {
        status: statusCode,
        statusText,
        headers: {},
        data: 'Bad stuff',
      };

      // Add the typical Axios error values.
      err.code = null;
      err.config = {};
      err.request = {};
      err.isAxiosError = true;
      err.toJSON = () => {};

      // Create the error.
      const handledErr = client._handleError(err);

      expect(handledErr).to.be.an.instanceof(Error);
      expect(handledErr.name).to.eql('StatusCodeError');
      expect(handledErr.message).to.eql(String(err));
      expect(handledErr.statusCode).to.eql(statusCode);
      expect(handledErr.statusMessage).to.eql(statusText);
      expect(handledErr.headers).to.eql({});
      expect(handledErr.body).to.eql('Bad stuff');
      expect(handledErr).to.have.property('cause');
      expect(handledErr.cause).to.be.an.instanceof(Error);
      expect(handledErr.cause.message).to.eql(err.message);
    });

    it(`should return a 'RequestError' error`, () => {
      const err = new Error('Oops, something happened');
      err.config = {};
      err.response = undefined;

      // Create the error.
      const handledErr = client._handleError(err);

      expect(handledErr).to.be.an.instanceof(Error);
      expect(handledErr.name).to.eql('RequestError');
      expect(handledErr.message).to.eql(String(err));
      expect(handledErr).to.have.property('cause');
      expect(handledErr.cause).to.be.an.instanceof(Error);
      expect(handledErr.cause.message).to.eql(err.message);
    });

    it(`should return an unmodified error`, () => {
      const err = new Error('Oops, something happened');
  
      // Create the error.
      const handledErr = client._handleError(err);
  
      expect(handledErr).to.be.an.instanceof(Error);
      expect(handledErr).to.eql(err);
    });
  });

  context('#_processCallback()', () => {
    it(`should execute the provided callback function`, () => {
      let callbackCalled = false;

      // Setup the callback.
      const callbackFunc = (err, resp) => {
        callbackCalled = true;
        expect(err).to.be.undefined;
        expect(resp).to.eql('Some data');
      };

      client._processCallback(undefined, 'Some data', callbackFunc);

      expect(callbackCalled).to.be.true;
    });

    it(`should return the response when not provided a callback function`, () => {
      const resp = client._processCallback(undefined, 'Some data');
      expect(resp).to.eql('Some data');
    });

    it(`should throw an error when not provided a response or callback function`, () => {
      expect(() => {
        client._processCallback(new Error('Some error'));
      }).to.throw(Error);
    });
  });

  context('#checkIn()', () => {
    const token = getMockToken();
    const response = 'Got it, thanks!\n';

    it(`should perform a snitch check-in`, async () => {
      // Mock the API request.
      nock(checkInBaseUrl)
        .get(`/${token}`)
        .reply(202, response);

      const resp = await client.checkIn(token);

      expect(resp).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should perform a snitch check-in with a string message`, async () => {
      // Mock the API request.
      nock(checkInBaseUrl)
        .get(`/${token}?m=test+message`)
        .reply(202, response);

      const resp = await client.checkIn(token, 'test message');

      expect(resp).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should perform a snitch check-in with an object message`, async () => {
      const obj = {
        type: 'important',
        data: {
          value: 'Something special'
        }
      };

      // Mock the API request.
      nock(checkInBaseUrl)
        .get(`/${token}?m=${encodeURIComponent(JSON.stringify(obj))}`)
        .reply(202, response);

      const resp = await client.checkIn(token, obj);

      expect(resp).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when performing a snitch check-in`, async () => {
      // Mock the API request.
      nock(checkInBaseUrl)
        .get('/other-token')
        .replyWithError('Something bad happened!');

      await expect(client.checkIn('other-token')).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#getSnitches()', () => {
    const prodSnitches = getMockSnitches(2, [ 'prod' ]);
    const appWwwSnitches = getMockSnitches(3, [ 'app', 'www' ]);

    const response = [
      ...prodSnitches,
      ...appWwwSnitches,
    ];

    it(`should return a list of snitches`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get('/v1/snitches')
        .times(3)
        .reply(200, response);

      let snitches = await client.getSnitches();

      expect(snitches).to.be.an('array');
      expect(snitches).to.eql(response);

      snitches = await client.getSnitches({});

      expect(snitches).to.be.an('array');
      expect(snitches).to.eql(response);

      snitches = await client.getSnitches([ 1, 2, 3 ]);

      expect(snitches).to.be.an('array');
      expect(snitches).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should return a list of snitches by tags`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get('/v1/snitches?tags=prod')
        .reply(200, prodSnitches)
        .get('/v1/snitches?tags=app,www')
        .reply(200, appWwwSnitches);

      let snitches = await client.getSnitches([ 'prod' ]);

      expect(snitches).to.be.an('array');
      expect(snitches).to.eql(prodSnitches);

      snitches = await client.getSnitches([ 'app', 'www' ]);

      expect(snitches).to.be.an('array');
      expect(snitches).to.eql(appWwwSnitches);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when performing a snitch check-in`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get('/v1/snitches')
        .replyWithError('Something bad happened!');

      await expect(client.getSnitches()).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#filterByStatus()', () => {
    const failedSnitches = getMockSnitches(2, [ 'prod' ], 'failed');
    const healthySnitches = getMockSnitches(4, [ 'prod' ], 'healthy');

    const response = [
      ...failedSnitches,
      ...healthySnitches,
    ];

    it(`should return snitches filtered by status`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get('/v1/snitches')
        .reply(200, response);

      const snitches = await client.filterByStatus('failed');

      expect(snitches).to.be.an('array');
      expect(snitches).to.eql(failedSnitches);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when given an invalid status value`, async () => {
      await expect(client.filterByStatus('bad')).to.be.rejectedWith(Error);
      await expect(client.filterByStatus({})).to.be.rejectedWith(Error);
    });

    it(`should throw an error when getting filtered snitches`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get('/v1/snitches')
        .replyWithError('Something bad happened!');

      await expect(client.filterByStatus('paused')).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#filterByInterval()', () => {
    const dailySnitches = getMockSnitches(2, [ 'prod' ], 'healthy', 'daily');
    const weeklySnitches = getMockSnitches(4, [ 'prod' ], 'healthy', 'weekly');

    const response = [
      ...dailySnitches,
      ...weeklySnitches,
    ];

    it(`should return snitches filtered by interval`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get('/v1/snitches')
        .reply(200, response);

      const snitches = await client.filterByInterval('daily');

      expect(snitches).to.be.an('array');
      expect(snitches).to.eql(dailySnitches);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when given an invalid interval value`, async () => {
      await expect(client.filterByInterval('bad')).to.be.rejectedWith(Error);
      await expect(client.filterByInterval({})).to.be.rejectedWith(Error);
    });

    it(`should throw an error when getting filtered snitches`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get('/v1/snitches')
        .replyWithError('Something bad happened!');

      await expect(client.filterByInterval('monthly')).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#filterByAlertType()', () => {
    const smartSnitches = getMockSnitches(3, [ 'prod' ], 'healthy', 'daily', 'smart');
    const basicSnitches = getMockSnitches(6, [ 'prod' ], 'healthy', 'daily', 'basic');

    const response = [
      ...smartSnitches,
      ...basicSnitches,
    ];

    it(`should return snitches filtered by alert type`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get('/v1/snitches')
        .reply(200, response);

      const snitches = await client.filterByAlertType('smart');

      expect(snitches).to.be.an('array');
      expect(snitches).to.eql(smartSnitches);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when given an invalid alert type value`, async () => {
      await expect(client.filterByAlertType('bad')).to.be.rejectedWith(Error);
      await expect(client.filterByAlertType({})).to.be.rejectedWith(Error);
    });

    it(`should throw an error when getting filtered snitches`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get('/v1/snitches')
        .replyWithError('Something bad happened!');

      await expect(client.filterByAlertType('basic')).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#getSnitch()', () => {
    const response = getMockSnitches(1, [ 'dev' ])[0];

    it(`should return information for a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get(`/v1/snitches/${response.token}`)
        .reply(200, response);

      const snitch = await client.getSnitch(response.token);

      expect(snitch).to.be.an('object');
      expect(snitch).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when getting a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .get('/v1/snitches/not-a-valid-token')
        .replyWithError('Something bad happened!');

      await expect(client.getSnitch('not-a-valid-token')).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#createSnitch()', () => {
    const response = getMockSnitches(1, [ 'dev' ])[0];

    it(`should create a new snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .post('/v1/snitches')
        .reply(200, response);

      const snitch = await client.createSnitch({
        name: response.name,
        interval: response.interval,
      });

      expect(snitch).to.be.an('object');
      expect(snitch).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when creating a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .post('/v1/snitches')
        .replyWithError('Something bad happened!');

      await expect(client.createSnitch()).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#updateSnitch()', () => {
    const response = getMockSnitches(1, [ 'prod', 'app' ], undefined,
      'monthly')[0];

    it(`should update an existing snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .patch(`/v1/snitches/${response.token}`)
        .reply(200, response);

      const snitch = await client.updateSnitch(response.token, {
        tags: response.tags,
        interval: response.interval,
      });

      expect(snitch).to.be.an('object');
      expect(snitch).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when updating a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .patch('/v1/snitches/not-a-valid-token')
        .replyWithError('Something bad happened!');

      await expect(
        client.updateSnitch('not-a-valid-token')
      ).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#addTags()', () => {
    const token = getMockToken();

    const response = [ 'prod', 'app', 'www' ];

    it(`should add tags to an existing snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .post(`/v1/snitches/${token}/tags`)
        .reply(200, response);

      const resp = await client.addTags(token, [ 'www' ]);

      expect(resp).to.be.an('array');
      expect(resp).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when adding tags to a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .post('/v1/snitches/not-a-valid-token/tags')
        .replyWithError('Something bad happened!');

      await expect(client.addTags('not-a-valid-token')).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#addTags()', () => {
    const token = getMockToken();

    const response = [ 'prod', 'app', 'www' ];

    it(`should add tags to an existing snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .post(`/v1/snitches/${token}/tags`)
        .reply(200, response);

      const resp = await client.addTags(token, [ 'www' ]);

      expect(resp).to.be.an('array');
      expect(resp).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when adding tags to a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .post('/v1/snitches/not-a-valid-token/tags')
        .replyWithError('Something bad happened!');

      await expect(client.addTags('not-a-valid-token')).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#removeTag()', () => {
    const token = getMockToken();

    const response = [ 'prod', 'app' ];

    it(`should delete a tag from an existing snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .delete(`/v1/snitches/${token}/tags/www`)
        .reply(200, response);

      const resp = await client.removeTag(token, 'www');

      expect(resp).to.be.an('array');
      expect(resp).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when deleting a snitch tag`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .delete('/v1/snitches/not-a-valid-token/tags/www')
        .replyWithError('Something bad happened!');

      await expect(
        client.removeTag('not-a-valid-token', 'www')
      ).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#changeTags()', () => {
    const response = getMockSnitches(1, [ 'dev', 'special' ])[0];

    it(`should replace the tags of an existing snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .patch(`/v1/snitches/${response.token}`)
        .reply(200, response);

      const snitch = await client.changeTags(response.token, response.tags);

      expect(snitch).to.be.an('object');
      expect(snitch).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when given invalid tags`, async () => {
      await expect(client.changeTags(response.token)).to.be.rejectedWith(Error);
      await expect(client.changeTags(response.token, {})).to.be.rejectedWith(Error);
    });

    it(`should throw an error when replacing the tags of a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .patch('/v1/snitches/not-a-valid-token')
        .replyWithError('Something bad happened!');

      await expect(
        client.changeTags('not-a-valid-token', [ 'www' ])
      ).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#removeAllTags()', () => {
    const response = getMockSnitches(1, [])[0];

    it(`should delete all tags from an existing snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .patch(`/v1/snitches/${response.token}`)
        .reply(200, response);

      const snitch = await client.removeAllTags(response.token);

      expect(snitch).to.be.an('object');
      expect(snitch).to.eql(response);

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when deleting the tags from a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .patch('/v1/snitches/not-a-valid-token')
        .replyWithError('Something bad happened!');

      await expect(client.removeAllTags('not-a-valid-token')).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#pauseSnitch()', () => {
    const token = getMockToken();

    it(`should pause a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .post(`/v1/snitches/${token}/pause`)
        .reply(204, '');

      const resp = await client.pauseSnitch(token);

      expect(resp).to.be.a('string');
      expect(resp).to.eql('');

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when pausing a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .post('/v1/snitches/not-a-valid-token/pause')
        .replyWithError('Something bad happened!');

      await expect(client.pauseSnitch('not-a-valid-token')).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });

  context('#deleteSnitch()', () => {
    const token = getMockToken();

    it(`should delete a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .delete(`/v1/snitches/${token}`)
        .reply(204, '');

      const resp = await client.deleteSnitch(token);

      expect(resp).to.be.a('string');
      expect(resp).to.eql('');

      // Remove the mocks.
      nock.cleanAll();
    });

    it(`should throw an error when deleting a snitch`, async () => {
      // Mock the API request.
      nock(apiBaseUrl)
        .delete('/v1/snitches/not-a-valid-token')
        .replyWithError('Something bad happened!');

      await expect(client.deleteSnitch('not-a-valid-token')).to.be.rejectedWith(Error);

      // Remove the mocks.
      nock.cleanAll();
    });
  });
});