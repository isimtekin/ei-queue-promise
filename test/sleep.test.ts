/**
 * Copyright (c) 2021 Ersin Isimtekin. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see the file LICENSE in the root directory.
 */

import { sleep } from '../src/sleep';

describe('Sleep Function', function() {
  it('check the sleep duration', async () => {
    const duration = 300;
    const startTime = new Date().getTime();
    await sleep(duration);
    const endTime = new Date().getTime();
    const result = endTime - startTime;
    expect(result).toBeLessThan(duration + 10);
  });
});
