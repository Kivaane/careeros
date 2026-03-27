# 🚀 CareerOS — Intelligent Career Management Platform

CareerOS is a full-stack web application designed to help users track, manage, and optimize their job applications in a structured and intelligent way.

It transforms scattered job tracking into a clean, organized system with a modern UI and scalable backend.

---

## 🌟 Core Idea

Instead of manually tracking applications across notes or spreadsheets, CareerOS provides:

* A centralized dashboard
* Structured application tracking
* Smart workflow (Apply → Track → Analyze)

This makes the job search process more efficient, organized, and scalable.

---

## ✨ Features

### 🔐 Authentication System

* User Registration
* Secure Login
* Protected Routes
* Session handling

---

### 📌 Application Management

* Add new job applications
* Edit existing applications
* Delete applications
* Track company, role, and status

---

### 📊 Dashboard & Pipeline

* View all applications in one place
* Structured “Mission Pipeline” UI
* Clean card-based layout

---

### 🧠 Smart Form System

* Structured input fields
* Date tracking (Applied Date, Target ETA)
* Priority-based classification

---

### 🔍 Filtering & Organization *(Extendable)*

* Filter applications by status
* Organize based on priority
* Scalable for future search & sorting

---

### 🌙 UI / UX Experience

* Light mode
* Dark mode
* Clean, modern SaaS-style interface
* Responsive layout

---

### ⚙️ Backend Integration

* REST API integration
* Proper validation handling
* Full CRUD operations

---

## 🛠 Tech Stack

**Frontend**

* React.js
* Tailwind CSS
* Axios

**Backend**

* Node.js
* NestJS

**Database**

* PostgreSQL
* Prisma ORM

---

## 📸 Screenshots

### 🔐 Login Page (Light Mode)

<img width="1919" height="1066" alt="image" src="https://github.com/user-attachments/assets/9b21b927-1855-4653-97a7-af3144f882c2" />


---

### 🌙 Login Page (Dark Mode)

<img width="1918" height="990" alt="image" src="https://github.com/user-attachments/assets/3d3dfd26-eacb-4cab-a481-8ea9d97fc76d" />


---

### 📝 Register Page

<img width="1918" height="998" alt="image" src="https://github.com/user-attachments/assets/0b54350a-0db8-4f7b-b9b7-eef28f63d203" />


---

### 🏠 Dashboard (Light Mode)

<img width="1919" height="1006" alt="image" src="https://github.com/user-attachments/assets/41aaf39e-e412-4502-afe6-040a4bb698d7" />


---

### 🌙 Dashboard (Dark Mode)

<img width="1919" height="1001" alt="image" src="https://github.com/user-attachments/assets/2baea4e7-c37f-4d58-a1b8-9acdc8ff8c9a" />


---

### 📌 Applications Page

<img width="1919" height="999" alt="image" src="https://github.com/user-attachments/assets/4ca9bc84-62b4-4493-a821-947d0352a1ae" />


---

### ➕ Add Application

<img width="1919" height="999" alt="image" src="https://github.com/user-attachments/assets/00f18ab7-16c5-42b0-85e4-f5fbbb1c1c0a" />
<img width="1919" height="1001" alt="image" src="https://github.com/user-attachments/assets/c01c4d11-e051-4f84-8dfc-5a9772e1c391" />
<img width="1916" height="1002" alt="image" src="https://github.com/user-attachments/assets/e6c55fc4-ea51-4f4d-bec6-75e3f2d21967" />
<img width="1919" height="997" alt="image" src="https://github.com/user-attachments/assets/36b54e45-d5e6-4dbc-bbc1-9369f20e3e0c" />


---

### ✏️ Edit Application

<img width="1919" height="1006" alt="image" src="https://github.com/user-attachments/assets/b459f14b-0e03-484c-b579-60977db21a93" />
<img width="1914" height="995" alt="image" src="https://github.com/user-attachments/assets/2c7bf92a-9467-41d0-9423-1d3f268dcf1f" />
<img width="522" height="534" alt="image" src="https://github.com/user-attachments/assets/01626c89-01e2-4ec8-92d3-802a1bbf5122" />


---

### 🗑️ Delete Application

<img width="619" height="540" alt="image" src="https://github.com/user-attachments/assets/b4b72c90-14e9-480e-81b4-7074ea8e807f" />
<img width="1919" height="1001" alt="image" src="https://github.com/user-attachments/assets/9d43ca0e-3840-4a1f-bbab-dc5626f51392" />
<img width="1917" height="996" alt="image" src="https://github.com/user-attachments/assets/3a08bf32-5ca0-44da-bb58-95fd4decdc35" />


---

### 🔍 Filtering / Organization

<img width="1904" height="996" alt="image" src="https://github.com/user-attachments/assets/4a1af7fc-b2c3-43b6-9c0d-3e4790532c63" />
<img width="1918" height="996" alt="image" src="https://github.com/user-attachments/assets/cdd6bd14-2511-4ef4-b6d3-a7416cf30145" />


---
### 🏠 Dashboard setup Final version

<img width="1919" height="1003" alt="image" src="https://github.com/user-attachments/assets/2512d692-da36-44fb-a633-76e29d749ffd" />
<img width="1915" height="1007" alt="image" src="https://github.com/user-attachments/assets/593a3439-e94d-452a-b617-8c4313c7dc02" />
<img width="1918" height="1005" alt="image" src="https://github.com/user-attachments/assets/a0beef2a-062e-454b-9c86-fcba95db19d3" />


## ⚙️ Setup Instructions

```bash
git clone https://github.com/Kivaane/careeros.git
cd careeros
```

### Install dependencies

```bash
npm install
cd client
npm install
```

### Setup environment variables

Create a `.env` file in root:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
```

### Run the project

Backend:

```bash
npm run start:dev
```

Frontend:

```bash
cd client
npm start
```

---

## 🚧 Current Status

* ✅ Frontend UI completed
* ✅ Backend API integrated
* ✅ CRUD operations working
* 🔧 Continuous improvements ongoing
* 🤖 AI features planned

---

## 🎯 Future Improvements

* AI-powered application analysis
* Resume feedback system
* Smart recommendations
* Advanced filtering & search
* Notifications / reminders

---

## 👩‍💻 Author

**Kivaane Anton Uthayakumar**

---

## 📌 Note

This project is actively being developed and improved as part of a full-stack system design journey.
