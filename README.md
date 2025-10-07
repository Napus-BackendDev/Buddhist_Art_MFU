# Buddhist Art MFU

ระบบจัดการและแสดงผลงานศิลปะพุทธ สำหรับมหาวิทยาลัยแม่ฟ้าหลวง

## 📋 เกี่ยวกับโปรเจกต์

Buddhist Art MFU เป็นแพลตฟอร์มสำหรับนักศึกษาและผู้สนใจศิลปะพุทธ ในการอัปโหลด จัดการ และแสดงผลงานศิลปะ พร้อมระบบจองและติดต่อศิลปิน

### ✨ ฟีเจอร์หลัก

- 🎨 **อัปโหลดผลงานศิลปะ** - นักศึกษาสามารถอัปโหลดและจัดการผลงานของตนเอง
- 🔍 **ค้นหาและกรองผลงาน** - ค้นหาตามชื่อ ประเภท เทคนิค และแนวคิด
- 👤 **ระบบผู้ใช้** - แยก role เป็น Student และ Admin
- 📱 **Responsive Design** - ใช้งานได้บนทุกอุปกรณ์
- 🛡️ **ระบบรักษาความปลอดภัย** - JWT Authentication
- 📊 **แดชบอร์ดผู้ดูแล** - จัดการผู้ใช้และผลงานศิลปะ

## 🚀 เทคโนโลยีที่ใช้

### Frontend
- **Nuxt 3** - Vue.js Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Nuxt UI** - Component Library
- **Valibot** - Schema Validation

### Backend
- **NestJS** - Node.js Framework
- **TypeScript** - Type Safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File Upload

## 📦 การติดตั้ง

### ข้อกำหนดระบบ
- Node.js 18+ 
- MongoDB 6+
- npm หรือ yarn

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/buddhist-art-mfu.git
cd buddhist-art-mfu
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/buddhist-art-mfu

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=8000

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

#### Frontend (.env)
```env
# API URL
NUXT_PUBLIC_API_URL=http://localhost:8000

# Environment
NUXT_PUBLIC_ENVIRONMENT=development
```

### 4. รันโปรเจกต์
```bash
npm start
```

## 🌐 การเข้าใช้งาน

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api

## 👥 บัญชีทดสอบ

### Admin
- **Username**: admin
- **Password**: admin123

### Student  
- **Username**: student
- **Password**: student123

## 📁 โครงสร้างโปรเจกต์

```
buddhist-art-mfu/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication Module
│   │   ├── users/          # Users Module  
│   │   ├── artworks/       # Artworks Module
│   │   ├── admin/          # Admin Module
│   │   └── shared/         # Shared Types & Utils
│   └── uploads/            # File Storage
├── frontend/               # Nuxt 3 Frontend
│   ├── app/
│   │   ├── components/     # Vue Components
│   │   ├── pages/          # Route Pages
│   │   ├── layouts/        # Page Layouts
│   │   ├── composables/    # Vue Composables
│   │   └── types/          # TypeScript Types
│   └── public/             # Static Assets
├── shared/                 # Shared Types
└── start.js               # Development Launcher
```

## 📝 API Documentation

### Authentication
```http
POST /auth/login      # เข้าสู่ระบบ
POST /auth/logout     # ออกจากระบบ  
GET  /auth/profile    # ดูข้อมูลผู้ใช้
```

### Artworks
```http
GET    /artworks           # ดูผลงานทั้งหมด
POST   /profile/arts       # อัปโหลดผลงาน
GET    /profile/arts/:id   # ดูผลงานเฉพาะ
PATCH  /profile/arts/:id   # แก้ไขผลงาน
DELETE /profile/arts/:id   # ลบผลงาน
```

### Admin
```http
GET    /admin/users        # ดูผู้ใช้ทั้งหมด
GET    /admin/artworks     # ดูผลงานทั้งหมด
DELETE /admin/users/:id    # ลบผู้ใช้
```

## 🚀 การ Deploy

### Backend (Railway/Heroku)
1. Set environment variables
2. Connect MongoDB Atlas  
3. Deploy from main branch

### Frontend (Vercel/Netlify)
1. Set `NUXT_PUBLIC_API_URL` ให้ชี้ไปยัง production API
2. Deploy from main branch

## 👨‍💻 ผู้พัฒนา

- **Developer Name** - [GitHub](https://github.com/yourusername)
- **Email**: your.email@example.com

## 🙏 กิตติกรรมประกาศ

- มหาวิทยาลัยแม่ฟ้าหลวง
- Vue.js และ NestJS Community  
- Open Source Libraries ที่ใช้ในโปรเจกต์

---

⭐ ถ้าโปรเจกต์นี้มีประโยชน์ อย่าลืม Star ให้เราด้วยนะครับ!
