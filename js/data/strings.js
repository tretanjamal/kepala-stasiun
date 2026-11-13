/* Semua teks UI di sini agar mudah ditinjau guru. */
window.KS_STR = {
  judul: 'Kepala Stasiun',
  tagline: 'Train Times in English',
  btn: { mulai: 'Mulai', santai: 'Mode Santai', info: 'Informasi', ref: 'Referensi', dev: 'Pengembang',
    kembali: 'Kembali', pasang: 'Pasang', peluit: 'Tiup Peluit', percepat: 'Percepat', dengar: 'Dengar lagi',
    pelan: 'Lebih pelan', lagi: 'Main lagi', menu: 'Menu', lanjut: 'Lanjut', lewati: 'Lewati petunjuk',
    pengaturan: 'Pengaturan' },
  setelan: { judul: 'Pengaturan', musik: 'Musik', suara: 'Suara pengumuman', kurangi: 'Kurangi animasi', teks: 'Teks selalu tampil',
    on: 'Hidup', off: 'Mati' },
  info: {
    judul: 'Informasi',
    tpLabel: 'Tujuan Pembelajaran',
    tp: 'Murid mampu menyimak penyebutan waktu dan hari dalam bahasa Inggris, membaca jam analog, dan menjawab pertanyaan sederhana tentang jadwal.',
    mapelLabel: 'Mata Pelajaran', mapel: 'Bahasa Inggris',
    topikLabel: 'Topik', topik: 'Time and Schedules (Listening)',
    panduanLabel: 'Panduan Gim',
    panduan: [
      'Dengarkan pengumuman di radio.',
      'Putar jarum jam di papan sesuai yang kamu dengar, lalu tekan Pasang.',
      'Lihat jam besar stasiun. Tiup peluit saat waktunya tiba!',
      'Salah itu boleh. Bu Wati akan memberi petunjuk.',
      'Sulit memutar? Pakai tombol + dan -.'
    ]
  },
  ref: {
    judul: 'Referensi',
    sumberLabel: 'Sumber Materi',
    sumber: [
      { a: 'Badan Standar, Kurikulum, dan Asesmen Pendidikan (2025).', t: 'Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran.', p: 'Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.' },
      { a: 'Emilia, E., Wijayanti, M.A., dkk. (2025).', t: 'Panduan Mata Pelajaran Bahasa Inggris Fase B-F dan Fase F Tingkat Lanjut.', p: 'Badan Standar, Kurikulum, dan Asesmen Pendidikan, Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.' }
    ],
    aiLabel: 'Keterangan Penggunaan AI',
    ai: 'Gim ini dirancang oleh guru dengan bantuan kecerdasan artifisial (AI). Semua hasil AI ditinjau dan disesuaikan oleh pengembang dengan Capaian Pembelajaran.',
    aiList: [['Gambar', 'dibuat dengan ChatGPT'], ['Musik', 'dibuat dengan Suno'], ['Pemrograman dan naskah', 'dibantu Claude (Anthropic)']],
    aiRujukanLabel: 'Rujukan pemanfaatan AI',
    aiRujukan: 'Purwarianti, A., dkk. (2025). Panduan Pemanfaatan Kecerdasan Artifisial untuk Guru PAUD, Pendidikan Dasar, dan Pendidikan Menengah. Jakarta: Pusat Kurikulum dan Pembelajaran & Pusat Standar dan Kebijakan Pendidikan.'
  },
  dev: {
    judul: 'Pengembang',
    orang: [
      { nama: 'Jamaluddin', instansi: 'UPTD SMPN 2 Robatal', email: 'jamaluddin551@guru.smp.belajar.id', ig: 'tretanjamal', igLabel: 'Instagram',
        tahun: 'Tahun Pembuatan: 2026', foto: 'assets/img/dev-jamaluddin.jpg', prestasiLabel: 'Prestasi dan Pengalaman',
        prestasi: ['Narasumber Digitalisasi Pembelajaran Kemendikdasmen', 'Guru Pejuang Digital',
          'Juara 1 Lomba Inovasi Guru SMP Kabupaten Sampang 2026', 'Juara 1 Guru Inspiratif SMP Kabupaten Sampang 2026',
          'Komunitas Belajar Terbaik BLPT Kemendikdasmen 2024'] },
      { nama: 'Ike Kartika Sari', instansi: 'Guru UPTD SDN Gunung Sekar 1', foto: 'assets/img/dev-ike.jpg' }
    ]
  },
  level: { judul: 'Pilih Level', kunci: 'Selesaikan Level ', segera: 'Segera hadir', mode: 'Mode', normal: 'Normal', santai: 'Santai', kereta: 'Kereta',
    terkunci: 'terkunci', selesai: 'selesai', main: 'Main!', kunciPesan: 'Level {a} masih terkunci. Selesaikan Level {n} dulu, ya!', kunciMulai: 'Level {a} masih terkunci. Ayo mulai dari Level {n}!',
    terbuka: 'Hore! Level {n} sekarang terbuka.' },
  main: {
    radio: 'Radio Pusat Kendali', papan: 'KEBERANGKATAN', jamPendek: 'jam', menitPanjang: 'menit',
    kunci: 'menit terkunci di 12',
    bu: {
      mulai: 'Halo! Aku Bu Wati. Dengarkan radio ya.',
      putar: 'Putar jarum pendek ke angka yang kamu dengar.',
      pasang: 'Bagus! Sekarang tekan Pasang.',
      tunggu: 'Tiup peluit saat jarum panjang di angka 12!',
      tungguJam: 'Tiup peluit saat jam besar menunjuk ',
      hebat: 'Hebat! Kereta berangkat tepat waktu.',
      awal: 'Belum waktunya! Lihat jam besar.',
      telat: 'Kereta menunggu. Lain kali lebih cepat ya.',
      salah1: 'Dengarkan lagi ya.',
      salah2: 'Cari angkanya: ',
      salah3: 'Begini caranya. Jarum pendek ke angka ',
      dekat: 'Hampir! ',
      itu: 'Itu jam ',
      santai: 'Jam besar maju sendiri. Tunggu sebentar ya.',
      siap: 'Sekarang tiup peluit!',
      lv2: 'Sekarang jarum panjang bisa diputar juga!',
      lv3: 'Ada seperempat jam. Dengarkan baik-baik ya.',
      lv4: 'Pilih harinya dulu, lalu pasang jamnya.',
      hari1: 'Harinya belum tepat. Dengarkan lagi ya.',
      hari2: 'Cari harinya: ',
      hari3: 'Begini caranya. Pilih hari ',
      lihatPapan: 'Lihat papan lagi. Cari tujuannya.',
      lihatJam: 'Lihat jam besar lagi ya.',
      jwb1: 'Belum tepat. Lihat papan sekali lagi.',
      jwb2: 'Baca jam di papan: ',
      jwb3: 'Ini jawabannya. Kita coba lagi nanti ya.',
      terima: 'Terima kasih! Jawabanmu tepat.',
      jawab: 'Jawab penumpang dengan kartu kalimat.',
      menitSalah: 'Jarum panjang menunjuk menit. '
    },
    kereta: 'Kereta', jam: 'jam', menit: 'menit', hari: 'Hari', kamus: 'Kamus'
  },
  kamus: { judul: 'Kamus Waktu', waktu: 'Waktu', hari: 'Hari', catat: 'Tu = Tuesday (Selasa), Th = Thursday (Kamis)',
    kartu: [[7, 0], [7, 30], [8, 15], [8, 45]],
    ket: ['jam tujuh tepat', 'setengah delapan', 'jam delapan lewat seperempat', 'jam sembilan kurang seperempat'],
    hariId: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'] },
  hasil: {
    judul: 'Hasil Belajarku', koin: 'Koin', bintang: 'Bintang', guru: 'Catatan untuk Guru',
    kuasai: 'Aku sudah tahu:', kartu: 'Kartu kereta baru',
    skill: {
      'jam-tepat': 'Aku tahu "seven o\'clock" = jam tujuh tepat.',
      'setengah': 'Aku tahu "half past seven" = setengah delapan.',
      'seperempat': 'Aku tahu "quarter past" dan "quarter to".',
      'hari': 'Aku bisa mengenali nama hari di jadwal.',
      'jawab-waktu': 'Aku bisa menjawab pertanyaan penumpang.',
      'simak-jadwal': 'Aku bisa menemukan tujuan dan jam kereta.' },
    nama: { 'jam-tepat': 'jam tepat', 'setengah': 'half past', 'seperempat': 'quarter past/to', 'hari': 'nama hari', 'jawab-waktu': 'menjawab penumpang', 'simak-jadwal': 'menyimak jadwal' },
    ulang: 'Perlu diulang: ',
    belum: 'Ayo coba lagi supaya makin lancar!',
    bintangNama: ['Jam tepat tanpa petunjuk', 'Peluit tepat waktu', 'Semua kereta tanpa petunjuk ke-3'],
    pesan: ['Ayo coba lagi. Kamu pasti bisa!', 'Bagus! Ayo kumpulkan bintang lagi.', 'Hebat! Sedikit lagi bintang penuh.', 'Luar biasa! Kamu kepala stasiun hebat!']
  },
  sertifikat: { judul: 'SERTIFIKAT', sub: 'Kepala Stasiun Cilik', beri: 'diberikan kepada', anon: '. . . . . . . . . . . . . . . . . . . .',
    selesai: 'telah menyelesaikan semua level Kepala Stasiun dan mampu:', bintang: 'Bintang terkumpul', tanggal: 'Tanggal', bu: 'Bu Wati', buJab: 'Kepala Stasiun',
    pengembang: 'Pengembang: Jamaluddin dan Ike Kartika Sari', nama: 'Tulis namamu (boleh kosong)', simpan: 'Simpan Gambar', cetak: 'Cetak', privasi: 'Nama hanya disimpan di perangkat ini.',
    gagal: 'Gambar tidak bisa disimpan di perangkat ini. Coba tombol Cetak.', tombol: 'Sertifikat', lanjut: 'Level berikutnya',
    bulan: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    skill: {
      'jam-tepat': 'memahami "seven o\'clock" sebagai jam tujuh tepat',
      'setengah': 'memahami "half past seven" = setengah delapan',
      'seperempat': 'memahami "quarter past" dan "quarter to"',
      'hari': 'mengenali nama hari dalam pengumuman jadwal',
      'jawab-waktu': 'menjawab pertanyaan waktu dengan kalimat pendek',
      'simak-jadwal': 'menyimak tujuan, jam, dan hari kereta' } },
  ui: { layarPenuh: 'Layar penuh', keluarLayar: 'Keluar layar penuh', musikOn: 'Matikan musik', musikOff: 'Hidupkan musik', menu: 'Menu',
    keluarJudul: 'Keluar dari level?', keluarIsi: 'Kemajuan level ini tidak disimpan.', keluar: 'Keluar', muat: 'Memuat stasiun...' },
  putar: 'Putar perangkatmu ke mendatar ya.'
};
