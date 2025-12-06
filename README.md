# Aplikasi Chat Real-Time

Aplikasi chat real-time modern full-stack yang dibangun dengan Express.js, Socket.io, dan React.js. Fitur termasuk autentikasi pengguna, beberapa ruang chat, pesan real-time, indikator mengetik, dan pelacakan pengguna online.

## 🚀 Fitur

### Backend
- Server **Express.js** dengan RESTful API
- **Socket.io** untuk komunikasi bidirectional real-time
- **Autentikasi JWT** untuk sesi pengguna yang aman
- **In-memory storage** untuk penyimpanan data (users, messages, rooms)
- Arsitektur MVC yang rapi dengan routes, controllers, dan middleware
- Event real-time: join_room, send_message, receive_message, typing, user_connected, user_disconnected

### Frontend
- **React 18** dengan hooks modern
- **Vite** untuk development dan building yang cepat
- **Tailwind CSS** untuk UI yang indah dan responsif
- **Socket.io-client** untuk fitur real-time
- Alur autentikasi (login/register)
- Beberapa ruang chat
- Pesan real-time tanpa reload halaman
- Indikator mengetik
- Daftar pengguna online
- Notifikasi pengguna join/leave
- Auto-scroll ke pesan terbaru
- UI modern bertema gelap dengan gradien dan animasi

## 📁 Struktur Proyek

```
realtime-chat/
├── backend/
│   ├── server.js                 # Server Express & Socket.io
│   ├── package.json
│   ├── .env
│   ├── db/
│   │   └── database.js          # Database in-memory
│   ├── middleware/
│   │   └── auth.js              # Middleware autentikasi JWT
│   ├── controllers/
│   │   ├── authController.js    # Logika register & login
│   │   ├── userController.js    # Manajemen user
│   │   └── chatController.js    # Logika chat & room
│   ├── routes/
│   │   ├── authRoutes.js        # Endpoint autentikasi
│   │   ├── userRoutes.js        # Endpoint user
│   │   └── chatRoutes.js        # Endpoint chat
│   └── socket/
│       └── socketHandler.js     # Handler event Socket.io
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx             # Entry point React
        ├── App.jsx              # Komponen aplikasi utama
        ├── index.css            # Tailwind & custom styles
        ├── components/
        │   ├── Login.jsx        # Form login
        │   ├── Register.jsx     # Form registrasi
        │   ├── RoomList.jsx     # Daftar ruang chat
        │   ├── ChatRoom.jsx     # Interface chat utama
        │   ├── MessageBubble.jsx # Komponen pesan
        │   └── OnlineUsers.jsx  # Sidebar pengguna online
        ├── context/
        │   └── AuthContext.jsx  # Context autentikasi
        └── utils/
            └── socket.js        # Setup Socket.io client
```

## 🛠️ Instalasi & Setup

### Prasyarat
- Node.js (v16 atau lebih tinggi)
- npm atau yarn

### Setup Backend

1. Masuk ke direktori backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Konfigurasi environment variables (file `.env` sudah dibuat):
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Jalankan server backend:
```bash
npm run dev
```

Server backend akan berjalan di `http://localhost:5000`

### Setup Frontend

1. Masuk ke direktori frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Konfigurasi environment variables (file `.env` sudah dibuat):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. Jalankan server development frontend:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 🎯 Cara Penggunaan

1. **Daftar akun baru**
   - Buka `http://localhost:5173` di browser Anda
   - Klik "Sign up" dan buat akun
   - Anda akan otomatis login setelah registrasi

2. **Pilih ruang chat**
   - Pilih dari ruang yang tersedia: General, Random, Tech Talk, atau Gaming
   - Klik pada card ruangan untuk masuk

3. **Mulai chatting**
   - Ketik pesan Anda di kolom input
   - Tekan Enter atau klik tombol kirim
   - Lihat pesan real-time dari pengguna lain
   - Perhatikan indikator mengetik saat orang lain sedang mengetik
   - Lihat pengguna online di sidebar

4. **Test dengan beberapa pengguna**
   - Buka beberapa jendela browser atau tab incognito
   - Daftar akun yang berbeda
   - Bergabung ke ruangan yang sama dan chat secara real-time

## 📡 Endpoint API

