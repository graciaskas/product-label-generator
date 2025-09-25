<<<<<<< HEAD
<<<<<<< HEAD
// EAN-128 (GS1-128) Barcode Generator for Pharmaceutical Products
export const generateEAN128Barcode = (productData: any): string => {
  // GS1 Application Identifiers (AI)
  const AI_GTIN = '01';           // Global Trade Item Number (Product Code)
  const AI_LOT = '10';            // Batch/Lot Number
  const AI_EXPIRY = '17';         // Expiry Date (YYMMDD)
  const AI_WEIGHT = '3103';       // Net Weight in kg (with 3 decimal places)

  // Extract and format data
  const productCode = productData.code || '';
  const lotNumber = productData.code || productCode; // Use product code as lot number
  const expiryDate = formatExpiryDateForGS1(productData.expiryDate);
  const netWeight = formatWeightForGS1(productData.netWeight);

  // Build GS1-128 data string
  // Format: (AI)Data(AI)Data...
  let gs1Data = '';
  
  // Add Product Code/GTIN (padded to 14 digits)
  const gtin = padGTIN(productCode);
  gs1Data += `(${AI_GTIN})${gtin}`;
  
  // Add Lot Number (set by user)
  if (lotNumber) {
    gs1Data += `(${AI_LOT})${lotNumber}`;
  }
  
  // Add Expiry Date (set by user)
  if (expiryDate) {
    gs1Data += `(${AI_EXPIRY})${expiryDate}`;
  }
  
  // Add Net Weight (set by user)
  if (netWeight) {
    gs1Data += `(${AI_WEIGHT})${netWeight}`;
  }

  return gs1Data;
};

// Format expiry date to YYMMDD format for GS1
const formatExpiryDateForGS1 = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const [year, month] = dateString.split('-');
    const shortYear = year.substring(2); // Get last 2 digits of year
    return `${shortYear}${month}01`; // YYMMDD format (using 01 for day)
  } catch {
    return '';
  }
};

// Format weight for GS1 (AI 3103 = net weight in kg with 3 decimal places)
const formatWeightForGS1 = (weightString: string): string => {
  if (!weightString) return '';
  
  try {
    // Remove any non-numeric characters except decimal point
    const cleanWeight = weightString.replace(/[^\d.,]/g, '').replace(',', '.');
    const weight = parseFloat(cleanWeight);
    
    if (isNaN(weight)) return '';
    
    // Format to 3 decimal places and remove decimal point for GS1
    // Example: 25.000 kg becomes "025000" (multiply by 1000)
    const formattedWeight = Math.round(weight * 1000).toString().padStart(6, '0');
    return formattedWeight;
  } catch {
    return '';
  }
};

// Pad product code to create a valid GTIN-14
const padGTIN = (productCode: string): string => {
  // Remove non-alphanumeric characters and convert to uppercase
  const cleanCode = productCode.replace(/[^A-Z0-9]/g, '').toUpperCase();
  
  // Convert letters to numbers for GTIN (A=10, B=11, etc.)
  let numericCode = '';
  for (let char of cleanCode) {
    if (char >= 'A' && char <= 'Z') {
      numericCode += (char.charCodeAt(0) - 55).toString(); // A=10, B=11, etc.
    } else {
      numericCode += char;
    }
  }
  
  // Pad or truncate to 13 digits, then calculate check digit
  numericCode = numericCode.substring(0, 13).padStart(13, '0');
  
  // Calculate GTIN check digit
  const checkDigit = calculateGTINCheckDigit(numericCode);
  
  return numericCode + checkDigit;
};

