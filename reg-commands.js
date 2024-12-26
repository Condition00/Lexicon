require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'dictionary',
        description: 'Searches the dictionary for the word given by user',
        options: [
            {
                name: 'word',
                description: 'word to search the dictionary for.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    {
        name: 'wordoftheday',
        description: 'Gets the Word of the Day with definition and example.',
    },

    {
        name: 'suggest',
        description: 'Suggests words based on a given meaning or explanation.',
        options: [
            {
                name: 'meaning',
                description: 'The meaning or explanation to get word suggestions for.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    {
        name: 'guessword',
        description: 'Guess the word based on the given clue.',
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.BOT_ID),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
