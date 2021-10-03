const { MessageEmbed } = require('discord.js');
const urls = require('../config.json');
const { WotBAPI } = require('../api');
let WotBlitzAPI = new WotBAPI(urls);
const users = require('./users.json');

module.exports.run = async (bot, message, args) => {
    try {
        let nickname = message.mentions.users.first()
            ? users[message.mentions.users.first().id].nickname
            : args[0];
        let stats = await WotBlitzAPI.getUserStatisticByName(nickname);

        let embed = new MessageEmbed({
            title: nickname,
            description: `Статистика игрока **${nickname}** по обычным боям`,
        })
            .setColor('#ff0000')
            .addField('Процент побед:', `${((stats.all.wins / stats.all.battles) * 100).toFixed(2)}%`, true)
            .addField('Количество боёв:', `${stats.all.battles}`, true)
            .addField('Средний урон:', `${Math.floor(stats.all.damage_dealt / stats.all.battles)}`, true)
            .addField('Победил и выжил в боях:', `${stats.all.win_and_survived}`, true)
            .addField('Выжил в боях:', `${stats.all.survived_battles}`, true)
            .addField('Процент попаданий:', `${((stats.all.hits / stats.all.shots) * 100).toFixed(2)}%`, true)
            .addField('Максимальное количество фрагов:', `${stats.all.max_frags}`, true)
            .addField('Максимальное опыт за бой:', `${stats.all.max_xp} EXP`, true)
            .addField('Количество обнаруженной техники:', `${stats.all.spotted}`, true)
            .setThumbnail(message.author.avatarURL());

        message.channel.send(embed);
    } catch (e) {
        message.channel.send(e.message);
    }
};

module.exports.help = {
    name: 'playerInfo',
    aliases: ['p'],
};
