/**
 * An queue that holds the history of energies for one frequency range
 * Extends conventional array functionality
 */
export default class HistoryQueue extends Array {
  constructor({ maxLength = 200 } = {}) {
    super();
    this.maxLength = maxLength;
  }

  /**
   * Add a new value in and drop any values beyond the max length
   * @param {*} value
   */
  add(value) {
    this.push(value);
    if (this.length > this.maxLength) {
      this.splice(0, this.length - this.maxLength);
    }
  }

  /**
   * Perform a "convolution" on just the last n elements of the queue, where n is the length of the kernel.
   * If history length is shorter than kernel length, then history[0] is used for negative indices (i.e. use "extend" method)
   * @param {Array<Number>} kernel Convolution kernel
   */
  convolveTail(kernel) {
    let sum = 0;

    const kernelIndexEdge = Math.min(kernel.length, this.length);
    for (let i = 0; i < kernelIndexEdge; i++) {
      sum += kernel[i] * this[this.length - 1 - i];
    }

    // If kernel length is longer than this queue
    if (kernel.length > this.length) {
      let kernelSum = 0;
      for (let i = kernelIndexEdge; i < kernel.length; i++) {
        kernelSum += kernel[i];
      }
      sum += kernelSum * this[0];
    }

    return sum;
  }

  /**
   * Approximate a derivative on the last few elements by using convolveTail
   * @returns
   */
  lastDiff() {
    return this.convolveTail([1, 0, -1]);
  }
}
