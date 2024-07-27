const { Client, IntentsBitField } = require('discord.js');
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
    console.log(msg);
});

client.login(config.token);
