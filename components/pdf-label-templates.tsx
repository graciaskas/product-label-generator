import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { ProductData, LabelTemplate } from "./label-generator";

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  labelContainer: {
    width: "48%",
    margin: "1%",
    border: "2px solid #16a34a",
    backgroundColor: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  // Template 1 Styles
  template1Header: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  template1HeaderText: {
    flex: 1,
  },
  template1CompanyName: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
  },
  template1Address: {
    fontSize: 7,
    lineHeight: 1.2,
  },
  template1Logo: {
    width: 30,
    height: 30,
    border: "2px solid #ffffff",
    borderRadius: 15,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
  template1LogoText: {
    fontSize: 6,
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 1,
  },
  template1Title: {
    backgroundColor: "#16a34a",
    padding: 6,
  },
  template1TitleInner: {
    backgroundColor: "#ffffff",
    color: "#16a34a",
    borderRadius: 10,
    padding: 6,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "bold",
  },
  template1Content: {
    padding: 8,
    fontSize: 7,
    lineHeight: 1.3,
  },
  template1Row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  template1Label: {
    fontWeight: "bold",
  },
  template1Value: {
    flex: 1,
    textAlign: "right",
  },
  template1StorageConditions: {
    textAlign: "center",
    color: "#dc2626",
    fontWeight: "bold",
    marginVertical: 4,
    fontSize: 7,
  },
  template1Manufacturer: {
    marginTop: 4,
  },
  template1ManufacturerName: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  template1ShippingMarks: {
    marginTop: 6,
    fontSize: 8,
    fontWeight: "bold",
  },
  // Template 2 Styles
  template2Header: {
    border: "3px solid #16a34a",
    padding: 6,
    marginBottom: 4,
    textAlign: "center",
  },
  template2ProductName: {
    color: "#dc2626",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  template2CasNumber: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 1,
  },
  template2Origin: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 1,
  },
  template2Taste: {
    fontSize: 6,
  },
  template2InfoSection: {
    backgroundColor: "#f3f4f6",
    padding: 6,
    marginBottom: 4,
    fontSize: 6,
    lineHeight: 1.2,
  },
  template2InfoTitle: {
    fontWeight: "bold",
    marginBottom: 1,
  },
  template2MainContent: {
    flexDirection: "row",
    marginBottom: 4,
  },
  template2LeftColumn: {
    flex: 2,
    paddingRight: 4,
  },
  template2RightColumn: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
  },
  template2HazardSection: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    padding: 4,
    marginBottom: 6,
    fontSize: 6,
    lineHeight: 1.2,
  },
  template2SectionTitle: {
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 6,
  },
  template2NetWeight: {
    marginBottom: 8,
  },
  template2NetWeightLabel: {
    color: "#16a34a",
    fontSize: 7,
    fontWeight: "bold",
  },
  template2NetWeightValue: {
    color: "#16a34a",
    fontSize: 16,
    fontWeight: "bold",
  },
  template2Warning: {
    alignItems: "center",
  },
  template2WarningTitle: {
    color: "#dc2626",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  template2WarningIcon: {
    width: 32,
    height: 32,
    border: "3px solid #dc2626",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  template2WarningIconText: {
    color: "#dc2626",
    fontSize: 20,
    fontWeight: "bold",
  },
  template2Footer: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    padding: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 6,
  },
  template2FooterLogo: {
    width: 24,
    height: 24,
    border: "2px solid #ffffff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  template2FooterLogoText: {
    fontSize: 5,
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 1,
  },
  template2FooterText: {
    textAlign: "right",
    flex: 1,
    lineHeight: 1.2,
  },
  template2FooterCountry: {
    fontWeight: "bold",
  },
  // Barcode Styles
  barcodeContainer: {
    borderTop: "2px solid #d1d5db",
    paddingTop: 6,
    marginTop: 6,
    alignItems: "center",
  },
  barcodeLabel: {
    fontSize: 7,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: "Courier",
  },
  barcodeImage: {
    width: 150,
    height: 40,
  },
});

interface LabelPDFDocumentProps {
  template: LabelTemplate;
  productData: ProductData;
  generatedCode: string;
  barcodeDataURL: string;
  copies: number;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const [year, month] = dateString.split("-");
  return `${month}/${year}`;
};

