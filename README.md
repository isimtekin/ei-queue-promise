# ei-queue-promise

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

| Statements                                                                  | Branches                                                                  | Functions                                                                  | Lines                                                                  |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) |

## Installation

for NPM:

```
$ npm install ei-queue-promise -S
```

for YARN:

```
$ yarn add ei-queue-promise
```

### Importing

ES5

```JS
var eiQueuePromise = require("ei-queue-promise");
```

ES6

```JS
import eiQueuePromise from "ei-queue-promise";
```

### Sample Usage

```JS
import eiQueuePromise from "ei-queue-promise";

const promiseTestSuccessNoParam = function(_previousResult) {
  return new Promise<string>(async resolve => {
    await sleep(200);
    resolve('promiseTestSuccess');
  });
};

const promiseTestSuccessWithParam = function(
  value,
  _previousResult,
): Promise<any> {
  return new Promise<string>(async resolve => {
    await sleep(200);
    resolve(value);
  });
};

const promiseTestError = function(_value, _previousResult) {
  return new Promise<string>(async (_resolve, reject) => {
    await sleep(200);
    reject('promiseTestError');
  });

     const promiseFunctionList = [
      promiseTestSuccessNoParam,
      {
        fn: promiseTestSuccessWithParam,
        parameters: [1],
      },
      {
        fn: promiseTestSuccessWithParam,
        parameters: [2],
      },
      promiseTestError,
      {
        fn: promiseTestSuccessWithParam,
        parameters: [3],
      },
      promiseTestError,
    ];

  queuePromise(promiseFunctionList).then((result)=>{
      //result
      /*
        [
            ['promiseTestSuccess'],
            [1],
            [2],
            [null, 'promiseTestError'],
            [3],
            [null, 'promiseTestError'],
        ]
    */
  })

};

```

### Delay

if you want to leave a delay between each queue item, you can set a delay(milliseconds) in the options.

```JS
    queuePromise([promiseTestSuccessNoParam, promiseTestSuccessNoParam], {
      debounce: 300,
    });
```

### Logging

if you want to log the result of each queue, you can set `true` to the `enableLog`

```JS
    queuePromise([promiseTestSuccessNoParam, promiseTestSuccessNoParam], {
      enableLog: true,
    });
```
