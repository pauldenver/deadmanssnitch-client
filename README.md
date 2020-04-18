# Dead Man's Snitch Client  ![GitHub package.json version](https://img.shields.io/github/package-json/v/pauldenver/deadmanssnitch-client)  [![Build Status](https://travis-ci.com/pauldenver/deadmanssnitch-client.svg?branch=master)](https://travis-ci.com/pauldenver/deadmanssnitch-client) [![Coverage Status](https://coveralls.io/repos/github/pauldenver/deadmanssnitch-client/badge.svg?branch=master)](https://coveralls.io/github/pauldenver/deadmanssnitch-client?branch=master)  [![codecov](https://codecov.io/gh/pauldenver/deadmanssnitch-client/branch/master/graph/badge.svg)](https://codecov.io/gh/pauldenver/deadmanssnitch-client)

The `deadmanssnitch-client` Node.js library contains a simple and convenient HTTP client for making requests to 
Dead Man's Snitch check-ins and the [Dead Man's Snitch REST API](https://deadmanssnitch.com/docs/api/v1).

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Intialize the client](#initialize-the-client)
    - [Importing](#example-import-methods)
    - [Set environment variables in an application](#using-environment-variables-in-an-application)
    - [Set environment variables on the command line](#setting-environment-variables-before-running-an-application)
    - [Options](#options)
- [Examples](#examples)
- [Documentation](#documentation)
- [Change Log](#change-log)
- [License](#license)

## Installation

Using NPM:

```bash
$ npm install deadmanssnitch-client
```

Using Yarn:

```bash
$ yarn add deadmanssnitch-client
```

## Usage

### Initializing a client

The library exports a `DeadMansSnitchClient` class for interacting with Dead Man's Snitch check-ins and the 
[Dead Man's Snitch REST API](https://deadmanssnitch.com/docs/api/v1). You'll need an API key provided by Dead Man's Snitch in order to interact with the Dead Man's Snitch REST API. An API key is required for REST API calls, but it is not necessary for snitch check-ins. You can provide the API key as an `apiKey` option or set the API key as an environment variable using `DMS_API_KEY`. By default, the client will use the `DMS_API_KEY` environment variable if the `apiKey` option is not provided.  

#### Example import methods:

```javascript
const DeadMansSnitchClient = require('deadmanssnitch-client');

// Creating an API client.
const client = new DeadMansSnitchClient({
  apiKey: 'DEAD-MANS-SNITCH-API-KEY'
});
```

```javascript
import DeadMansSnitchClient from 'deadmanssnitch-client';

// Creating an API client.
const client = new DeadMansSnitchClient({
  apiKey: 'DEAD-MANS-SNITCH-API-KEY'
});
```

#### Using environment variables in an application:

```javascript
const DeadMansSnitchClient = require('deadmanssnitch-client');

// Set the API key as an environment variable.
process.env.DMS_API_KEY = 'DEAD-MANS-SNITCH-API-KEY';

const client = new DeadMansSnitchClient();
```

#### Setting environment variables before running an application:

Linux:

```bash
$ DMS_API_KEY=DEAD-MANS-SNITCH-API-KEY node app.js
```

Windows:

```batch
> cmd /C "set DMS_API_KEY=DEAD-MANS-SNITCH-API-KEY && node app.js"
```

### Options

These are the available options for creating a `DeadMansSnitchClient` instance.

| Name                | Default                           |  Description                                                |
| ------------------- | --------------------------------- | ----------------------------------------------------------- | 
| `apiKey`            | `undefined`                       | Dead Man's Snitch API Key                                   |
| `timeout`           | `5000`                            | Number of milliseconds before the request times out         |
| `apiBaseUrl`        | `https://api.deadmanssnitch.com`  | Base URL for the Dead Man's Snitch REST API                 |
| `checkInBaseUrl`    | `https://nosnch.in`               | Base URL for the Dead Man's Snitch check-ins                |
| `fullResponse`      | `false`                           | Get the full response instead of just the body              |
| `maxContentLength`  | `10000`                           | The max size of the HTTP response content in bytes          |
| `apiVersion`        | `1`                               | The REST API Version to use                                 |
<br />

## Examples

The `checkIn` and REST API methods return a `Promise` which resolves with the response data or rejects with an error.  

Alternatively, the `checkIn` method and each of the REST API methods can also be provided a completion callback function as its last argument. When a callback function is used the corresponding method does not return a value. The arguments passed to the completion callback function are `err` and `resp`. The first argument (`err`) is always reserved for an exception/error and the second argument (`resp`) is always reserved for the data returned from the check-in or API call. If the corresponding method is completed successfully, then the first argument will be `undefined`. If the method fails, then the second argument will be `undefined`.

Create an instance:

```javascript
const DeadMansSnitchClient = require('deadmanssnitch-client');

// Creating an API client.
const client = new DeadMansSnitchClient({
  apiKey: 'DEAD-MANS-SNITCH-API-KEY'
});
```

Check-in with a snitch:

```javascript
async function performTask(token) {
  /*
   * Add task logic here.
   */

  // Check-in after a task completes.
  await client.checkIn(token);
}
```

Check-in with a snitch and add a message:

```javascript
async function performTask(token) {
  /*
   * Add task logic here.
   */

  // Check-in after a task completes.
  await client.checkIn(token, `All's good man!`);
}
```

Get a list of snitches:

```javascript
async function getAllSnitches() {
  try {
    return await client.getSnitches();
  } catch(err) {
    console.error(err);
  }
}
```

Get a certain snitch:

```javascript
async function getSnitchInfo(token) {
  try {
    return await client.getSnitch(token);
  } catch(err) {
    console.error(err);
  }
}
```

Create a new snitch:

```javascript
async function createNewSnitch() {
  try {
    return await client.createSnitch({
      name: 'Web App',
      interval: 'daily'
    });
  } catch(err) {
    console.error(err);
  }
}
```

Update a snitch using a callback function:

```javascript
async function updateMySnitch(token, snitchInfo) {
  await client.updateSnitch(token, snitchInfo, (err, resp) => {
    if (err) {
      console.error(err);
    } else {
      console.log(resp);
    }
  });
}
```

## Documentation

- **`client.checkIn(token, message, callback)`** - Performs a check-in request for a snitch - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs)  
- **`client.getSnitches(tags, callback)`** - Gets a list of snitches - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#listing-snitches)  
- **`client.filterByStatus(status, callback)`** - Filters snitches by status - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#listing-snitches)  
- **`client.filterByInterval(interval, callback)`** - Filters snitches by interval - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#listing-snitches)  
- **`client.filterByAlertType(alertType, callback)`** - Filters snitches by alert type - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#listing-snitches)  
- **`client.getSnitch(token, callback)`** - Get the information for a snitch - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#examining-a-snitch)  
- **`client.createSnitch(snitchInfo, callback)`** - Creates a new snitch - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#creating-a-snitch)  
- **`client.updateSnitch(token, snitchInfo, callback)`** - Updates a snitch - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#updating-a-snitch)  
- **`client.addTags(token, tags, callback)`** - Adds tags to a snitch - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#adding-tags)  
- **`client.removeTag(token, tagName, callback)`** - Remove a tag from a snitch - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#removing-tags)  
- **`client.changeTags(token, tags, callback)`** - Changes/replaces the tags of a snitch - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#changing-tags)  
- **`client.removeAllTags(token, callback)`** - Removes all of the tags from a snitch - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#changing-tags)  
- **`client.pauseSnitch(token, callback)`** - Pauses an active snitch - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#pausing-a-snitch)  
- **`client.deleteSnitch(token, callback)`** - Deletes a snitch - [Dead Man's Snitch Documentation](https://deadmanssnitch.com/docs/api/v1#deleting-a-snitch)  

## Change Log

### v1.0.0

- Initial release

## License

This software is licensed under the [Apache 2 license](./LICENSE).