const Template1Label: React.FC<{
  productData: ProductData;
  generatedCode: string;
  barcodeDataURL: string;
}> = ({ productData, generatedCode, barcodeDataURL }) => (
  <View style={styles.labelContainer}>
    {/* Header */}
    <View style={styles.template1Header}>
      <View style={styles.template1HeaderText}>
        <Text style={styles.template1CompanyName}>
          {productData.manufacturer?.name || "PHARMAKINA S.A."}
        </Text>
        <Text style={styles.template1Address}>
          {productData.manufacturer?.address ||
            "Km4, Route de Goma, P.O. Box 1240 BUKAVU"}
        </Text>
        <Text style={styles.template1Address}>
          {productData.manufacturer?.country || "Democratic Republic of Congo"}
        </Text>
      </View>
      <View style={styles.template1Logo}>
        <Text style={styles.template1LogoText}>BUKAVU{"\n"}PHARMAKINA</Text>
      </View>
    </View>

    {/* Title */}
    <View style={styles.template1Title}>
      <View style={styles.template1TitleInner}>
        <Text>{productData.name || "NOM DU PRODUIT"}</Text>
      </View>
    </View>

    {/* Content */}
    <View style={styles.template1Content}>
      <View style={styles.template1Row}>
        <Text style={styles.template1Label}>PRODUCT CODE/LOT N°</Text>
        <Text style={styles.template1Value}>
          : {productData.code || "HC25/L0000"}
        </Text>
      </View>
      <View style={styles.template1Row}>
        <Text> - Manufacturing date</Text>
        <Text style={styles.template1Value}>
          : {formatDate(productData.manufacturingDate) || "07/2025"}
        </Text>
      </View>
      <View style={styles.template1Row}>
        <Text> - Expiry date</Text>
        <Text style={styles.template1Value}>
          : {formatDate(productData.expiryDate) || "07/2030"}
        </Text>
      </View>
      <View style={styles.template1Row}>
        <Text> - Quantity: Gross Weight</Text>
        <Text style={styles.template1Value}>
          : {productData.grossWeight || "28,00"} Kg
        </Text>
      </View>
      <View style={styles.template1Row}>
        <Text> Net Weight</Text>
        <Text style={styles.template1Value}>
          : {productData.netWeight || "25,00"} Kg
        </Text>
      </View>
      <View style={styles.template1Row}>
        <Text style={styles.template1Label}>EXPORT L N°</Text>
        <Text style={styles.template1Value}>
          : {productData.exportLot || "- 00/25"}
        </Text>
      </View>

      <Text style={styles.template1StorageConditions}>
        Storage conditions :{" "}
        {productData.storageConditions || "Protect from light and humidity."}
      </Text>

      <View style={styles.template1Manufacturer}>
        <View style={styles.template1Row}>
          <Text style={styles.template1Label}>Manufacturer: </Text>
          <Text
            style={[styles.template1Value, styles.template1ManufacturerName]}
          >
            {productData.manufacturer?.name || "PHARMAKINA S.A."}
          </Text>
        </View>
        <Text style={[styles.template1Address, { marginLeft: 40 }]}>
          {productData.manufacturer?.address ||
            "Km4, Route de Goma, P.O. Box 1240 BUKAVU"}
        </Text>
        <Text style={[styles.template1Address, { marginLeft: 40 }]}>
          {productData.manufacturer?.country || "Democratic Republic of Congo"}
        </Text>
        <View style={styles.template1Row}>
          <Text style={styles.template1Label}>Web site: </Text>
          <Text style={styles.template1Value}>
            {productData.manufacturer?.website || "www.pharmakina.com"}
          </Text>
        </View>
      </View>

      <Text style={styles.template1ShippingMarks}>SHIPPING MARKS: --</Text>

      {/* Barcode Section */}
      {generatedCode && (
        <View style={styles.barcodeContainer}>
          <Text style={styles.barcodeLabel}>
            Code de Traçabilité: {(() => {
              try {
                const parsed = JSON.parse(generatedCode);
                return parsed.trackingCode || parsed.code || generatedCode;
              } catch {
                return generatedCode;
              }
            })()}
          </Text>
          {barcodeDataURL && (
            <Image src={barcodeDataURL} style={styles.barcodeImage} />
          )}
        </View>
      )}
    </View>
  </View>
);

