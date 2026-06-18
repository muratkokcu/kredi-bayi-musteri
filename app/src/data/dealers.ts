/**
 * Bank-side dealer network — seed data extracted from the dealer-management
 * screen (rollout). Served via src/services/dealers.
 */
export interface Dealer {
  bolge: string;
  donusum: number;
  durum: "Aktif" | "Pasif" | "Beklemede";
  id: string;
  initials: string;
  kod: string;
  logoTone: string;
  name: string;
  sehir: string;
  teklif: number;
  yanit: string;
}

export const DEALERS: Dealer[] = [
  {
    id: "1",
    name: "Doğuş Otomotiv",
    sehir: "İstanbul / Maslak",
    initials: "DO",
    logoTone: "bg-bank-tint text-bank-700",
    kod: "BYİ-1024",
    bolge: "Marmara",
    durum: "Aktif",
    teklif: 1248,
    donusum: 38,
    yanit: "1,8 saat",
  },
  {
    id: "2",
    name: "Borusan Otomotiv",
    sehir: "İstanbul / Şişli",
    initials: "BO",
    logoTone: "bg-dealer-tint text-dealer-700",
    kod: "BYİ-1077",
    bolge: "Marmara",
    durum: "Aktif",
    teklif: 1086,
    donusum: 41,
    yanit: "2,1 saat",
  },
  {
    id: "3",
    name: "Otokoç Otomotiv",
    sehir: "Ankara / Çankaya",
    initials: "OO",
    logoTone: "bg-cust-tint text-cust-600",
    kod: "BYİ-0931",
    bolge: "İç Anadolu",
    durum: "Aktif",
    teklif: 974,
    donusum: 35,
    yanit: "2,6 saat",
  },
  {
    id: "4",
    name: "Groupe PSA Bayi",
    sehir: "İzmir / Bornova",
    initials: "GP",
    logoTone: "bg-warn-tint text-warn",
    kod: "BYİ-1153",
    bolge: "Ege",
    durum: "Beklemede",
    teklif: 612,
    donusum: 29,
    yanit: "4,2 saat",
  },
  {
    id: "5",
    name: "Çetaş Otomotiv",
    sehir: "Bursa / Nilüfer",
    initials: "ÇO",
    logoTone: "bg-bank-tint text-bank-700",
    kod: "BYİ-1208",
    bolge: "Marmara",
    durum: "Aktif",
    teklif: 845,
    donusum: 33,
    yanit: "2,3 saat",
  },
  {
    id: "6",
    name: "Aydın Otomotiv",
    sehir: "Antalya / Muratpaşa",
    initials: "AO",
    logoTone: "bg-dealer-tint text-dealer-700",
    kod: "BYİ-0884",
    bolge: "Akdeniz",
    durum: "Aktif",
    teklif: 738,
    donusum: 31,
    yanit: "3,0 saat",
  },
  {
    id: "7",
    name: "Maslak Motors",
    sehir: "İstanbul / Sarıyer",
    initials: "MM",
    logoTone: "bg-cust-tint text-cust-600",
    kod: "BYİ-1291",
    bolge: "Marmara",
    durum: "Pasif",
    teklif: 421,
    donusum: 22,
    yanit: "5,4 saat",
  },
  {
    id: "8",
    name: "Ege Oto Plaza",
    sehir: "İzmir / Karşıyaka",
    initials: "EO",
    logoTone: "bg-warn-tint text-warn",
    kod: "BYİ-1042",
    bolge: "Ege",
    durum: "Aktif",
    teklif: 690,
    donusum: 36,
    yanit: "2,5 saat",
  },
];
