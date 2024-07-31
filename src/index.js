const { Client, IntentsBitField, Message, EmbedBuilder } = require('discord.js');
require('dotenv').config();

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

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'dictionary') {
        const word = interaction.options.getString('word');
        
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();

            if (response.ok) {
                const definition = data[0].meanings[0].definitions[0].definition;
                const embed = new EmbedBuilder()
                .setTitle(`**${word}**`)
                .setDescription(`**Definition:**\n*${definition}*\n`)
                interaction.reply({embeds: [embed] });
            } else {
                await interaction.reply(`Sorry, I couldn't find the definition for **${word}**.`);
            }
        } catch (error) {
            console.error('Error fetching the definition:', error);
            await interaction.reply('There was an error fetching the definition. Please try again later.');
        }
    }
});

client.login(process.env.TOKEN);
