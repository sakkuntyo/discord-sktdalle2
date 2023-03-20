const { REST, Routes } = require('discord.js');
const commands = [
	  {
		      name: 'dalle2',
		      description: 'DALL-E2 を利用します',
		    },
];

let DISCORD_TOKEN = ""
let DISCORD_CLIENT_ID = ""
let CHATGPT_TOKEN = ""
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const axios = require("axios");

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()){
    if (interaction.commandName === 'dalle2') {
      const modal = new ModalBuilder()
        .setCustomId('dalle2')
        .setTitle('dalle2');
      const hobbiesInput = new TextInputBuilder()
        .setCustomId('requestInput')
        .setLabel("please type your request for dalle2")
        .setStyle(TextInputStyle.Paragraph);
      const firstActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
      modal.addComponents(firstActionRow);
      await interaction.showModal(modal);
    }
  }
  if (interaction.isModalSubmit()){
    const value = interaction.fields.getTextInputValue('requestInput');
    await interaction.deferReply("drawing...");
    
    let data = {
      "prompt": value,
      "n": 2,
      "size": "1024x1024"
    }

    let headers = {
      "Content-Type":'application/json',
      "Authorization":`Bearer ${CHATGPT_TOKEN}`
    }

    var message = `> ${value}`;
    var gptres = await axios.post("https://api.openai.com/v1/images/generations", data, {headers: headers})
    gptres.data.data.forEach((data) => {
      var url = data.url;
      message += `\n${url}`;
    })
    await interaction.followUp(message);
  }
});

client.login(DISCORD_TOKEN);
