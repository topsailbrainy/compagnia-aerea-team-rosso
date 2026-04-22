import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "navbar": {
        "login": "Login",
        "signup": "Sign Up",
        "alerts": "Alerts",
        "alertsOn": "Alerts On"
      },
      "sidebar": {
        "admin": "Administration",
        "ceoPortal": "CEO Portal",
        "services": "Services",
        "explore": "Explore",
        "excellence": "Aviation Excellence",
        "book": "Book",
        "manage": "Manage",
        "checkin": "Check-in",
        "status": "Flight Status",
        "destinations": "Destinations",
        "fleet": "Our Fleet",
        "about": "Company Info",
        "contact": "Contact Us"
      },
      "footer": {
        "desc": "A premium aviation experience connecting Italy to the world with the youngest and most modern fleet.",
        "links": "Links",
        "services": "Services",
        "newsletter": "Newsletter",
        "newsSub": "Subscribe to get the latest offers.",
        "join": "Join",
        "allRights": "All rights reserved.",
        "privacy": "Privacy Policy",
        "terms": "Terms of Service",
        "cookies": "Cookies",
        "dining": "In-flight dining",
        "loyalty": "Sky Loyalty",
        "business": "Business Class",
        "economy": "Economy Class"
      },
      "utility": {
        "checkin": "Check-in",
        "checkinDesc": "Fast online check-in",
        "manage": "Manage",
        "manageDesc": "Your bookings",
        "status": "Flight Status",
        "statusDesc": "Live updates",
        "timetable": "Timetable",
        "timetableDesc": "Global schedule"
      },
      "booking": {
        "returnTrip": "Return Trip",
        "oneWay": "One Way",
        "premiumEngine": "Premium Booking Engine",
        "origin": "Origin",
        "destination": "Destination",
        "departure": "Departure",
        "return": "Return",
        "passenger": "Passenger",
        "passengers": "Passengers",
        "searchFlights": "Search Flights",
        "missingInfo": "Missing Information",
        "missingInfoDesc": "Please fill in all sections to search flights.",
        "select": "Select..."
      },
      "destinations": {
        "title": "World-Class Destinations",
        "subtitle": "Discover our global network across 5 continents.",
        "africa": "Africa",
        "america": "America",
        "asia": "Asia",
        "europe": "Europe",
        "oceania": "Oceania",
        "middleEast": "Middle East",
        "exploreWorld": "Explore the World",
        "viewAll": "View All Destinations",
        "from": "From"
      },
      "fleet": {
        "title": "Our Modern Fleet",
        "subtitle": "The average age of our aircraft is only 4.5 years.",
        "aircraft": "Our Aircraft",
        "aircraftDesc": "Modern and efficient fleet.",
        "cabins": "Premium Cabins",
        "cabinsDesc": "Unmatched comfort in the sky.",
        "lounges": "Exclusive Lounges",
        "loungesDesc": "Relax before your flight.",
        "excellence": "Operational Excellence",
        "excellenceDesc": "Safety and reliability first."
      },
      "info": {
        "excellence": "Company Excellence",
        "excellenceSub": "Learn about our commitment to premium aviation.",
        "touch": "Get in Touch",
        "touchSub": "Our global support team is available 24/7.",
        "contentPrepared": "Content is being prepared by our digital team.",
        "insurance": "Travel Insurance",
        "insuranceDesc": "Fly with peace of mind. Protect your journey with our comprehensive coverage.",
        "support": "24/7 Support",
        "supportDesc": "Our dedicated team is always here to help you with any request, anywhere.",
        "baggage": "Baggage Info",
        "baggageDesc": "Check your allowance and find out what you can bring on your FlyPlus flight.",
        "payment": "Flexible Payment",
        "paymentDesc": "Book now and pay in installments with our partner financial services."
      },
      "common": {
        "comingSoon": "Section coming soon",
        "preparing": "We are preparing this premium content for you."
      },
      "bookPage": {
        "whyTitle": "Why Choose FlyPlus?",
        "whyDesc": "Discover the difference of flying with a premium carrier dedicated to your comfort and safety.",
        "safe": "Safe & Secure",
        "safeDesc": "Industry-leading safety protocols and secure booking systems.",
        "onTime": "Always On Time",
        "onTimeDesc": "Ranked top 5 globally for on-time performance and reliability.",
        "award": "Award Winning",
        "awardDesc": "5-star service recognized by Skytrax for 10 consecutive years.",
        "global": "Global Network",
        "globalDesc": "Connecting you to over 150 destinations worldwide from Italy.",
        "loyaltyTitle": "Experience more rewards with every flight",
        "loyaltyDesc": "Join our loyalty program today and start earning miles that you can spend on flights, upgrades, and more.",
        "joinNow": "Join now",
        "learnMore": "Learn more",
        "privileges": "Member Privileges",
        "privilegesDesc": "Unlock exclusive lounge access and priority boarding."
      }
    }
  },
  it: {
    translation: {
      "navbar": {
        "login": "Accedi",
        "signup": "Registrati",
        "alerts": "Avvisi",
        "alertsOn": "Avvisi Attivi"
      },
      "sidebar": {
        "admin": "Amministrazione",
        "ceoPortal": "Portale CEO",
        "services": "Servizi",
        "explore": "Esplora",
        "excellence": "Eccellenza nell'Aviazione",
        "book": "Prenota",
        "manage": "Gestisci",
        "checkin": "Check-in",
        "status": "Stato Volo",
        "destinations": "Destinazioni",
        "fleet": "La Nostra Flotta",
        "about": "Info Azienda",
        "contact": "Contattaci"
      },
      "footer": {
        "desc": "Un'esperienza aeronautica premium che collega l'Italia al mondo con la flotta più giovane e moderna.",
        "links": "Link",
        "services": "Servizi",
        "newsletter": "Newsletter",
        "newsSub": "Iscriviti per ricevere le ultime offerte.",
        "join": "Iscriviti",
        "allRights": "Tutti i diritti riservati.",
        "privacy": "Privacy Policy",
        "terms": "Termini di Servizio",
        "cookies": "Cookie",
        "dining": "Ristorazione a bordo",
        "loyalty": "Sky Loyalty",
        "business": "Business Class",
        "economy": "Economy Class"
      },
      "utility": {
        "checkin": "Check-in",
        "checkinDesc": "Check-in online veloce",
        "manage": "Gestisci",
        "manageDesc": "Le tue prenotazioni",
        "status": "Stato Volo",
        "statusDesc": "Aggiornamenti live",
        "timetable": "Orari",
        "timetableDesc": "Programma globale"
      },
      "booking": {
        "returnTrip": "Andata e Ritorno",
        "oneWay": "Solo Andata",
        "premiumEngine": "Motore di Ricerca Premium",
        "origin": "PARTENZA",
        "destination": "DESTINAZIONE",
        "departure": "Partenza",
        "return": "Ritorno",
        "passenger": "Passeggero",
        "passengers": "Passeggeri",
        "searchFlights": "Cerca Voli",
        "missingInfo": "Informazioni Mancanti",
        "missingInfoDesc": "Per favore, compila tutte le sezioni per cercare i voli.",
        "select": "Seleziona..."
      },
      "destinations": {
        "title": "Destinazioni di Classe Mondiale",
        "subtitle": "Scopri la nostra rete globale in 5 continenti.",
        "africa": "Africa",
        "america": "America",
        "asia": "Asia",
        "europe": "Europa",
        "oceania": "Oceania",
        "middleEast": "Medio Oriente",
        "exploreWorld": "Esplora il Mondo",
        "viewAll": "Vedi Tutte le Destinazioni",
        "from": "Da"
      },
      "fleet": {
        "title": "La Nostra Flotta Moderna",
        "subtitle": "L'età media dei nostri aerei è di soli 4,5 anni.",
        "aircraft": "I Nostri Aerei",
        "aircraftDesc": "Flotta moderna ed efficiente.",
        "cabins": "Cabine Premium",
        "cabinsDesc": "Comfort senza pari nel cielo.",
        "lounges": "Lounge Esclusive",
        "loungesDesc": "Rilassati prima del tuo volo.",
        "excellence": "Eccellenza Operativa",
        "excellenceDesc": "Sicurezza e affidabilità prima di tutto."
      },
      "info": {
        "excellence": "Eccellenza Aziendale",
        "excellenceSub": "Scopri il nostro impegno per un'aviazione premium.",
        "touch": "Mettiti in Contatto",
        "touchSub": "Il nostro team di supporto globale è disponibile 24 ore su 24, 7 giorni su 7.",
        "contentPrepared": "Il contenuto è in fase di preparazione da parte del nostro team digitale.",
        "insurance": "Assicurazione di Viaggio",
        "insuranceDesc": "Vola con serenità. Proteggi il tuo viaggio con la nostra copertura completa.",
        "support": "Supporto 24/7",
        "supportDesc": "Il nostro team dedicato è sempre qui per aiutarti con ogni richiesta, ovunque.",
        "baggage": "Info Bagaglio",
        "baggageDesc": "Controlla la tua franchigia e scopri cosa puoi portare sul tuo volo FlyPlus.",
        "payment": "Pagamento Flessibile",
        "paymentDesc": "Prenota ora e paga a rate con i nostri partner di servizi finanziari."
      },
      "common": {
        "comingSoon": "Sezione in arrivo",
        "preparing": "Stiamo preparando questo contenuto premium per te."
      },
      "bookPage": {
        "whyTitle": "Perché Scegliere FlyPlus?",
        "whyDesc": "Scopri la differenza di volare con un vettore premium dedicato al tuo comfort e alla tua sicurezza.",
        "safe": "Sicuro e Protetto",
        "safeDesc": "Protocolli di sicurezza leader del settore e sistemi di prenotazione sicuri.",
        "onTime": "Sempre in Orario",
        "onTimeDesc": "Classificato tra i primi 5 al mondo per puntualità e affidabilità.",
        "award": "Pluripremiato",
        "awardDesc": "Servizio a 5 stelle riconosciuto da Skytrax per 10 anni consecutivi.",
        "global": "Rete Globale",
        "globalDesc": "Ti colleghiamo a oltre 150 destinazioni in tutto il mondo dall'Italia.",
        "loyaltyTitle": "Vivi più premi con ogni volo",
        "loyaltyDesc": "Iscriviti al nostro programma fedeltà oggi e inizia a guadagnare miglia che puoi spendere in voli, upgrade e altro ancora.",
        "joinNow": "Iscriviti ora",
        "learnMore": "Scopri di più",
        "privileges": "Privilegi per i Soci",
        "privilegesDesc": "Sblocca l'accesso esclusivo alle lounge e l'imbarco prioritario."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
