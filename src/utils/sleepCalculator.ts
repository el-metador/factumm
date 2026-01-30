export interface WakeOption {
  time: string;
  cycles: number;
}

export function calculateOptimalWakeOptions(
  bedTime: string,
  targetSleep: number = 8
): WakeOption[] {
  const bedTimeDate = new Date(`2000-01-01 ${bedTime}:00`);
  const sleepCycleDuration = 90; // minutes
  const cyclesForTargetSleep = Math.round((targetSleep * 60) / sleepCycleDuration);
  
  const wakeOptions: WakeOption[] = [];
  
  // Calculate 3 wake time options based on sleep cycles
  for (let i = -1; i <= 1; i++) {
    const cycles = cyclesForTargetSleep + i;
    if (cycles > 0) {
      const totalSleepMinutes = cycles * sleepCycleDuration;
      const wakeTime = new Date(bedTimeDate.getTime() + totalSleepMinutes * 60000);
      const hours = wakeTime.getHours().toString().padStart(2, '0');
      const minutes = wakeTime.getMinutes().toString().padStart(2, '0');
      wakeOptions.push({ time: `${hours}:${minutes}`, cycles });
    }
  }
  
  return wakeOptions;
}

export function calculateOptimalWakeTime(bedTime: string, targetSleep: number = 8): string[] {
  return calculateOptimalWakeOptions(bedTime, targetSleep).map(option => option.time);
}

export function calculateSleepQuality(actualSleep: number, targetSleep: number): number {
  const difference = Math.abs(actualSleep - targetSleep);
  if (difference <= 0.5) return 100;
  if (difference <= 1) return 80;
  if (difference <= 2) return 60;
  if (difference <= 3) return 40;
  return 20;
}
