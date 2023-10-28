const DEFAULT_TAB_CYCLE_TIME_MILLIS = 4000;
const MAX_FAST_CYCLE_TIME_MILLIS = 1000;

export class TabCycle {
  interval: NodeJS.Timeout | undefined;
  intervalDelay: number = DEFAULT_TAB_CYCLE_TIME_MILLIS;
  cycleTabFunc: () => void;

  constructor(cycleTabFunc: () => void) {
    this.cycleTabFunc = cycleTabFunc;
  }

  startInterval() {
    if (this.interval) {
      this.stopInterval();
    }
    this.intervalDelay = DEFAULT_TAB_CYCLE_TIME_MILLIS;
    this.interval = setInterval(this.cycleTabFunc, this.intervalDelay);
  }

  stopInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  fasterInterval() {
    this.stopInterval();
    if (this.intervalDelay > 1) {
      this.intervalDelay = Math.min(this.intervalDelay, MAX_FAST_CYCLE_TIME_MILLIS * 2) / 2;
    }
    this.interval = setInterval(this.cycleTabFunc, this.intervalDelay);
  }
}