// Calculate GTIN check digit using modulo 10 algorithm
const calculateGTINCheckDigit = (code: string): string => {
  let sum = 0;
  for (let i = 0; i < code.length; i++) {
    const digit = parseInt(code[i]);
    // Multiply odd positions by 3, even positions by 1
    sum += digit * (i % 2 === 0 ? 3 : 1);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit.toString();
};

// Generate EAN-128 barcode pattern for display
export const generateEAN128BarcodeDataURL = (gs1Data: string): string => {
=======
export const generateBarcodeDataURL = (text: string): string => {
  // Create a canvas element
>>>>>>> parent of 4650916 (Implement EAN-128 (GS1-128) Barcode Format)
=======
export const generateBarcodeDataURL = (text: string): string => {
  // Create a canvas element
>>>>>>> parent of 4650916 (Implement EAN-128 (GS1-128) Barcode Format)
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

<<<<<<< HEAD
<<<<<<< HEAD
// Parse EAN-128 barcode data
export const parseEAN128Barcode = (scannedData: string): any => {
  const result: any = {
    format: 'EAN-128 (GS1-128)',
    rawData: scannedData
  };

  try {
    // Parse GS1 Application Identifiers
    const aiRegex = /\((\d+)\)([^(]+)/g;
    let match;

    while ((match = aiRegex.exec(scannedData)) !== null) {
      const ai = match[1];
      const data = match[2];

      switch (ai) {
        case '01':
          result.gtin = data;
          result.productCode = data;
          break;
        case '10':
          result.lotNumber = data;
          result.batchCode = data;
          break;
        case '17':
          result.expiryDate = parseGS1Date(data);
          break;
        case '3103':
          result.netWeight = parseGS1Weight(data);
          break;
      }
    }

    return result;
  } catch (error) {
    return {
      format: 'EAN-128 (GS1-128)',
      rawData: scannedData,
      error: 'Failed to parse barcode data'
    };
  }
};

// Parse GS1 date format (YYMMDD) to readable format
const parseGS1Date = (dateString: string): string => {
  if (dateString.length !== 6) return dateString;
  
  const year = '20' + dateString.substring(0, 2);
  const month = dateString.substring(2, 4);
  const day = dateString.substring(4, 6);
  
  return `${year}-${month}-${day}`;
};

// Parse GS1 weight format (AI 3103 - 6 digits representing kg with 3 decimal places)
const parseGS1Weight = (weightString: string): string => {
  if (weightString.length !== 6) return weightString;
  
  try {
    // Convert back from GS1 format (divide by 1000)
    const weight = parseInt(weightString) / 1000;
    return `${weight.toFixed(3)} kg`;
  } catch {
    return weightString;
  }
};

// Legacy functions for backward compatibility
export const generateBarcodeDataURL = generateEAN128BarcodeDataURL;
export const generateProductInfoString = generateEAN128Barcode;
export const parseProductInfoFromBarcode = parseEAN128Barcode;

// Download barcode as image
export const downloadEAN128Barcode = (gs1Data: string, filename?: string) => {
  const dataURL = generateEAN128BarcodeDataURL(gs1Data);
=======
export const downloadBarcode = (text: string, filename?: string) => {
  const dataURL = generateBarcodeDataURL(text);
>>>>>>> parent of 4650916 (Implement EAN-128 (GS1-128) Barcode Format)
  const link = document.createElement('a');
  link.download = filename || `barcode-${text}.png`;
  link.href = dataURL;
  link.click();
};

<<<<<<< HEAD
<<<<<<< HEAD
// Improved barcode generation with better readability
export const generateEAN128BarcodeDataURL = (gs1Data: string): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  // Set larger canvas dimensions for better readability
  canvas.width = 600;
  canvas.height = 150;

  // Clear canvas with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // EAN-128 patterns
  const START_PATTERN = '11010000100';
  const STOP_PATTERN = '1100011101011';
  const FNC1_PATTERN = '11110101000';

  // Simplified Code 128 patterns for basic characters
  const CODE128_PATTERNS: { [key: string]: string } = {
    '0': '11011001100', '1': '11001101100', '2': '11001100110', '3': '10010011000',
    '4': '10010001100', '5': '10010001100', '6': '10011001000', '7': '10011000100',
    '8': '10001100100', '9': '11001001000', '(': '11110111010', ')': '11000010100',
    'A': '11010001000', 'B': '11000101000', 'C': '10110001000', 'D': '10001101000',
    'E': '10001100010', 'F': '10110000100', 'G': '10000110100', 'H': '11000100010',
    'I': '11001000010', 'J': '11110100010', 'K': '10110111000', 'L': '10110001110',
    'M': '10001101110', 'N': '10111011000', 'O': '10111000110', 'P': '10001110110',
    'Q': '11101110110', 'R': '11010001110', 'S': '11000101110', 'T': '11011101000',
    'U': '11011100010', 'V': '11011101110', 'W': '11101011000', 'X': '11101000110',
    'Y': '11100010110', 'Z': '11101101000', '/': '10101111000'
  };

  // Build barcode pattern
  let barcodePattern = START_PATTERN + FNC1_PATTERN;
  
  for (let char of gs1Data) {
    const pattern = CODE128_PATTERNS[char] || CODE128_PATTERNS['0'];
    barcodePattern += pattern;
  }
  
  barcodePattern += STOP_PATTERN;

  // Draw barcode with improved readability
  const barWidth = 2; // Increased bar width
  const barHeight = 80; // Increased bar height
  const startX = 50;
  const startY = 20;

  ctx.fillStyle = 'black';
  let currentX = startX;

  // Draw bars
  for (let i = 0; i < barcodePattern.length && currentX < canvas.width - 50; i++) {
    if (barcodePattern[i] === '1') {
      ctx.fillRect(currentX, startY, barWidth, barHeight);
    }
    currentX += barWidth;
  }

  // Add human-readable text with better formatting
  ctx.fillStyle = 'black';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  
  // Display GS1 data in readable format
  const centerX = canvas.width / 2;
  const textY = startY + barHeight + 20;
  
  // Split long text into multiple lines if needed
  if (gs1Data.length > 40) {
    const firstLine = gs1Data.substring(0, 40);
    const secondLine = gs1Data.substring(40);
    ctx.fillText(firstLine, centerX, textY);
    ctx.fillText(secondLine, centerX, textY + 15);
  } else {
    ctx.fillText(gs1Data, centerX, textY);
  }
  
  // Add format label
  ctx.font = '10px Arial';
  ctx.fillText('EAN-128 (GS1-128)', centerX, textY + 30);

  return canvas.toDataURL('image/png');
};

export const downloadBarcode = downloadEAN128Barcode;
=======
=======
export const downloadBarcode = (text: string, filename?: string) => {
  const dataURL = generateBarcodeDataURL(text);
  const link = document.createElement('a');
  link.download = filename || `barcode-${text}.png`;
  link.href = dataURL;
  link.click();
};

>>>>>>> parent of 4650916 (Implement EAN-128 (GS1-128) Barcode Format)
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
<<<<<<< HEAD
};
>>>>>>> parent of 4650916 (Implement EAN-128 (GS1-128) Barcode Format)
=======
};
>>>>>>> parent of 4650916 (Implement EAN-128 (GS1-128) Barcode Format)
=======
export const downloadBarcode = downloadEAN128Barcode;
>>>>>>> parent of 6be3b3e (Fix Code Generator Syntax and Improve Barcode Readability)
