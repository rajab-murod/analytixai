# AI Analytics Platform — Feature List va Texnik Arxitektura

**Versiya:** MVP v1.0
**Sana:** 2026-yil avgust

---

## 1. Mahsulot qisqacha ta'rifi

Multi-tenant SaaS platforma: kompaniyalar ro'yxatdan o'tadi, loyiha yaratadi, o'z ma'lumotlar bazasini ulaydi, LLM model (bulutli yoki local) tanlaydi va tabiiy tilda so'rov berib, avtomatik SQL, chart va Excel hisobot oladi. Token orqali API integratsiya va obuna asosida monetizatsiya.

---

## 2. Feature List

### 2.1 Autentifikatsiya va Tenant (Kompaniya) boshqaruvi
- Ro'yxatdan o'tish / login (email + parol, keyinchalik Google/Microsoft SSO)
- Rol tizimi: Super Admin (platforma egasi) → Company Admin → Company Member (viewer/editor)
- Har bir kompaniya alohida "workspace" — ma'lumotlari boshqa kompaniyalardan to'liq izolyatsiyalangan
- Kompaniya profili: nomi, logotipi, sohasi (universitet, tibbiyot, retail va h.k.)

### 2.2 Loyiha (Project) boshqaruvi
- Bitta kompaniya ichida bir nechta loyiha yaratish (masalan: "Talabalar bazasi", "Moliya bazasi")
- Har bir loyiha — alohida baza ulanishi, alohida LLM konfiguratsiyasi, alohida schema/metadata
- Loyiha darajasida ruxsatlar (kim ko'ra oladi, kim so'rov bera oladi)

