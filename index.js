const TelegramBot = require('node-telegram-bot-api');

const token = '7743866452:AAEwG27jefcV4oVDrNjd8-CR01aymEPPi4c';
const ADMIN_ID = 2053660453;

const bot = new TelegramBot(token, { polling: true });

const users = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users[chatId] = { step: 'name' };

  const opts = {
    reply_markup: {
      keyboard: [["Ro'yxatdan o'tish"], ["Admin bilan bog'lanish"]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };
  bot.sendMessage(chatId, "Xush kelibsiz! Quyidagilardan birini tanlang:", opts);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const contact = msg.contact;
  const user = users[chatId] || {};

  if (text === "Ro'yxatdan o'tish") {
    users[chatId] = { step: 'name' };
    bot.sendMessage(chatId, "Iltimos, ism va familyangizni kiriting:");
    return;
  }

  if (text === "Admin bilan bog'lanish") {
    bot.sendMessage(chatId, "Admin bilan bog'lanish: @your_admin_username");
    return;
  }

  if (user.step === 'name') {
    users[chatId].name = text;
    users[chatId].step = 'phone';
    bot.sendMessage(chatId, "Telefon raqamingizni yuboring:", {
      reply_markup: {
        keyboard: [[{ text: "Raqamni yuborish", request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  if (user.step === 'phone' && contact) {
    users[chatId].phone = contact.phone_number;
    users[chatId].step = 'subject';
    bot.sendMessage(chatId, "Qaysi fan bo'yicha ro'yxatdan o'tmoqchisiz?", {
      reply_markup: {
        keyboard: [["Matematika"], ["Fizika"], ["Ingliz tili"]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  if (user.step === 'subject' && ["Matematika", "Fizika", "Ingliz tili"].includes(text)) {
    users[chatId].subject = text;
    users[chatId].step = 'location';
    bot.sendMessage(chatId, "Sizga qaysi filialimiz qulayroq?", {
      reply_markup: {
        keyboard: [["Yunusobod"], ["Chilonzor"], ["Olmazor"]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  if (user.step === 'location') {
    users[chatId].location = text;

    const info = users[chatId];
    const fullInfo = `Yangi ro'yxat:

Ism Familya: ${info.name}
Telefon: ${info.phone}
Fan: ${info.subject}
Joylashuv: ${info.location}
Foydalanuvchi: @${msg.from.username || 'yo‘q'} (ID: ${msg.from.id})`;

    bot.sendMessage(ADMIN_ID, fullInfo);
    bot.sendMessage(chatId, "Ro'yxatingiz muvaffaqiyatli qabul qilindi. Tez orada siz bilan bog'lanamiz.");
    users[chatId].step = null;
    return;
  }
});
