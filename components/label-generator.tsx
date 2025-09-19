"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateSelector } from "./template-selector"
import { ProductForm } from "./product-form"
import { LabelPreview } from "./label-preview"
import { CodeGenerator } from "./code-generator"

export interface ProductData {
  productName: string
  productCode: string
  manufacturingDate: string
  expiryDate: string
  grossWeight: string
  netWeight: string
  exportLot: string
  casNumber?: string
  origin?: string
  uses?: string[]
  storageConditions: string
  hazardStatements?: string[]
  precautionaryStatements?: string[]
  manufacturer: {
    name: string
    address: string
    city: string
    country: string
    website: string
    phone?: string
    email?: string
  }
}

export interface LabelTemplate {
  id: string
  name: string
  description: string
  imageUrl: string
  type: "basic" | "detailed"
}

export function LabelGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<LabelTemplate | null>(null)
  const [productData, setProductData] = useState<ProductData>({
    productName: "",
    productCode: "",
    manufacturingDate: "",
    expiryDate: "",
    grossWeight: "",
    netWeight: "",
    exportLot: "",
    storageConditions: "",
    manufacturer: {
      name: "PHARMAKINA S.A.",
      address: "Km4, Route de Goma, P.O. Box 1240 BUKAVU",
      city: "BUKAVU",
      country: "Democratic Republic of Congo",
      website: "www.pharmakina.com",
      phone: "+(243) 999 455 668",
      email: "pk.kivu@pharmakina.com",
    },
  })
  const [generatedCode, setGeneratedCode] = useState<string>("")

  const handleGenerateCode = () => {
    const timestamp = Date.now().toString(36)
    const productCode = productData.productCode.replace(/[^A-Z0-9]/g, "")
    const code = `${productCode}-${timestamp.toUpperCase()}`
    setGeneratedCode(code)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration de l'Étiquette</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="template" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="template">Modèle</TabsTrigger>
                <TabsTrigger value="product">Produit</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="space-y-4">
                <TemplateSelector selectedTemplate={selectedTemplate} onTemplateSelect={setSelectedTemplate} />
              </TabsContent>

              <TabsContent value="product" className="space-y-4">
                <ProductForm
                  productData={productData}
                  onProductDataChange={setProductData}
                  selectedTemplate={selectedTemplate}
                />
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <CodeGenerator
                  productData={productData}
                  generatedCode={generatedCode}
                  onGenerateCode={handleGenerateCode}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu de l'Étiquette</CardTitle>
          </CardHeader>
          <CardContent>
            <LabelPreview template={selectedTemplate} productData={productData} generatedCode={generatedCode} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
