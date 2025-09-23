"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Printer, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pdf } from "@react-pdf/renderer";
import { PrintHistoryManager } from "@/lib/print-history";
import type { ProductData, LabelTemplate } from "./label-generator";
import { generateBarcodeDataURL } from "@/lib/barcode-generator";
import { LabelPDFDocument } from "./pdf-label-templates";

interface LabelPreviewProps {
  template: LabelTemplate | null;
  productData: ProductData;
  generatedCode: string;
}

type ExportFormat = "png" | "pdf" | "svg" | "json";
type PrintSize = "A4" | "A5" | "label" | "custom";

export function LabelPreview({
  template,
  productData,
  generatedCode,
}: LabelPreviewProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [printSize, setPrintSize] = useState<PrintSize>("A4");
  const [copies, setCopies] = useState("1");
  const [customWidth, setCustomWidth] = useState("800");
  const [customHeight, setCustomHeight] = useState("600");
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [barcodeDataURL, setBarcodeDataURL] = useState<string>("");
  const { toast } = useToast();

  // Generate barcode when generatedCode changes
  useEffect(() => {
    if (generatedCode) {
      const dataURL = generateBarcodeDataURL(generatedCode);
      setBarcodeDataURL(dataURL);
    }
  }, [generatedCode]);

  const handlePrint = useCallback(async () => {
    if (!template || !productData.name) {
      toast({
        title: "Erreur",
        description:
          "Veuillez remplir les informations du produit avant d'imprimer",
        variant: "destructive",
      });
      return;
    }

    setIsPrinting(true);

    try {
      // Generate PDF using react-pdf
      const pdfDoc = (
        <LabelPDFDocument
          template={template}
          productData={productData}
          generatedCode={generatedCode}
          barcodeDataURL={barcodeDataURL}
          copies={Number.parseInt(copies) || 1}
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

      PrintHistoryManager.addEntry({
        name: productData.name,
        code: productData.code || "N/A",
        template: template.name,
        printedBy: "Admin", // TODO: Get from auth context
        quantity: Number.parseInt(copies) || 1,
        status: "completed",
        barcodeGenerated: generatedCode,
        printSize:
          printSize === "custom"
            ? `${customWidth}x${customHeight}px`
            : printSize,
      });

      toast({
        title: "Impression réussie",
        description: `${copies} étiquette(s) générée(s) en PDF`,
      });

      // Clean up URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 10000);

    } catch (error) {
      console.error('Print error:', error);
      PrintHistoryManager.addEntry({
        name: productData.name,
        code: productData.code || "N/A",
        template: template.name,
        printedBy: "Admin",
        quantity: Number.parseInt(copies) || 1,
        status: "failed",
        barcodeGenerated: generatedCode,
        printSize:
          printSize === "custom"
            ? `${customWidth}x${customHeight}px`
            : printSize,
      });

      toast({
        title: "Erreur d'impression",
        description: "Une erreur s'est produite lors de l'impression",
        variant: "destructive",
      });
    } finally {
      setIsPrinting(false);
    }
  }, [template, productData, generatedCode, barcodeDataURL, copies, printSize, customWidth, customHeight, toast]);

  const getStylesForPrintSize = (size: PrintSize) => {
    switch (size) {
      case "A4":
        return ".label { width: 210mm; height: 297mm; }";
      case "A5":
        return ".label { width: 148mm; height: 210mm; }";
      case "label":
        return ".label { width: 100mm; height: 150mm; }";
      case "custom":
        return `.label { width: ${customWidth}px; height: ${customHeight}px; }`;
      default:
        return "";
    }
  };

  const handleExport = useCallback(async () => {
    if (!template || !productData.name) {
      toast({
        title: "Erreur",
        description:
          "Veuillez remplir les informations du produit avant d'exporter",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      switch (exportFormat) {
        case "png":
          await exportAsPNG();
          break;
        case "pdf":
          await exportAsPDF();
          break;
        case "svg":
          await exportAsSVG();
          break;
        case "json":
          await exportAsJSON();
          break;
      }

      PrintHistoryManager.addEntry({
        name: productData.name,
        code: productData.code || "N/A",
        template: template.name,
        printedBy: "Admin",
        quantity: 1,
        status: "completed",
        barcodeGenerated: generatedCode,
        exportFormat: exportFormat.toUpperCase(),
      });

      toast({
        title: "Export réussi",
        description: `Étiquette exportée en format ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      PrintHistoryManager.addEntry({
        name: productData.name,
        code: productData.code || "N/A",
        template: template.name,
        printedBy: "Admin",
        quantity: 1,
        status: "failed",
        barcodeGenerated: generatedCode,
        exportFormat: exportFormat.toUpperCase(),
      });

      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'exportation",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [template, productData, generatedCode, barcodeDataURL, exportFormat, toast]);

  const exportAsPNG = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const width = Number.parseInt(customWidth) || 800;
      const height = Number.parseInt(customHeight) || 600;
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.fillText(productData.name || "Produit", 50, 50);
      ctx.fillText(`Code: ${generatedCode}`, 50, 80);

      const link = document.createElement("a");
      link.download = `etiquette-${productData.code || "produit"}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const exportAsPDF = async () => {
    if (!template) return;

    const pdfDoc = (
      <LabelPDFDocument
        template={template}
        productData={productData}
        generatedCode={generatedCode}
        barcodeDataURL={barcodeDataURL}
        copies={1}
      />
    );

    const pdfBlob = await pdf(pdfDoc).toBlob();
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `etiquette-${productData.code || "produit"}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsSVG = async () => {
    const svgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="white" stroke="black" strokeWidth="2"/>
        <text x="50" y="50" fontFamily="Arial" fontSize="20" fill="black">${productData.name}</text>
        <text x="50" y="80" fontFamily="Arial" fontSize="14" fill="black">Code: ${generatedCode}</text>
      </svg>
    `;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `etiquette-${productData.code || "produit"}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = async () => {
    const jsonData = {
      template: template?.id,
      productData,
      generatedCode,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `etiquette-data-${productData.code || "produit"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!template) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Sélectionnez un modèle pour voir l'aperçu
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Options
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Options d'Impression et d'Exportation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Format d'Exportation</Label>
                  <Select
                    value={exportFormat}
                    onValueChange={(value: ExportFormat) =>
                      setExportFormat(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG (Image)</SelectItem>
                      <SelectItem value="pdf">PDF (Document)</SelectItem>
                      <SelectItem value="svg">SVG (Vectoriel)</SelectItem>
                      <SelectItem value="json">JSON (Données)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Taille d'Impression</Label>
                  <Select
                    value={printSize}
                    onValueChange={(value: PrintSize) => setPrintSize(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4 (210×297mm)</SelectItem>
                      <SelectItem value="A5">A5 (148×210mm)</SelectItem>
                      <SelectItem value="label">
                        Étiquette (100×150mm)
                      </SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {printSize === "custom" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Largeur (px)</Label>
                      <Input
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hauteur (px)</Label>
                      <Input
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Nombre de Copies</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={copies}
                    onChange={(e) => setCopies(e.target.value)}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            disabled={isPrinting}
          >
            <Printer className="h-4 w-4 mr-2" />
            {isPrinting ? "Impression..." : "Imprimer"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Export..." : "Exporter"}
          </Button>
        </div>
      </div>

      <Card>
        <div
          id="label-preview"
          className="bg-white border-2 border-gray-300 p-4 print:border-0 print:p-0"
        >
          {template.id === "template1" && (
            <Template1Preview
              productData={productData}
              generatedCode={generatedCode}
            />
          )}
          {template.id === "template2" && (
            <Template2Preview
              productData={productData}
              generatedCode={generatedCode}
            />
          )}
        </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informations d'Exportation</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Format:</span>{" "}
              {exportFormat.toUpperCase()}
            </div>
            <div>
              <span className="font-semibold">Taille:</span>{" "}
              {printSize === "custom"
                ? `${customWidth}×${customHeight}px`
                : printSize}
            </div>
            <div>
              <span className="font-semibold">Copies:</span> {copies}
            </div>
            <div>
              <span className="font-semibold">Modèle:</span> {template.name}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Template1Preview({
  productData,
  generatedCode,
  barcodeDataURL,
}: {
  productData: ProductData;
  generatedCode: string;
  barcodeDataURL: string;
}) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    return `${month}/${year}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white text-black font-sans text-sm">
      <div className="bg-green-500 text-white p-2 mb-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold text-xs">
              {productData.manufacturer.name}
            </div>
            <div className="text-xs">{productData.manufacturer.address}</div>
            <div className="text-xs">{productData.manufacturer.country}</div>
          </div>
          <div className="text-right">
            <div className="border-2 border-white rounded-full w-16 h-16 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs font-bold">BUKAVU</div>
                <div className="text-xs font-bold">PHARMAKINA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-500 text-white p-2 mb-2">
        <div className="bg-white text-green-800 rounded-full px-4 py-2 text-center font-bold text-lg">
          {productData.name || "NOM DU PRODUIT"}
        </div>
      </div>

      <div className="border-4 border-green-500 p-4 space-y-2">
        <div className="grid grid-cols-2 gap-x-8 text-sm">
          <div>
            <div className="flex justify-between">
              <span className="font-bold">PRODUCT CODE/LOT N°</span>
              <span>: {productData.code || "HC25/L0000"}</span>
            </div>
            <div className="flex justify-between">
              <span className="ml-4">- Manufacturing date</span>
              <span>
                : {formatDate(productData.manufacturingDate) || "07/2025"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="ml-4">- Expiry date</span>
              <span>: {formatDate(productData.expiryDate) || "07/2030"}</span>
            </div>
            <div className="flex justify-between">
              <span className="ml-4">- Quantity: Gross Weight</span>
              <span>: {productData.grossWeight || "28,00"} Kg</span>
            </div>
            <div className="flex justify-between">
              <span className="ml-8">Net Weight</span>
              <span>: {productData.netWeight || "25,00"} Kg</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-bold">EXPORT L N°</span>
              <span>: {productData.exportLot || "- 00/25"}</span>
            </div>
          </div>
        </div>

        <div className="text-red-600 font-bold text-center py-2">
          Storage conditions :{" "}
          {productData.storageConditions || "Protect from light and humidity."}
        </div>

        <div className="space-y-1">
          <div>
            <span className="font-bold">Manufacturer: </span>
            <span className="text-green-600 font-bold">
              {productData.manufacturer.name}
            </span>
          </div>
          <div className="ml-16">{productData.manufacturer.address}</div>
          <div className="ml-16">{productData.manufacturer.country}</div>
          <div>
            <span className="font-bold">Web site: </span>
            <span>{productData.manufacturer.website}</span>
          </div>
        </div>

        <div className="pt-8 pb-4">
          <div className="font-bold text-lg">SHIPPING MARKS: --</div>
        </div>

        {generatedCode && (
          <div className="barcode-container text-center pt-4 border-t-2 border-gray-300">
            <div className="barcode-text font-bold mb-2">
              Code de Traçabilité: {generatedCode}
            </div>
            {barcodeDataURL && (
              <img
                src={barcodeDataURL}
                alt={`Barcode: ${generatedCode}`}
                className="barcode-image mx-auto"
                style={{ maxWidth: "300px", height: "auto" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Template2Preview({
  productData,
  generatedCode,
  barcodeDataURL,
}: {
  productData: ProductData;
  generatedCode: string;
  barcodeDataURL: string;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white text-black font-sans text-sm">
      <div className="border-4 border-green-500 p-3 mb-2">
        <div className="text-center">
          <div className="text-red-600 font-bold text-lg mb-1">
            {productData.name || "QUININE HYDROCHLORIDE DIHYDRATE"}
          </div>
          <div className="font-bold">
            CAS: {productData.casNumber || "6119-47-7"}
          </div>
          <div className="font-bold">
            {productData.origin || "POWDER OF NATURAL ORIGIN"}
          </div>
          <div className="text-sm italic">(Very bitter taste)</div>
        </div>
      </div>

      <div className="bg-gray-100 p-3 mb-2 space-y-2">
        <div>
          <span className="font-bold">REFERENCE PHARMACOPOEAIS:</span>
          <span className="ml-4">BP / USP / EP / IP</span>
        </div>
        <div>
          <span className="font-bold">USES:</span>
          <div className="ml-4">
            {(
              productData.uses || [
                "1. ANTIMALARIAL DRUG (see WHO / national regulations)",
                "2. FLAVORING AGENT IN BEVERAGES (max: 83mg/L)",
              ]
            ).map((use, index) => (
              <div key={index}>{use}</div>
            ))}
          </div>
        </div>
        <div>
          <span className="font-bold">STORAGE CONDITIONS:</span>
          <span className="ml-2">
            {productData.storageConditions ||
              "ambient conditions not exceeding 30°C-70% RH"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-2">
        <div className="col-span-2 space-y-3">
          <div className="bg-green-500 text-white p-2">
            <div className="font-bold text-sm">HAZARD STATEMENT:</div>
            <div className="text-xs space-y-1">
              {(
                productData.hazardStatements || [
                  "H302: Harmful if swallowed.",
                  "H317: May cause an allergic skin reaction.",
                  "H335: May cause respiratory irritation",
                ]
              ).map((hazard, index) => (
                <div key={index}>{hazard}</div>
              ))}
            </div>
          </div>

          <div className="bg-green-500 text-white p-2">
            <div className="font-bold text-sm">
              PRECAUTIONARY STATEMENT PREVENTION:
            </div>
            <div className="text-xs space-y-1">
              {(
                productData.precautionaryStatements || [
                  "P102: Keep out of reach of children.",
                  "P103: Read label before use.",
                  "P232: Protect from moisture",
                  "P233: Keep container tightly closed.",
                  "P270: Do not eat, drink or smoke when using this product.",
                  "P273: Avoid release to the environment.",
                  "P280: Wear protective gloves/protective clothing/eye protection/face protection.",
                  "P281: Use personal protective equipment as required.",
                  "P284: Wear respiratory protection.",
                  "P285: In case of inadequate ventilation wear respiratory protection.",
                ]
              )
                .slice(0, 10)
                .map((precaution, index) => (
                  <div key={index}>{precaution}</div>
                ))}
            </div>
          </div>

          <div className="bg-green-500 text-white p-2">
            <div className="font-bold text-sm">
              PRECAUTIONARY STATEMENT RESPONSE:
            </div>
            <div className="text-xs space-y-1">
              <div>
                P301+P330+P331: If swallowed, rinse mouth. Do NOT induce
                vomiting.
              </div>
              <div>
                P302+P352: If on skin: Wash with plenty of soap and water.
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-green-600 font-bold text-2xl">Net weight</div>
            <div className="text-green-600 font-bold text-4xl">
              {productData.netWeight || "25"} Kg
            </div>
          </div>

          <div className="text-center">
            <div className="text-red-600 font-bold text-lg mb-2">WARNING</div>
            <div className="w-16 h-16 mx-auto border-4 border-red-600 bg-white flex items-center justify-center">
              <div className="text-red-600 text-4xl font-bold">!</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-500 text-white p-3">
        <div className="flex justify-between items-center">
          <div className="border-2 border-white rounded-full w-16 h-16 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-bold">BUKAVU</div>
              <div className="text-xs font-bold">PHARMAKINA</div>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="font-bold">
              Manufactured by {productData.manufacturer.name}
            </div>
            <div>{productData.manufacturer.address}</div>
            {productData.manufacturer.phone && (
              <div>Tel. {productData.manufacturer.phone}</div>
            )}
            {productData.manufacturer.email && (
              <div>E-Mail : {productData.manufacturer.email}</div>
            )}
            <div className="font-bold">{productData.manufacturer.country}</div>
          </div>
        </div>
      </div>

      {generatedCode && (
        <div className="barcode-container text-center pt-4 border-t-2 border-gray-300">
          <div className="barcode-text font-bold mb-2">
            Code de Traçabilité: {generatedCode}
          </div>
          {barcodeDataURL && (
            <img
              src={barcodeDataURL}
              alt={`Barcode: ${generatedCode}`}
              className="barcode-image mx-auto"
              style={{ maxWidth: "300px", height: "auto" }}
            />
          )}
        </div>
      )}
    </div>
  );
}
