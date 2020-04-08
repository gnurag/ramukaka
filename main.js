const irc = require("irc");

const config = {
    channels: ["#ramukaka"],
    server: "irc.example.com",
    botName: "ramukaka",
    userName: "ramu",
    realName: "Ramu kaka",
    floodProtection: false,
    floodProtectionDelay: 1000,
};

let userList = {};
for (let channel of config.channels) {
  userList[channel] = new Set();
}

// Create the bot
const bot = new irc.Client(config.server, config.botName, {
  channels: config.channels,
  userName: config.userName,
  realName: config.realName, 
  floodProtection: config.floodProtection,
  floodProtectionDelay: config.floodProtectionDelay,
});


// Add listener
bot.addListener("message#", (nick, to, text, message) => {
  console.log(`[${to}] ${nick}: ${text}`);
  const replyTo = (to === config.botName) ? nick : to;

  if ( text.startsWith('@all ') ) {
    const realText = text.replace(/^@all\s/, '');
    const users = Array.from(userList[to]).join(' ');
    bot.say(replyTo, `${users} : ${realText}`);
  }
});

bot.addListener("pm", (nick, text, message) => {
  console.log(`[PrivMsg] ${nick}: ${text}`);
  bot.say(nick, "Hi, I'm a bot");
});

bot.addListener("names", (channel, nicks) => {
  userList[channel] = new Set(Object.keys(nicks));
});

bot.addListener("join", (channel, nick) => {
  console.log(`[${channel}] ${nick} joined the channel`);
  userList[channel].add(nick);
});

bot.addListener("part", (channel, nick) => {
  console.log(`[${channel}] ${nick} left the channel`);
  userList[channel].delete(nick);
});
