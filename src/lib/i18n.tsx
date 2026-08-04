import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "fr" | "en" | "es" | "it";

export const LANGUAGE_NAMES: Record<Language, { label: string; flag: string }> = {
  fr: { label: "Français", flag: "🇫🇷" },
  en: { label: "English", flag: "🇬🇧" },
  es: { label: "Español", flag: "🇪🇸" },
  it: { label: "Italiano", flag: "🇮🇹" },
};

const TRANSLATIONS = {
  fr: {
    // Nav
    nav_home: "Accueil",
    nav_courses: "Cours en Ligne",
    nav_custom: "Sur Commande",
    nav_heritage: "L'Héritage",
    nav_contact: "Contact",
    nav_account: "Espace Client",
    nav_enroll: "S'inscrire",

    // Hero
    hero_badge: "Maison d'Artisanat & Transmission",
    hero_title_1: "L'âme du",
    hero_title_accent: "Textile",
    hero_desc: "Apprenez l'art de la couture avec des étoffes d'exception. De la nappe en lin belge au vêtement architectural, façonnez des pièces durables.",
    hero_cta_courses: "Découvrir les formations",
    hero_cta_custom: "Commander sur mesure",
    hero_quote: "« La précision du geste »",
    hero_quote_sub: "Atelier de coupe HONOR — Londres",

    // Pillars
    pillar_1_title: "Transmission d'Excellence",
    pillar_1_desc: "Des formations pas-à-pas filmées en haute définition à l'atelier, adaptées aux passionnés exigeants.",
    pillar_2_title: "Matières Nobles",
    pillar_2_desc: "Lins de Courtrai, soies italiennes et cotons biologiques rigoureusement sélectionnés.",
    pillar_3_title: "Accompagnement Continu",
    pillar_3_desc: "Accès illimité à vie, patrons téléchargeables et sessions live de conseils personnalisés.",

    // Courses Home
    home_courses_badge: "Inscriptions Ouvertes",
    home_courses_title_1: "Formations de l'",
    home_courses_title_accent: "Atelier",
    home_courses_see_all: "Voir tout le catalogue",
    home_courses_join: "Rejoindre →",

    // Custom Home
    home_custom_badge: "Atelier de Confection",
    home_custom_title_1: "La Collection",
    home_custom_title_accent: "Sur Commande",
    home_custom_desc: "Choisissez la forme, le tissu, les finitions et ajoutez votre monogramme brodé main. Chaque pièce est confectionnée spécialement pour vous.",
    home_custom_linens: "Nappes sur-mesure",
    home_custom_linens_sub: "Lin belge, popeline & festons brodés",
    home_custom_shirts: "Chemisier d'Atelier",
    home_custom_shirts_sub: "Coupe architecturale & sur vos mesures",
    home_custom_btn: "Composer ma pièce sur mesure",

    // Heritage Home
    home_heritage_badge: "Notre Engagement",
    home_heritage_title_1: "Chaque point est une promesse de",
    home_heritage_title_accent: "durabilité",
    home_heritage_title_2: "et de beauté.",
    home_heritage_p1: "« Nous ne vendons pas seulement des objets ; nous partageons un savoir-faire hérité, utilisant des fils de soie et des cotons biologiques sourcés avec une rigueur absolue. »",
    home_heritage_p2: "Dans notre atelier, la formation et la création se rejoignent. Les techniques enseignées dans nos cours sont les mêmes que nous appliquons pour réaliser vos pièces sur mesure.",

    // Contact Page
    contact_badge: "Nous Écrire",
    contact_title_1: "Entrer en",
    contact_title_accent: "Contact",
    contact_desc: "Une question sur une formation, un projet de confection particulière ou une prise de rendez-vous à l'atelier ? Notre équipe vous répond sous 24h.",
    contact_form_name: "Nom complet",
    contact_form_email: "Adresse e-mail",
    contact_form_phone: "Téléphone (optionnel)",
    contact_form_subject: "Sujet de votre demande",
    contact_form_subject_custom: "Commande sur-mesure & devis",
    contact_form_subject_courses: "Question sur les cours en ligne",
    contact_form_subject_appointment: "Prise de rendez-vous à l'atelier",
    contact_form_subject_other: "Autre demande",
    contact_form_message: "Votre message",
    contact_form_send: "Envoyer le message",
    contact_form_success: "Votre message a été transmis à l'atelier !",
    contact_atelier_address_title: "Atelier de Londres",
    contact_atelier_address: "DEPT 6977, 196 High Road, Wood Green, London N22 8HH",
    contact_atelier_hours_title: "Heures d'ouverture",
    contact_atelier_hours: "Du lundi au vendredi : 9h00 – 18h00",
    contact_faq_title: "Questions Fréquentes",

    // Client Portal / Espace Client
    client_title: "Espace Client HONOR",
    client_subtitle: "Gérez vos formations, vos commandes d'atelier et votre profil de mensurations.",
    client_tab_login: "Connexion",
    client_tab_register: "Créer un compte",
    client_login_email: "Votre e-mail",
    client_login_pass: "Mot de passe",
    client_login_btn: "Se connecter à mon espace",
    client_demo_login: "Connexion démo rapide",
    client_logout: "Déconnexion",
    client_welcome: "Ravi de vous revoir",
    client_tab_courses: "Mes Cours",
    client_tab_orders: "Mes Confections Sur-Mesure",
    client_tab_measurements: "Mes Mensurations",
    client_no_courses: "Vous n'êtes inscrit à aucun cours pour le moment.",
    client_no_orders: "Aucune commande en cours à l'atelier.",
    client_measurements_desc: "Enregistrez vos mensurations pour simplifier la confection de vos pièces sur-mesure.",
    client_measurements_save: "Sauvegarder mes mensurations",

    // Footer
    footer_slogan: "Inspirer la main, sublimer le quotidien.",
    footer_rights: "Tous droits réservés.",
    footer_mentions: "Mentions légales",
    footer_cgv: "CGV",
    footer_privacy: "Confidentialité (RGPD)",
    footer_cookies: "Cookies",
    footer_cookie_pref: "Préférences cookies",
  },

  en: {
    // Nav
    nav_home: "Home",
    nav_courses: "Online Courses",
    nav_custom: "Made to Order",
    nav_heritage: "Heritage",
    nav_contact: "Contact",
    nav_account: "Client Portal",
    nav_enroll: "Enroll Now",

    // Hero
    hero_badge: "Craftsmanship & Heritage House",
    hero_title_1: "The Soul of",
    hero_title_accent: "Textiles",
    hero_desc: "Learn the art of sewing with exceptional fabrics. From Belgian linen tablecloths to architectural garments, craft timeless pieces.",
    hero_cta_courses: "Explore Courses",
    hero_cta_custom: "Order Custom Piece",
    hero_quote: "“Precision in every gesture”",
    hero_quote_sub: "HONOR Cutting Workshop — London",

    // Pillars
    pillar_1_title: "Excellence Transmitted",
    pillar_1_desc: "Step-by-step HD courses filmed live in the atelier, designed for discerning enthusiasts.",
    pillar_2_title: "Noble Materials",
    pillar_2_desc: "Kortrijk linens, Italian silks, and organic cottons selected with uncompromising rigor.",
    pillar_3_title: "Lifetime Support",
    pillar_3_desc: "Unlimited lifetime access, downloadable patterns, and live personalized mentoring sessions.",

    // Courses Home
    home_courses_badge: "Enrollment Open",
    home_courses_title_1: "Atelier",
    home_courses_title_accent: "Courses",
    home_courses_see_all: "View Full Catalog",
    home_courses_join: "Join Course →",

    // Custom Home
    home_custom_badge: "Tailoring Workshop",
    home_custom_title_1: "The Made-to-Order",
    home_custom_title_accent: "Collection",
    home_custom_desc: "Choose the cut, fabric, finishes, and add your hand-embroidered monogram. Every piece is handcrafted specifically for you.",
    home_custom_linens: "Bespoke Tablecloths",
    home_custom_linens_sub: "Belgian linen, poplin & hand scallops",
    home_custom_shirts: "Atelier Blouse",
    home_custom_shirts_sub: "Architectural cut tailored to your measurements",
    home_custom_btn: "Configure Custom Piece",

    // Heritage Home
    home_heritage_badge: "Our Promise",
    home_heritage_title_1: "Every stitch is a vow of",
    home_heritage_title_accent: "durability",
    home_heritage_title_2: "and pure elegance.",
    home_heritage_p1: "“We do not simply sell items; we share an inherited savoir-faire, using silk threads and organic cottons sourced with absolute standards.”",
    home_heritage_p2: "In our workshop, education and creation merge seamlessly. The techniques taught in our masterclasses are identical to those applied in our custom orders.",

    // Contact Page
    contact_badge: "Get in Touch",
    contact_title_1: "Contact",
    contact_title_accent: "Our Atelier",
    contact_desc: "Have a question about a course, a custom tailoring inquiry, or booking an atelier visit? Our team will reply within 24 hours.",
    contact_form_name: "Full Name",
    contact_form_email: "Email Address",
    contact_form_phone: "Phone (optional)",
    contact_form_subject: "Inquiry Subject",
    contact_form_subject_custom: "Custom tailoring & quote",
    contact_form_subject_courses: "Online course question",
    contact_form_subject_appointment: "Atelier appointment",
    contact_form_subject_other: "Other inquiry",
    contact_form_message: "Your Message",
    contact_form_send: "Send Message",
    contact_form_success: "Your message has been received by our atelier!",
    contact_atelier_address_title: "London Workshop",
    contact_atelier_address: "DEPT 6977, 196 High Road, Wood Green, London N22 8HH",
    contact_atelier_hours_title: "Opening Hours",
    contact_atelier_hours: "Monday to Friday: 9:00 AM – 6:00 PM",
    contact_faq_title: "Frequently Asked Questions",

    // Client Portal / Espace Client
    client_title: "HONOR Client Space",
    client_subtitle: "Manage your enrolled courses, custom tailoring orders, and measurement profile.",
    client_tab_login: "Sign In",
    client_tab_register: "Create Account",
    client_login_email: "Your Email",
    client_login_pass: "Password",
    client_login_btn: "Access Client Portal",
    client_demo_login: "Quick Demo Sign-In",
    client_logout: "Sign Out",
    client_welcome: "Welcome back",
    client_tab_courses: "My Masterclasses",
    client_tab_orders: "My Custom Orders",
    client_tab_measurements: "My Measurements",
    client_no_courses: "You are not enrolled in any masterclasses yet.",
    client_no_orders: "No active tailoring orders currently in progress.",
    client_measurements_desc: "Save your body measurements to streamline future custom tailoring orders.",
    client_measurements_save: "Save My Measurements",

    // Footer
    footer_slogan: "Inspiring the hand, elevating the everyday.",
    footer_rights: "All rights reserved.",
    footer_mentions: "Legal Notice",
    footer_cgv: "Terms of Service",
    footer_privacy: "Privacy Policy",
    footer_cookies: "Cookies",
    footer_cookie_pref: "Cookie Preferences",
  },

  es: {
    // Nav
    nav_home: "Inicio",
    nav_courses: "Cursos en Línea",
    nav_custom: "A Medida",
    nav_heritage: "Patrimonio",
    nav_contact: "Contacto",
    nav_account: "Área Cliente",
    nav_enroll: "Inscribirse",

    // Hero
    hero_badge: "Casa de Artesanía y Transmisión",
    hero_title_1: "El Alma del",
    hero_title_accent: "Textil",
    hero_desc: "Aprenda el arte de la costura con tejidos excepcionales. Desde manteles de lino belga hasta prendas arquitectónicas.",
    hero_cta_courses: "Descubrir Cursos",
    hero_cta_custom: "Encargar a Medida",
    hero_quote: "«La precisión del gesto»",
    hero_quote_sub: "Taller de corte HONOR — Londres",

    // Pillars
    pillar_1_title: "Transmisión de Excelencia",
    pillar_1_desc: "Cursos paso a paso grabados en HD en el taller, diseñados para apasionados exigentes.",
    pillar_2_title: "Materiales Nobles",
    pillar_2_desc: "Linos de Cortrai, sedas italianas y algodones orgánicos seleccionados con máxima rigurosidad.",
    pillar_3_title: "Acompañamiento Continuo",
    pillar_3_desc: "Acceso ilimitado de por vida, patrones descargables y sesiones en vivo personalizadas.",

    // Courses Home
    home_courses_badge: "Inscripciones Abiertas",
    home_courses_title_1: "Cursos del",
    home_courses_title_accent: "Taller",
    home_courses_see_all: "Ver Catálogo Completo",
    home_courses_join: "Unirse →",

    // Custom Home
    home_custom_badge: "Taller de Confección",
    home_custom_title_1: "Colección a",
    home_custom_title_accent: "Medida",
    home_custom_desc: "Elija la forma, el tejido, los acabados y añada su monograma bordado a mano. Cada pieza se confecciona para usted.",
    home_custom_linens: "Manteles Personalizados",
    home_custom_linens_sub: "Lino belga, popelina y festones bordados",
    home_custom_shirts: "Blusa de Taller",
    home_custom_shirts_sub: "Corte arquitectónico adaptado a sus medidas",
    home_custom_btn: "Diseñar Mi Pieza",

    // Heritage Home
    home_heritage_badge: "Nuestro Compromiso",
    home_heritage_title_1: "Cada puntada es una promesa de",
    home_heritage_title_accent: "durabilidad",
    home_heritage_title_2: "y belleza pura.",
    home_heritage_p1: "«No vendemos simplemente objetos; compartimos un saber hacer heredado, utilizando hilos de seda y algodones orgánicos.»",
    home_heritage_p2: "En nuestro taller, el aprendizaje y la creación se unen. Las técnicas enseñadas en nuestros cursos son las mismas que aplicamos en sus encargos.",

    // Contact Page
    contact_badge: "Escríbanos",
    contact_title_1: "Póngase en",
    contact_title_accent: "Contacto",
    contact_desc: "¿Tiene una pregunta sobre un curso o desea solicitar un presupuesto a medida? Nuestro equipo le responderá en 24 horas.",
    contact_form_name: "Nombre completo",
    contact_form_email: "Correo electrónico",
    contact_form_phone: "Teléfono (opcional)",
    contact_form_subject: "Asunto de la solicitud",
    contact_form_subject_custom: "Encargo a medida y presupuesto",
    contact_form_subject_courses: "Consulta sobre cursos en línea",
    contact_form_subject_appointment: "Cita en el taller",
    contact_form_subject_other: "Otro asunto",
    contact_form_message: "Su mensaje",
    contact_form_send: "Enviar Mensaje",
    contact_form_success: "¡Su mensaje ha sido enviado a nuestro taller!",
    contact_atelier_address_title: "Taller de Londres",
    contact_atelier_address: "DEPT 6977, 196 High Road, Wood Green, Londres N22 8HH",
    contact_atelier_hours_title: "Horario de Atención",
    contact_atelier_hours: "De lunes a viernes: 9:00 – 18:00",
    contact_faq_title: "Preguntas Frecuentes",

    // Client Portal / Espace Client
    client_title: "Espacio Cliente HONOR",
    client_subtitle: "Gestione sus cursos, sus pedidos a medida y su perfil de medidas.",
    client_tab_login: "Iniciar Sesión",
    client_tab_register: "Crear Cuenta",
    client_login_email: "Correo Electrónico",
    client_login_pass: "Contraseña",
    client_login_btn: "Acceder a Mi Espacio",
    client_demo_login: "Acceso Demo Rápido",
    client_logout: "Cerrar Sesión",
    client_welcome: "Bienvenido de nuevo",
    client_tab_courses: "Mis Cursos",
    client_tab_orders: "Mis Encargos a Medida",
    client_tab_measurements: "Mis Medidas",
    client_no_courses: "Aún no está inscrito en ningún curso.",
    client_no_orders: "No hay pedidos a medida en curso.",
    client_measurements_desc: "Guarde sus medidas corporales para agilizar futuros encargos a medida.",
    client_measurements_save: "Guardar Mis Medidas",

    // Footer
    footer_slogan: "Inspirar la mano, sublimar el día a día.",
    footer_rights: "Todos los derechos reservados.",
    footer_mentions: "Aviso Legal",
    footer_cgv: "Términos y Condiciones",
    footer_privacy: "Privacidad",
    footer_cookies: "Cookies",
    footer_cookie_pref: "Preferencias de cookies",
  },

  it: {
    // Nav
    nav_home: "Home",
    nav_courses: "Corsi Online",
    nav_custom: "Su Misura",
    nav_heritage: "Eredità",
    nav_contact: "Contatto",
    nav_account: "Area Clienti",
    nav_enroll: "Iscriviti",

    // Hero
    hero_badge: "Casa d'Artigianato e Trasmissione",
    hero_title_1: "L'Anima del",
    hero_title_accent: "Tessile",
    hero_desc: "Impara l'arte della sartoria con tessuti d'eccezione. Dalle tovaglie in lino belga ai capi d'abbigliamento strutturati.",
    hero_cta_courses: "Scopri i Corsi",
    hero_cta_custom: "Ordina Su Misura",
    hero_quote: "«La precisione del gesto»",
    hero_quote_sub: "Laboratorio di taglio HONOR — Londra",

    // Pillars
    pillar_1_title: "Eccellenza e Maestria",
    pillar_1_desc: "Corso passo-passo girato in alta definizione in laboratorio per appassionati esigenti.",
    pillar_2_title: "Materiali Nobili",
    pillar_2_desc: "Lini di Courtrai, sete italiane e cotoni biologici selezionati con massima rigorosità.",
    pillar_3_title: "Supporto Continuo",
    pillar_3_desc: "Accesso a vita illimitato, cartamodelli scaricabili e sessioni live di consulenza.",

    // Courses Home
    home_courses_badge: "Iscrizioni Aperte",
    home_courses_title_1: "Corsi del",
    home_courses_title_accent: "Laboratorio",
    home_courses_see_all: "Vedi Catalogo Completo",
    home_courses_join: "Partecipa →",

    // Custom Home
    home_custom_badge: "Sartoria Su Misura",
    home_custom_title_1: "Collezione Su",
    home_custom_title_accent: "Ordinazione",
    home_custom_desc: "Scegli il modello, il tessuto, le finiture e aggiungi il tuo monogramma ricamato a mano.",
    home_custom_linens: "Tovaglie Su Misura",
    home_custom_linens_sub: "Lino belga, popeline e festoni ricamati",
    home_custom_shirts: "Camicia Sartoriale",
    home_custom_shirts_sub: "Taglio architettonico sulle tue misure",
    home_custom_btn: "Crea il Tuo Capo",

    // Heritage Home
    home_heritage_badge: "Il Nostro Impegno",
    home_heritage_title_1: "Ogni punto è una promessa di",
    home_heritage_title_accent: "durabilità",
    home_heritage_title_2: "e pura bellezza.",
    home_heritage_p1: "«Non vendiamo semplicemente oggetti; condividiamo un savoir-faire ereditato, utilizzando fili di seta e cotoni biologici.»",
    home_heritage_p2: "Nel nostro laboratorio, formazione e creazione si fondono. Le tecniche insegnate nei nostri corsi sono le stesse utilizzate per i capi su misura.",

    // Contact Page
    contact_badge: "Scrivici",
    contact_title_1: "Mettiti in",
    contact_title_accent: "Contatto",
    contact_desc: "Hai domande su un corso o desideri un preventivo su misura? Il nostro team ti risponderà entro 24 ore.",
    contact_form_name: "Nome e Cognome",
    contact_form_email: "Indirizzo Email",
    contact_form_phone: "Telefono (opzionale)",
    contact_form_subject: "Oggetto della richiesta",
    contact_form_subject_custom: "Ordine su misura e preventivo",
    contact_form_subject_courses: "Informazioni sui corsi online",
    contact_form_subject_appointment: "Appuntamento in laboratorio",
    contact_form_subject_other: "Altra richiesta",
    contact_form_message: "Il tuo messaggio",
    contact_form_send: "Invia Messaggio",
    contact_form_success: "Il tuo messaggio è stato inviato al nostro laboratorio!",
    contact_atelier_address_title: "Laboratorio di Londra",
    contact_atelier_address: "DEPT 6977, 196 High Road, Wood Green, Londra N22 8HH",
    contact_atelier_hours_title: "Orari di Apertura",
    contact_atelier_hours: "Dal lunedì al venerdì: 9:00 – 18:00",
    contact_faq_title: "Domande Frequenti",

    // Client Portal / Espace Client
    client_title: "Area Clienti HONOR",
    client_subtitle: "Gestisci i tuoi corsi, i tuoi ordini su misura e il tuo profilo di misure.",
    client_tab_login: "Accedi",
    client_tab_register: "Crea Account",
    client_login_email: "Indirizzo Email",
    client_login_pass: "Password",
    client_login_btn: "Accedi alla Mia Area",
    client_demo_login: "Accesso Demo Rapido",
    client_logout: "Disconnetti",
    client_welcome: "Bentornato",
    client_tab_courses: "I Miei Corsi",
    client_tab_orders: "I Miei Ordini Su Misura",
    client_tab_measurements: "Le Mie Misure",
    client_no_courses: "Non sei ancora iscritto a nessun corso.",
    client_no_orders: "Nessun ordine su misura attualmente in corso.",
    client_measurements_desc: "Salva le tue misure per velocizzare i futuri ordini sartoriali.",
    client_measurements_save: "Salva le Mie Misure",

    // Footer
    footer_slogan: "Ispirare la mano, sublimare la quotidianità.",
    footer_rights: "Tutti i diritti riservati.",
    footer_mentions: "Note Legali",
    footer_cgv: "Condizioni Generali",
    footer_privacy: "Privacy",
    footer_cookies: "Cookie",
    footer_cookie_pref: "Preferenze cookie",
  },
} as const;

export type TranslationKey = keyof (typeof TRANSLATIONS)["fr"];

interface I18nContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function detectLanguage(): Language {
  if (typeof window === "undefined") return "fr";

  try {
    const saved = localStorage.getItem("honor_lang");
    if (saved && (saved === "fr" || saved === "en" || saved === "es" || saved === "it")) {
      return saved;
    }

    const userLangs = navigator.languages || [navigator.language];
    for (const l of userLangs) {
      const code = l.toLowerCase().slice(0, 2);
      if (code === "fr") return "fr";
      if (code === "en") return "en";
      if (code === "es") return "es";
      if (code === "it") return "it";
    }
  } catch {
    // Ignorer
  }

  return "fr";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("fr");

  useEffect(() => {
    const detected = detectLanguage();
    setLangState(detected);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("honor_lang", newLang);
      document.documentElement.lang = newLang;
    } catch {
      // Ignorer
    }
  };

  const t = (key: TranslationKey): string => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.fr;
    return (dict as Record<string, string>)[key] || (TRANSLATIONS.fr as Record<string, string>)[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
