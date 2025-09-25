// Import JsBarcode library
import JsBarcode from "jsbarcode";

// The core function to generate the barcode as a data URL
export const generateBarcodeDataURL = (text: string): string => {
  // Create a canvas element to render the barcode
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  // Set canvas dimensions
  canvas.width = 300;
  canvas.height = 80;

  // Clear canvas with white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Use JsBarcode to draw the barcode directly onto the canvas.
  // We use the "CODE128" format, which is the technical standard
  // for EAN-128. The 'ean128' option ensures GS1 compliance.
  JsBarcode(canvas, text, {
    format: "CODE128",
    displayValue: true, // Display the human-readable text below the bars
    ean128: true, // Crucial for proper GS1-128 formatting
    width: 3, // Adjusts the width of the bars
    height: 50, // Adjusts the height of the bars
    margin: 12,
  });

  // Return the barcode image as a data URL
  return canvas.toDataURL("image/png");
};

// The function to download the generated barcode image
export const downloadBarcode = (text: string, filename?: string) => {
  const dataURL = generateBarcodeDataURL(text);
  const link = document.createElement("a");
  link.download = filename || `barcode-${text}.png`;
  link.href = dataURL;
  link.click();
};

// This function now generates a properly formatted GS1-128 data string.
// It combines the Application Identifiers (AIs) with the product data.
// Note: Variable-length fields like batch code are terminated by the
// FNC1 character, which JsBarcode automatically handles with the GS1 standard.
export const generateProductInfoString = (productData: any): string => {
  const gtin = productData.code || "";
  const expDate = productData.expiryDate || ""; // Format: YYMMDD
  const batchCode = productData.exportLot || "";

  // The format is (AI)Data(AI)Data...
  // Example: (01)GTIN(17)ExpiryDate(10)BatchCode
  return `(01)${gtin}(17)${expDate}(10)${batchCode}`;
};

// This function now correctly parses the GS1 string back into a JavaScript object.
export const parseProductInfoFromBarcode = (scannedData: string): any => {
  try {
    const data = {};
    // Regex to find all Application Identifiers and their data
    const aiRegex = /\((\d{2,4})\)(.*?)(?=\(\d{2,4}\)|\s*$)/g;
    let match;

    while ((match = aiRegex.exec(scannedData)) !== null) {
      const ai = match[1];
      const value = match[2];

      // Map the AIs to meaningful property names
      if (ai === "01") data.code = value;
      if (ai === "17") data.expiryDate = value;
      if (ai === "10") data.exportLot = value;
      // Add more AIs as needed...
    }
    return data;
  } catch (error) {
    return { rawData: scannedData };
  }
};
