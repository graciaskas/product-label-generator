"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LabelTemplate } from "./label-generator"
import { cn } from "@/lib/utils"

const templates: LabelTemplate[] = [
  {
    id: "template1",
    name: "Modèle Standard",
    description: "Étiquette complète avec toutes les informations réglementaires",
    imageUrl: "/images/template1.png",
    type: "detailed",
  },
  {
    id: "template2",
    name: "Modèle Sécurisé",
    description: "Étiquette avec déclarations de danger et précautions",
    imageUrl: "/images/template2.png",
    type: "detailed",
  },
]

interface TemplateSelectorProps {
  selectedTemplate: LabelTemplate | null
  onTemplateSelect: (template: LabelTemplate) => void
}

export function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choisissez un modèle d'étiquette</h3>
      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedTemplate?.id === template.id && "ring-2 ring-primary",
            )}
            onClick={() => onTemplateSelect(template)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={template.imageUrl || "/placeholder.svg"}
                    alt={template.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-sm">{template.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {template.type === "detailed" ? "Détaillé" : "Basique"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
