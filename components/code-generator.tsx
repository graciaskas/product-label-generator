"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  QrCode, 
  Download, 
  Copy, 
  RefreshCw, 
  Package,
  Calendar,
  Weight,
  Hash
} from "lucide-react";
import { 
  generateEAN128Barcode, 
  generateEAN128BarcodeDataURL,
  downloadEAN128Barcode 
} from "@/lib/barcode-generator";
import { useToast } from "@/hooks/use-toast";
import type { ProductData } from "./label-generator";

interface CodeGeneratorProps {
  productData: ProductData;
  generatedCode: string;
  onGenerateCode: () => void;
}

export function CodeGenerator({ 
  productData, 
  generatedCode, 
  onGenerateCode 
}: CodeGeneratorProps) {
  const [lotNumber, setLotNumber] = useState(productData.code || "");
  const [expiryDate, setExpiryDate] = useState(productData.expiryDate || "");
  const [netWeight, setNetWeight] = useState(productData.netWeight || "");
  const [barcodeDataURL, setBarcodeDataURL] = useState<string>("");
  const { toast } = useToast();

  const generateBarcode = () => {
    if (!lotNumber || !expiryDate || !netWeight) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    const barcodeData = {
      code: lotNumber,
      expiryDate: expiryDate,
      netWeight: netWeight
    };

    const gs1Data = generateEAN128Barcode(barcodeData);
    const dataURL = generateEAN128BarcodeDataURL(gs1Data);
    setBarcodeDataURL(dataURL);
    onGenerateCode();

    toast({
      title: "Code-barres généré",
      description: "Le code-barres EAN-128 a été créé avec succès",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Code copié dans le presse-papiers",
    });
  };

  const downloadBarcode = () => {
    if (!barcodeDataURL) {
      toast({
        title: "Aucun code-barres",
        description: "Veuillez d'abord générer un code-barres",
        variant: "destructive",
      });
      return;
    }

    const barcodeData = {
      code: lotNumber,
      expiryDate: expiryDate,
      netWeight: netWeight
    };

    const gs1Data = generateEAN128Barcode(barcodeData);
    downloadEAN128Barcode(gs1Data, `barcode-${lotNumber}-${Date.now()}.png`);
  };

  const currentGS1Data = lotNumber && expiryDate && netWeight 
    ? generateEAN128Barcode({
        code: lotNumber,
        expiryDate: expiryDate,
        netWeight: netWeight
      })
    : "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Générateur de Code-barres EAN-128
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lotNumber" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Numéro de Lot *
              </Label>
              <Input
                id="lotNumber"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                placeholder="ex: HC25/L0000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date d'Expiration *
              </Label>
              <Input
                id="expiryDate"
                type="month"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="netWeight" className="flex items-center gap-2">
              <Weight className="h-4 w-4" />
              Poids Net (kg) *
            </Label>
            <Input
              id="netWeight"
              value={netWeight}
              onChange={(e) => setNetWeight(e.target.value)}
              placeholder="ex: 25.00"
            />
          </div>

          <Button 
            onClick={generateBarcode} 
            className="w-full"
            disabled={!lotNumber || !expiryDate || !netWeight}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Générer Code-barres EAN-128
          </Button>
        </CardContent>
      </Card>

      {currentGS1Data && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu du Code-barres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barcode Image */}
            {barcodeDataURL && (
              <div className="flex justify-center p-4 bg-white rounded-lg border">
                <img 
                  src={barcodeDataURL} 
                  alt="Code-barres EAN-128" 
                  className="max-w-full h-auto"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            )}

            {/* GS1 Data Display */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span className="font-medium">Données GS1-128:</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(currentGS1Data)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="font-mono text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded border break-all">
                {currentGS1Data}
              </div>

              {/* Data Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    <span className="font-mono mr-2">(01)</span>
                    GTIN: {lotNumber.replace(/[^A-Z0-9]/g, '').padStart(13, '0')}
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <span className="font-mono mr-2">(10)</span>
                    Lot: {lotNumber}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    <span className="font-mono mr-2">(17)</span>
                    Expiry: {expiryDate ? expiryDate.replace('-', '').substring(2) + '01' : ''}
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <span className="font-mono mr-2">(3103)</span>
                    Weight: {netWeight ? (parseFloat(netWeight) * 1000).toString().padStart(6, '0') : ''}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={downloadBarcode}
                disabled={!barcodeDataURL}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger PNG
              </Button>
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(currentGS1Data)}
                className="flex-1"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copier Données
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Format EAN-128 (GS1-128)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>AI 01:</strong> GTIN (Global Trade Item Number)</p>
          <p><strong>AI 10:</strong> Numéro de lot/batch</p>
          <p><strong>AI 17:</strong> Date d'expiration (AAMMJJ)</p>
          <p><strong>AI 3103:</strong> Poids net en kg (3 décimales)</p>
        </CardContent>
      </Card>
    </div>
  );
}