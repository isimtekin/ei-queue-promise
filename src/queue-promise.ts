/**
 * Copyright (c) 2021 Ersin Isimtekin. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see the file LICENSE in the root directory.
 */

import { sleep } from './sleep';

type PromiseFunction = (...parameters) => Promise<any>;

export interface QueuePromiseItem {
  fn: PromiseFunction;
  parameters?: any[];
}

export interface QueuePromiseOptions {
  debounce?: number;
  enableLog?: boolean;
}

/**
 *
 * @param {PromiseFunction} fn - Detail.
 * @param {unknown[]} parameters - Detail.
 *
 * @returns {unknown}
 */
export async function promiseFunction(
  fn: PromiseFunction,
  parameters: unknown[] = [],
) {
  return await fn(...parameters);
}

/**
 *
 * @param {QueuePromiseItem | PromiseFunction} promiseList - Detail.
 * @param {QueuePromiseOptions} options - Detail.
 *
 * @returns {Promise<any[]>}
 */
const queuePromise = async (
  promiseList: (QueuePromiseItem | PromiseFunction)[] = [],
  options: QueuePromiseOptions = {},
): Promise<any[]> => {
  const result = [];
  if (promiseList.length === 0) {
    return null;
  }
  let currentPromiseFnIndex = 0;

  async function runPromiseFunction(next, previousResult: any = null) {
    const callItem = promiseList[currentPromiseFnIndex];
    try {
      let resultItem;
      if (typeof callItem === 'function') {
        resultItem = await promiseFunction(callItem, [previousResult]);
      } else {
        resultItem = await promiseFunction(callItem.fn, [
          ...callItem.parameters,
          previousResult,
        ]);
      }

      result.push([resultItem]);
      if (options.enableLog) {
        console.log(resultItem);
      }
      await next([resultItem], result);
    } catch (e) {
      result.push([null, e.toString()]);
      if (options.enableLog) {
        console.warn(e.toString());
      }
      await next([, e.toString()], result);
    }
  }

  async function next(result) {
    const isLastItem = promiseList.length - 1 === currentPromiseFnIndex;
    if (options.debounce && !isLastItem) {
      await sleep(options.debounce);
    }

    if (!isLastItem) {
      currentPromiseFnIndex = currentPromiseFnIndex + 1;
      await runPromiseFunction(next, result);
    }
  }

  await runPromiseFunction(next);
  return result;
};

export default queuePromise;