Base URL: `http://localhost:5000/api`

### Autentikasi

#### 1. Register User Baru

Mendaftarkan user baru ke dalam sistem.

**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123",
  "displayName": "John Doe"  // Opsional
}
```

**Validasi:**
- `username`: Minimal 3 karakter, harus unik
- `password`: Minimal 6 karakter
- `displayName`: Opsional, jika kosong akan menggunakan username

**Response Sukses (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1733491234567",
    "username": "johndoe",
    "displayName": "John Doe"
  }
}
```

**Response Error (400):**
```json
{
  "error": "Username already exists"
}
```

**Contoh dengan cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123","displayName":"John Doe"}'
```

**Contoh dengan Postman:**
1. Method: `POST`
2. URL: `http://localhost:5000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "username": "johndoe",
     "password": "password123",
     "displayName": "John Doe"
   }
   ```

---

#### 2. Login User

Login dengan username dan password yang sudah terdaftar.

**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response Sukses (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1733491234567",
    "username": "johndoe",
    "displayName": "John Doe"
  }
}
```

**Response Error (401):**
```json
{
  "error": "Invalid credentials"
}
```

**Contoh dengan cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'
```

**Cara Menggunakan Token:**
Setelah login, simpan token dan gunakan di header Authorization untuk request selanjutnya:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Pengguna

Semua endpoint pengguna memerlukan **JWT Token** di header Authorization.

#### 3. Dapatkan Pengguna Online

Mendapatkan daftar pengguna yang sedang online di ruangan tertentu.

**Endpoint:** `GET /api/users/online?roomId={roomId}`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
```

**Query Parameters:**
- `roomId` (wajib): ID ruangan (`general`, `random`, `tech`, `gaming`)

**Response Sukses (200):**
```json
{
  "roomId": "general",
  "users": [
    {
      "userId": "1733491234567",
      "username": "johndoe",
      "connectedAt": "2025-12-06T13:30:00.000Z"
    }
  ]
}
```

**Contoh dengan cURL:**
```bash
curl -X GET "http://localhost:5000/api/users/online?roomId=general" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

#### 4. Dapatkan Profil Pengguna

Mendapatkan profil pengguna yang sedang login.

**Endpoint:** `GET /api/users/profile`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
```

**Response Sukses (200):**
```json
{
  "id": "1733491234567",
  "username": "johndoe",
  "displayName": "John Doe",
  "createdAt": "2025-12-06T10:00:00.000Z"
}
```

---

#### 5. Dapatkan Semua Pengguna Terdaftar

Mendapatkan daftar semua pengguna yang sudah terdaftar di sistem.

**Endpoint:** `GET /api/users/all`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
```

**Response Sukses (200):**
```json
{
  "total": 3,
  "users": [
    {
      "id": "1733491234567",
      "username": "johndoe",
      "displayName": "John Doe",
      "createdAt": "2025-12-06T10:00:00.000Z"
    },
    {
      "id": "1733491234568",
      "username": "janedoe",
      "displayName": "Jane Doe",
      "createdAt": "2025-12-06T10:05:00.000Z"
    }
  ]
}
```

**Contoh dengan cURL:**
```bash
curl -X GET http://localhost:5000/api/users/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Contoh dengan JavaScript:**
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/users/all', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('Total users:', data.total);
console.log('Users:', data.users);
```

**Catatan Keamanan:**
- Password tidak ditampilkan dalam response
- Hanya menampilkan informasi publik: id, username, displayName, createdAt

---

### Chat

#### 6. Dapatkan Semua Ruangan

Mendapatkan daftar semua ruang chat yang tersedia.

**Endpoint:** `GET /api/chat/rooms`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
```

**Response Sukses (200):**
```json
{
  "rooms": [
    {
      "id": "general",
      "name": "General",
      "description": "General discussion"
    },
    {
      "id": "random",
      "name": "Random",
      "description": "Random topics"
    },
    {
      "id": "tech",
      "name": "Tech Talk",
      "description": "Technology discussions"
    },
    {
      "id": "gaming",
      "name": "Gaming",
      "description": "Gaming chat"
    }
  ]
}
```

---

#### 7. Dapatkan Riwayat Chat Ruangan

Mendapatkan riwayat chat dari ruangan tertentu.

