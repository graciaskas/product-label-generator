"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, QrCode, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ProductData } from "./label-generator";
import { generateBarcodeDataURL, downloadBarcode } from "@/lib/barcode-generator";

interface CodeGeneratorProps {
  productData: ProductData;
  generatedCode: string;
  onGenerateCode: () => void;
}

type CodeFormat = "standard" | "batch" | "qr" | "barcode" | "custom";

export function CodeGenerator({
  productData,
  generatedCode,
  onGenerateCode,
}: CodeGeneratorProps) {
  const [codeFormat, setCodeFormat] = useState<CodeFormat>("barcode");
  const [customPrefix, setCustomPrefix] = useState("");
  const [batchSize, setBatchSize] = useState("1");
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [barcodeDataURL, setBarcodeDataURL] = useState<string>("");
  const { toast } = useToast();

  const generateCode = (format: CodeFormat, index?: number) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const code = productData.code.replace(/[^A-Z0-9]/g, "");
    const manufacturingDate = productData.manufacturingDate.replace(/-/g, "");
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();

    switch (format) {
      case "standard":
        return `${code}-${timestamp}`;
      case "batch":
        const batchNumber = String(index || 1).padStart(3, "0");
        return `${code}-${manufacturingDate}-${batchNumber}-${randomSuffix}`;
      case "qr":
        return `QR-${code}-${timestamp}-${randomSuffix}`;
      case "barcode":
        return `${code}${manufacturingDate.substring(2)}${randomSuffix}`;
      case "custom":
        const prefix = customPrefix || "CUSTOM";
        return `${prefix}-${code}-${timestamp}`;
      default:
        return `${code}-${timestamp}`;
    }
  };

  const handleGenerateCode = () => {
    if (codeFormat === "batch") {
      const size = Number.parseInt(batchSize) || 1;
      const codes = Array.from({ length: size }, (_, i) =>
        generateCode("batch", i + 1)
      );
      setGeneratedCodes(codes);
    } else {
      const code = generateCode(codeFormat);
      setGeneratedCodes([code]);
      onGenerateCode();
    }
  };

  useEffect(() => {
    if (
      generatedCodes.length > 0 &&
      codeFormat === "barcode"
    ) {
      const dataURL = generateBarcodeDataURL(generatedCodes[0]);
      setBarcodeDataURL(dataURL);
    }
  }, [generatedCodes, codeFormat]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le code a été copié dans le presse-papiers.",
    });
  };

  const copyAllCodes = () => {
    const allCodes = generatedCodes.join("\n");
    navigator.clipboard.writeText(allCodes);
    toast({
      title: "Tous les codes copiés !",
      description: `${generatedCodes.length} codes copiés dans le presse-papiers.`,
    });
  };

  const downloadBarcode = () => {
    if (generatedCodes.length > 0) {
      downloadBarcode(generatedCodes[0], `barcode-${generatedCodes[0]}.png`);
    }
  };

  const exportCodes = () => {
    const csvContent = [
      "Code,Produit,Date_Fabrication,Date_Expiration,Poids_Net",
      ...generatedCodes.map(
        (code) =>
          `${code},${productData.productName},${productData.manufacturingDate},${productData.expiryDate},${productData.netWeight}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `codes-tracabilite-${productData.code || "produit"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuration du Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codeFormat">Format du Code</Label>
            <Select
              value={codeFormat}
              onValueChange={(value: CodeFormat) => setCodeFormat(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">
                  Standard (PRODUIT-TIMESTAMP)
                </SelectItem>
                <SelectItem value="batch">
                  Lot (PRODUIT-DATE-LOT-RANDOM)
                </SelectItem>
                <SelectItem value="qr">
                  QR Code (QR-PRODUIT-TIMESTAMP-RANDOM)
                </SelectItem>
                <SelectItem value="barcode">
                  Code-barres (PRODUITDATERANDOM)
                </SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {codeFormat === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customPrefix">Préfixe Personnalisé</Label>
              <Input
                id="customPrefix"
                value={customPrefix}
                onChange={(e) => setCustomPrefix(e.target.value)}
                placeholder="ex: PHARMA, MED, etc."
              />
            </div>
          )}

          {codeFormat === "batch" && (
            <div className="space-y-2">
              <Label htmlFor="batchSize">Nombre de Codes à Générer</Label>
              <Input
                id="batchSize"
                type="number"
                min="1"
                max="1000"
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
                placeholder="1"
              />
            </div>
          )}

          <Button
            onClick={handleGenerateCode}
            className="w-full"
            disabled={!productData.code}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Générer {codeFormat === "batch" ? "les Codes" : "le Code"}
          </Button>
        </CardContent>
      </Card>

      {generatedCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Codes Générés
              <Badge variant="secondary">{generatedCodes.length} code(s)</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyAllCodes}>
                <Copy className="h-4 w-4 mr-2" />
                Copier Tous
              </Button>
              <Button variant="outline" size="sm" onClick={exportCodes}>
                <QrCode className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
              {codeFormat === "barcode" && (
                <Button variant="outline" size="sm" onClick={downloadBarcode}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger Code-barres
                </Button>
              )}
            </div>

            {codeFormat === "barcode" && generatedCodes.length > 0 && (
              <div className="flex justify-center p-4 bg-white border rounded">
                {barcodeDataURL && (
                  <img
                    src={barcodeDataURL}
                    alt={`Barcode: ${generatedCodes[0]}`}
                    className="border"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                )}
              </div>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {generatedCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted p-3 rounded"
                >
                  <code className="font-mono text-sm">{code}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations du Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Format:</span>
              <span className="ml-2 capitalize">{codeFormat}</span>
            </div>
            <div>
              <span className="font-semibold">Produit:</span>
              <span className="ml-2">{productData.code || "Non défini"}</span>
            </div>
            <div>
              <span className="font-semibold">Date Fab.:</span>
              <span className="ml-2">
                {productData.manufacturingDate || "Non définie"}
              </span>
            </div>
            <div>
              <span className="font-semibold">Date Exp.:</span>
              <span className="ml-2">
                {productData.expiryDate || "Non définie"}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t">
            <h4 className="font-semibold mb-2">Formats Disponibles:</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>
                • <strong>Standard:</strong> Format simple avec timestamp
              </div>
              <div>
                • <strong>Lot:</strong> Inclut date de fabrication et numéro de
                lot
              </div>
              <div>
                • <strong>QR Code:</strong> Optimisé pour les codes QR
              </div>
              <div>
                • <strong>Code-barres:</strong> Format compact sans séparateurs
              </div>
              <div>
                • <strong>Personnalisé:</strong> Avec votre propre préfixe
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
