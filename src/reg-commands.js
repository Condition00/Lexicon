require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require(`discord.js`);

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
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.BOT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();