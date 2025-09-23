import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { ProductData } from './label-generator';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 10,
    flexWrap: 'wrap',
  },
  pageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  },
  label: {
    width: '48%',
    marginBottom: 10,
    border: '2pt solid #22c55e',
    backgroundColor: '#FFFFFF',
    pageBreakInside: 'avoid',
    minHeight: 350,
  },
  // Template 1 Styles
  template1Header: {
    backgroundColor: '#22c55e',
    color: '#FFFFFF',
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  template1HeaderLeft: {
    flex: 1,
  },
  template1HeaderRight: {
    width: 40,
    height: 40,
    border: '2pt solid #FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  template1Title: {
    backgroundColor: '#22c55e',
    color: '#FFFFFF',
    padding: 4,
    marginBottom: 4,
  },
  template1TitleText: {
    backgroundColor: '#FFFFFF',
    color: '#22c55e',
    borderRadius: 20,
    padding: 4,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  template1Content: {
    padding: 8,
  },
  template1Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  template1Label: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  template1Value: {
    fontSize: 8,
  },
  template1Storage: {
    color: '#dc2626',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
    fontSize: 8,
  },
  template1Manufacturer: {
    marginTop: 4,
  },
  template1ManufacturerName: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 8,
  },
  template1Shipping: {
    marginTop: 8,
    paddingTop: 8,
  },
  // Template 2 Styles
  template2Header: {
    border: '4pt solid #22c55e',
    padding: 6,
    marginBottom: 4,
    textAlign: 'center',
  },
  template2Title: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  template2Subtitle: {
    fontWeight: 'bold',
    fontSize: 8,
  },
  template2Info: {
    backgroundColor: '#f3f4f6',
    padding: 6,
    marginBottom: 4,
  },
  template2Content: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  template2Left: {
    flex: 2,
  },
  template2Right: {
    flex: 1,
    alignItems: 'center',
  },
  template2Section: {
    backgroundColor: '#22c55e',
    color: '#FFFFFF',
    padding: 4,
    marginBottom: 6,
  },
  template2SectionTitle: {
    fontWeight: 'bold',
    fontSize: 8,
    marginBottom: 2,
  },
  template2SectionContent: {
    fontSize: 6,
  },
  template2NetWeight: {
    textAlign: 'center',
    marginBottom: 8,
  },
  template2NetWeightLabel: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  template2NetWeightValue: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 20,
  },
  template2Warning: {
    textAlign: 'center',
    marginBottom: 8,
  },
  template2WarningText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  template2WarningIcon: {
    width: 40,
    height: 40,
    border: '4pt solid #dc2626',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  template2Footer: {
    backgroundColor: '#22c55e',
    color: '#FFFFFF',
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  template2FooterLogo: {
    width: 40,
    height: 40,
    border: '2pt solid #FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  template2FooterInfo: {
    flex: 1,
    textAlign: 'right',
    fontSize: 6,
  },
  // Barcode Styles
  barcodeContainer: {
    textAlign: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTop: '2pt solid #cccccc',
  },
  barcodeText: {
    fontFamily: 'Courier',
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  barcodeImage: {
    width: 150,
    height: 40,
    margin: '0 auto',
  },
  // Common Styles
  text: {
    fontSize: 8,
  },
  textBold: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 6,
  },
  textLarge: {
    fontSize: 10,
  },
});

interface PDFLabelProps {
  template: { id: string; name: string };
  productData: ProductData;
  generatedCode: string;
  barcodeDataURL: string;
  copies: number;
}