### 2.3 Ma'lumotlar bazasi konfiguratsiyasi
- Qo'llab-quvvatlanadigan bazalar (MVP): PostgreSQL, MySQL
- Kelajakda: MS SQL Server, Oracle, BigQuery, Snowflake
- Ulanish ma'lumotlari (host, port, user, parol) — **shifrlangan holda** saqlanadi
- **Read-only** foydalanuvchi bilan ulanish talab qilinadi (yozish huquqisiz — xavfsizlik uchun majburiy)
- Schema avtomatik skanerlash (jadval/ustun nomlari, tiplar, bog'lanishlar)
- Qo'lda "biznes lug'ati" qo'shish imkoniyati (masalan: "aylanma" = revenue jadvalidagi qaysi ustun)

### 2.4 LLM model tanlash
- Bulutli modellar: OpenAI, Anthropic, Gemini (API key orqali, kompaniya o'zi kiritadi yoki platforma taqdim etadi)
- **Local modellar**: Ollama orqali (Llama, Qwen, Mistral va h.k.) — maxfiy ma'lumot uchun
- Har bir loyiha uchun alohida model tanlash
- Model tanlashda narx/tezlik/aniqlik haqida ko'rsatma (masalan: "Local — sekinroq, lekin ma'lumot chiqmaydi")

### 2.5 So'rov mexanizmi (Query Engine)
- Tabiiy tilda savol berish (o'zbek, rus, ingliz tili)
- Generatsiya qilingan SQL foydalanuvchiga **ko'rsatiladi** (shaffoflik + xato tekshirish uchun)
- Natija: jadval ko'rinishida
- Suhbat tarixi (context) saqlanadi — keyingi savollar oldingi natijaga bog'liq bo'lishi mumkin
- Xato/noaniq so'rovlarda tizim aniqlashtiruvchi savol beradi

### 2.6 Hisobot va vizualizatsiya
- Avtomatik chart tanlash (bar, line, pie) — ma'lumot tipiga qarab
- Excel (.xlsx) export
- PDF export (keyingi faza)
- Dashboard: tez-tez so'raladigan hisobotlarni "saqlash" va pin qilish
- Rejalashtirilgan hisobotlar (masalan: har hafta email orqali)  — keyingi faza

### 2.7 API / Token integratsiyasi
- Har bir loyiha uchun API token generatsiya qilinadi
- REST API: `/query`, `/reports`, `/schema` endpointlari
- Kompaniya o'z ichki tizimiga (CRM, LMS, ERP) shu tokenlar orqali ulanadi
- Rate limiting token darajasida

### 2.8 Billing va obuna
- Tariflar: Free (limitli so'rov), Starter, Business, Enterprise (custom)
- Usage-based komponent: so'rov soni / token sarfi bo'yicha limit
- To'lov integratsiyasi: Payme/Click (mahalliy) + Stripe (xalqaro)
- Invoice va usage tarixi

### 2.9 Admin panel va monitoring
- Super admin: barcha kompaniyalarni ko'rish, limitlarni boshqarish
- Company admin: o'z loyihalari, xodimlari, so'rov tarixini ko'rish
- Xarajat monitoringi (qaysi loyiha qancha token sarflagani)

### 2.10 Xavfsizlik va Governance
- SQL generatsiyasi faqat **SELECT** operatsiyalariga ruxsat beradi (INSERT/UPDATE/DELETE bloklanadi)
- Query sandboxing — timeout va row-limit bilan ijro etiladi
- Audit log: kim, qachon, qanday so'rov bergani
- Ma'lumotlar shifrlash (at rest va in transit)
- Har bir tenant uchun to'liq ma'lumot izolyatsiyasi (boshqa kompaniya ma'lumotiga kirish imkonsiz)

---

## 3. Texnik Arxitektura

### 3.1 Umumiy arxitektura (yuqori darajada)

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Frontend    │ ───► │   API Gateway /    │ ───► │  Auth Service    │
│ (Web + API)  │      │   Backend (REST)   │      │  (JWT, RBAC)     │
└─────────────┘      └──────────────────┘      └─────────────────┘
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                 ▼
      ┌────────────┐   ┌─────────────┐   ┌──────────────┐
      │ Tenant/     │   │ Query Engine │   │ Billing       │
      │ Project     │   │ (Vanna-based │   │ Service       │
      │ Service     │   │ orchestrator)│   │ (Stripe/Payme)│
      └────────────┘   └─────────────┘   └──────────────┘
                              │
             ┌────────────────┼─────────────────┐
             ▼                ▼                  ▼
      ┌────────────┐   ┌─────────────┐   ┌──────────────┐
      │ Vector DB   │   │ LLM Router   │   │ Customer DBs │
      │ (per-tenant │   │ (Cloud API / │   │ (read-only   │
      │  schema RAG)│   │  Ollama)     │   │  connection) │
      └────────────┘   └─────────────┘   └──────────────┘
             │
             ▼
      ┌────────────┐
      │ Platform DB │  (companies, projects, users, tokens,
      │ (Postgres)  │   configs, query_logs, subscriptions)
      └────────────┘
```

### 3.2 Texnologik stack (tavsiya)

| Qatlam | Texnologiya | Izoh |
|---|---|---|
| Frontend | React + Tailwind | Dashboard, chat interfeysi |
| Backend API | Python (FastAPI) | REST API |
| Query orchestration | **Vanna AI 2.0** (open-source, MIT) | Text-to-SQL yadrosi, multi-tenant izolyatsiya tayyor |
| Local LLM runtime | **Ollama** | Local model (Llama, Qwen, Mistral) ishga tushirish |
| Cloud LLM | OpenAI / Anthropic / Gemini API | Router orqali tanlanadi |
| Vector DB (RAG) | ChromaDB yoki pgvector | Har bir loyiha uchun alohida namespace/collection |
| Platform DB | PostgreSQL | Asosiy metadata: users, companies, projects, configs |
| Auth | JWT + OAuth2 | Rol asosida ruxsatlar (RBAC) |
| Chart generatsiya | Plotly / Chart.js (backend orqali JSON → frontend render) | |
| Excel export | openpyxl  | |
| Billing | Stripe + Payme/Click | |
| Deployment | Docker + Kubernetes (yoki Docker Compose MVP uchun) | Har bir mijoz uchun local LLM konteynerini alohida ishga tushirish mumkin |
| Monitoring | Prometheus + Grafana | Token sarfi, so'rov soni, xatolik darajasi |

### 3.3 Multi-tenancy strategiyasi

MVP uchun tavsiya: **shared database, tenant_id bilan ajratish** (schema-per-tenant emas — sodda va tez):

- Har bir jadvalda `tenant_id` (company_id) ustuni majburiy
- Barcha so'rovlar backend darajasida `tenant_id` filtri bilan avtomatik cheklanadi (middleware orqali — dasturchi xato qilib boshqa tenant ma'lumotini chiqarib yubormasligi uchun)
- Vector DB'da har bir loyiha uchun alohida collection/namespace
- Mijozning haqiqiy ma'lumotlar bazasi ulanish ma'lumotlari alohida, shifrlangan jadvalda saqlanadi (masalan HashiCorp Vault yoki AWS Secrets Manager orqali, MVP'da — shifrlangan ustun + AES-256)

O'sish bosqichida (Enterprise mijozlar uchun) — schema-per-tenant yoki alohida instance'ga o'tish imkoniyati qoldiriladi.

### 3.4 Ma'lumotlar oqimi (bitta so'rov qanday ishlaydi)

1. Foydalanuvchi frontend'da savol yozadi → Backend'ga JWT token bilan yuboriladi
2. Auth Service token'ni tekshiradi, `tenant_id` va `project_id` ni aniqlaydi
3. Query Engine loyihaning schema/metadata'sini Vector DB'dan (RAG) oladi
4. Tanlangan LLM'ga (cloud yoki local/Ollama) savol + schema konteksti yuboriladi
5. LLM SQL generatsiya qiladi → SQL foydalanuvchiga ko'rsatiladi (shaffoflik)
6. SQL faqat SELECT ekanligi tekshiriladi (sanitizatsiya) → read-only ulanish orqali mijoz bazasida ijro etiladi (timeout + row limit bilan)
7. Natija qaytadi → chart/jadval sifatida frontend'da ko'rsatiladi, kerak bo'lsa Excel'ga export qilinadi
8. So'rov, SQL, natija — audit log'ga yoziladi

### 3.5 Platforma bazasi — asosiy jadvallar (yuqori darajada)

- `companies` (id, name, plan, created_at)
- `users` (id, company_id, role, email)
- `projects` (id, company_id, name, llm_config_id, db_config_id)
- `db_configs` (id, project_id, type, encrypted_credentials, schema_cache)
- `llm_configs` (id, project_id, provider, model_name, is_local)
- `api_tokens` (id, project_id, token_hash, rate_limit)
- `query_logs` (id, project_id, user_id, question, generated_sql, status, tokens_used, created_at)
- `subscriptions` (id, company_id, plan, status, usage_current_period)

### 3.6 Xavfsizlik arxitekturasi

- SQL Guard qatlami: faqat `SELECT` ruxsat, `DROP/DELETE/UPDATE/INSERT/ALTER` bloklanadi (regex + SQL parser tekshiruvi orqali, ikki bosqichli)
- Mijoz bazasiga ulanish — har doim **read-only** rol bilan (platforma tomonidan majburlanadi)
- Har bir so'rov uchun timeout (masalan 10 sek) va max row limit (masalan 10,000 qator)
- Credentials — AES-256 shifrlash, faqat runtime'da dekodlanadi
- Local LLM tanlangan loyihalarda — ma'lumot hech qachon tashqi API'ga yuborilmaydi (bu — asosiy sotish argumenti maxfiylik talab qiladigan mijozlar uchun)

### 3.7 Deployment (MVP uchun sodda variant)

- Docker Compose: Backend + Platform DB + Vector DB + (ixtiyoriy) Ollama konteyneri
- Cloud: DigitalOcean / Hetzner (arzon) yoki AWS (kengroq imkoniyat)
- Local LLM talab qiluvchi mijozlar uchun — GPU'li server (yoki mijozning o'z serverida on-premise deploy qilish varianti — bu Enterprise tarif uchun kuchli taklif bo'lishi mumkin)

---

## 4. MVP scope — nima kiradi, nima keyingi fazaga qoldiriladi

**MVP'ga kiradi:**
- 1 kompaniya → ko'p loyiha
- PostgreSQL/MySQL ulanish
- 1-2 cloud LLM + Ollama orqali 1 local model
- Tabiiy tildan SQL + jadval + oddiy chart
- Excel export
- API token (asosiy)
- Oddiy obuna (Free + 1 pullik tarif)

**Keyingi fazaga qoldiriladi:**
- Schema-per-tenant / on-premise deploy
- PDF export, rejalashtirilgan hisobotlar
- Ko'p tilli murakkab kontekst (uzoq suhbat xotirasi)
- SSO, granular RBAC
- BigQuery/Snowflake/Oracle qo'llab-quvvatlash

---

## 5. Taxminiy vaqt

| Faza | Muddat | Asosiy natija |
|---|---|---|
| Faza 1 — Core query engine | 4-6 hafta | 1 kompaniya, 1 baza, ishlaydigan NL→SQL→chart |
| Faza 2 — Multi-tenant + API | 4-6 hafta | Ro'yxatdan o'tish, loyiha boshqaruvi, token API |
| Faza 3 — Billing + polish | 2-4 hafta | Obuna, admin panel, xavfsizlik audit |

**Jami: ~10-16 hafta** (2-3 dasturchi bilan; 1 dasturchi bo'lsa 2 barobar uzoqroq)
