/* Konfigurasi jadwal & tujuan. Data berupa .js agar jalan lewat file:// */
window.KS_JADWAL = {
  tujuan: [
    { id: 'beach',    nama: 'BEACH',    en: 'beach',    warna: '#2F6FD0', ikon: 'wave' },
    { id: 'mountain', nama: 'MOUNTAIN', en: 'mountain', warna: '#7A5BB5', ikon: 'mountain' },
    { id: 'zoo',      nama: 'ZOO',      en: 'zoo',      warna: '#F08A24', ikon: 'paw' },
    { id: 'lake',     nama: 'LAKE',     en: 'lake',     warna: '#3DAA62', ikon: 'boat' },
    { id: 'farm',     nama: 'FARM',     en: 'farm',     warna: '#E86C8F', ikon: 'barn' },
    { id: 'city',     nama: 'CITY',     en: 'city',     warna: '#5B7289', ikon: 'city' },
    { id: 'airport',  nama: 'AIRPORT',  en: 'airport',  warna: '#D9A91C', ikon: 'plane' },
    { id: 'market',   nama: 'MARKET',   en: 'market',   warna: '#1AA5A0', ikon: 'basket' }
  ],
  jamMin: 6, jamMax: 12,
  hari: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  levelAktif: 5,
  level: [
    { id: 1, nama: 'Jam Tepat',   tag: 'jam-tepat',  jumlah: 4 },
    { id: 2, nama: 'Setengah',    tag: 'setengah',   jumlah: 5 },
    { id: 3, nama: 'Seperempat',  tag: 'seperempat', jumlah: 6 },
    { id: 4, nama: 'Jadwal Mingguan', tag: 'hari',   jumlah: 6 },
    { id: 5, nama: 'Jam Sibuk', tag: 'campuran', jumlah: 8 }
  ]
};
