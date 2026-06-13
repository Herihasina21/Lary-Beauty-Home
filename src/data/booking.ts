import {
    MessageCircle, Mail, Clock,Home,
    Wallet, UserX, Hand, Info, HelpCircle, } from "lucide-react";
import type { BookingRule } from "@/types";
  
export const bookingRules: BookingRule[] = [
    { id: "b1", icon: MessageCircle, text: "Les réservations se font uniquement en message privé." },
    {
      id: "b2",
      icon: Mail,
      text: "Un message de confirmation ainsi que l'adresse vous seront envoyés la veille du rendez-vous.",
      highlight: "Sans confirmation, le rendez-vous sera automatiquement annulé.",
    },
    { id: "b3", icon: Clock, text: "Tout retard de plus de 15 minutes entraîne l'annulation automatique du rendez-vous." },
    { id: "b4", icon: Home, text: "Je ne me déplace pas. Vous serez reçue chez moi, dans mon espace dédié à la beauté." },
    { id: "b5", icon: Wallet, text: "Paiement en espèces ou Wero." },
    { id: "b6", icon: UserX, text: "Pas d'accompagnateur accepté." },
    { id: "b7", icon: Hand, text: "Seules les dépôts extérieures sont payantes." },
    { id: "b8", icon: Info, text: "Si vous avez une dépose à faire, pensez à le préciser lors de la réservation. Le prix sera ensuite ajusté par mes soins." },
    { id: "b9", icon: HelpCircle, text: "Un doute sur la prestation à choisir ? Je suis disponible en DM sur Instagram !" },
];
  
export const bookingHighlights: string[] = [
    "Beauté des ongles",
    "Nail art personnalisé",
    "Extensions & gainage",
    "Réhaussement de cils",
    "Soins & mise en beauté",
    "Épilations douces",
];
  
export const bookingQuote = "Un moment rien qu'à vous, dans le confort pour révéler votre beauté naturellement.";