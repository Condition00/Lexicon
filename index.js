const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} = require('discord.js');
require('dotenv').config();
const cron = require('node-cron');

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

async function fetchWordOfTheDay() {
    try {
        const fetch = (await import('node-fetch')).default;
        const apiKey = process.env.WORDNIK_API_KEY;
        const response = await fetch(`https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${apiKey}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to fetch Word of the Day: ${data.message}`);
        }

        return {
            word: data.word,
            definition: data.definitions?.[0]?.text || 'No definition available.',
            partOfSpeech: data.definitions?.[0]?.partOfSpeech || 'N/A',
            example: data.examples?.[0]?.text || 'No example available.',
            pronunciation: data.pronunciations?.[0]?.raw || 'N/A',
        };
    } catch (error) {
        console.error('Error fetching Word of the Day:', error);
        throw error;
    }
}


function createEmbedForWord(wordData) {
    return new EmbedBuilder()
        .setColor(0x1D82B6)
        .setTitle(`📚 Word of the Day: **${wordData.word}**`)
        .setDescription(`**${wordData.definition}**`)
        .addFields(
            { name: 'Part of Speech', value: wordData.partOfSpeech || 'N/A', inline: true },
            { name: 'Phonetics', value: wordData.pronunciation || 'N/A', inline: true },
            { name: 'Example', value: wordData.example || 'No example available.', inline: false }
        )
        .setThumbnail('https://cdn.pixabay.com/animation/2023/06/13/15/13/15-13-14-651_512.gif')
        .setFooter({ text: 'Built by Zero using Discord.js', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
        .setTimestamp();
}

//  word fetching scheduler
cron.schedule('0 9 * * *', async () => {
    const channel = client.channels.cache.get(process.env.CHNLID);
    if (channel) {
        try {
            const wordData = await fetchWordOfTheDay();
            const embed = createEmbedForWord(wordData);
            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching Word of the Day:', error);
        }
    }
});

// event listener
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;
    console.log('Received command:', commandName);

    if (commandName === 'wordoftheday') {
        try {
            await interaction.deferReply();
            const wordData = await fetchWordOfTheDay();
            const embed = createEmbedForWord(wordData);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching the word of the day:', error);
            await interaction.editReply({ content: '❌ There was an error fetching the word of the day. Please try again later.' });
        }
    }

    if (commandName === 'dictionary') {
        const word = interaction.options.getString('word');

        if (!word || word.trim() === '') {
            return interaction.reply({ content: '❌ Please provide a valid word.', ephemeral: true });
        }

        try {
            await interaction.deferReply();

            const fetch = (await import('node-fetch')).default;
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();

            if (response.ok && data.length > 0) {
                const definitions = data[0].meanings.flatMap(meaning => meaning.definitions);
                const example = definitions[0]?.example || 'No example available.';
                const partOfSpeech = data[0].meanings[0]?.partOfSpeech || 'N/A';
                const phonetics = data[0].phonetics[0]?.text || 'N/A';
                const audio = data[0].phonetics[0]?.audio || null;
                const synonyms = definitions[0]?.synonyms?.join(', ') || 'No synonyms available.';

                const embed = new EmbedBuilder()
                    .setColor(0x1D82B6)
                    .setTitle(`📚 Definition of **${word}**`)
                    .setDescription(`**${definitions[0]?.definition || 'No definition available.'}**`)
                    .setThumbnail('https://cdn.pixabay.com/animation/2023/06/13/15/13/15-13-14-651_512.gif')
                    .addFields(
                        { name: 'Part of Speech', value: partOfSpeech, inline: true },
                        { name: 'Phonetics', value: phonetics, inline: true },
                        { name: 'Synonyms', value: synonyms, inline: false },
                        { name: 'Example', value: example, inline: false }
                    )
                    .setFooter({ text: 'Built by Zero using Discord.js', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
                    .setTimestamp();

                if (audio) {
                    embed.addFields({ name: 'Audio Pronunciation 🔊', value: `[Listen here](${audio})`, inline: false });
                }

                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply({ content: `❌ Sorry, no definition found for **${word}**.` });
            }
        } catch (error) {
            console.error('Error fetching the definition:', error);
            await interaction.editReply({ content: '❌ There was an error fetching the definition. Please try again later.' });
        }
    }

    if (commandName === 'suggest') {
        const meaning= interaction.options.getString('meaning');
        console.log('received meaning:', meaning);

        if (!meaning || meaning.trim() === '') {
            return interaction.reply({ content: '❌ please provide a valid meaning ', ephemeral: true });
        }

        try {
            await interaction.deferReply();

            const fetch = (await import('node-fetch')).default;
            const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(meaning)}`);
            const data = await response.json();

            if (response.ok && data.length > 0) {
                const suggestions = data.slice(0, 5).map((word) => word.word).join(', ');

                const embed = new EmbedBuilder()
                    .setColor(0x1D82B6)
                    .setTitle('🔍 Word Suggestions')
                    .setDescription(`Based on the meaning: **${meaning}**`)
                    .addFields({ name: 'Suggestions', value: suggestions, inline: false })
                    .setFooter({ text: 'Built by Anant Kavuru using Discord.js', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply({ content: `❌ Sorry, no suggestions found for **${meaning}**.` });
            }
        } catch (error) {
            console.error('Error fetching word suggestions:', error);
            await interaction.editReply({ content: '❌ There was an error fetching word suggestions. Please try again later.' });
        }
    }
        if (commandName === 'guessword') {
        try {
            await interaction.deferReply();

            const fetch = (await import('node-fetch')).default;
            const apiKey = process.env.WORDNIK_API_KEY;

            // Fetching a random word
            const wordResponse = await fetch(`https://api.wordnik.com/v4/words.json/randomWord?api_key=${apiKey}`);
            const wordData = await wordResponse.json();

            // Fetch its definition
            const definitionResponse = await fetch(`https://api.wordnik.com/v4/word.json/${wordData.word}/definitions?api_key=${apiKey}`);
            const definitionData = await definitionResponse.json();

            if (!definitionData || definitionData.length === 0) {
                return interaction.editReply({ content: '❌ Could not fetch a valid definition for the word. Please try again.' });
            }

            const rawDefinition = definitionData[0]?.text || 'No definition available.';
            const definition = rawDefinition.replace(/<[^>]*>/g, '');

            // Generate similar words
            const similarResponse = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(definition)}`);
            const similarWords = await similarResponse.json();

            if (!similarWords || similarWords.length < 2) {
                return interaction.editReply({ content: '❌ Could not generate enough options for the game. Try again later.' });
            }

            const correctWord = wordData.word;
            const incorrectOptions = similarWords.slice(0, 2).map(word => word.word);
            const allOptions = [correctWord, ...incorrectOptions].sort(() => Math.random() - 0.5);

            // Embed for the game
            const embed = new EmbedBuilder()
                .setColor(0x1D82B6)
                .setTitle('🎮 Guess the Word Game')
                .setDescription(`Which word matches the following definition?\n\n**${definition}**`)
                .addFields(
                    allOptions.map((opt, idx) => ({
                        name: `Option ${idx + 1}`,
                        value: opt,
                        inline: false,
                    }))
                )
                .setFooter({ text: 'Built by Zero using Discord.js', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
                .setTimestamp();

            // Buttons
            const buttons = new ActionRowBuilder().addComponents(
                allOptions.map((opt, idx) =>
                    new ButtonBuilder()
                        .setCustomId(`guessword_option_${idx}`)
                        .setLabel((idx + 1).toString())
                        .setStyle(ButtonStyle.Primary)
                )
            );

            const reply = await interaction.editReply({ embeds: [embed], components: [buttons] });

            // Collect interaction
            const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 15000,
                max: 1,
            });

            collector.on('collect', async (btnInteraction) => {
                const chosenIndex = parseInt(btnInteraction.customId.split('_').pop(), 10);
                const chosenWord = allOptions[chosenIndex];

                const isCorrect = chosenWord.toLowerCase() === correctWord.toLowerCase();

                await btnInteraction.reply({
                    content: isCorrect
                        ? `✅ Correct! The word was **${correctWord}**.`
                        : `❌ Wrong! You chose **${chosenWord}** but the correct word was **${correctWord}**.`,
                    ephemeral: true,
                });
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp({ content: '⏰ Time’s up! No one answered.', ephemeral: true });
                }
            });
        } catch (error) {
            console.error('Error in guessword command:', error);
            await interaction.editReply({ content: '❌ Error occurred while running the game. Please try again later.' });
        }
    }
    });

// bot login
client.login(process.env.TOKEN);


console.log('Token:', process.env.TOKEN);
