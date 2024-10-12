const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
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
    console.log(`✅ ${c.user.tag} is online.`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'dictionary') {
        const word = interaction.options.getString('word');

        if (!word || word.trim() === '') {
            if (!interaction.replied) {
                await interaction.reply({ content: '❌ Please provide a valid word.', ephemeral: true });
            }
            return;
        }

        try {
            // Defer reply for long operations
            await interaction.deferReply();

            const fetch = (await import('node-fetch')).default;
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();

            if (response.ok && data.length > 0) {
                const definitions = data[0].meanings.flatMap(meaning => meaning.definitions);
                const example = definitions.length > 0 && definitions[0].example ? definitions[0].example : 'No example available.';
                const partOfSpeech = data[0].meanings.length > 0 ? data[0].meanings[0].partOfSpeech : 'N/A';
                const phonetics = data[0].phonetics.length > 0 ? data[0].phonetics[0].text : 'N/A';
                const audio = data[0].phonetics.length > 0 && data[0].phonetics[0].audio ? data[0].phonetics[0].audio : null;
                const synonyms = definitions.length > 0 && definitions[0].synonyms ? definitions[0].synonyms.join(', ') : 'No synonyms available.';

                const embed = new EmbedBuilder()
                    .setColor(0x1D82B6)
                    .setTitle(`📚 Definition of **${word}**`)
                    .setDescription(`**${definitions.length > 0 ? definitions[0].definition : 'No definition available.'}**`)
                    .setThumbnail('https://cdn.pixabay.com/animation/2023/06/13/15/13/15-13-14-651_512.gif')
                    .addFields(
                        { name: 'Part of Speech', value: partOfSpeech || 'N/A', inline: true },
                        { name: 'Phonetics', value: phonetics || 'N/A', inline: true },
                        { name: 'Synonyms', value: synonyms || 'No synonyms available.', inline: false },
                        { name: 'Example', value: example || 'No example available.', inline: false }
                    )
                    .setImage('https://www.phdchennai.com/images/banner-home.jpg')
                    .setFooter({ text: 'Built by Anant Kavuru using Discord.js', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
                    .setTimestamp();

                if (audio) {
                    embed.addFields({ name: 'Audio Pronunciation 🔊', value: `[Listen here](${audio})`, inline: false });
                }

                await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(0x1D82B6)
                    .setTitle(`📚 Definition of **${word}**`)
                    .setDescription(`❌ Sorry, I couldn't find the definition for **${word}**. \n ✅ We are improving our databases. Better soon!`);

                await interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error fetching the definition:', error);
            try {
                await interaction.editReply({ content: '❌ There was an error fetching the definition. Please try again later.' });
            } catch (replyError) {
                console.error('Error sending the error message:', replyError);
            }
        }
    }
});

client.login(process.env.TOKEN);
