import { Gem, Flower2, Star } from "lucide-react";
import type { ServiceCategory } from "@/types";

export const servicesData: ServiceCategory[] = [
  {
    id: "ongles",
    title: "Ongles",
    icon: Gem,
    services: [
      { id: "n1", category: "Ongles naturels — Mains", name: "Beauté des mains", price: 20 },
      { id: "n2", category: "Ongles naturels — Mains", name: "Beauté des mains + semi-permanent", price: 35 },
      { id: "n3", category: "Ongles naturels — Pieds", name: "Beauté des pieds", price: 20 },
      { id: "n4", category: "Ongles naturels — Pieds", name: "Beauté des pieds + semi-permanent", price: 25 },
      { id: "n5", category: "Rallongement & Renforcement", name: "Gainage sur ongles naturels", price: 40 },
      { id: "n6", category: "Rallongement & Renforcement", name: "Pose américaine", price: 40 },
      { id: "n7", category: "Rallongement & Renforcement", name: "Rallongement demi-capsule", price: 45 },
      { id: "n8", category: "Rallongement & Renforcement", name: "Rallongement chablon", price: 60 },
      { id: "n9", category: "Rallongement & Renforcement", name: "Rallongement pop-it", price: 50 },
      { id: "n10", category: "Options", name: "Construction gros orteil", price: "+5" },
      { id: "n11", category: "Options", name: "Dépose extérieure semi-permanent", price: 15 },
      { id: "n12", category: "Options", name: "Dépose extérieure gel", price: 20 },
      { id: "n13", category: "Entretien", name: "Remplissage", price: 40 },
      { id: "n14", category: "Nail Art", name: "French", price: "+5" },
      { id: "n15", category: "Nail Art", name: "Baby boomer", price: "+10" },
      { id: "n16", category: "Nail Art", name: "Nail art simple", price: "+1", unit: "/doigt" },
      { id: "n17", category: "Nail Art", name: "Nail art élaboré", price: "+3", unit: "/doigt" },
      { id: "n18", category: "Nail Art", name: "Strass", price: "+1", unit: "/doigt" },
    ],
  },
  {
    id: "epilations",
    title: "Épilations",
    icon: Flower2,
    services: [
      { id: "e1", category: "Visage", name: "Sourcils", price: 10 },
      { id: "e2", category: "Visage", name: "Lèvre", price: 10 },
      { id: "e3", category: "Visage", name: "Menton", price: 10 },
      { id: "e4", category: "Visage", name: "Visage complet", price: 25 },
      { id: "e5", category: "Corps", name: "Aisselles", price: 12 },
      { id: "e6", category: "Corps", name: "Bras", price: 15 },
      { id: "e7", category: "Corps", name: "Demi-jambes", price: 20 },
      { id: "e8", category: "Corps", name: "Jambes complètes", price: 30 },
      { id: "e9", category: "Forfaits", name: "Demi-jambes + maillot simple + aisselles", price: 40 },
      { id: "e10", category: "Forfaits", name: "Jambes complètes + maillot simple + aisselles", price: 50 },
    ],
  },
  {
    id: "soins",
    title: "Soins Visage",
    icon: Star,
    services: [
      {
        id: "s1",
        category: "Soins Visage",
        name: "Soin Éclat Express",
        price: 25,
        duration: "30 min",
        description: "Nettoyage + soin rapide pour un teint frais et lumineux. Idéal avant un événement.",
      },
      {
        id: "s2",
        category: "Soins Visage",
        name: "Soin Pureté",
        price: 40,
        duration: "45 min",
        description: "Nettoyage profond, purification et rééquilibrage de la peau. Parfait pour peaux mixtes à grasses.",
      },
      {
        id: "s3",
        category: "Soins Visage",
        name: "Soin Hydratant Confort",
        price: 45,
        duration: "1h",
        description: "Apporte douceur, nutrition et éclat à la peau. Idéal pour peaux sèches et sensibles.",
      },
      {
        id: "s4",
        category: "Soins Visage",
        name: "Soin Signature Lari Beauty",
        price: 50,
        duration: "1h",
        description: "Soin complet + modelage relaxation du visage. Un vrai moment de détente et de beauté.",
      },
    ],
  },
];

export const soinsNotes = [
  "Chaque soin est personnalisé selon votre type de peau",
  "Produits professionnels adaptés",
  "Moment de détente garanti",
];