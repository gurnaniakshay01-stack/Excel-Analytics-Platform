import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Auth
      "Welcome to Excel Analytics Platform": "Welcome to Excel Analytics Platform",
      "Username": "Username",
      "Password": "Password",
      "Sign In": "Sign In",
      "Register": "Register",
      "Don't have an account?": "Don't have an account?",
      "Register here": "Register here",
      "Already have an account?": "Already have an account?",
      "Login here": "Login here",
      "Enter your username": "Enter your username",
      "Enter your password": "Enter your password",
      "User registered successfully!": "User registered successfully!",
      "Please fill in all fields": "Please fill in all fields",
      "Invalid credentials": "Invalid credentials",

      // Navigation
      "Home": "Home",
      "Upload": "Upload",
      "Charts": "Charts",
      "History": "History",
      "Admin": "Admin",
      "Logout": "Logout",

      // Dashboard
      "Dashboard": "Dashboard",
      "Total Files": "Total Files",
      "Active Users": "Active Users",
      "Data Points": "Data Points",
      "Recent Uploads": "Recent Uploads",
      "AI Summary": "AI Summary",
      "File Name": "File Name",
      "Upload Date": "Upload Date",
      "Size": "Size",
      "Status": "Status",

      // Upload
      "Drag and drop your Excel files here": "Drag and drop your Excel files here",
      "or click to select files": "or click to select files",
      "Upload Progress": "Upload Progress",
      "Processing...": "Processing...",
      "Upload Complete": "Upload Complete",

      // Charts
      "Select X Axis": "Select X Axis",
      "Select Y Axis": "Select Y Axis",
      "Chart Type": "Chart Type",
      "Bar Chart": "Bar Chart",
      "Line Chart": "Line Chart",
      "Pie Chart": "Pie Chart",
      "Scatter Plot": "Scatter Plot",
      "3D Chart": "3D Chart",
      "Export as PNG": "Export as PNG",
      "Export as PDF": "Export as PDF",

      // History
      "Upload History": "Upload History",
      "No uploads yet": "No uploads yet",

      // Admin
      "Admin Panel": "Admin Panel",
      "Users": "Users",
      "Activity Logs": "Activity Logs",
      "Expand": "Expand",
      "Collapse": "Collapse",

      // Common
      "Loading...": "Loading...",
      "Error": "Error",
      "Success": "Success",
      "Cancel": "Cancel",
      "Save": "Save",
      "Delete": "Delete",
      "Edit": "Edit",
      "View": "View"
    }
  },
  hi: {
    translation: {
      // Auth
      "Welcome to Excel Analytics Platform": "एक्सेल एनालिटिक्स प्लेटफॉर्म में आपका स्वागत है",
      "Username": "उपयोगकर्ता नाम",
      "Password": "पासवर्ड",
      "Sign In": "साइन इन करें",
      "Register": "पंजीकरण करें",
      "Don't have an account?": "खाता नहीं है?",
      "Register here": "यहाँ पंजीकरण करें",
      "Already have an account?": "पहले से खाता है?",
      "Login here": "यहाँ लॉगिन करें",
      "Enter your username": "अपना उपयोगकर्ता नाम दर्ज करें",
      "Enter your password": "अपना पासवर्ड दर्ज करें",
      "User registered successfully!": "उपयोगकर्ता सफलतापूर्वक पंजीकृत!",
      "Please fill in all fields": "कृपया सभी फ़ील्ड भरें",
      "Invalid credentials": "अमान्य क्रेडेंशियल",

      // Navigation
      "Home": "होम",
      "Upload": "अपलोड",
      "Charts": "चार्ट",
      "History": "इतिहास",
      "Admin": "एडमिन",
      "Logout": "लॉगआउट",

      // Dashboard
      "Dashboard": "डैशबोर्ड",
      "Total Files": "कुल फ़ाइलें",
      "Active Users": "सक्रिय उपयोगकर्ता",
      "Data Points": "डेटा पॉइंट",
      "Recent Uploads": "हाल के अपलोड",
      "AI Summary": "एआई सारांश",
      "File Name": "फ़ाइल नाम",
      "Upload Date": "अपलोड तिथि",
      "Size": "आकार",
      "Status": "स्थिति",

      // Upload
      "Drag and drop your Excel files here": "अपनी एक्सेल फ़ाइलों को यहाँ खींचें और छोड़ें",
      "or click to select files": "या फ़ाइलों का चयन करने के लिए क्लिक करें",
      "Upload Progress": "अपलोड प्रगति",
      "Processing...": "प्रोसेसिंग...",
      "Upload Complete": "अपलोड पूरा",

      // Charts
      "Select X Axis": "X अक्ष चुनें",
      "Select Y Axis": "Y अक्ष चुनें",
      "Chart Type": "चार्ट प्रकार",
      "Bar Chart": "बार चार्ट",
      "Line Chart": "लाइन चार्ट",
      "Pie Chart": "पाई चार्ट",
      "Scatter Plot": "स्कैटर प्लॉट",
      "3D Chart": "3D चार्ट",
      "Export as PNG": "PNG के रूप में निर्यात करें",
      "Export as PDF": "PDF के रूप में निर्यात करें",

      // History
      "Upload History": "अपलोड इतिहास",
      "No uploads yet": "अभी तक कोई अपलोड नहीं",

      // Admin
      "Admin Panel": "एडमिन पैनल",
      "Users": "उपयोगकर्ता",
      "Activity Logs": "गतिविधि लॉग",
      "Expand": "विस्तार करें",
      "Collapse": "संकुचित करें",

      // Common
      "Loading...": "लोड हो रहा है...",
      "Error": "त्रुटि",
      "Success": "सफलता",
      "Cancel": "रद्द करें",
      "Save": "सेव करें",
      "Delete": "मिटाएं",
      "Edit": "संपादित करें",
      "View": "देखें"
    }
  },
  fr: {
    translation: {
      // Auth
      "Welcome to Excel Analytics Platform": "Bienvenue sur Excel Analytics Platform",
      "Username": "Nom d'utilisateur",
      "Password": "Mot de passe",
      "Sign In": "Se connecter",
      "Register": "S'inscrire",
      "Don't have an account?": "Vous n'avez pas de compte?",
      "Register here": "S'inscrire ici",
      "Already have an account?": "Vous avez déjà un compte?",
      "Login here": "Se connecter ici",
      "Enter your username": "Entrez votre nom d'utilisateur",
      "Enter your password": "Entrez votre mot de passe",
      "User registered successfully!": "Utilisateur enregistré avec succès!",
      "Please fill in all fields": "Veuillez remplir tous les champs",
      "Invalid credentials": "Identifiants invalides",

      // Navigation
      "Home": "Accueil",
      "Upload": "Télécharger",
      "Charts": "Graphiques",
      "History": "Historique",
      "Admin": "Admin",
      "Logout": "Déconnexion",

      // Dashboard
      "Dashboard": "Tableau de bord",
      "Total Files": "Total des fichiers",
      "Active Users": "Utilisateurs actifs",
      "Data Points": "Points de données",
      "Recent Uploads": "Téléchargements récents",
      "AI Summary": "Résumé IA",
      "File Name": "Nom du fichier",
      "Upload Date": "Date de téléchargement",
      "Size": "Taille",
      "Status": "Statut",

      // Upload
      "Drag and drop your Excel files here": "Glissez-déposez vos fichiers Excel ici",
      "or click to select files": "ou cliquez pour sélectionner des fichiers",
      "Upload Progress": "Progression du téléchargement",
      "Processing...": "Traitement...",
      "Upload Complete": "Téléchargement terminé",

      // Charts
      "Select X Axis": "Sélectionner l'axe X",
      "Select Y Axis": "Sélectionner l'axe Y",
      "Chart Type": "Type de graphique",
      "Bar Chart": "Graphique à barres",
      "Line Chart": "Graphique linéaire",
      "Pie Chart": "Graphique circulaire",
      "Scatter Plot": "Nuage de points",
      "3D Chart": "Graphique 3D",
      "Export as PNG": "Exporter en PNG",
      "Export as PDF": "Exporter en PDF",

      // History
      "Upload History": "Historique des téléchargements",
      "No uploads yet": "Aucun téléchargement pour le moment",

      // Admin
      "Admin Panel": "Panneau d'administration",
      "Users": "Utilisateurs",
      "Activity Logs": "Journaux d'activité",
      "Expand": "Développer",
      "Collapse": "Réduire",

      // Common
      "Loading...": "Chargement...",
      "Error": "Erreur",
      "Success": "Succès",
      "Cancel": "Annuler",
      "Save": "Enregistrer",
      "Delete": "Supprimer",
      "Edit": "Modifier",
      "View": "Voir"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
