
# IMAP Email Sync App

A full-stack web application to sync and browse emails real-time from multiple IMAP accounts.  
Built with Node.js, Express, MongoDB, React, and Material UI.

---

## Features

- User registration and login with JWT authentication  
- Add, connect, and manage multiple IMAP email accounts  
- Fetch email folders and messages with incremental synchronization  
- View parsed email content including HTML and plain text parts  
- Search and paginate email messages  
- Store emails securely in MongoDB  

---

## Tech Stack

- **Backend:** Node.js, Express, Mongoose, ImapFlow, mailparser  
- **Frontend:** React, Material UI, Axios  
- **Database:** MongoDB  

---

## Getting Started

### Prerequisites

- Node.js and npm installed  
- MongoDB running locally or accessible remotely  
- [Optional] Create app passwords for Gmail/Outlook if using 2FA  

### Installation

1. Clone the repo:

git clone https://github.com/yourusername/email-sync-app.git
cd email-sync-app

text

2. Backend Setup:

cd backend
npm install

text

Create a `.env` file with:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

text

3. Frontend Setup:

cd ../frontend
npm install

text

---

### Running the Application

- Start backend server:

cd backend
npm start

text

- Start frontend development server:

cd ../frontend
npm start

text

- Open `http://localhost:3000` in your browser.

---

## Usage

- Register a new user and log in  
- Add real IMAP accounts using actual server details (e.g., Gmail: imap.gmail.com)  
- Connect, sync, browse folders and messages  
- Search emails and view their full contents  

---

## Notes

- Always use real IMAP server hostnames (placeholders like `imap.example.com` will fail)  
- For Gmail and Outlook accounts, generate and use app-specific passwords if two-factor authentication is enabled  
- Keep your `.env` secrets secure and never commit them to version control  

---

