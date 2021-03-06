require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
    ],
});
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir('./commands', (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter((f) => f.split('.').pop() == 'js');
    if (jsfile.length <= 0) return console.log('Команды не найдены!');

    console.log(`Загружено ${jsfile.length} команд`);

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} загружен!`);
        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach((alias) => {
            bot.aliases.set(alias, props.help.name);
        });
    });
});

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    let prefix = 't!';
    let messageArray = message.content.split(/\s+/g);
    var command = String(messageArray[0].slice(prefix.length)).toLowerCase();
    var args = messageArray.slice(1);

    if (message.content.startsWith(prefix)) {
        try {
            let command_file = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
            if (command_file) {
                return command_file.run(bot, message, args);
            }
        } catch (e) {
            message.channel.send(e.message);
            message.channel.send('ошибка нахуй');
        }
    }
    if (message.content.toLowerCase() === 'ping') {
        message.channel.send('pоng');
    }

    if (message.content.toLowerCase() === 'pong') {
        message.channel.send('pіng');
    }
});

bot.on('guildMemberAdd', (member) => {
    let role = member.guild.roles.cache.find((r) => r.name === 'guest');
    member.roles.add(role).catch(console.log('Не удалось выдать роль'));
});

// (async () => {
//     try {
//         let res = await WotBlitzAPI.getUserIdByName('te xt');
//         // console.log(res);
//     } catch (e) {
//         console.log(e);
//     }
// })();

bot.login(process.env.TOKEN);
