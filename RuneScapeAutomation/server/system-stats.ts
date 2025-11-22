import os from 'os';

export interface SystemStats {
  cpu: number;
  gpu: number;
  ram: number;
  disk: number;
  uptime: number;
  timestamp: number;
}

export function getSystemStats(): SystemStats {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  // Calculate CPU usage percentage
  let totalIdle = 0;
  let totalTick = 0;
  
  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times];
    }
    totalIdle += cpu.times.idle;
  });
  
  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const cpuUsage = 100 - ~~(100 * idle / total);
  
  // GPU simulation (using random value 20-80% for demo, will improve on Windows)
  const gpuUsage = 20 + Math.floor(Math.random() * 60);
  
  // RAM percentage
  const ramUsage = Math.round((usedMem / totalMem) * 100);
  
  // Disk usage simulation (20-60% for demo)
  const diskUsage = 20 + Math.floor(Math.random() * 40);
  
  return {
    cpu: Math.min(cpuUsage, 100),
    gpu: gpuUsage,
    ram: ramUsage,
    disk: diskUsage,
    uptime: os.uptime(),
    timestamp: Date.now(),
  };
}

// History for charts (last 20 readings)
let statsHistory: SystemStats[] = [];

export function recordStats(): SystemStats {
  const stats = getSystemStats();
  statsHistory.push(stats);
  
  // Keep only last 20 readings
  if (statsHistory.length > 20) {
    statsHistory.shift();
  }
  
  return stats;
}

export function getStatsHistory(): SystemStats[] {
  return statsHistory;
}

// Initialize with some data
setInterval(recordStats, 5000);
