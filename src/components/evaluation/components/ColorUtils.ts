/**
 * Converts a hex color to rgba format
 * @param color - Hex color string (format: #RRGGBB)
 * @param alpha - Alpha transparency value (0-1)
 * @returns rgba color string
 */
export const colorToRgba = (color: string, alpha: number) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
