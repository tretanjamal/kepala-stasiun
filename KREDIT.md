# KREDIT: Kepala Stasiun: Train Times in English
Pengembang: Jamaluddin (UPTD SMPN 2 Robatal) dan Ike Kartika Sari (Guru UPTD SDN Gunung Sekar 1). Tahun 2026.
Rujukan materi: Kepka BSKAP 046/H/KR/2025; Emilia, Wijayanti dkk. (2025) Panduan Mata Pelajaran Bahasa Inggris Fase B-F.
Rujukan AI: Purwarianti dkk. (2025) Panduan Pemanfaatan Kecerdasan Artifisial untuk Guru PAUD, Dikdas, dan Dikmen.

## Aset buatan pengembang dengan bantuan AI (tanggal pembuatan masih perlu diisi pengembang)
- assets/img/bg-stasiun, bg-judul, bg-sertifikat, keyart, dekor-*, kartu-beach: gambar AI (alat: ChatGPT, tanggal: ......), prompt di docs/ASET-PROMPT.md
- assets/audio/musik-judul, musik-main, musik-hasil: musik AI (alat: Suno, tanggal: ......), dikonversi mono 80 kbps
- assets/img/bu-senang, bu-mikir, bu-sorak, kereta-* (8), kartu-* (7 tujuan selain beach), penumpang-1..8: gambar AI (alat: ChatGPT, 13 Nov 2026), prompt di ASET-PROMPT-2.md; latar magenta dibuang dan dikompres WebP dengan tools/proses_aset2.py. bu-kedip dibuat dari bu-senang (mata dipejamkan secara digital).
- assets/img/ikon-instagram.png: logo Instagram (merek milik Meta), dipakai hanya sebagai penanda akun pengembang, tanpa tautan.
- assets/img/dev-jamaluddin.jpg, dev-ike.jpg: foto pribadi pengembang (izin pemilik foto)
## Font
- Poppins (Indian Type Foundry), lisensi SIL OFL 1.1, dibundel di assets/fonts.
## Kode
- HTML/CSS/JavaScript murni oleh pengembang dengan bantuan Claude (Anthropic). Efek suara disintesis WebAudio. Suara pengumuman memakai speechSynthesis peramban.
