const { Client, IntentsBitField, Message } = require('discord.js');
const config = require('../config.json');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`✅ ${c.user.tag} is online.`)
});

client.on(`messageCreate`, (msg) => {
    if (msg.content === 'Hello') {
        msg.reply('Hello! How are you!');
    }
    else if (msg.content === 'Hi') {
        msg.reply('Hey! How was your day!');
    }
});

client.login(config.token);
