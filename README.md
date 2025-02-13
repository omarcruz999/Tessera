# Tessera
Tessera is a mobile app designed to facilitate in-person social connections using NFC technology and selfies. Instead of passive social media engagement, Tessera encourages meaningful interactions by allowing users to:

📌 Tap phones to connect using NFC
📌 Take a selfie together to capture the moment
📌 View a home feed of recent connections

The app focuses on authentic, real-world interactions, making networking and socializing more engaging. Future features include group connections, profile customization, and notifications.

## 💡 Tech Stack:

### 📱 Mobile App (Main Platform)
✅ React Native (Expo for ease, or bare React Native if needed)
✅ React Native NFC Manager (Handles NFC interactions)
✅ React Native Camera (For capturing selfies)
✅ React Context (For state management)

### 💻 Web App (Admin & Viewing Platform)
✅ Vite + React (Frontend for web dashboard)
✅ React Router (For navigation)
✅ Tailwind CSS (For styling)
✅ Supabase SDK (For database, auth, and storage integration)

### 🛠 Backend & Database
✅ Supabase (PostgreSQL) (Database, Auth, Real-time Sync)
✅ Supabase Auth (Handles user authentication)
✅ Supabase Storage (For images and media)
✅ Supabase Realtime (For live updates in the feed)
✅ Node.js (For potential future backend logic)

### 📡 Deployment & DevOps
✅ GitHub Projects (For sprint tracking & issues)
✅ Vercel (For web app deployment)
✅ Expo EAS (For mobile builds)
✅ Supabase Hosted Backend (No need to manage servers)

### 🔗 Collaboration & Task Management
✅ GitHub (Version control & CI/CD)
✅ GitHub Projects (Kanban board for tasks)
✅ Discord (For team communication & async updates)

## 🚀 Development Approach:
We use iterative development with weekly sprints, starting with an MVP and expanding as time allows.

## ⭐ Tessera Database Schema

Tessera uses **PostgreSQL (via Supabase)** to store users, connections, posts, and group memberships.  

---

### 🧑‍💻 Users Table (`users`)
```
id          UUID       PRIMARY KEY
email       VARCHAR    UNIQUE
name        VARCHAR
avatar_url  TEXT
created_at  TIMESTAMP  DEFAULT now()
```

---

### 🔗 Connections Table (`connections`)
```
id          UUID       PRIMARY KEY
user_1      UUID       REFERENCES users(id)
user_2      UUID       REFERENCES users(id)
selfie_url  TEXT
timestamp   TIMESTAMP  DEFAULT now()
```

---

### 📝 Posts Table (`posts`)
```
id          UUID       PRIMARY KEY
user_id     UUID       REFERENCES users(id)
text        TEXT
created_at  TIMESTAMP  DEFAULT now()
```

---

### 📸 Post Media Table (`post_media`)
```
id          UUID       PRIMARY KEY
post_id     UUID       REFERENCES posts(id)
media_url   TEXT
type        VARCHAR    CHECK (type IN ('image', 'video', 'file'))
created_at  TIMESTAMP  DEFAULT now()
```

---

### 👥 Groups Table (`groups`)
```
id          UUID       PRIMARY KEY
name        VARCHAR
description TEXT
created_by  UUID       REFERENCES users(id)
created_at  TIMESTAMP  DEFAULT now()
```

---

### 📌 Group Members Table (`group_members`)
```
group_id    UUID       REFERENCES groups(id)
user_id     UUID       REFERENCES users(id)
joined_at   TIMESTAMP  DEFAULT now()
PRIMARY KEY (group_id, user_id)
```

---

### ✅ How to Use This Schema
- **One-to-Many Relationships**:
  - Each **user** can create **many posts**.
  - Each **post** can have **multiple media files**.
- **Many-to-Many Relationships**:
  - **Users** can belong to **multiple groups**, and **groups** can have **multiple members** (tracked in `group_members`).

