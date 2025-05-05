const TelegramBot = require('node-telegram-bot-api');

const token = '7743866452:AAEwG27jefcV4oVDrNjd8-CR01aymEPPi4c';
const ADMIN_ID = 2053660453;

const bot = new TelegramBot(token, { polling: true });

ot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `Assalomu alaykum!

Bu bot o‘quv markazingiz uchun yaratilgan.
Quyidagi bo‘limlardan birini tanlang:`;

  const options = {
    reply_markup: {
      keyboard: [
        ['Ro‘yxatdan o‘tish'],
        ['O‘qituvchilar haqida'],
        ['O‘quv markaz haqida'],
        ['Admin bilan bog‘lanish']
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  bot.sendMessage(chatId, message, options);
});

// Bo‘limlar
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === 'O‘qituvchilar haqida') {
    bot.sendMessage(chatId, 'O');
    bot.sendMessage(chatId, "Ro‘yxatdan o‘tish uchun pastdagi tugmani bosing.", {
      reply_markup: {
        keyboard: [['Ro‘yxatdan o‘tish']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }

  if (text === 'O‘quv markaz haqida') {
    bot.sendMessage(chatId, "Bizning o‘quv markaz Farg'ona shahrida joylashgan. Darslar zamonaviy va interaktiv tarzda o‘tiladi.");
  }

  if (text === 'Admin bilan bog‘lanish') {
    bot.sendMessage(chatId, 'Admin: @your_admin_username');
  }

  if (text === 'Ro‘yxatdan o‘tish') {
    bot.sendMessage(chatId, "Ism familiyangizni kiriting:");
    bot.once('message', (msg1) => {
      const name = msg1.text;
      bot.sendMessage(chatId, "Telefon raqamingizni kiriting:");
      bot.once('message', (msg2) => {
        const phone = msg2.text;
        bot.sendMessage(chatId, "Qaysi fan bo‘yicha ro‘yxatdan o‘tmoqchisiz? (Matematika, Fizika, Ingliz tili):");
        bot.once('message', (msg3) => {
          const subject = msg3.text;

          const info = `Yangi ro‘yxatdan o‘tuvchi:\nIsm Familya: ${name}\nTelefon: ${phone}\nFan: ${subject}`;

          bot.sendMessage(adminChatId, info);
          bot.sendMessage(chatId, "Ma’lumotlaringiz yuborildi! Tez orada siz bilan bog‘lanamiz.");
        });
      });
    });
  }
});
