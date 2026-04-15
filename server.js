const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");


const app = express();

app.use(cors());
app.use(express.json());
const resend = new Resend(process.env.RESEND_API_KEY);



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
const result = await resend.emails.send({
  from: "Rezerwacje <onboarding@resend.dev>",
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

console.log("RESEND RESULT:", result);
console.log("✅ Mail do admina wysłany");

   

    console.log("✅ Mail do admina wysłany");

    console.log("➡️ Wysyłam mail do użytkownika...");
// await resend.emails.send({
//   from: "onboarding@resend.dev",
//   to: email,
//   subject: "Potwierdzenie rezerwacji",
//   text: `
// Dzień dobry ${name},
//
// Twoja rezerwacja została zapisana ✅
//
// 📅 Data: ${date}
// 🕒 Godzina: ${time}
//
// Placówka: ${facility}
//   `
// });

   

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