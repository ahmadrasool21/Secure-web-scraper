# Secure Web Scraper - Project Documentation

## 📌 Project Title

**Secure Web Scraper**

---

## 🧭 Objective

To build a secure web scraping application where users can:

* Register and log in securely.
* Submit a valid URL.
* Extract and download scraped data in a password-protected `.zip` file.

The application is designed to comply with OWASP Top 10 security principles.

---

## 🛠 Technologies Used

### Backend:

* **Node.js** with **Express.js**
* **Sequelize ORM** with **SQLite**
* **JWT** for secure authentication
* **bcryptjs** for password hashing
* **express-validator** for input validation
* **axios** & **cheerio** for web scraping

### Frontend:

* **React.js** with functional components

### Testing:

* **Mocha** – Test Runner
* **Chai** – Assertions
* **Supertest** – HTTP request testing
* **Sinon** – Mocking
* **mock-fs** – File system mocking for `.txt` and `.zip` file generation

---

## 🔐 Security Features Implemented

### ✅ Authentication & Authorization

* Passwords hashed using **bcryptjs**.
* Login returns **JWT token** stored in **httpOnly** cookie.
* Access to protected routes requires valid token (middleware enforced).

### ✅ Input Validation & Sanitization

* All input validated using `express-validator`.
* Prevents XSS, SQL injection and malformed input.

### ✅ Rate Limiting

* Login route protected with rate limiter to mitigate brute-force attacks:

```js
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});
```

### ✅ SSRF Protection

* Private/internal IPs are blocked using regular expressions:

```js
const blockedPatterns = [/^http:\/\/localhost/, /^http:\/\/192\.168\./, ... ];
```

### ✅ Secure Data Handling

* Scraped data stored in `.txt` files.
* Files compressed using `7z` with dynamically generated passwords.
* Downloads restricted to authenticated users.

---

## 🧪 Testing Implementation

### Frameworks Used:

* Mocha, Chai, Supertest, Sinon, mock-fs

### What Was Tested:

* **AuthController**: Registration, login, token generation
* **Routes**: Valid/invalid requests, cookie handling, logout
* **Middleware**: Token verification, rate limiting
* **Model**: Sequelize validation for User model
* **Security**: JWT, SSRF protection, validation logic

### Example Test Case:

```js
describe('POST /api/login', () => {
  it('should return 400 for empty password', async () => {
    const res = await request(app).post('/api/login').send({ email: 'user@example.com' });
    expect(res.status).to.equal(400);
  });
});
```

### Results:

* ✅ 13 tests passed
* Core logic for auth, security, and routing fully verified

---

## 🧭 How the Program Works

### Flow:

1. User registers or logs in.
2. On login, a JWT token is stored in a secure cookie.
3. User enters a URL to scrape.
4. URL is validated and sanitized.
5. HTML content is fetched and cleaned using `cheerio`.
6. Scraped text saved in `.txt` → zipped with a generated password using `7z`.
7. File made available for download, password shown in response.

---

## 🔒 Key Secure Code Snippets

### Registration Hashing

```js
const hashedPassword = await bcrypt.hash(password, 10);
const user = await User.create({ email, password: hashedPassword });
```

### JWT Cookie Setup

```js
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
res.cookie("token", token, { httpOnly: true, sameSite: 'Lax' });
```

### SSRF Blocking

```js
if (blockedPatterns.some(pattern => pattern.test(url))) {
  return res.status(403).json({ msg: "Access to private/internal IPs is not allowed" });
}
```

---

## 📷 Screenshots (Recommended)

* Login/Register form
* URL input interface
* Download screen with password
* Sample `.zip` contents

---

## 📈 Future Improvements

* Add MFA (multi-factor authentication)
* Auto-delete old files after N minutes
* Implement domain whitelisting
* Add real-time email verification for registration

---

## ▶️ How to Run the Project

### Prerequisites:

* Node.js and npm installed
* SQLite installed (comes with Sequelize)
* 7-Zip installed and added to system PATH (for ZIP encryption)

### Backend Setup:

```bash
cd backend
npm install
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### Testing:

```bash
cd backend
npm test
```

All unit and integration tests will execute with Mocha.

---

## 📄 Conclusion

This secure web scraper project combines modern web development practices with secure coding standards. It enforces session management, protects sensitive data, and guards against common vulnerabilities through validation, authentication, SSRF protection, and proper testing.

---

## 🙏 Thank You

Feel free to ask questions during the presentation!
