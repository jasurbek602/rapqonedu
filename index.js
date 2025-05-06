const TelegramBot = require('node-telegram-bot-api');

const token = '7743866452:AAEwG27jefcV4oVDrNjd8-CR01aymEPPi4c';
const adminChatId = 2053660453;
const adminChat = 1915666976;

const bot = new TelegramBot(token, { polling: true });

const userSteps = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const welcome = `Assalomu alaykum!\n\nBu bot o‘quv markazi uchun mo‘ljallangan. Quyidagi bo‘limlardan birini tanlang:`;

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

  bot.sendMessage(chatId, welcome, options);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === 'O‘qituvchilar haqida') {
    bot.sendMessage(chatId, 'O‘qituvchilar:\n1.');
  }

  if (text === 'O‘quv markaz haqida') {
    bot.sendMessage(chatId, 'Markazimiz Rapqon shaharcha, Abdurazoq MFY. Darslar yuqori sifatda olib boriladi.');
  }

  if (text === 'Admin bilan bog‘lanish') {
    bot.sendMessage(chatId, 'Admin: @your_admin_username');
  }

  if (text === 'Ro‘yxatdan o‘tish') {
    userSteps[chatId] = { step: 1 };
    bot.sendMessage(chatId, "Iltimos, ism va familiyangizni kiriting:");
  }

  const step = userSteps[chatId]?.step;

  if (step === 1 && text !== 'Ro‘yxatdan o‘tish') {
    userSteps[chatId].name = text;
    userSteps[chatId].step = 2;
    bot.sendMessage(chatId, "Endi telefon raqamingizni kiriting:");
  } else if (step === 2) {
    userSteps[chatId].phone = text;
    userSteps[chatId].step = 3;

    const subjects = {
      reply_markup: {
        keyboard: [['Matematika'], ['Fizika'], ['Ingliz tili']],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };

    bot.sendMessage(chatId, "Qaysi fan bo‘yicha ro‘yxatdan o‘tmoqchisiz?", subjects);
  } else if (step === 3) {
    userSteps[chatId].subject = text;

    const info = `Yangi ro‘yxatdan o‘tuvchi:\nIsm: ${userSteps[chatId].name}\nTelefon: ${userSteps[chatId].phone}\nFan: ${userSteps[chatId].subject}`;

    bot.sendMessage(adminChatId, info);
    bot.sendMessage(adminChat, info);
    bot.sendMessage(chatId, "Ma’lumotlaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog‘lanamiz. Qayta boshlash uchun /start ni bosing");

    delete userSteps[chatId];
  }
});
