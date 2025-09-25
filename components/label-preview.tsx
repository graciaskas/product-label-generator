"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Printer,
  Eye,
  FileText,
  Package,
  Calendar,
  Weight,
  MapPin,
  AlertTriangle,
  Shield,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { LabelDocument } from "./pdf-label-templates";
import { generateEAN128Barcode, generateEAN128BarcodeDataURL } from "@/lib/barcode-generator";
import { PrintHistoryManager } from "@/lib/print-history";
import { useToast } from "@/hooks/use-toast";
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
  const [quantity, setQuantity] = useState(1);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [printSize, setPrintSize] = useState("A4");
  const [barcodeDataURL, setBarcodeDataURL] = useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Generate barcode when component mounts or data changes
  React.useEffect(() => {
    if (productData.code && productData.expiryDate && productData.netWeight) {
      const gs1Data = generateEAN128Barcode({
        code: productData.code,
        expiryDate: productData.expiryDate,
        netWeight: productData.netWeight
      });
      const dataURL = generateEAN128BarcodeDataURL(gs1Data);
      setBarcodeDataURL(dataURL);
    }
  }, [productData.code, productData.expiryDate, productData.netWeight]);

  const handlePrint = async () => {
    if (!template || !productData.name) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir les informations du produit",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add to print history
      PrintHistoryManager.addEntry({
        name: productData.name,
        code: productData.code || "N/A",
        template: template.name,
        printedBy: "Utilisateur actuel",
        quantity: quantity,
        status: "completed",
        barcodeGenerated: generatedCode || "N/A",
        exportFormat: exportFormat,
        printSize: printSize,
      });

      // Generate PDF and trigger print
      if (exportFormat === "pdf") {
        const doc = LabelDocument({
          template,
          productData,
          quantity,
          barcodeDataURL,
        });
        const pdfBlob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(pdfBlob);
        
        // Open in new window for printing
        const printWindow = window.open(url);
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      }

      toast({
        title: "Impression lancée",
        description: `${quantity} étiquette(s) envoyée(s) à l'impression`,
      });
    } catch (error) {
      console.error("Print error:", error);
      
      PrintHistoryManager.addEntry({
        name: productData.name,
        code: productData.code || "N/A",
        template: template?.name || "Unknown",
        printedBy: "Utilisateur actuel",
        quantity: quantity,
        status: "failed",
        barcodeGenerated: generatedCode || "N/A",
        exportFormat: exportFormat,
        printSize: printSize,
      });

      toast({
        title: "Erreur d'impression",
        description: "Une erreur s'est produite lors de l'impression",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const [year, month] = dateString.split("-");
    return `${month}/${year}`;
  };

  if (!template) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
            Aucun modèle sélectionné
          </h3>
          <p className="text-muted-foreground">
            Choisissez un modèle pour voir l'aperçu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Print Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Options d'Impression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Taille</Label>
              <Select value={printSize} onValueChange={setPrintSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="Letter">Letter</SelectItem>
                  <SelectItem value="Label">Label Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handlePrint} className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Imprimer ({quantity})
            </Button>
            
            {template && productData.name && (
              <PDFDownloadLink
                document={
                  <LabelDocument
                    template={template}
                    productData={productData}
                    quantity={quantity}
                    barcodeDataURL={barcodeDataURL}
                  />
                }
                fileName={`etiquette-${productData.code}-${Date.now()}.pdf`}
                className="flex-1"
              >
                {({ loading }) => (
                  <Button variant="outline" disabled={loading} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    {loading ? "Génération..." : "Télécharger PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Label Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu - {template.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-white" ref={previewRef}>
            {template.id === "template1" ? (
              <Template1Preview
                productData={productData}
                generatedCode={generatedCode}
                barcodeDataURL={barcodeDataURL}
              />
            ) : (
              <Template2Preview
                productData={productData}
                generatedCode={generatedCode}
                barcodeDataURL={barcodeDataURL}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Template 1 Preview Component
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
    if (!dateString) return "N/A";
    const [year, month] = dateString.split("-");
    return `${month}/${year}`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border-2 border-gray-300 text-xs font-sans">
      {/* Header */}
      <div className="bg-green-600 text-white p-2 text-center">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="font-bold text-sm">{productData?.manufacturer?.name || "PHARMAKINA S.A."}</div>
            <div className="text-xs">{productData?.manufacturer?.website || "www.pharmakina.com"}</div>
          </div>
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <Package className="w-4 h-4 text-green-600" />
          </div>
        </div>
      </div>

      {/* Product Name */}
      <div className="bg-gray-100 p-2 text-center border-b">
        <div className="font-bold text-sm text-gray-800">
          {productData?.name || "PRODUCT NAME"}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-2 space-y-1">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-semibold">Code:</span> {productData?.code || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Export:</span> {productData?.exportLot || "N/A"}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className="font-semibold">Mfg:</span> {formatDate(productData?.manufacturingDate)}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className="font-semibold">Exp:</span> {formatDate(productData?.expiryDate)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Weight className="w-3 h-3" />
            <span className="font-semibold">Gross:</span> {productData?.grossWeight || "N/A"} Kg
          </div>
          <div className="flex items-center gap-1">
            <Weight className="w-3 h-3" />
            <span className="font-semibold">Net:</span> {productData?.netWeight || "N/A"} Kg
          </div>
        </div>
      </div>

      {/* Storage Conditions */}
      <div className="p-2 border-t">
        <div className="text-red-600 font-semibold text-xs mb-1">Storage Conditions:</div>
        <div className="text-xs text-gray-700">
          {productData?.storageConditions || "Store in a cool, dry place"}
        </div>
      </div>

      {/* Manufacturer Info */}
      <div className="p-2 border-t bg-gray-50">
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="font-semibold">Address:</span>
          </div>
          <div className="text-xs text-gray-600 ml-4">
            {productData?.manufacturer?.address || "Km4, Route de Goma, P.O. Box 1240 BUKAVU"}
          </div>
          <div className="text-xs text-gray-600 ml-4">
            {productData?.manufacturer?.city || "BUKAVU"}, {productData?.manufacturer?.country || "Democratic Republic of Congo"}
          </div>
          
          {(productData?.manufacturer?.phone || productData?.manufacturer?.email) && (
            <div className="flex items-center gap-2 mt-1">
              {productData?.manufacturer?.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span className="text-xs">{productData.manufacturer.phone}</span>
                </div>
              )}
              {productData?.manufacturer?.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span className="text-xs">{productData.manufacturer.email}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shipping Marks */}
      <div className="p-2 border-t">
        <div className="font-semibold text-xs mb-1">SHIPPING MARKS:</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <Package className="w-4 h-4 mx-auto mb-1" />
            <div>HANDLE WITH CARE</div>
          </div>
          <div className="text-center">
            <Shield className="w-4 h-4 mx-auto mb-1" />
            <div>KEEP DRY</div>
          </div>
          <div className="text-center">
            <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
            <div>FRAGILE</div>
          </div>
        </div>
      </div>

      {/* Barcode */}
      {barcodeDataURL && (
        <div className="p-2 border-t text-center">
          <img 
            src={barcodeDataURL} 
            alt="Barcode" 
            className="mx-auto max-w-full h-auto"
            style={{ maxHeight: '40px' }}
          />
          <div className="text-xs mt-1 font-mono">
            {generatedCode || productData?.code || "TRACKING CODE"}
          </div>
        </div>
      )}
    </div>
  );
}

// Template 2 Preview Component
function Template2Preview({
  productData,
  generatedCode,
  barcodeDataURL,
}: {
  productData: ProductData;
  generatedCode: string;
  barcodeDataURL: string;
}) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const [year, month] = dateString.split("-");
    return `${month}/${year}`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border-2 border-gray-300 text-xs font-sans">
      {/* Product Header */}
      <div className="p-2 border-b bg-gray-50">
        <div className="font-bold text-sm text-center mb-2">
          {productData?.name || "PRODUCT NAME"}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-semibold">CAS No:</span> {productData?.casNumber || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Origin:</span> {productData?.origin || "N/A"}
          </div>
        </div>
      </div>

      {/* Reference Pharmacopoeias */}
      <div className="p-2 border-b">
        <div className="font-semibold text-xs mb-1">Reference Pharmacopoeias:</div>
        <div className="text-xs text-gray-600">USP, BP, Ph. Eur.</div>
      </div>

      {/* Uses */}
      {productData?.uses && productData.uses.length > 0 && (
        <div className="p-2 border-b">
          <div className="font-semibold text-xs mb-1">Uses:</div>
          <div className="text-xs text-gray-600">
            {productData.uses.join(", ")}
          </div>
        </div>
      )}

      {/* Storage Conditions */}
      <div className="p-2 border-b">
        <div className="font-semibold text-xs mb-1">Storage Conditions:</div>
        <div className="text-xs text-gray-600">
          {productData?.storageConditions || "Store in a cool, dry place"}
        </div>
      </div>

      {/* Hazard Statements */}
      {productData?.hazardStatements && productData.hazardStatements.length > 0 && (
        <div className="p-2 border-b">
          <div className="bg-green-100 p-2 rounded">
            <div className="font-semibold text-xs mb-1 text-green-800">Hazard Statements:</div>
            <div className="space-y-1">
              {productData.hazardStatements.map((hazard, index) => (
                <div key={index} className="text-xs text-green-700">
                  • {hazard}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Precautionary Statements */}
      {productData?.precautionaryStatements && productData.precautionaryStatements.length > 0 && (
        <div className="p-2 border-b">
          <div className="bg-yellow-100 p-2 rounded">
            <div className="font-semibold text-xs mb-1 text-yellow-800">Precautionary Statements:</div>
            <div className="space-y-1">
              {productData.precautionaryStatements.map((precaution, index) => (
                <div key={index} className="text-xs text-yellow-700">
                  • {precaution}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Net Weight */}
      <div className="p-2 border-b text-center">
        <div className="font-bold text-lg">
          NET: {productData?.netWeight || "N/A"} Kg
        </div>
      </div>

      {/* Warning */}
      <div className="p-2 border-b bg-red-50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <div className="font-semibold text-xs text-red-800">
            Keep out of reach of children
          </div>
        </div>
      </div>

      {/* Manufacturer Footer */}
      <div className="p-2 bg-gray-50">
        <div className="text-xs space-y-1">
          <div className="font-semibold">{productData?.manufacturer?.name || "PHARMAKINA S.A."}</div>
          <div className="text-gray-600">
            {productData?.manufacturer?.address || "Km4, Route de Goma, P.O. Box 1240 BUKAVU"}
          </div>
          <div className="text-gray-600">
            {productData?.manufacturer?.city || "BUKAVU"}, {productData?.manufacturer?.country || "DRC"}
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" />
            <span>{productData?.manufacturer?.website || "www.pharmakina.com"}</span>
          </div>
        </div>
      </div>

      {/* Barcode */}
      {barcodeDataURL && (
        <div className="p-2 border-t text-center">
          <img 
            src={barcodeDataURL} 
            alt="Barcode" 
            className="mx-auto max-w-full h-auto"
            style={{ maxHeight: '40px' }}
          />
          <div className="text-xs mt-1 font-mono">
            {generatedCode || productData?.code || "TRACKING CODE"}
          </div>
        </div>
      )}
    </div>
  );
}