// Template 1 PDF Component
const Template1PDF: React.FC<{ productData: ProductData; generatedCode: string; barcodeDataURL: string }> = ({
  productData,
  generatedCode,
  barcodeDataURL,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    return `${month}/${year}`;
  };

  return (
    <View style={styles.label}>
      {/* Header */}
      <View style={styles.template1Header}>
        <View style={styles.template1HeaderLeft}>
          <Text style={[styles.textBold, { color: '#FFFFFF' }]}>
            {productData.manufacturer.name}
          </Text>
          <Text style={[styles.textSmall, { color: '#FFFFFF' }]}>
            {productData.manufacturer.address}
          </Text>
          <Text style={[styles.textSmall, { color: '#FFFFFF' }]}>
            {productData.manufacturer.country}
          </Text>
        </View>
        <View style={styles.template1HeaderRight}>
          <Text style={[styles.textSmall, { color: '#FFFFFF', textAlign: 'center' }]}>
            BUKAVU{'\n'}PHARMAKINA
          </Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.template1Title}>
        <View style={styles.template1TitleText}>
          <Text style={styles.template1TitleText}>
            {productData.name || "NOM DU PRODUIT"}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.template1Content}>
        <View style={styles.template1Row}>
          <Text style={styles.template1Label}>PRODUCT CODE/LOT N°</Text>
          <Text style={styles.template1Value}>: {productData.code || "HC25/L0000"}</Text>
        </View>
        <View style={styles.template1Row}>
          <Text style={[styles.template1Value, { marginLeft: 16 }]}>- Manufacturing date</Text>
          <Text style={styles.template1Value}>
            : {formatDate(productData.manufacturingDate) || "07/2025"}
          </Text>
        </View>
        <View style={styles.template1Row}>
          <Text style={[styles.template1Value, { marginLeft: 16 }]}>- Expiry date</Text>
          <Text style={styles.template1Value}>
            : {formatDate(productData.expiryDate) || "07/2030"}
          </Text>
        </View>
        <View style={styles.template1Row}>
          <Text style={[styles.template1Value, { marginLeft: 16 }]}>- Quantity: Gross Weight</Text>
          <Text style={styles.template1Value}>: {productData.grossWeight || "28,00"} Kg</Text>
        </View>
        <View style={styles.template1Row}>
          <Text style={[styles.template1Value, { marginLeft: 32 }]}>Net Weight</Text>
          <Text style={styles.template1Value}>: {productData.netWeight || "25,00"} Kg</Text>
        </View>
        <View style={styles.template1Row}>
          <Text style={styles.template1Label}>EXPORT L N°</Text>
          <Text style={styles.template1Value}>: {productData.exportLot || "- 00/25"}</Text>
        </View>

        <Text style={styles.template1Storage}>
          Storage conditions : {productData.storageConditions || "Protect from light and humidity."}
        </Text>

        <View style={styles.template1Manufacturer}>
          <View style={styles.template1Row}>
            <Text style={styles.template1Label}>Manufacturer: </Text>
            <Text style={styles.template1ManufacturerName}>{productData.manufacturer.name}</Text>
          </View>
          <Text style={[styles.template1Value, { marginLeft: 64 }]}>
            {productData.manufacturer.address}
          </Text>
          <Text style={[styles.template1Value, { marginLeft: 64 }]}>
            {productData.manufacturer.country}
          </Text>
          <View style={styles.template1Row}>
            <Text style={styles.template1Label}>Web site: </Text>
            <Text style={styles.template1Value}>{productData.manufacturer.website}</Text>
          </View>
        </View>

        <View style={styles.template1Shipping}>
          <Text style={styles.textLarge}>SHIPPING MARKS: --</Text>
        </View>

        {/* Barcode */}
        {generatedCode && (
          <View style={styles.barcodeContainer}>
            <Text style={styles.barcodeText}>
              Code de Traçabilité: {generatedCode}
            </Text>
            {barcodeDataURL && (
              <Image src={barcodeDataURL} style={styles.barcodeImage} />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

// Template 2 PDF Component
const Template2PDF: React.FC<{ productData: ProductData; generatedCode: string; barcodeDataURL: string }> = ({
  productData,
  generatedCode,
  barcodeDataURL,
}) => {
  return (
    <View style={styles.label}>
      {/* Header */}
      <View style={styles.template2Header}>
        <Text style={styles.template2Title}>
          {productData.name || "QUININE HYDROCHLORIDE DIHYDRATE"}
        </Text>
        <Text style={styles.template2Subtitle}>
          CAS: {productData.casNumber || "6119-47-7"}
        </Text>
        <Text style={styles.template2Subtitle}>
          {productData.origin || "POWDER OF NATURAL ORIGIN"}
        </Text>
        <Text style={styles.textSmall}>(Very bitter taste)</Text>
      </View>

      {/* Info Section */}
      <View style={styles.template2Info}>
        <Text style={styles.textBold}>REFERENCE PHARMACOPOEAIS: BP / USP / EP / IP</Text>
        <Text style={styles.textBold}>USES:</Text>
        {(productData.uses || [
          "1. ANTIMALARIAL DRUG (see WHO / national regulations)",
          "2. FLAVORING AGENT IN BEVERAGES (max: 83mg/L)",
        ]).map((use, index) => (
          <Text key={index} style={[styles.textSmall, { marginLeft: 16 }]}>{use}</Text>
        ))}
        <Text style={styles.textBold}>
          STORAGE CONDITIONS: {productData.storageConditions || "ambient conditions not exceeding 30°C-70% RH"}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.template2Content}>
        <View style={styles.template2Left}>
          {/* Hazard Statements */}
          <View style={styles.template2Section}>
            <Text style={styles.template2SectionTitle}>HAZARD STATEMENT:</Text>
            {(productData.hazardStatements || [
              "H302: Harmful if swallowed.",
              "H317: May cause an allergic skin reaction.",
              "H335: May cause respiratory irritation",
            ]).map((hazard, index) => (
              <Text key={index} style={styles.template2SectionContent}>{hazard}</Text>
            ))}
          </View>

          {/* Precautionary Statements */}
          <View style={styles.template2Section}>
            <Text style={styles.template2SectionTitle}>PRECAUTIONARY STATEMENT PREVENTION:</Text>
            {(productData.precautionaryStatements || [
              "P102: Keep out of reach of children.",
              "P103: Read label before use.",
              "P232: Protect from moisture",
              "P233: Keep container tightly closed.",
              "P270: Do not eat, drink or smoke when using this product.",
            ]).slice(0, 5).map((precaution, index) => (
              <Text key={index} style={styles.template2SectionContent}>{precaution}</Text>
            ))}
          </View>
        </View>

        <View style={styles.template2Right}>
          {/* Net Weight */}
          <View style={styles.template2NetWeight}>
            <Text style={styles.template2NetWeightLabel}>Net weight</Text>
            <Text style={styles.template2NetWeightValue}>
              {productData.netWeight || "25"} Kg
            </Text>
          </View>

          {/* Warning */}
          <View style={styles.template2Warning}>
            <Text style={styles.template2WarningText}>WARNING</Text>
            <View style={styles.template2WarningIcon}>
              <Text style={[styles.textLarge, { color: '#dc2626', fontSize: 32 }]}>!</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.template2Footer}>
        <View style={styles.template2FooterLogo}>
          <Text style={[styles.textSmall, { color: '#FFFFFF', textAlign: 'center' }]}>
            BUKAVU{'\n'}PHARMAKINA
          </Text>
        </View>
        <View style={styles.template2FooterInfo}>
          <Text style={[styles.textSmall, { color: '#FFFFFF' }]}>
            Manufactured by {productData.manufacturer.name}
          </Text>
          <Text style={[styles.textSmall, { color: '#FFFFFF' }]}>
            {productData.manufacturer.address}
          </Text>
          {productData.manufacturer.phone && (
            <Text style={[styles.textSmall, { color: '#FFFFFF' }]}>
              Tel. {productData.manufacturer.phone}
            </Text>
          )}
          {productData.manufacturer.email && (
            <Text style={[styles.textSmall, { color: '#FFFFFF' }]}>
              E-Mail : {productData.manufacturer.email}
            </Text>
          )}
          <Text style={[styles.textBold, { color: '#FFFFFF', fontSize: 8 }]}>
            {productData.manufacturer.country}
          </Text>
        </View>
      </View>

      {/* Barcode */}
      {generatedCode && (
        <View style={styles.barcodeContainer}>
          <Text style={styles.barcodeText}>
            Code de Traçabilité: {generatedCode}
          </Text>
          {barcodeDataURL && (
            <Image src={barcodeDataURL} style={styles.barcodeImage} />
          )}
        </View>
      )}
    </View>
  );
};

// Main PDF Document Component
export const LabelPDFDocument: React.FC<PDFLabelProps> = ({
  template,
  productData,
  generatedCode,
  barcodeDataURL,
  copies,
}) => {
  // Group labels into pages of 4
  const labelsPerPage = 4;
  const totalPages = Math.ceil(copies / labelsPerPage);
  const pages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const startIndex = pageIndex * labelsPerPage;
    const endIndex = Math.min(startIndex + labelsPerPage, copies);
    return Array.from({ length: endIndex - startIndex }, (_, labelIndex) => startIndex + labelIndex);
  });

  return (
    <Document>
      {pages.map((pageLabels, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={styles.pageGrid}>
            {pageLabels.map((labelIndex) => (
              <View key={labelIndex} style={styles.label}>
                {template.id === "template1" && (
                  <Template1PDF
                    productData={productData}
                    generatedCode={generatedCode}
                    barcodeDataURL={barcodeDataURL}
                  />
                )}
                {template.id === "template2" && (
                  <Template2PDF
                    productData={productData}
                    generatedCode={generatedCode}
                    barcodeDataURL={barcodeDataURL}
                  />
                )}
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};