"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, FileText, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateBarcodeDataURL } from "@/lib/barcode-generator";
import { PrintHistoryManager } from "@/lib/print-history";
import { pdf } from "@react-pdf/renderer";
import { LabelPDFDocument } from "./pdf-label-templates";
import type { ProductData, LabelTemplate } from "./label-generator";

interface LabelPreviewProps {
  template: LabelTemplate | null;
  productData: ProductData;
  generatedCode: string;
}

export function LabelPreview({
  template,
  productData,
  generatedCode,
}: LabelPreviewProps) {
  const [copies, setCopies] = useState("4");
  const [isGenerating, setIsGenerating] = useState(false);
  const [barcodeDataURL, setBarcodeDataURL] = useState<string>("");
  const { toast } = useToast();

  // Generate barcode when code changes
  useEffect(() => {
    if (generatedCode) {
      const dataURL = generateBarcodeDataURL(generatedCode);
      setBarcodeDataURL(dataURL);
    }
  }, [generatedCode]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    return `${month}/${year}`;
  };

  const handlePrint = async () => {
    if (!template || !productData.name) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un modèle et remplir les informations du produit.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const numCopies = Number.parseInt(copies) || 1;
      
      // Generate PDF
      const pdfDoc = (
        <LabelPDFDocument
          template={template}
          productData={productData}
          generatedCode={generatedCode}
          barcodeDataURL={barcodeDataURL}
          copies={numCopies}
        />
      );

      const pdfBlob = await pdf(pdfDoc).toBlob();
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open PDF in new window for printing
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }

      // Add to print history
      PrintHistoryManager.addEntry({
        name: productData.name,
        code: productData.code,
        template: template.name,
        printedBy: "Utilisateur actuel",
        quantity: numCopies,
        status: "completed",
        barcodeGenerated: generatedCode,
        printSize: "A4",
      });

      toast({
        title: "Impression lancée",
        description: `${numCopies} étiquette(s) envoyée(s) à l'impression.`,
      });

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      toast({
        title: "Erreur d'impression",
        description: "Une erreur s'est produite lors de la génération du PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (!template || !productData.name) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un modèle et remplir les informations du produit.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const numCopies = Number.parseInt(copies) || 1;
      
      // Generate PDF
      const pdfDoc = (
        <LabelPDFDocument
          template={template}
          productData={productData}
          generatedCode={generatedCode}
          barcodeDataURL={barcodeDataURL}
          copies={numCopies}
        />
      );

      const pdfBlob = await pdf(pdfDoc).toBlob();
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Download PDF
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `etiquettes-${productData.code || "produit"}-${Date.now()}.pdf`;
      link.click();

      // Add to print history
      PrintHistoryManager.addEntry({
        name: productData.name,
        code: productData.code,
        template: template.name,
        printedBy: "Utilisateur actuel",
        quantity: numCopies,
        status: "completed",
        barcodeGenerated: generatedCode,
        exportFormat: "PDF",
      });

      toast({
        title: "Export réussi",
        description: `${numCopies} étiquette(s) exportée(s) en PDF.`,
      });

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de la génération du PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!template) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Aucun modèle sélectionné</h3>
        <p className="text-muted-foreground">
          Veuillez sélectionner un modèle d'étiquette pour voir l'aperçu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Print Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Options d'impression</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="copies">Nombre de copies</Label>
            <Input
              id="copies"
              type="number"
              min="1"
              max="100"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
              className="w-32"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              disabled={isGenerating || !productData.name}
              className="flex-1"
            >
              <Printer className="mr-2 h-4 w-4" />
              {isGenerating ? "Génération..." : "Imprimer"}
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isGenerating || !productData.name}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Label Preview */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Aperçu - {template.name}</h3>
          <Badge variant="secondary">{template.type === "detailed" ? "Détaillé" : "Basique"}</Badge>
        </div>

        {/* Template 1 Preview */}
        {template.id === "template1" && (
          <div className="label-preview border-2 border-green-600 bg-white text-black max-w-2xl mx-auto">
            {/* Header */}
            <div className="bg-green-600 text-white p-3 flex justify-between items-start">
              <div className="flex-1">
                <div className="font-bold text-sm">{productData.manufacturer?.name || "PHARMAKINA S.A."}</div>
                <div className="text-xs">{productData.manufacturer?.address || "Km4, Route de Goma, P.O. Box 1240 BUKAVU"}</div>
                <div className="text-xs">{productData.manufacturer?.country || "Democratic Republic of Congo"}</div>
              </div>
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                <div className="text-xs text-center leading-tight">
                  BUKAVU<br />PHARMAKINA
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="bg-green-600 p-2">
              <div className="bg-white text-green-600 rounded-full py-2 px-4 text-center font-bold">
                {productData.name || "NOM DU PRODUIT"}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="font-bold">PRODUCT CODE/LOT N°</span>
                <span>: {productData.code || "HC25/L0000"}</span>
              </div>
              <div className="flex justify-between ml-4">
                <span>- Manufacturing date</span>
                <span>: {formatDate(productData.manufacturingDate) || "07/2025"}</span>
              </div>
              <div className="flex justify-between ml-4">
                <span>- Expiry date</span>
                <span>: {formatDate(productData.expiryDate) || "07/2030"}</span>
              </div>
              <div className="flex justify-between ml-4">
                <span>- Quantity: Gross Weight</span>
                <span>: {productData.grossWeight || "28,00"} Kg</span>
              </div>
              <div className="flex justify-between ml-8">
                <span>Net Weight</span>
                <span>: {productData.netWeight || "25,00"} Kg</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">EXPORT L N°</span>
                <span>: {productData.exportLot || "- 00/25"}</span>
              </div>

              <div className="text-center text-red-600 font-bold py-2">
                Storage conditions : {productData.storageConditions || "Protect from light and humidity."}
              </div>

              <div className="space-y-1">
                <div className="flex">
                  <span className="font-bold">Manufacturer: </span>
                  <span className="text-green-600 font-bold">{productData.manufacturer?.name || "PHARMAKINA S.A."}</span>
                </div>
                <div className="ml-16 text-xs">
                  {productData.manufacturer?.address || "Km4, Route de Goma, P.O. Box 1240 BUKAVU"}
                </div>
                <div className="ml-16 text-xs">
                  {productData.manufacturer?.country || "Democratic Republic of Congo"}
                </div>
                <div className="flex">
                  <span className="font-bold">Web site: </span>
                  <span>{productData.manufacturer?.website || "www.pharmakina.com"}</span>
                </div>
              </div>

              <div className="pt-4">
                <div className="text-lg font-bold">SHIPPING MARKS: --</div>
              </div>

              {/* Barcode Section */}
              {generatedCode && (
                <div className="barcode-container border-t-2 border-gray-300 pt-4 mt-4 text-center">
                  <div className="font-mono font-bold text-sm mb-2">
                    Code de Traçabilité: {generatedCode}
                  </div>
                  {barcodeDataURL && (
                    <img 
                      src={barcodeDataURL} 
                      alt={`Barcode ${generatedCode}`}
                      className="barcode-image mx-auto max-w-full h-auto"
                      style={{ maxWidth: '300px', height: '80px' }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Template 2 Preview */}
        {template.id === "template2" && (
          <div className="label-preview bg-white text-black max-w-2xl mx-auto">
            {/* Header */}
            <div className="border-4 border-green-600 p-3 mb-2 text-center">
              <div className="text-red-600 font-bold text-lg mb-1">
                {productData.name || "QUININE HYDROCHLORIDE DIHYDRATE"}
              </div>
              <div className="font-bold text-sm">
                CAS: {productData.casNumber || "6119-47-7"}
              </div>
              <div className="font-bold text-sm">
                {productData.origin || "POWDER OF NATURAL ORIGIN"}
              </div>
              <div className="text-xs">(Very bitter taste)</div>
            </div>

            {/* Info Section */}
            <div className="bg-gray-100 p-3 mb-2 text-xs">
              <div className="font-bold">REFERENCE PHARMACOPOEAIS: BP / USP / EP / IP</div>
              <div className="font-bold">USES:</div>
              {(productData.uses || [
                "1. ANTIMALARIAL DRUG (see WHO / national regulations)",
                "2. FLAVORING AGENT IN BEVERAGES (max: 83mg/L)"
              ]).map((use, index) => (
                <div key={index} className="ml-4">{use}</div>
              ))}
              <div className="font-bold">
                STORAGE CONDITIONS: {productData.storageConditions || "ambient conditions not exceeding 30°C-70% RH"}
              </div>
            </div>

            {/* Content */}
            <div className="flex mb-2">
              <div className="flex-2 space-y-3">
                {/* Hazard Statements */}
                <div className="bg-green-600 text-white p-2">
                  <div className="font-bold text-xs mb-1">HAZARD STATEMENT:</div>
                  {(productData.hazardStatements || [
                    "H302: Harmful if swallowed.",
                    "H317: May cause an allergic skin reaction.",
                    "H335: May cause respiratory irritation"
                  ]).map((hazard, index) => (
                    <div key={index} className="text-xs">{hazard}</div>
                  ))}
                </div>

                {/* Precautionary Statements */}
                <div className="bg-green-600 text-white p-2">
                  <div className="font-bold text-xs mb-1">PRECAUTIONARY STATEMENT PREVENTION:</div>
                  {(productData.precautionaryStatements || [
                    "P102: Keep out of reach of children.",
                    "P103: Read label before use.",
                    "P232: Protect from moisture",
                    "P233: Keep container tightly closed.",
                    "P270: Do not eat, drink or smoke when using this product."
                  ]).slice(0, 5).map((precaution, index) => (
                    <div key={index} className="text-xs">{precaution}</div>
                  ))}
                </div>
              </div>

              <div className="flex-1 text-center space-y-4">
                {/* Net Weight */}
                <div>
                  <div className="text-green-600 font-bold text-sm">Net weight</div>
                  <div className="text-green-600 font-bold text-3xl">
                    {productData.netWeight || "25"} Kg
                  </div>
                </div>

                {/* Warning */}
                <div>
                  <div className="text-red-600 font-bold text-lg mb-2">WARNING</div>
                  <div className="w-16 h-16 border-4 border-red-600 bg-white mx-auto flex items-center justify-center">
                    <span className="text-red-600 text-3xl font-bold">!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-green-600 text-white p-3 flex justify-between items-center">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                <div className="text-xs text-center leading-tight">
                  BUKAVU<br />PHARMAKINA
                </div>
              </div>
              <div className="text-right text-xs">
                <div>Manufactured by {productData.manufacturer?.name || "PHARMAKINA S.A."}</div>
                <div>{productData.manufacturer?.address || "Km4, Route de Goma, P.O. Box 1240 BUKAVU"}</div>
                {productData.manufacturer?.phone && (
                  <div>Tel. {productData.manufacturer.phone}</div>
                )}
                {productData.manufacturer?.email && (
                  <div>E-Mail : {productData.manufacturer.email}</div>
                )}
                <div className="font-bold">
                  {productData.manufacturer?.country || "Democratic Republic of Congo"}
                </div>
              </div>
            </div>

            {/* Barcode Section */}
            {generatedCode && (
              <div className="barcode-container border-t-2 border-gray-300 pt-4 mt-4 text-center">
                <div className="font-mono font-bold text-sm mb-2">
                  Code de Traçabilité: {generatedCode}
                </div>
                {barcodeDataURL && (
                  <img 
                    src={barcodeDataURL} 
                    alt={`Barcode ${generatedCode}`}
                    className="barcode-image mx-auto max-w-full h-auto"
                    style={{ maxWidth: '300px', height: '80px' }}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .label-preview {
            page-break-inside: avoid;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .barcode-container {
            page-break-inside: avoid;
          }
          
          .barcode-image {
            max-width: 300px !important;
            height: 80px !important;
            display: block !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </div>
  );
}