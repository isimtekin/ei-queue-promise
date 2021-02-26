/**
 * Copyright (c) 2021 Ersin Isimtekin. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see the file LICENSE in the root directory.
 */

import queuePromise, { promiseFunction } from '../src/queue-promise';
import { sleep } from '../src/sleep';

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
};

describe('Queue Promise', function() {
  it('check result type', async () => {
    const promiseFunctionList = [
      promiseTestSuccessNoParam,
      promiseTestError,
      promiseTestSuccessNoParam,
      promiseTestSuccessNoParam,
      promiseTestError,
    ];
    const result = await queuePromise(promiseFunctionList);
    expect(Array.isArray(result)).toBe(true);
  });

  it('check result length', async () => {
    const promiseFunctionList = [
      promiseTestSuccessNoParam,
      promiseTestError,
      promiseTestSuccessNoParam,
      promiseTestSuccessNoParam,
      promiseTestError,
    ];
    const result = await queuePromise(promiseFunctionList);
    expect(result.length).toEqual(promiseFunctionList.length);
  });

  it('check result value', async () => {
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
    const result = await queuePromise(promiseFunctionList);
    expect(result).toEqual([
      ['promiseTestSuccess'],
      [1],
      [2],
      [null, 'promiseTestError'],
      [3],
      [null, 'promiseTestError'],
    ]);
  });

  it('check enable info log', async () => {
    console.log = jest.fn();
    await queuePromise([promiseTestSuccessNoParam], {
      enableLog: true,
    });

    expect(console.log).toHaveBeenCalledWith('promiseTestSuccess');
  });

  it('check the sleep durations', async () => {
    console.warn = jest.fn();
    await queuePromise([promiseTestError], {
      enableLog: true,
    });

    expect(console.warn).toHaveBeenCalledWith('promiseTestError');
  });

  it('empty promise list', async () => {
    const result = await queuePromise([]);
    expect(result).toBeNull();
  });

  it('empty promise list', async () => {
    const result = await queuePromise();
    expect(result).toBeNull();
  });

  it('debounce', async () => {
    const startDate = new Date().getTime();
    await queuePromise([promiseTestSuccessNoParam, promiseTestSuccessNoParam], {
      debounce: 300,
    });
    const endDate = new Date().getTime();
    expect(endDate - startDate).toBeGreaterThanOrEqual(700);
  });
});

describe('promiseFunction', function() {
  it('check the sleep duration', async () => {
    const param = [2];
    const result = await promiseFunction(promiseTestSuccessWithParam, param);
    expect(result).toEqual(param[0]);
  });

  it('check the sleep duration', async () => {
    const result = await promiseFunction(promiseTestSuccessWithParam);
    expect(result).toBeUndefined();
  });
});
