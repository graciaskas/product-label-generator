"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { ProductData, LabelTemplate } from "./label-generator"

interface ProductFormProps {
  productData: ProductData
  onProductDataChange: (data: ProductData) => void
  selectedTemplate: LabelTemplate | null
}

export function ProductForm({ productData, onProductDataChange, selectedTemplate }: ProductFormProps) {
  const [newUse, setNewUse] = useState("")
  const [newHazard, setNewHazard] = useState("")
  const [newPrecaution, setNewPrecaution] = useState("")

  const updateField = (field: keyof ProductData, value: any) => {
    onProductDataChange({ ...productData, [field]: value })
  }

  const updateManufacturerField = (field: keyof ProductData["manufacturer"], value: string) => {
    onProductDataChange({
      ...productData,
      manufacturer: { ...productData.manufacturer, [field]: value },
    })
  }

  const addUse = () => {
    if (newUse.trim()) {
      const uses = productData.uses || []
      updateField("uses", [...uses, newUse.trim()])
      setNewUse("")
    }
  }

  const removeUse = (index: number) => {
    const uses = productData.uses || []
    updateField(
      "uses",
      uses.filter((_, i) => i !== index),
    )
  }

  const addHazard = () => {
    if (newHazard.trim()) {
      const hazards = productData.hazardStatements || []
      updateField("hazardStatements", [...hazards, newHazard.trim()])
      setNewHazard("")
    }
  }

  const removeHazard = (index: number) => {
    const hazards = productData.hazardStatements || []
    updateField(
      "hazardStatements",
      hazards.filter((_, i) => i !== index),
    )
  }

  const addPrecaution = () => {
    if (newPrecaution.trim()) {
      const precautions = productData.precautionaryStatements || []
      updateField("precautionaryStatements", [...precautions, newPrecaution.trim()])
      setNewPrecaution("")
    }
  }

  const removePrecaution = (index: number) => {
    const precautions = productData.precautionaryStatements || []
    updateField(
      "precautionaryStatements",
      precautions.filter((_, i) => i !== index),
    )
  }

  if (!selectedTemplate) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Veuillez d'abord sélectionner un modèle d'étiquette.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations du Produit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Nom du Produit *</Label>
              <Input
                id="productName"
                value={productData.productName}
                onChange={(e) => updateField("productName", e.target.value)}
                placeholder="ex: QUININE HYDROCHLORIDE"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCode">Code Produit/Lot *</Label>
              <Input
                id="productCode"
                value={productData.productCode}
                onChange={(e) => updateField("productCode", e.target.value)}
                placeholder="ex: HC25/L0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturingDate">Date de Fabrication *</Label>
              <Input
                id="manufacturingDate"
                type="month"
                value={productData.manufacturingDate}
                onChange={(e) => updateField("manufacturingDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Date d'Expiration *</Label>
              <Input
                id="expiryDate"
                type="month"
                value={productData.expiryDate}
                onChange={(e) => updateField("expiryDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossWeight">Poids Brut (Kg)</Label>
              <Input
                id="grossWeight"
                value={productData.grossWeight}
                onChange={(e) => updateField("grossWeight", e.target.value)}
                placeholder="ex: 28,00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="netWeight">Poids Net (Kg) *</Label>
              <Input
                id="netWeight"
                value={productData.netWeight}
                onChange={(e) => updateField("netWeight", e.target.value)}
                placeholder="ex: 25,00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exportLot">N° Export</Label>
              <Input
                id="exportLot"
                value={productData.exportLot}
                onChange={(e) => updateField("exportLot", e.target.value)}
                placeholder="ex: 00/25"
              />
            </div>
          </div>

          {selectedTemplate.id === "template2" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="casNumber">Numéro CAS</Label>
                  <Input
                    id="casNumber"
                    value={productData.casNumber || ""}
                    onChange={(e) => updateField("casNumber", e.target.value)}
                    placeholder="ex: 6119-47-7"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin">Origine</Label>
                  <Input
                    id="origin"
                    value={productData.origin || ""}
                    onChange={(e) => updateField("origin", e.target.value)}
                    placeholder="ex: POWDER OF NATURAL ORIGIN"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="storageConditions">Conditions de Stockage *</Label>
            <Textarea
              id="storageConditions"
              value={productData.storageConditions}
              onChange={(e) => updateField("storageConditions", e.target.value)}
              placeholder="ex: Protect from light and humidity."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {selectedTemplate.id === "template2" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Utilisations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newUse}
                  onChange={(e) => setNewUse(e.target.value)}
                  placeholder="Ajouter une utilisation"
                  onKeyPress={(e) => e.key === "Enter" && addUse()}
                />
                <Button onClick={addUse} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {(productData.uses || []).map((use, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm">{use}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeUse(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Déclarations de Danger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newHazard}
                  onChange={(e) => setNewHazard(e.target.value)}
                  placeholder="ex: H302: Harmful if swallowed"
                  onKeyPress={(e) => e.key === "Enter" && addHazard()}
                />
                <Button onClick={addHazard} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {(productData.hazardStatements || []).map((hazard, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm">{hazard}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeHazard(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Déclarations de Précaution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newPrecaution}
                  onChange={(e) => setNewPrecaution(e.target.value)}
                  placeholder="ex: P102: Keep out of reach of children"
                  onKeyPress={(e) => e.key === "Enter" && addPrecaution()}
                />
                <Button onClick={addPrecaution} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {(productData.precautionaryStatements || []).map((precaution, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm">{precaution}</span>
                    <Button variant="ghost" size="sm" onClick={() => removePrecaution(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations du Fabricant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturerName">Nom du Fabricant *</Label>
              <Input
                id="manufacturerName"
                value={productData.manufacturer.name}
                onChange={(e) => updateManufacturerField("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturerWebsite">Site Web</Label>
              <Input
                id="manufacturerWebsite"
                value={productData.manufacturer.website}
                onChange={(e) => updateManufacturerField("website", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manufacturerAddress">Adresse Complète *</Label>
            <Textarea
              id="manufacturerAddress"
              value={productData.manufacturer.address}
              onChange={(e) => updateManufacturerField("address", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturerPhone">Téléphone</Label>
              <Input
                id="manufacturerPhone"
                value={productData.manufacturer.phone || ""}
                onChange={(e) => updateManufacturerField("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturerEmail">Email</Label>
              <Input
                id="manufacturerEmail"
                type="email"
                value={productData.manufacturer.email || ""}
                onChange={(e) => updateManufacturerField("email", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