const Template2Label: React.FC<{
  productData: ProductData;
  generatedCode: string;
  barcodeDataURL: string;
}> = ({ productData, generatedCode, barcodeDataURL }) => (
  <View style={styles.labelContainer}>
    {/* Header */}
    <View style={styles.template2Header}>
      <Text style={styles.template2ProductName}>
        {productData.name || "QUININE HYDROCHLORIDE DIHYDRATE"}
      </Text>
      <Text style={styles.template2CasNumber}>
        CAS: {productData.casNumber || "6119-47-7"}
      </Text>
      <Text style={styles.template2Origin}>
        {productData.origin || "POWDER OF NATURAL ORIGIN"}
      </Text>
      <Text style={styles.template2Taste}>(Very bitter taste)</Text>
    </View>

    {/* Info Section */}
    <View style={styles.template2InfoSection}>
      <Text style={styles.template2InfoTitle}>
        REFERENCE PHARMACOPOEAIS: BP / USP / EP / IP
      </Text>
      <Text style={styles.template2InfoTitle}>USES:</Text>
      {(
        productData.uses || [
          "1. ANTIMALARIAL DRUG (see WHO / national regulations)",
          "2. FLAVORING AGENT IN BEVERAGES (max: 83mg/L)",
        ]
      ).map((use, index) => (
        <Text key={index} style={{ marginLeft: 8 }}>
          {use}
        </Text>
      ))}
      <Text style={styles.template2InfoTitle}>
        STORAGE CONDITIONS:{" "}
        {productData.storageConditions ||
          "ambient conditions not exceeding 30°C-70% RH"}
      </Text>
    </View>

    {/* Main Content */}
    <View style={styles.template2MainContent}>
      <View style={styles.template2LeftColumn}>
        {/* Hazard Statements */}
        <View style={styles.template2HazardSection}>
          <Text style={styles.template2SectionTitle}>HAZARD STATEMENT:</Text>
          {(
            productData.hazardStatements || [
              "H302: Harmful if swallowed.",
              "H317: May cause an allergic skin reaction.",
              "H335: May cause respiratory irritation",
            ]
          ).map((hazard, index) => (
            <Text key={index}>{hazard}</Text>
          ))}
        </View>

        {/* Precautionary Statements */}
        <View style={styles.template2HazardSection}>
          <Text style={styles.template2SectionTitle}>
            PRECAUTIONARY STATEMENT PREVENTION:
          </Text>
          {(
            productData.precautionaryStatements || [
              "P102: Keep out of reach of children.",
              "P103: Read label before use.",
              "P232: Protect from moisture",
              "P233: Keep container tightly closed.",
              "P270: Do not eat, drink or smoke when using this product.",
            ]
          )
            .slice(0, 5)
            .map((precaution, index) => (
              <Text key={index}>{precaution}</Text>
            ))}
        </View>
      </View>

      <View style={styles.template2RightColumn}>
        {/* Net Weight */}
        <View style={styles.template2NetWeight}>
          <Text style={styles.template2NetWeightLabel}>Net weight</Text>
          <Text style={styles.template2NetWeightValue}>
            {productData.netWeight || "25"} Kg
          </Text>
        </View>

        {/* Warning */}
        <View style={styles.template2Warning}>
          <Text style={styles.template2WarningTitle}>WARNING</Text>
          <View style={styles.template2WarningIcon}>
            <Text style={styles.template2WarningIconText}>!</Text>
          </View>
        </View>
      </View>
    </View>

    {/* Footer */}
    <View style={styles.template2Footer}>
      <View style={styles.template2FooterLogo}>
        <Text style={styles.template2FooterLogoText}>
          BUKAVU{"\n"}PHARMAKINA
        </Text>
      </View>
      <View style={styles.template2FooterText}>
        <Text>
          Manufactured by {productData.manufacturer?.name || "PHARMAKINA S.A."}
        </Text>
        <Text>
          {productData.manufacturer?.address ||
            "Km4, Route de Goma, P.O. Box 1240 BUKAVU"}
        </Text>
        {productData.manufacturer?.phone && (
          <Text>Tel. {productData.manufacturer.phone}</Text>
        )}
        {productData.manufacturer?.email && (
          <Text>E-Mail : {productData.manufacturer.email}</Text>
        )}
        <Text style={styles.template2FooterCountry}>
          {productData.manufacturer?.country || "Democratic Republic of Congo"}
        </Text>
      </View>
    </View>

    {/* Barcode Section */}
    {generatedCode && (
      <View style={styles.barcodeContainer}>
        <Text style={styles.barcodeLabel}>
          Code de Traçabilité: {(() => {
            try {
              const parsed = JSON.parse(generatedCode);
              return parsed.trackingCode || parsed.code || generatedCode;
            } catch {
              return generatedCode;
            }
          })()}
        </Text>
        {barcodeDataURL && (
          <Image src={barcodeDataURL} style={styles.barcodeImage} />
        )}
      </View>
    )}
  </View>
);

export const LabelPDFDocument: React.FC<LabelPDFDocumentProps> = ({
  template,
  productData,
  generatedCode,
  barcodeDataURL,
  copies,
}) => {
  // Calculate number of pages needed (4 labels per page)
  const labelsPerPage = 4;
  const totalPages = Math.ceil(copies / labelsPerPage);

  const pages = [];
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const startIndex = pageIndex * labelsPerPage;
    const endIndex = Math.min(startIndex + labelsPerPage, copies);
    const labelsOnThisPage = endIndex - startIndex;

    pages.push(
      <Page key={pageIndex} size="A4" style={styles.page}>
        {Array.from({ length: labelsOnThisPage }, (_, labelIndex) => {
          const LabelComponent =
            template.id === "template1" ? Template1Label : Template2Label;
          return (
            <LabelComponent
              key={startIndex + labelIndex}
              productData={productData}
              generatedCode={generatedCode}
              barcodeDataURL={barcodeDataURL}
            />
          );
        })}
      </Page>
    );
  }

  return <Document>{pages}</Document>;
};
