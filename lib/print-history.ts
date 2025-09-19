export interface PrintHistoryEntry {
  id: string
  productName: string
  productCode: string
  template: string
  printedAt: string
  printedBy: string
  quantity: number
  status: "completed" | "failed"
  barcodeGenerated: string
  exportFormat?: string
  printSize?: string
}

// Simulate local storage for print history
export class PrintHistoryManager {
  private static STORAGE_KEY = "pharmakina_print_history"

  static addEntry(entry: Omit<PrintHistoryEntry, "id" | "printedAt">): PrintHistoryEntry {
    const newEntry: PrintHistoryEntry = {
      ...entry,
      id: Date.now().toString(),
      printedAt: new Date().toLocaleString("fr-FR"),
    }

    const history = this.getHistory()
    history.unshift(newEntry) // Add to beginning

    // Keep only last 1000 entries
    if (history.length > 1000) {
      history.splice(1000)
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history))
    return newEntry
  }

  static getHistory(): PrintHistoryEntry[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static getStats() {
    const history = this.getHistory()
    const today = new Date().toDateString()
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    return {
      total: history.length,
      today: history.filter((entry) => new Date(entry.printedAt).toDateString() === today).length,
      thisWeek: history.filter((entry) => new Date(entry.printedAt) >= thisWeek).length,
      thisMonth: history.filter((entry) => new Date(entry.printedAt) >= thisMonth).length,
      completed: history.filter((entry) => entry.status === "completed").length,
      failed: history.filter((entry) => entry.status === "failed").length,
    }
  }
}
