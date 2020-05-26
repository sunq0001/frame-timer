Array.prototype.quickSort = function (prop) {
  let start = 0;
  let end = this.length - 1;
  const devision = (array, start, end, prop) => {
    if (start >= end) return array;
    let baseIndex = Math.floor((start + end) / 2), // 基数索引
      i = start,
      j = end;
    while (i <= j) {
      if (!prop) {
        while (array[i] < array[baseIndex]) i++;
        while (array[j] > array[baseIndex]) j--;
      } else {
        while (array[i][prop] < array[baseIndex][prop]) i++;
        while (array[j][prop] > array[baseIndex][prop]) j--;
      }
      if (i <= j) {
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        i++;
        j--;
      }
    }
    return i;
  };
  const sort = (array, start, end, prop) => {
    if (array.length < 1) {
      return array;
    }
    let index = devision(array, start, end, prop);
    if (start < index - 1) {
      sort(array, start, index - 1, prop);
    }
    if (end > index) {
      sort(array, index, end, prop);
    }
    return array;
  };
  return sort(this, start, end, prop);
};

class FrameTimer {
  constructor() {
    this.startRun = false;
  }

  run(callback, ...params) {
    this.startRun = true;

    const delta = () => {
      let oldTime = new Date().getTime();
      return function (currTime) {
        let delta = currTime - oldTime;
        oldTime = currTime;
        return delta;
      };
    };
    let getDelta = delta();
    const step = () => {
      //executing time queue of delay function
      while (
        this.delayArr &&
        1 <= this.delayArr.length &&
        new Date().getTime() > this.delayArr[0].time
      ) {
        if (
          this.delayArr[0].callback &&
          typeof this.delayArr[0].callback === "function"
        )
          this.delayArr[0].callback(...this.delayArr[0].params);
        this.delayArr.shift();
      }
      //executing time queue of tick function
      if (this.tickArr && 1 <= this.tickArr.length) {
        let currentTime = new Date().getTime();
        for (let item of this.tickArr) {
          if (currentTime > item.time) {
            if (item.callback && typeof item.callback === "function")
              item.callback(...item.params);
            item.time = currentTime + item.ms;
          }
        }
      }
      // execution frameAction
      // input delta time into callback, so that client function can call it
      let dt = getDelta(new Date().getTime());
      if (this.startRun) {
        var id = requestAnimationFrame(step);
        if (callback && typeof callback == "function") callback(...params, dt);
      } else cancelAnimationFrame(id);
    };
    step();
    return this;
  }

  stop(callback, ...params) {
    this.startRun = false;
    if (callback && typeof callback === "function") callback(...params);
    return this;
  }

  delay(callback, ms, ...params) {
    //generate delay time queue
    if (!this.delayArr) this.delayArr = [];
    let time = new Date().getTime() + ms;
    this.delayArr.push({ time, callback, params });
    this.delayArr.quickSort("time");
    return this;
  }

  tick(callback, ms, ...params) {
    //generate tick time queue
    if (!this.tickArr) this.tickArr = [];
    let time = new Date().getTime() + ms;
    this.tickArr.push({ time, callback, ms, params });
    return this;
  }

  remove(fnName, callback, ...params) {
    //remove tick or delay callback from time queue
    const removeFn = (fnName, arr) => {
      if (arr && 1 <= arr.length) {
        arr.forEach((val, index, array) => {
          if (
            val.callback &&
            typeof val.callback === "function" &&
            val.callback.name &&
            val.callback.name === fnName
          ) {
            array.splice(index, 1);
          }
        });
      }
    };
    removeFn(fnName, this.delayArr);
    removeFn(fnName, this.tickArr);
    if (callback && typeof callback === "function") callback(...params);
    return this;
  }
}

export default function frameTimer() {
  return new FrameTimer();
}
