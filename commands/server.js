const { SlashCommandBuilder, flatten } = require("discord.js");
const { DockerManager, Result } = require("../utils/docker");
const { containerName } = require("../config.json");

const docker = new DockerManager(containerName);
const { Success, Failure, Error } = Result;

const messages = {
    "start": {
        [Success]: "Server successfully started!",
        [Failure]: "Server is already up!",
        [Error]: "An internal server error has happened, contact the server owner!",
    },
    "stop": {
        [Success]: "Server successfully stopped!",
        [Failure]: "Server is already down!",
        [Error]: "An internal server error has happened, contact the server owner!",
    },
    "status": {
        [Success]: "Server is running!",
        [Failure]: "Server is down!",
        [Error]: "An internal server error has happened, contact the server owner!",
    },
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Manage the MC server :>")
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start the server.'))

        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stop the server'))

        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Check the status of the server')),

    async execute(interaction) {
	//await interaction.reply({ content: "Working on it...", ephemeral: true });
	await interaction.deferReply();
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "start":
                return await interaction.followUp({ content: messages[subcommand][await docker.start()], ephemeral: true });
            case "stop":
                return await interaction.followUp({ content: messages[subcommand][await docker.stop()], ephemeral: true });
            case "status":
                return await interaction.followUp({ content: messages[subcommand][await docker.check()], ephemeral: true });
        }
        await interaction.reply({ content: "An internal server error has happened, contact the server owner!", ephemeral: true });
    }
}
