# Lexicon - Discord Word of the Day Bot

Lexicon is a Discord bot that fetches the Word of the Day from the Wordnik API and provides dictionary definitions for words. It's built using [Discord.js](https://discord.js.org/) and can send daily updates to a channel at a specific time.

## Features
- Fetches the **Word of the Day** from Wordnik API.
- Provides definitions, examples, and phonetic pronunciation for any word.
- Sends an embedded message with the Word of the Day in a specified channel.
- Slash commands to fetch Word of the Day (`/wordoftheday`) and dictionary definitions (`/dictionary <word>`).

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (v16.6.0 or higher)
- Discord Bot Token (from [Discord Developer Portal](https://discord.com/developers/applications))
- Wordnik API Key (from [Wordnik API](https://developer.wordnik.com/))

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/Lexicon.git
    cd Lexicon
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up your `.env` file**:
   Create a `.env` file in the root directory and add the following keys:
    ```env
    TOKEN=your_discord_bot_token
    CHNLID=your_discord_channel_id
    WORDNIK_API_KEY=your_wordnik_api_key
    ```

4. **Run the bot**:
    ```bash
    node src/index.js
    ```

## Usage

Once the bot is running, it provides the following functionality:

- **Word of the Day**: Every day at 9 AM (server time), the bot will send the Word of the Day to the specified channel.
- **Slash Commands**:
  - `/wordoftheday`: Get the current Word of the Day with its definition, pronunciation, and example.
  - `/dictionary <word>`: Get the definition, synonyms, and example of any word.

### Example Commands
- `/wordoftheday` - Retrieves the word of the day from Wordnik.
- `/dictionary hello` - Fetches the definition and example of the word "hello."

## Contributing

If you'd like to contribute to this project:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Built With

- [Node.js](https://nodejs.org/)
- [Discord.js](https://discord.js.org/)
- [Wordnik API](https://developer.wordnik.com/)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
