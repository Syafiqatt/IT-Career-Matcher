# Sistem Rekomendasi Karir IT

Proyek **end-to-end machine learning + web** yang merekomendasikan jalur karir IT yang
paling cocok bagi seseorang berdasarkan **skill, tools, database, lama pengalaman koding,
dan tingkat pendidikan**. Dibangun dari data survei developer Stack Overflow, dimodelkan
dengan machine learning, dan disajikan sebagai aplikasi web full-stack interaktif.

Pipeline proyek: **Data → Machine Learning → Web Application**

```
Data Wrangling  ──►  Modelling (ML)  ──►  Deployment (Web App Full-Stack)
   (membersihkan         (melatih &           (React + Express + FastAPI + PostgreSQL)
    & menyiapkan          memilih model
    dataset)              terbaik)
```

---

## 📁 Struktur Proyek

```
PI Sistem Rekomendasi karir/
├── Data Wrangling/        # 1) Penyiapan & eksplorasi data
│   ├── survey_results_public.csv                     # data mentah Stack Overflow
│   ├── Data_cleaning.ipynb                           # pembersihan & transformasi
│   ├── EDA_StackOverflow_Career_Classification.ipynb # analisis eksploratif
│   ├── ab_testing_stackoverflow_experiment.ipynb     # eksperimen A/B
│   └── dataset_so_smote_balanced_injected.csv        # dataset siap pakai (balanced)
│
├── modelling/             # 2) Pemodelan machine learning
│   └── Modeling_Career_Recommendation.ipynb          # training & evaluasi model
│
├── deployment/            # 3) Aplikasi web full-stack
│   ├── ml-service/        # FastAPI — melayani inferensi model
│   ├── backend/           # Express — RESTful API + PostgreSQL
│   └── frontend/          # React + Vite — antarmuka pengguna
│
└── README.md             # dokumen ini
```

---

## 1️⃣ Data — `Data Wrangling/`

Sumber data: **Stack Overflow Annual Developer Survey** (`survey_results_public.csv`).

Tahapan:
- **Pembersihan** (`Data_cleaning.ipynb`): menyeleksi kolom relevan, menormalisasi
  daftar skill/tools/database (dipisah `;`), menangani nilai kosong, dan menurunkan
  label karir.
- **EDA** (`EDA_StackOverflow_Career_Classification.ipynb`): eksplorasi distribusi skill
  dan label karir.
- **Penyeimbangan kelas**: dataset akhir di-*balance* menggunakan **SMOTE** sehingga tiap
  kelas karir relatif setara dan model tidak bias.

**Dataset siap pakai:** `dataset_so_smote_balanced_injected.csv`
- **139.079 baris**, **6 kolom**, **18 label karir** (target seimbang).

| Kolom | Keterangan |
|-------|------------|
| `all_skills` | skill/bahasa & teknologi (dipisah `;`) |
| `tools` | tools / IDE |
| `databases` | database |
| `years_code` | lama pengalaman koding (tahun) |
| `education_level` | tingkat pendidikan (skala 0–6) |
| `career_label` | **target** — 18 karir IT |

---

## 2️⃣ Machine Learning — `modelling/`

Notebook: **`Modeling_Career_Recommendation.ipynb`**

**Rumusan masalah:** *multi-class classification* — memprediksi **Top-N rekomendasi karir**
beserta skor probabilitas.

**Feature engineering:**
- Kolom multi-nilai (`all_skills`, `tools`, `databases`) → **multi-hot encoding**
  (`MultiLabelBinarizer`) = **258 fitur biner**.
- Fitur numerik (`years_code`, `education_level`) → distandarisasi.

**Perbandingan model** (data uji 20%, stratified):

| Model | Accuracy | Macro-F1 | Top-3 Acc |
|-------|:--------:|:--------:|:---------:|
| Logistic Regression | 0.770 | 0.776 | 0.933 |
| **🏆 Random Forest** | **0.974** | **0.978** | **0.998** |
| XGBoost | 0.970 | 0.974 | 0.998 |

**Model terpilih: Random Forest** (berdasarkan Top-3 Accuracy — metrik paling relevan untuk
sistem rekomendasi). Artefak model + encoder disimpan ke
`deployment/ml-service/career_recommender_model.joblib` dan dipakai langsung oleh web app.

> Catatan: artefak Random Forest berukuran besar (~700 MB). Untuk deploy online, XGBoost
> (akurasi nyaris sama) bisa menjadi alternatif yang jauh lebih ringan.

---

## 3️⃣ Web Application — `deployment/`

Aplikasi web full-stack interaktif. Pengguna mengisi profilnya, lalu mendapatkan Top-N
rekomendasi karir; setiap permintaan disimpan sebagai riwayat di database.

### Arsitektur

```
┌─────────────┐    Axios/REST    ┌──────────────┐    HTTP    ┌────────────────┐
│  Frontend   │ ───────────────► │   Backend    │ ─────────► │   ML Service   │
│ React+Vite  │ ◄─────────────── │   Express    │ ◄───────── │   FastAPI      │
│ (port 5173) │     /api/...     │  (port 3000) │  /predict  │  (port 8000)   │
└─────────────┘                  └──────┬───────┘            └────────────────┘
                                        │                     model Random Forest
                                        ▼
                                 ┌──────────────┐
                                 │  PostgreSQL  │  tabel: recommendations (riwayat)
                                 └──────────────┘
```

