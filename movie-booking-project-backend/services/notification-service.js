// backend/services/notification-service.js
// Aici poți folosi un serviciu de email precum Nodemailer
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Înlocuiește cu email-ul tău
    pass: "your-app-password", // Înlocuiește cu parola aplicației tale
  },
});

export const sendCancellationNotification = async (email, movieTitle, showTime) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: `Anulare spectacol: ${movieTitle}`,
    text: `Bună,\n\nNe pare rău să te informăm că spectacolul "${movieTitle}" programat pentru ${new Date(
      showTime
    ).toLocaleString("ro-RO")} a fost anulat.\nÎți mulțumim pentru înțelegere.\n\nEchipa DramArena`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notificare trimisă către ${email}`);
  } catch (err) {
    console.error(`Eroare la trimiterea notificării către ${email}:`, err);
  }
};