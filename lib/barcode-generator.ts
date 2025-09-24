export const generateBarcodeDataURL = (text: string): string => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  // Set canvas dimensions
  canvas.width = 300;
  canvas.height = 80;

  // Clear canvas with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Simple Code 128 style barcode generation
  const barWidth = 2;
  const barHeight = 50;
  const startX = 20;
  const startY = 10;

  // Convert text to binary pattern (simplified Code 128 simulation)
  let binaryPattern = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Create alternating pattern based on character codes
    if (charCode % 4 === 0) {
      binaryPattern += '11001100';
    } else if (charCode % 4 === 1) {
      binaryPattern += '10011001';
    } else if (charCode % 4 === 2) {
      binaryPattern += '11010010';
    } else {
      binaryPattern += '10100110';
    }
  }

  // Add start and end patterns
  binaryPattern = '11010010000' + binaryPattern + '11010011000';

  // Draw bars
  ctx.fillStyle = 'black';
  const maxBars = Math.min(binaryPattern.length, 120); // Limit to fit canvas
  const actualBarWidth = Math.min(barWidth, (canvas.width - 40) / maxBars);
  
  for (let i = 0; i < maxBars; i++) {
    if (binaryPattern[i] === '1') {
      ctx.fillRect(startX + i * actualBarWidth, startY, actualBarWidth, barHeight);
    }
  }

  // Add text below barcode
  ctx.fillStyle = 'black';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, startY + barHeight + 20);

  // Return data URL
  return canvas.toDataURL('image/png');
};

export const downloadBarcode = (text: string, filename?: string) => {
  const dataURL = generateBarcodeDataURL(text);
  const link = document.createElement('a');
  link.download = filename || `barcode-${text}.png`;
  link.href = dataURL;
  link.click();
};

// Generate product information string for barcode encoding
export const generateProductInfoString = (productData: any): string => {
  const info = {
    name: productData.name || '',
    code: productData.code || '',
    mfgDate: productData.manufacturingDate || '',
    expDate: productData.expiryDate || '',
    netWeight: productData.netWeight || '',
    manufacturer: productData.manufacturer?.name || '',
    storageConditions: productData.storageConditions || '',
    batchCode: productData.exportLot || ''
  };

  // Create a structured string that can be parsed when scanned
  return JSON.stringify(info);
};

// Parse product information from scanned barcode
export const parseProductInfoFromBarcode = (scannedData: string): any => {
  try {
    return JSON.parse(scannedData);
  } catch (error) {
    // If not JSON, return as simple string
    return { rawData: scannedData };
  }
};