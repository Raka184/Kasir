# Kasir App (Next.js + MySQL/Laragon)

Aplikasi kasir (POS) dengan role **Admin** & **Petugas**, dibangun dengan
Next.js 14 (App Router), Tailwind CSS, dan Prisma ORM. Dirancang untuk
dijalankan bersama **Laragon** (MySQL lokal).

## Hak Akses (Privilege)

| Fitur                  | Admin | Petugas |
|-------------------------|:-----:|:-------:|
| Login / Logout          |  ✅   |   ✅    |
| Kasir (transaksi)       |  ✅   |   ✅    |
| Registrasi Member       |  ✅   |   ✅    |
| Lihat Laporan           |  ✅   |   ✅    |
| Update Stok / Produk    |  ✅   |   ❌    |
| Kelola Akun Pengguna    |  ✅   |   ❌    |

> Pendaftar **pertama** yang membuat akun lewat halaman Register otomatis
> menjadi **Admin**. Pendaftaran berikutnya otomatis menjadi **Petugas**.
> Selanjutnya, Admin bisa membuat akun Petugas (atau Admin lain) langsung
> lewat menu **Pengguna**.

## Fitur

- Login & Register dengan role otomatis (Admin/Petugas), password di-hash bcrypt, sesi JWT httpOnly cookie
- Halaman **Kasir**: cari produk, keranjang, pilih member (opsional), metode bayar Tunai/Kredit, hitung kembalian, cetak struk
- **Member**: registrasi & kelola data pelanggan (nama, telepon, alamat)
- **Produk** (khusus Admin): tambah/edit/hapus produk & kelola stok
- **Pengguna** (khusus Admin): buat akun Petugas/Admin baru, ubah role, hapus akun
- **Laporan**: riwayat transaksi lengkap dengan detail item & nama member
- Stok otomatis berkurang setiap transaksi berhasil

## Alur Transaksi

```
Login (Petugas/Admin)
   -> pilih barang yang dibeli (klik produk di grid)
   -> atur jumlah barang di keranjang
   -> (opsional) pilih member
   -> Payment (Tunai/Kredit) -> struk tercetak, stok berkurang
```

## 1. Persiapan Laragon

1. Buka **Laragon**, klik **Start All** (Apache/Nginx + MySQL menyala).
2. Buka `http://localhost/phpmyadmin`.
3. Buat database baru, misalnya `kasir_db`.

## 2. Install project

```bash
npm install
```

## 3. Konfigurasi environment

Salin `.env.example` menjadi `.env`, lalu sesuaikan:

```env
DATABASE_URL="mysql://root:@localhost:3306/kasir_db"
JWT_SECRET="ganti-dengan-string-acak-yang-panjang"
```

## 4. Buat tabel di database

```bash
npx prisma db push
```

## 5. Jalankan aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000`.

1. Klik **Daftar di sini** → buat akun pertama → otomatis jadi **Admin**.
2. Login dengan akun tersebut.
3. Masuk ke menu **Produk** → tambahkan beberapa produk.
4. (Opsional) Masuk ke menu **Pengguna** → buat akun **Petugas** untuk kasir harian.
5. Masuk ke menu **Member** → registrasi pelanggan (opsional, bisa juga transaksi tanpa member).
6. Masuk ke menu **Kasir** → pilih produk, pilih member, pilih metode bayar, isi uang dibayar, klik **Bayar**.
7. Cek hasilnya di menu **Laporan**.

## Struktur Folder Penting

```
app/
  login/                -> halaman login
  register/             -> halaman daftar akun (pertama = admin)
  dashboard/
    page.js             -> halaman kasir (POS)
    products/           -> manajemen produk (khusus admin, dilindungi layout.js)
    members/            -> registrasi & kelola member
    users/               -> kelola akun pengguna (khusus admin, dilindungi layout.js)
    history/             -> laporan / riwayat transaksi
  api/
    auth/                -> register, login, logout, me
    products/            -> CRUD produk
    members/             -> CRUD member
    users/                -> CRUD pengguna (admin only)
    transactions/        -> checkout & riwayat
lib/
  prisma.js             -> koneksi database
  auth.js               -> hashing password, JWT, helper isAdmin()
prisma/
  schema.prisma         -> struktur tabel: User, Product, Member, Transaction, TransactionItem
```

## Build untuk produksi

```bash
npm run build
npm run start
```

## Troubleshooting

- **Error koneksi database**: pastikan Laragon (MySQL) sudah "Start All", dan
  `DATABASE_URL` di `.env` sudah sesuai.
- **Tabel belum ada / berubah**: jalankan ulang `npx prisma db push`.
- **Menu Produk/Pengguna tidak muncul**: menu tersebut hanya tampil untuk akun
  dengan role Admin. Cek role akun lewat menu Pengguna (login sebagai Admin).