- **Frontend** — React + **Vite** (module bundler) + **Tailwind CSS** + **Axios**. Responsif.
- **Backend** — RESTful API dengan **Express**; validasi (Joi), CORS, logging (morgan);
  menyimpan riwayat ke **PostgreSQL**; mem-proxy inferensi ke ML service.
- **ML Service** — **FastAPI** memuat model scikit-learn sekali, melayani `/predict` & `/vocab`.

### Endpoint REST API (Express)

| Method | URL | Keterangan |
|--------|-----|------------|
| GET | `/api/health` | Status API + ML service |
| POST | `/api/auth/register` | Registrasi akun (mengembalikan JWT) |
| POST | `/api/auth/login` | Login (mengembalikan JWT) |
| GET | `/api/auth/me` | Profil user dari token (perlu login) |
| GET | `/api/options` | Daftar opsi skill/tool/database/karir |
| POST | `/api/recommendations` | Buat rekomendasi baru (disimpan ke DB) |
| GET | `/api/recommendations` | Daftar riwayat (`?limit=&offset=&search=&sort=`) |
| GET | `/api/recommendations/:id` | Detail satu riwayat |
| DELETE | `/api/recommendations/:id` | Hapus satu riwayat |

> **Autentikasi & riwayat per-user.** Login bersifat opsional (JWT). Jika user login,
> riwayat rekomendasi ditautkan ke akunnya (`user_id`) dan hanya menampilkan miliknya;
> tanpa login, flow tetap berjalan sebagai sesi tamu. Backend lama tidak dirombak —
> kolom `user_id` bersifat nullable.

### Halaman Aplikasi (React Router)

| Route | Halaman | Keterangan |
|-------|---------|------------|
| `/` | **Home** | Hero section, preview rekomendasi, fitur & cara kerja |
| `/input` | **Input Rekomendasi** | Form profil premium (multi-select, slider, progress) |
| `/hasil` | **Hasil** | Match circle, ranking, analisis skill, AI insight, roadmap & gaji |
| `/riwayat` | **Riwayat** | Dashboard riwayat: search, sort, lihat detail, hapus |
| `/tentang` | **Tentang** | Penjelasan proyek & teknologi |
| `/login`, `/register` | **Autentikasi** | Login & registrasi (JWT) |

UI dibangun dengan **Tailwind CSS + Framer Motion + React Icons + react-hot-toast**,
lengkap dengan splash screen, navbar modern (blur saat scroll, hamburger mobile),
glassmorphism, animasi, dan layout responsif.

### Cara Menjalankan

Prasyarat: **Node.js**, **Python 3.11+**, **PostgreSQL** (berjalan).

#### 🚀 Sekali jalan (disarankan)

Satu perintah menjalankan **ML service + backend + frontend** sekaligus (via `concurrently`):

```powershell
cd deployment
npm run install:all     # instal dependensi root, backend, & frontend (sekali saja)
# (sekali saja) salin deployment/backend/.env.example -> .env, isi PGPASSWORD, lalu:
npm run migrate         # membuat database & tabel (sekali saja)
npm run dev             # ⬅️ menjalankan ml + api + web sekaligus
```

Lalu buka **http://localhost:5173**. Hentikan semua dengan satu `Ctrl + C`.

> Untuk ML service, jalankan `pip install -r ml-service/requirements.txt` sekali di awal.

#### 🔧 Manual (3 terminal terpisah, opsional)

```powershell
# Terminal 1 — ML Service
cd deployment/ml-service
uvicorn app:app --host 127.0.0.1 --port 8000

# Terminal 2 — Backend
cd deployment/backend
npm run dev

# Terminal 3 — Frontend
cd deployment/frontend


```

Frontend memproxy `/api` ke backend (lihat `vite.config.js`), jadi CORS tidak perlu
dikonfigurasi saat development.

### Konfigurasi (`deployment/backend/.env`)
- `PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE` — koneksi PostgreSQL
- `ML_SERVICE_URL` — alamat FastAPI (default `http://127.0.0.1:8000`)
- `CORS_ORIGIN` — origin frontend (default `http://localhost:5173`)

---

## 🛠️ Teknologi

| Bagian | Teknologi |
|--------|-----------|
| Data & ML | Python, pandas, scikit-learn, XGBoost, imbalanced-learn (SMOTE), Jupyter |
| ML Service | FastAPI, Uvicorn, joblib |
| Backend | Node.js, Express, PostgreSQL (`pg`), Joi, Axios, CORS, morgan |
| Frontend | React, React Router, Vite, Tailwind CSS, Framer Motion, React Icons, react-hot-toast, Axios |
| Auth | JWT (jsonwebtoken), bcryptjs |

---

## 🔄 Alur Kerja Singkat

1. Pengguna memilih skill, tools, database, pengalaman, dan pendidikan di **frontend**.
2. Frontend mengirim `POST /api/recommendations` ke **backend Express** (Axios).
3. Backend memvalidasi input, meneruskan ke **ML service (FastAPI)** untuk inferensi.
4. Hasil rekomendasi disimpan ke **PostgreSQL**, lalu dikembalikan ke frontend.
5. Frontend menampilkan **Top-N karir + skor kecocokan** dan **riwayat** rekomendasi.
