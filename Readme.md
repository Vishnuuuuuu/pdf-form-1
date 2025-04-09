# PDF Form Fill System

This project is a full-stack application that allows users to load a PDF form in the browser, fill out form fields (text fields and checkboxes/radio buttons), and save the updated PDF back to the server.

---

## ✅ Features

* Backend powered by **NestJS**
* Frontend using **React + Vite**
* Uses **pdf-lib** to read/write AcroForm fields
* Uses **pdf.js** to render PDFs inside browser with native form interactivity
* Open-source libraries only — no paid or trial SDKs

---

## 📁 Project Structure

```
pdf-form-system/
├── backend/        # NestJS backend
│   ├── src/
│   │   ├── app.module.ts
│   │   └── pdf.controller.ts
│   ├── pdfs/       # Contains example.pdf
│   └── ...
├── frontend/       # React frontend (Vite)
│   └── src/
│       └── App.js  # Main UI logic
├── package.json    # Uses concurrently to run both servers
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Vishnuuuuuu/pdf-form-1.git
cd pdf-form-system
```

### 2. Place PDF File

Download this PDF file and put it in the backend:

📄 [example.pdf](https://drive.google.com/file/d/1cVVEue6KoJdPsUnWr4Uh1hMGeHGinxY6)

```
Place the file here:
backend/pdfs/example.pdf
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the App

```bash
npm start
```

This will:

* Start the NestJS backend at `http://localhost:3001`
* Start the React frontend at `http://localhost:3000`

---

## 🔧 How It Works

* Clicking **Load PDF** will fetch `example.pdf` from the backend and render it using `pdf.js`.
* You can interact with text fields and checkboxes directly inside the browser.
* Clicking **Save PDF** will:
  * Use `pdf-lib` to read the current PDF bytes
  * Apply changes from HTML inputs
  * Save the modified PDF back to the server

---

## 📦 Technologies Used

* **NestJS** (Backend REST API)
* **React + Vite** (Frontend UI)
* **pdf-lib** (Reading and writing AcroForm fields)
* **pdf.js** (Rendering the PDF in the browser)
* **concurrently** (To start both frontend and backend)

---

## 🧠 Notes

* PDF text fields work out-of-the-box.
* Checkboxes and radio buttons may require manual mapping or HTML overlay (depending on field names/export values).
* Fields must have matching `name` attributes in the HTML for updates to sync correctly.

---

## 📝 Assignment Requirements Coverage

* [X] Load PDF in browser ✅
* [X] Fill form fields in-browser ✅
* [X] Save updated PDF to server ✅
* [X] Use open source libraries ✅
* [X] Use NestJS (backend) and React (frontend) ✅
* [X] Simple, functional UI ✅

 Made with ❤️ using React, NestJS, pdf-lib and pdf.js
