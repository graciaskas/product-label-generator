"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { ProductForm } from "@/components/product-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "QUININE HYDROCHLORIDE",
    code: "HC25/L0000",
    manufacturer: "PHARMAKINA S.A.",
    category: "Antimalarial",
    status: "active",
    lastUpdated: "2025-01-15",
  },
  {
    id: 2,
    name: "QUININE HYDROCHLORIDE DIHYDRATE",
    code: "HC26/L0001",
    manufacturer: "PHARMAKINA S.A.",
    category: "Antimalarial",
    status: "active",
    lastUpdated: "2025-01-14",
  },
  {
    id: 3,
    name: "ARTEMETHER INJECTION",
    code: "AR15/L0002",
    manufacturer: "PHARMAKINA S.A.",
    category: "Antimalarial",
    status: "inactive",
    lastUpdated: "2025-01-10",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Gestion des produits
          </h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits pharmaceutiques
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau produit</DialogTitle>
            </DialogHeader>
            <ProductForm selectedTemplate="template1" onDataChange={() => {}} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">
          {filteredProducts.length} produit
          {filteredProducts.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <Badge
                    variant={
                      product.status === "active" ? "default" : "secondary"
                    }
                  >
                    {product.status === "active" ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>Code: {product.code}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Fabricant</p>
                  <p className="text-sm text-muted-foreground">
                    {product.manufacturer}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Catégorie</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dernière mise à jour</p>
                  <p className="text-sm text-muted-foreground">
                    {product.lastUpdated}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Aucun produit trouvé</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Essayez de modifier votre recherche"
              : "Commencez par ajouter votre premier produit"}
          </p>
        </div>
      )}
    </div>
  );
}