**Endpoint:** `GET /api/chat/rooms/{roomId}/history`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
```

**Path Parameters:**
- `roomId`: ID ruangan (`general`, `random`, `tech`, `gaming`)

**Response Sukses (200):**
```json
{
  "roomId": "general",
  "messages": [
    {
      "id": "1733491234567",
      "userId": "1733491234567",
      "username": "johndoe",
      "message": "Hello everyone!",
      "timestamp": "2025-12-06T13:30:00.000Z"
    }
  ]
}
```

**Contoh dengan cURL:**
```bash
curl -X GET http://localhost:5000/api/chat/rooms/general/history \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔌 Event Socket.io

Socket.io digunakan untuk komunikasi real-time. Client harus mengirim JWT token saat koneksi.

### Koneksi Socket.io

**Client Side (JavaScript):**
```javascript
import { io } from 'socket.io-client';

const token = localStorage.getItem('token');

const socket = io('http://localhost:5000', {
  auth: {
    token: token
  }
});

socket.on('connect', () => {
  console.log('Terhubung ke server');
});
```

---

### Event dari Client ke Server

#### 1. `user_connected`

Dipanggil saat pengguna pertama kali bergabung ke ruangan.

**Emit:**
```javascript
socket.emit('user_connected', {
  roomId: 'general'
});
```

**Parameter:**
- `roomId` (string): ID ruangan yang akan dimasuki

---

#### 2. `join_room`

Dipanggil saat pengguna pindah dari satu ruangan ke ruangan lain.

**Emit:**
```javascript
socket.emit('join_room', {
  roomId: 'tech'
});
```

**Parameter:**
- `roomId` (string): ID ruangan baru

---

#### 3. `send_message`

Mengirim pesan chat ke ruangan.

**Emit:**
```javascript
socket.emit('send_message', {
  roomId: 'general',
  message: 'Halo semuanya!'
});
```

**Parameter:**
- `roomId` (string): ID ruangan tujuan
- `message` (string): Isi pesan

---

#### 4. `typing`

Memberitahu pengguna lain bahwa sedang mengetik.

**Emit:**
```javascript
// Saat mulai mengetik
socket.emit('typing', {
  roomId: 'general',
  isTyping: true
});

// Saat berhenti mengetik
socket.emit('typing', {
  roomId: 'general',
  isTyping: false
});
```

**Parameter:**
- `roomId` (string): ID ruangan
- `isTyping` (boolean): Status mengetik

---

### Event dari Server ke Client

#### 1. `receive_message`

Menerima pesan baru dari pengguna lain atau diri sendiri.

**Listen:**
```javascript
socket.on('receive_message', (data) => {
  console.log('Pesan baru:', data);
  // Tampilkan pesan di UI
});
```

**Data:**
```json
{
  "id": "1733491234567",
  "userId": "1733491234567",
  "username": "johndoe",
  "message": "Halo semuanya!",
  "timestamp": "2025-12-06T13:30:00.000Z"
}
```

---

#### 2. `user_joined`

Pengguna baru bergabung ke ruangan.

**Listen:**
```javascript
socket.on('user_joined', (data) => {
  console.log(`${data.username} bergabung`);
  // Update daftar pengguna online
});
```

**Data:**
```json
{
  "userId": "1733491234567",
  "username": "johndoe",
  "message": "johndoe joined the room",
  "onlineUsers": [
    {
      "userId": "1733491234567",
      "username": "johndoe"
    }
  ]
}
```

---

#### 3. `user_left`

Pengguna keluar dari ruangan.

**Listen:**
```javascript
socket.on('user_left', (data) => {
  console.log(`${data.username} keluar`);
});
```

---

#### 4. `user_disconnected`

Pengguna terputus dari server.

**Listen:**
```javascript
socket.on('user_disconnected', (data) => {
  console.log(`${data.username} terputus`);
});
```

---

#### 5. `user_typing`

Pengguna lain sedang mengetik.

**Listen:**
```javascript
socket.on('user_typing', (data) => {
  if (data.isTyping) {
    console.log(`${data.username} sedang mengetik...`);
  }
});
```

**Data:**
```json
{
  "userId": "1733491234567",
  "username": "johndoe",
  "isTyping": true
}
```

