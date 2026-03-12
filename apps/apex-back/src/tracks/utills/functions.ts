export function parseLapTime(str: string): number | null {
  const ms = parseFloat(str);
  return isNaN(ms) ? null : ms;
}
