"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Download,
  FileText,
  Search,
  Filter,
  Trash2,
} from "lucide-react";
import {
  PrintHistoryManager,
  type PrintHistoryEntry,
} from "@/lib/print-history";
import { useToast } from "@/hooks/use-toast";

export default function HistoryPage() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<PrintHistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    const loadHistory = () => {
      const realHistory = PrintHistoryManager.getHistory();
      setHistory(realHistory);
    };

    loadHistory();

    // Refresh every 5 seconds to catch new entries
    const interval = setInterval(loadHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportHistory = () => {
    const csvContent = [
      [
        "Produit",
        "Code",
        "Modèle",
        "Date d'impression",
        "Utilisateur",
        "Quantité",
        "Statut",
        "Code-barres",
        "Format",
      ],
      ...filteredHistory.map((item) => [
        item.productName,
        item.code,
        item.template,
        item.printedAt,
        item.printedBy,
        item.quantity,
        item.status,
        item.barcodeGenerated,
        item.exportFormat || item.printSize || "Print",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historique-impressions-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: `${filteredHistory.length} entrées exportées en CSV`,
    });
  };

  const clearHistory = () => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir effacer tout l'historique ? Cette action est irréversible."
      )
    ) {
      PrintHistoryManager.clearHistory();
      setHistory([]);
      toast({
        title: t('historyCleared'),
        description: t('allHistoryDeleted'),
      });
    }
  };

  return (
    <div className="space-y-6 ">
      <div className="flex flex-1 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t('printHistory')}</h1>
          <p className="text-muted-foreground">
            {t('printHistorySubtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearHistory}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t('clear')}
          </Button>
          <Button onClick={exportHistory}>
            <Download className="mr-2 h-4 w-4" />
            {t('exportCSV')}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('searchHistory')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t('filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStatuses')}</SelectItem>
            <SelectItem value="completed">{t('completed')}</SelectItem>
            <SelectItem value="failed">{t('failed')}</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary">
          {filteredHistory.length} {t('print')}{filteredHistory.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {item.productName}
                    </CardTitle>
                    <CardDescription>Code: {item.code}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    item.status === "completed" ? "default" : "destructive"
                  }
                >
                  {item.status === "completed" ? t('completed') : t('failed')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm font-medium">{t('templateUsed')}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.template}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('printDate')}</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {item.printedAt}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('quantity')}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} {t('labels')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('type')}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.exportFormat || item.printSize || t('print')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('barcodeGenerated')}</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {item.barcodeGenerated}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">{t('noHistoryFound')}</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? t('tryModifyingSearch')
              : t('noHistoryFoundDesc')}
          </p>
        </div>
      )}
    </div>
  );
}
