/**
 * Dealer-side offers pipeline — seed data extracted from the dealer offers
 * screen (rollout). Each column is a pipeline stage holding offer cards;
 * served via src/services/dealer-offers.
 */
export interface OfferCard {
  amount: string;
  avatarTone: string;
  customer: string;
  id: string;
  initials: string;
  status: string;
  vehicle: string;
}

export interface Column {
  accent: string;
  cards: OfferCard[];
  count: number;
  dot: string;
  id: string;
  title: string;
  total: string;
}

export const COLUMNS: Column[] = [
  {
    id: "taslak",
    title: "Taslak",
    total: "₺1.240.000",
    count: 7,
    dot: "bg-ink-muted",
    accent: "text-ink-soft",
    cards: [
      {
        id: "t1",
        customer: "A*** Y*******",
        initials: "AY",
        avatarTone: "bg-dealer-tint text-dealer-700",
        vehicle: "Volkswagen Tiguan",
        amount: "₺1.250.000",
        status: "Oluşturulma: Bugün 10:24",
      },
      {
        id: "t2",
        customer: "M*** K******",
        initials: "MK",
        avatarTone: "bg-cust-tint text-cust-600",
        vehicle: "Peugeot 3008",
        amount: "₺1.180.000",
        status: "Oluşturulma: Bugün 09:15",
      },
      {
        id: "t3",
        customer: "S*** D*******",
        initials: "SD",
        avatarTone: "bg-warn-tint text-warn",
        vehicle: "Toyota Corolla",
        amount: "₺980.000",
        status: "Oluşturulma: Dün 16:40",
      },
    ],
  },
  {
    id: "gonderildi",
    title: "Gönderildi",
    total: "₺3.450.000",
    count: 12,
    dot: "bg-dealer",
    accent: "text-dealer-700",
    cards: [
      {
        id: "g1",
        customer: "E*** Y*******",
        initials: "EY",
        avatarTone: "bg-dealer-tint text-dealer-700",
        vehicle: "Volkswagen Tiguan",
        amount: "₺1.250.000",
        status: "Gönderilme: Bugün 11:30",
      },
      {
        id: "g2",
        customer: "H*** B*******",
        initials: "HB",
        avatarTone: "bg-cust-tint text-cust-600",
        vehicle: "Honda Civic",
        amount: "₺890.000",
        status: "Gönderilme: Dün 14:20",
      },
      {
        id: "g3",
        customer: "A*** G*******",
        initials: "AG",
        avatarTone: "bg-warn-tint text-warn",
        vehicle: "Renault Clio",
        amount: "₺650.000",
        status: "Gönderilme: Dün 11:05",
      },
    ],
  },
  {
    id: "goruntulendi",
    title: "Görüntülendi",
    total: "₺2.750.000",
    count: 8,
    dot: "bg-cust",
    accent: "text-cust-600",
    cards: [
      {
        id: "v1",
        customer: "B*** Y*******",
        initials: "BY",
        avatarTone: "bg-dealer-tint text-dealer-700",
        vehicle: "Toyota Corolla",
        amount: "₺980.000",
        status: "Görüntülenme: Bugün 09:40",
      },
      {
        id: "v2",
        customer: "K*** Y*******",
        initials: "KY",
        avatarTone: "bg-cust-tint text-cust-600",
        vehicle: "Peugeot 3008",
        amount: "₺1.180.000",
        status: "Görüntülenme: Bugün 08:55",
      },
      {
        id: "v3",
        customer: "F*** A*******",
        initials: "FA",
        avatarTone: "bg-warn-tint text-warn",
        vehicle: "Opel Astra",
        amount: "₺790.000",
        status: "Görüntülenme: Dün 17:10",
      },
    ],
  },
  {
    id: "gorusme",
    title: "Görüşme",
    total: "₺1.890.000",
    count: 6,
    dot: "bg-success",
    accent: "text-success",
    cards: [
      {
        id: "m1",
        customer: "M*** T*******",
        initials: "MT",
        avatarTone: "bg-dealer-tint text-dealer-700",
        vehicle: "Honda Civic",
        amount: "₺890.000",
        status: "Son Görüşme: Bugün 10:15",
      },
      {
        id: "m2",
        customer: "D*** Ç*******",
        initials: "DÇ",
        avatarTone: "bg-cust-tint text-cust-600",
        vehicle: "Ford Focus",
        amount: "₺1.000.000",
        status: "Son Görüşme: Dün 15:30",
      },
    ],
  },
  {
    id: "kabul",
    title: "Kabul",
    total: "₺2.470.000",
    count: 9,
    dot: "bg-success",
    accent: "text-success",
    cards: [
      {
        id: "k1",
        customer: "Ö*** D*******",
        initials: "ÖD",
        avatarTone: "bg-dealer-tint text-dealer-700",
        vehicle: "Toyota Corolla",
        amount: "₺980.000",
        status: "Kabul: Bugün 09:50",
      },
      {
        id: "k2",
        customer: "N*** A*******",
        initials: "NA",
        avatarTone: "bg-cust-tint text-cust-600",
        vehicle: "Skoda Octavia",
        amount: "₺1.150.000",
        status: "Kabul: Dün 13:25",
      },
    ],
  },
  {
    id: "reddedildi",
    title: "Reddedildi",
    total: "₺650.000",
    count: 6,
    dot: "bg-danger",
    accent: "text-danger",
    cards: [
      {
        id: "r1",
        customer: "N*** O*******",
        initials: "NO",
        avatarTone: "bg-dealer-tint text-dealer-700",
        vehicle: "Renault Clio",
        amount: "₺650.000",
        status: "Reddetme: Dün 12:03",
      },
      {
        id: "r2",
        customer: "T*** K*******",
        initials: "TK",
        avatarTone: "bg-cust-tint text-cust-600",
        vehicle: "Fiat Egea",
        amount: "₺720.000",
        status: "Reddetme: 22.04.2025",
      },
    ],
  },
];
