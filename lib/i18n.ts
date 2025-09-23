import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: "Dashboard",
      generateLabels: "Generate Labels",
      productManagement: "Product Management",
      users: "Users",
      history: "History",
      statistics: "Statistics",
      settings: "Settings",
      
      // Dashboard
      dashboardTitle: "Dashboard",
      dashboardSubtitle: "Manage your products and generate pharmaceutical labels",
      registeredProducts: "Registered Products",
      generatedLabels: "Generated Labels",
      prints: "Prints",
      generatedCodes: "Generated Codes",
      quickActions: "Quick Actions",
      generateLabel: "Generate Label",
      manageProducts: "Manage Products",
      viewHistory: "View History",
      recentActivity: "Recent Activity",
      
      // Authentication
      login: "Login",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      role: "Role",
      department: "Department",
      forgotPassword: "Forgot Password?",
      
      // History
      printHistory: "Print History",
      printHistorySubtitle: "View history of all printed labels",
      searchHistory: "Search in history...",
      filterByStatus: "Filter by status",
      allStatuses: "All statuses",
      completed: "Completed",
      failed: "Failed",
      clear: "Clear",
      exportCSV: "Export CSV",
      noHistoryFound: "No history found",
      noHistoryFoundDesc: "No prints have been made yet",
      tryModifyingSearch: "Try modifying your search",
      
      // Print History Details
      productName: "Product",
      code: "Code",
      templateUsed: "Template Used",
      printDate: "Print Date",
      quantity: "Quantity",
      type: "Type",
      barcodeGenerated: "Generated Barcode",
      labels: "labels",
      print: "Print",
      
      // Label Generation
      generateLabelTitle: "Generate Label",
      generateLabelSubtitle: "Create professional labels with traceability codes",
      labelConfiguration: "Label Configuration",
      template: "Template",
      product: "Product",
      
      // Common
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      search: "Search",
      filter: "Filter",
      export: "Export",
      loading: "Loading...",
      success: "Success",
      error: "Error",
      
      // Theme
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      
      // Language
      language: "Language",
      english: "English",
      french: "French",
    }
  },
  fr: {
    translation: {
      // Navigation
      dashboard: "Tableau de bord",
      generateLabels: "Générer étiquettes",
      productManagement: "Gestion produits",
      users: "Utilisateurs",
      history: "Historique",
      statistics: "Statistiques",
      settings: "Paramètres",
      
      // Dashboard
      dashboardTitle: "Tableau de bord",
      dashboardSubtitle: "Gérez vos produits et générez des étiquettes pharmaceutiques",
      registeredProducts: "Produits enregistrés",
      generatedLabels: "Étiquettes générées",
      prints: "Impressions",
      generatedCodes: "Codes générés",
      quickActions: "Actions rapides",
      generateLabel: "Générer une étiquette",
      manageProducts: "Gérer les produits",
      viewHistory: "Voir l'historique",
      recentActivity: "Activité récente",
      
      // Authentication
      login: "Se connecter",
      signup: "S'inscrire",
      email: "Adresse email",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      firstName: "Prénom",
      lastName: "Nom",
      phone: "Téléphone",
      role: "Rôle",
      department: "Département",
      forgotPassword: "Mot de passe oublié ?",
      
      // History
      printHistory: "Historique des impressions",
      printHistorySubtitle: "Consultez l'historique de toutes les étiquettes imprimées",
      searchHistory: "Rechercher dans l'historique...",
      filterByStatus: "Filtrer par statut",
      allStatuses: "Tous les statuts",
      completed: "Terminé",
      failed: "Échoué",
      clear: "Effacer",
      exportCSV: "Exporter CSV",
      noHistoryFound: "Aucun historique trouvé",
      noHistoryFoundDesc: "Aucune impression n'a encore été effectuée",
      tryModifyingSearch: "Essayez de modifier votre recherche",
      
      // Print History Details
      productName: "Produit",
      code: "Code",
      templateUsed: "Modèle utilisé",
      printDate: "Date d'impression",
      quantity: "Quantité",
      type: "Type",
      barcodeGenerated: "Code-barres généré",
      labels: "étiquettes",
      print: "Impression",
      
      // Label Generation
      generateLabelTitle: "Générer une étiquette",
      generateLabelSubtitle: "Créez des étiquettes professionnelles avec codes de traçabilité",
      labelConfiguration: "Configuration de l'Étiquette",
      template: "Modèle",
      product: "Produit",
      
      // Common
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      add: "Ajouter",
      search: "Rechercher",
      filter: "Filtrer",
      export: "Exporter",
      loading: "Chargement...",
      success: "Succès",
      error: "Erreur",
      
      // Theme
      lightMode: "Mode Clair",
      darkMode: "Mode Sombre",
      
      // Language
      language: "Langue",
      english: "Anglais",
      french: "Français",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;