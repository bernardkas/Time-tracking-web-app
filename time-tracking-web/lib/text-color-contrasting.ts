export function getContrastingTextColor(bgColor: string): string {
    if (!bgColor) return '#000000'; 
  
    const hex = bgColor.replace('#', '');
  
    // Parse r, g, b values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
  