---

### Contoh Implementasi Lengkap

```javascript
import { io } from 'socket.io-client';

// 1. Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'johndoe', password: 'password123' })
});
const { token } = await response.json();
localStorage.setItem('token', token);

// 2. Hubungkan Socket.io
const socket = io('http://localhost:5000', {
  auth: { token }
});

// 3. Bergabung ke ruangan
socket.emit('user_connected', { roomId: 'general' });

// 4. Dengarkan pesan
socket.on('receive_message', (message) => {
  console.log(`[${message.username}]: ${message.message}`);
});

// 5. Kirim pesan
socket.emit('send_message', {
  roomId: 'general',
  message: 'Halo!'
});

// 6. Handle mengetik
let typingTimeout;
inputField.addEventListener('input', () => {
  socket.emit('typing', { roomId: 'general', isTyping: true });
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing', { roomId: 'general', isTyping: false });
  }, 2000);
});
```

## 🎨 Fitur UI

- **Tema Gelap Modern** dengan aksen gradien
- **Desain Responsif** berfungsi di desktop dan mobile
- **Animasi Halus** untuk UX yang lebih baik
- **Custom Scrollbar** styling
- **Loading States** untuk operasi async
- **Error Handling** dengan pesan yang user-friendly
- **Auto-scroll** ke pesan terbaru
- **Message Bubbles** dengan styling pengirim/penerima
- **Indikator Mengetik** dengan titik animasi
- **Indikator Status** online

## 🔐 Fitur Keamanan

- Hashing password dengan bcryptjs
- Autentikasi berbasis JWT token
- Route API yang terproteksi
- Middleware autentikasi Socket.io
- Konfigurasi CORS
- Environment variables untuk data sensitif

## 🚀 Deployment Production

### Backend
1. Set `NODE_ENV=production` di `.env`
2. Update CORS origin ke domain production Anda
3. Gunakan database production-ready (PostgreSQL, MongoDB)
4. Deploy ke layanan seperti Heroku, Railway, atau DigitalOcean

### Frontend
1. Build production bundle:
```bash
npm run build
```
2. Update API URLs di `.env` ke URL backend production
3. Deploy ke Vercel, Netlify, atau layanan hosting statis lainnya

## 🛠️ Stack Teknologi

**Backend:**
- Express.js - Web framework
- Socket.io - Komunikasi real-time
- JWT - Autentikasi
- bcryptjs - Hashing password
- In-memory storage - Penyimpanan data
- CORS - Cross-origin resource sharing
- dotenv - Environment variables

**Frontend:**
- React 18 - Library UI
- Vite - Build tool
- Tailwind CSS - Styling
- Socket.io-client - Client real-time
- Context API - Manajemen state

## 📝 Cara Kerja Socket.io di Aplikasi Ini

1. **Koneksi**: Saat pengguna login, frontend menginisialisasi koneksi Socket.io dengan JWT token untuk autentikasi.

2. **Bergabung ke Ruangan**: Saat memasuki ruang chat, client mengirim event `user_connected` dengan ID ruangan. Server menambahkan pengguna ke ruangan tersebut.

3. **Pesan**: Saat mengirim pesan:
   - Client mengirim `send_message` dengan ID ruangan dan pesan
   - Server menyimpan pesan ke database
   - Server broadcast `receive_message` ke semua pengguna di ruangan
   - Semua client memperbarui UI mereka secara real-time

4. **Indikator Mengetik**: Saat pengguna mengetik:
   - Client mengirim event `typing` dengan status isTyping
   - Server broadcast ke pengguna lain di ruangan
   - Client lain menampilkan/menyembunyikan indikator mengetik

5. **Kehadiran Pengguna**: 
   - Server melacak pengguna online per ruangan
   - Broadcast event join/leave pengguna
   - Client memperbarui daftar pengguna online secara real-time

6. **Penanganan Disconnect**: Saat pengguna menutup browser atau kehilangan koneksi, Socket.io otomatis memicu event disconnect, dan server membersihkan kehadiran pengguna.

## 🤝 Kontribusi

Silakan fork proyek ini dan kirim pull request untuk perbaikan apapun!

## 📄 Lisensi

ISC

---

**Selamat chatting secara real-time! 💬✨**
