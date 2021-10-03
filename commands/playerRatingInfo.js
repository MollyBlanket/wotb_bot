const { MessageEmbed } = require('discord.js');
const urls = require('../config.json');
const { WotBAPI } = require('../api');
let WotBlitzAPI = new WotBAPI(urls);

module.exports.run = async (bot, message, args) => {
    let stats = await WotBlitzAPI.getUserStatisticByName(args[0]);

    let embed = new MessageEmbed({
        title: args[0],
        description: `Статистика игрока **${args[0]}** по рейтинговым боям`,
    })
        .setColor('#ff0000')
        .addField('Процент побед:', `${((stats.rating.wins / stats.rating.battles) * 100).toFixed(2)}%`, true)
        .addField('Количество боёв:', `${stats.rating.battles}`, true)
        .addField('Средний урон:', `${Math.floor(stats.rating.damage_dealt / stats.rating.battles)}`, true)
        .addField('Победил и выжил в боях:', `${stats.rating.win_and_survived}`, true)
        .addField('Выжил в боях:', `${stats.rating.survived_battles}`, true)
        .addField(
            'Процент попаданий:',
            `${((stats.rating.hits / stats.rating.shots) * 100).toFixed(2)}%`,
            true
        )
        .setThumbnail(message.author.avatarURL());

    message.channel.send(embed);
};

module.exports.help = {
    name: 'playerRatingInfo',
    aliases: ['r'],
};
