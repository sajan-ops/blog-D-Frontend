// timerManager.ts
export class TimerManager {
  private static instance: TimerManager;
  private timers: Map<
    string,
    {
      publishTime: string;
      callback: () => void;
    }
  >;
  private checkInterval: NodeJS.Timeout | null;

  private constructor() {
    this.timers = new Map();
    this.checkInterval = null;
  }

  public static getInstance(): TimerManager {
    if (!TimerManager.instance) {
      TimerManager.instance = new TimerManager();
    }
    return TimerManager.instance;
  }

  public addTimer(id: string, publishTime: string, callback: () => void) {
    this.timers.set(id, { publishTime, callback });
    this.startChecking();
  }

  public removeTimer(id: string) {
    this.timers.delete(id);
    if (this.timers.size === 0) {
      this.stopChecking();
    }
  }

  private startChecking() {
    if (!this.checkInterval) {
      this.checkInterval = setInterval(() => this.checkTimers(), 1000);
    }
  }

  private stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private checkTimers() {
    const now = new Date().getTime();

    this.timers.forEach(({ publishTime, callback }, id) => {
      const publishDate = new Date(publishTime).getTime();
      if (now >= publishDate) {
        callback();
        this.removeTimer(id);
      }
    });
  }
}

export const timerManager = TimerManager.getInstance();
