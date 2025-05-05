const TelegramBot = require('node-telegram-bot-api');

const token = '7743866452:AAEwG27jefcV4oVDrNjd8-CR01aymEPPi4c';
const ADMIN_ID = 2053660453;

const bot = new TelegramBot(token, { polling: true });

// Foydalanuvchi ma'lumotlarini vaqtincha saqlash
const userStates = {};

bot.setMyCommands([
  { command: '/start', description: 'Botni boshlash' }
]);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;

  bot.sendMessage(chatId, `Assalomu alaykum, ${name}! Qaysi bo‘limga o‘tmoqchisiz?`, {
    reply_markup: {
      keyboard: [
        ['O‘quv markaz haqida'],
        ['O‘qituvchilar haqida'],
        ['Ro‘yxatdan o‘tish']
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === 'O‘quv markaz haqida') {
    bot.sendMessage(chatId, `Bizning o‘quv markazimiz zamonaviy fanlarni chuqur o‘rgatishga mo‘ljallangan.
Manzil: Rapqon, Abdurazzoq MFY.
Fanlar: Matematika, Fizika, Ingliz tili.
Bog‘lanish: +998 99-322-57-28`);
  }

  else if (text === 'O‘qituvchilar haqida') {
    bot.sendMessage(chatId, ``, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Ro‘yxatdan o‘tish', callback_data: 'register' }]
        ]
      }
    });
  }

  else if (text === 'Ro‘yxatdan o‘tish') {
    userStates[chatId] = { step: 'name' };
    bot.sendMessage(chatId, 'Ism familyangizni kiriting:');
  }
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'register') {
    userStates[chatId] = { step: 'name' };
    bot.sendMessage(chatId, 'Ism familyangizni kiriting:');
  }

  bot.answerCallbackQuery(query.id);
});

bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const state = userStates[chatId];

  if (!state) return;

  if (state.step === 'name') {
    state.name = text;
    state.step = 'phone';
    bot.sendMessage(chatId, 'Telefon raqamingizni kiriting:');
  } else if (state.step === 'phone') {
    state.phone = text;
    state.step = 'subject';
    bot.sendMessage(chatId, 'Qaysi fanga yozilmoqchisiz? (Matematika/Fizika/Ingliz tili)');
  } else if (state.step === 'subject') {
    state.subject = text;

    const message = `Yangi ro‘yxatdan o‘tish:

Ism: ${state.name}
Tel: ${state.phone}
Fan: ${state.subject}`;

    bot.sendMessage(adminChatId, message);
    bot.sendMessage(chatId, 'Ro‘yxatdan o‘tishi qabul qilindi! Tez orada siz bilan bog‘lanamiz');

    delete userStates[chatId];
  }
});
