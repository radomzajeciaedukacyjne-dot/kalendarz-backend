const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// 🔥 SUPABASE
const SUPABASE_URL = "https://atzejpcxfvjxekfbrvbc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0emVqcGN4ZnZqeGVrZmJydmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTQwMzgsImV4cCI6MjA5MTg3MDAzOH0.dXA26WQgRcpt0Y-yGYohdikDPdFGgXjgYPb7_wCukCg";

// 🔥 POBIERANIE REZERWACJI
app.get("/rezerwacje", async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd pobierania" });
  }
});

// 🔥 DODAWANIE REZERWACJI
app.post("/rezerwacja", async (req, res) => {
  const { name, surname, email, phone, facility, date, time } = req.body;

  try {
    // 🔥 zapis do SUPABASE
    await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify([{
        name,
        surname,
        email,
        phone,
        facility,
        date,
        time
      }])
    });

    // 🔥 MAIL ADMIN
    await resend.emails.send({
      from: "Rezerwacje <kontakt@rezerwacje-radom.pl>",
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

    // 🔥 MAIL USER
    await resend.emails.send({
      from: "Rezerwacje <kontakt@rezerwacje-radom.pl>",
      to: email,
      subject: "Potwierdzenie rezerwacji",
      text: `
Dzień dobry ${name},

Twoja rezerwacja została zapisana ✅

📅 Data: ${date}
🕒 Godzina: ${time}

Placówka: ${facility}

Pozdrawiamy,
Nadleśnictwo Radom
`
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd" });
  }
});

// 🔥 START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Serwer działa na porcie " + PORT);
});