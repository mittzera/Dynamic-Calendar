export function generateColorFromTitle(title: string): string {
  const colors = [
    "#4f46e5",
    "#0ea5e9",
    "#0891b2",
    "#0d9488",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#84cc16",
    "#ef4444",
    "#ea580c",
  ];

  const hash = title.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
}
