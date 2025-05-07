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
        ['Telegram kanal']
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

  if (text == 'O‘qituvchilar haqida') {
    bot.sendPhoto(chatId, 'AgACAgIAAxkBAAPtaBskqtLZ3nqozze9x4Gbq2AcY4IAAtTpMRtQTNlITF1tsxFx2xkBAAMCAAN5AAM2BA', { caption: 'Rajabaliyev Behruzbek \n Fan: Matematika \n Tajriba: 4 yil \n 1000tadan ortiq o`quvchiga talim bergan', 
      reply_markup: {
      inline_keyboard: [
        [
          { text: "Ro‘yxatdan o‘tish", callback_data: 'register' }
        ]
      ]
    }
   });
    bot.sendPhoto(chatId, 'AgACAgIAAxkBAAPvaBsk3xzUR1_Hy3hzPndmRCoxisIAAtXpMRtQTNlIMmtd3aYiJLEBAAMCAAN5AAM2BA', { caption: 'Ozodbek Qosimov \n Fan: Matematika Fizika \n Tajriba: 4 yil \n 1000taga yaqin o`quvchiga talim bergan',
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Ro‘yxatdan o‘tish", callback_data: 'register' }
          ]
        ]
      }
     });
  }

  if (text === 'O‘quv markaz haqida') {
    bot.sendMessage(chatId, 'Markazimiz Rapqon shaharcha, Abdurazoq MFY. Darslar yuqori sifatda olib boriladi.');
  }

  if (text === 'Telegram kanal') {
    bot.sendMessage(chatId, 'Admin: @your_admin_username');
  }

  if (text === 'Ro‘yxatdan o‘tish') {
    if (text == '/start') {
      delete userSteps[chatId];
    } else {
      userSteps[chatId] = { step: 1 };
      bot.sendMessage(chatId, "Iltimos, ism va familiyangizni kiriting:");
    }
    
  }

  const step = userSteps[chatId]?.step;

  if (step === 1 && text !== 'Ro‘yxatdan o‘tish') {
    if (text == `/start`) {
      delete userSteps[chatId];
    } else{
      userSteps[chatId].name = text;
      userSteps[chatId].step = 2;
      bot.sendMessage(chatId, "Endi telefon raqamingizni kiriting:");
    }
   
  } else if (step === 2) {
    if (text == `/start`) {
      delete userSteps[chatId];
    } else {
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
    }
    
  } else if (step === 3) {
    userSteps[chatId].subject = text;

    const info = `Yangi ro‘yxatdan o‘tuvchi:\nIsm: ${userSteps[chatId].name}\nTelefon: ${userSteps[chatId].phone}\nFan: ${userSteps[chatId].subject}\nUsername: @${msg.chat.username}`;

    bot.sendMessage(adminChatId, info);
    bot.sendMessage(adminChat, info);
    bot.sendMessage(chatId, "Ma’lumotlaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog‘lanamiz. Qayta boshlash uchun /start ni bosing");

    delete userSteps[chatId];
  }
});
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'register') {
    userSteps[chatId] = { step: 1 };
      bot.sendMessage(chatId, "Iltimos, ism va familiyangizni kiriting:");
  }

  bot.answerCallbackQuery(query.id); // Loading tugmasini to‘xtatish
});
