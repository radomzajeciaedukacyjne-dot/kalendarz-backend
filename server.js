const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 KONFIGURACJA MAILA (TU PODASZ SWÓJ EMAIL)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
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
  console.log("DOSTAŁEM REQUEST:", req.body);

  const { name, surname, email, phone, facility, date, time } = req.body;

  try {
    console.log("➡️ Wysyłam mail do admina...");

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

    console.log("✅ Mail do admina wysłany");

    console.log("➡️ Wysyłam mail do użytkownika...");

    await transporter.sendMail({
      from: `"Nadleśnictwo Radom" <radom.zajecia.edukacyjne@gmail.com>`,
      to: email,
      subject: "Potwierdzenie rezerwacji",
      text: `
Dzień dobry ${name},

Twoja rezerwacja została zapisana
      `
    });

    console.log("✅ Mail do użytkownika wysłany");

    res.json({ success: true });

  } catch (err) {
    console.error("❌ BŁĄD MAILA:", err);
    res.status(500).json({ error: "Błąd wysyłki maila" });
  }
});

// 🔥 START SERWERA
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Serwer działa na porcie " + PORT);
});