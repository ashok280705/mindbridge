export function predictNextCycle(entries) {
  if (!entries.length) return null;

  // Sort by date
  const sorted = [...entries].sort((a, b) =>
    new Date(a.startDate) - new Date(b.startDate)
  );

  // Calculate avg cycle length
  let totalCycle = 0;
  for (let i = 1; i < sorted.length; i++) {
    const diff =
      (new Date(sorted[i].startDate) - new Date(sorted[i - 1].startDate)) /
      (1000 * 60 * 60 * 24);
    totalCycle += diff;
  }
  const avgCycle = totalCycle / (sorted.length - 1) || 28;

  // Avg duration
  const totalDuration = sorted.reduce((acc, e) => {
    if (e.endDate) {
      const dur =
        (new Date(e.endDate) - new Date(e.startDate)) / (1000 * 60 * 60 * 24);
      return acc + dur;
    }
    return acc;
  }, 0);
  const avgDuration = totalDuration / sorted.length || 5;

  const lastStart = new Date(sorted[sorted.length - 1].startDate);
  const nextStart = new Date(lastStart);
  nextStart.setDate(lastStart.getDate() + avgCycle);

  return {
    avgCycleLength: Math.round(avgCycle),
    avgDuration: Math.round(avgDuration),
    nextStartDate: nextStart,
  };
}