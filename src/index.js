import { Client, Events, GatewayIntentBits, Guild } from "discord.js";
import fs from "fs";

function main() {

    let token = "";

    try {
        // Create default token.json if it doesn't exist
        if (!fs.existsSync("token.json"))
        {
            const fileText = JSON.stringify({
                token: "bot-token-here"
            });

            fs.writeFileSync("token.json", fileText);

            throw new Error("Could not find token.json; a default token.json file has been created.");
        }

        // Read token from json file
        const data = fs.readFileSync("token.json");
        token = JSON.parse(data).token;

        if (token == "bot-token-here")
        {
            throw new Error("Please enter the bot token in token.json.");
        }

        //console.log("Data: " + data);
        //console.log("Token: " + token)

    } catch (err) {
        console.error("Error reading token.json: ", err);
        return;
    }

    startBot(token);

}

/**
 * 
 * @param {string} token 
 */
function startBot(token)
{
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages/*, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences*/] });
    client.login(token);

    client.once(Events.ClientReady, async client => {
        console.log("Deleting all slash commands for this client: " + client.user.tag);

        // Using await instead of .then so I can easily shutdown
        // the bot when it is done clearing commands.
        await client.application.commands.set([]);
        const guilds = await client.guilds.fetch();
        for (const guildPartial of guilds)
        {
            /** @type { Guild } */
            const guild = await client.guilds.fetch(guildPartial[0]);
            await guild.commands.set([]);
        }

        console.log("Finished.");
        client.destroy();
    });

}

main();
