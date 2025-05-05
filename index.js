const TelegramBot = require('node-telegram-bot-api');

const token = '7743866452:AAEwG27jefcV4oVDrNjd8-CR01aymEPPi4c';
const ADMIN_ID = 2053660453;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const opts = {
    reply_markup: {
      keyboard: [["Ro'yxatdan o'tish"]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };
  bot.sendMessage(chatId, "Xush kelibsiz! Ro'yxatdan o'tish tugmasini bosing:", opts);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text !== "/start" && text !== "Ro'yxatdan o'tish") {
    const fromUser = msg.from;
    const info = `Yangi ma'lumot:\n${text}\nFoydalanuvchi: @${fromUser.username || 'yo‘q'} (ID: ${fromUser.id})`;
    bot.sendMessage(ADMIN_ID, info);
    bot.sendMessage(chatId, "Rahmat, ma'lumot yuborildi.");
  }
});
