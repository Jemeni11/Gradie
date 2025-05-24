export default function getRandomFromSlice<T>(
  array: T[],
  start: number = 0,
  end?: number,
): T {
  if (array.length === 0) throw new Error("Array cannot be empty");
  const slice = array.slice(start, end);
  if (slice.length === 0) throw new Error("Slice cannot be empty");
  return slice[Math.floor(Math.random() * slice.length)];
}
