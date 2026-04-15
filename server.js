const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 KONFIGURACJA MAILA (TU PODASZ SWÓJ EMAIL)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "radom.zajecia.edukacyjne@gmail.com",
    pass: process.env.EMAIL_PASS
  }
});

// 🔥 TEST
app.get("/", (req, res) => {
  res.send("Serwer działa!");
});

// 🔥 WYSYŁKA REZERWACJI
app.post("/rezerwacja", async (req, res) => {
  const { name, surname, email, phone, facility, date, time } = req.body;

  try {
    // 📩 MAIL DO ADMINA
await transporter.sendMail({
  from: `"Kalendarz" <radom.zajecia.edukacyjne@gmail.com>`,
  to: "radom.zajecia.edukacyjne@gmail.com",
  subject: "Nowa rezerwacja",
  text: `
Nowa rezerwacja:

Data: ${date}
Godzina: ${time}

Imię: ${name}
Nazwisko: ${surname}
Email: ${email}
Telefon: ${phone}
Placówka: ${facility}
  `
});

// 📩 MAIL DO UŻYTKOWNIKA
await transporter.sendMail({
  from: `"Nadleśnictwo Radom" <radom.zajecia.edukacyjne@gmail.com>`,
  to: email,
  subject: "Potwierdzenie rezerwacji",
  text: `
Dzień dobry ${name},

Twoja rezerwacja została zapisana ✅

📅 Data: ${date}
🕒 Godzina: ${time}

Placówka: ${facility}

W razie pytań prosimy o kontakt.

Pozdrawiamy,
Nadleśnictwo Radom
  `
});

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd wysyłki maila" });
  }
});

// 🔥 START SERWERA
app.listen(3000, () => {
  console.log("Serwer działa na http://localhost:3000");
});