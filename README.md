<div align="center">

# MediVault 💊

<strong>A Digital Vault to Store & Track Medicine Slips</strong>

</div>
Live link - https://meditrack-1-qjyk.onrender.com/


## 📌 Overview

MediVault is a **MERN stack web application** that lets users securely **store, manage, search, and track medical prescriptions ("medicine slips")**. Instead of carrying paper slips, patients can upload and access their prescription history anywhere.

> Status: Initial MVP scaffold committed (auth, slip upload, search, minimal UI). Cloud storage + production hardening still pending (see Roadmap).

## ✨ Features (MVP)

- 📂 Upload and store medicine slips (image / PDF) – currently stored as base64 (dev mode)
- 🔍 Text search across title / doctor / hospital / tags / notes
- 🧾 Metadata: doctor, hospital, date, tags, notes
- 🛡️ JWT authentication (register + login)
- 👤 Basic account management (local persistence in browser)
- 📱 Responsive minimal Tailwind UI

## 🔒 Planned Enhancements

- Cloudinary file storage (replace base64 storage)
- Role-based access (caregiver / patient sharing)
- OCR extraction (medicine names, dosage) via Tesseract or a cloud OCR API
- Tag suggestions & autocomplete
- Audit log & download tracking
- Encrypted at-rest file handling (client-side or server-side envelope)

## 🚀 Tech Stack

| Layer            | Tech                                      |
| ---------------- | ----------------------------------------- |
| Frontend         | React 18, Vite, React Router, TailwindCSS |
| Backend          | Node.js, Express.js                       |
| Database         | MongoDB (Mongoose)                        |
| Auth             | JWT + bcrypt.js                           |
| Uploads (future) | Multer + Cloudinary                       |
| Dev Tooling      | ESLint, Nodemon                           |

## 📂 Monorepo Structure

```
MediTrack/
	README.md
	client/            # React frontend
		src/
			pages/         # Auth, Dashboard, Upload pages
			state/         # Auth context
			main.jsx
	server/            # Express API
		src/
			models/        # Mongoose schemas (User, Slip)
			routes/        # auth + slips routers
			middleware/    # auth middleware
			index.js       # entrypoint
		.env.example
```

## 🛠️ Prerequisites

- Node.js 18+
- MongoDB running locally OR MongoDB Atlas URI

## 🔧 Setup & Run (Development)

Clone & install:

```powershell
git clone <repo-url> MediVault
cd MediVault

# Backend deps
cd server
npm install
copy .env.example .env   # then edit values

# In a separate terminal - start Mongo if local
mongod # or ensure your MongoDB service is running

npm run dev

# Frontend deps
cd ../client
npm install
copy .env.example .env   # adjust VITE_API_URL if needed
npm run dev
```

Open: http://localhost:5173 (frontend) which calls http://localhost:4000/api

## 🔑 Environment Variables

Backend (`server/.env`):

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/medivault
JWT_SECRET=change_me
CLIENT_ORIGIN=http://localhost:5173
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME   # optional for prod
```

Frontend (`client/.env`):

```
VITE_API_URL=http://localhost:4000/api
```

## 🧪 API Endpoints (MVP)

| Method | Path               | Auth   | Description                       |
| ------ | ------------------ | ------ | --------------------------------- |
| GET    | /api/health        | -      | Health check                      |
| POST   | /api/auth/register | -      | Create account                    |
| POST   | /api/auth/login    | -      | Login + JWT                       |
| GET    | /api/slips?q=term  | Bearer | List/search slips                 |
| POST   | /api/slips         | Bearer | Upload slip (multipart/form-data) |
| DELETE | /api/slips/:id     | Bearer | Delete slip                       |

### Upload Payload

Multipart fields: `file` (required), optional: `title`, `doctor`, `hospital`, `date` (YYYY-MM-DD), `tags` (comma separated), `notes`.

## 🧹 Scripts

Backend:

```powershell
cd server
npm run dev      # nodemon
npm start        # production
npm run lint
```

Frontend:

```powershell
cd client
npm run dev
npm run build
npm run preview
```

## ⚠️ Security / Dev Notes

- File storage is base64 in Mongo for now (NOT production safe). Replace with Cloudinary or S3 before launch.
- JWT secret must be long & random in production.
- Add rate limiting & helmet for headers before public exposure.
- Enable proper CORS origins list for deployment.

## 🗺️ Roadmap

1. Replace base64 storage with Cloudinary (store `secure_url`, `public_id`).
2. Add deletion syncing to Cloudinary.
3. Implement pagination & infinite scroll.
4. Add OCR extraction and structured medicine fields.
5. Role-based sharing (grant caregiver access tokens).
6. Email / password reset flow.
7. Unit + integration tests (Jest / Supertest backend, React Testing Library frontend).
8. Dockerize services & compose.
9. Add analytics + audit logs.
10. Progressive Web App (offline cached recent slips).

## 🤝 Contributing

PRs welcome. Please open an issue for significant changes first.

## 📄 License

MIT (add a LICENSE file if distributing publicly).

---

Feel free to open an issue with feature ideas or questions. Happy building! 🩺

## 📸 Screenshots (Optional)

_Add screenshots or UI mockups once available_

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/medivault.git
cd medivault
2️⃣ Backend Setup
cd backend
npm install
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm start

4️⃣ Environment Variables

Create a .env file in the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_URL=your_cloudinary_url   # if using Cloudinary

🎯 Usage

Register/Login as a user

Upload your medicine slips (images/PDFs)

Organize and track prescriptions

Search and access anytime

🛠️ Future Enhancements

📱 Mobile app version (React Native)

📊 Medicine reminders and dosage tracking

🔔 Notifications for prescription refills

🤝 Doctor-patient sharing feature

📈 Analytics for medicine usage history

🤝 Contributing

Contributions are welcome! Please fork this repo and create a pull request.

📜 License

This project is licensed under the MIT License – feel free to use it for personal or academic purposes.
```


