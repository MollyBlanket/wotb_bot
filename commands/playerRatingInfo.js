const { MessageEmbed } = require('discord.js');
const { WotBAPI } = require('../api/api.ts');
let WotBlitzAPI = new WotBAPI();
const users = require('../jsons/users.json');

module.exports.run = async (bot, message, args) => {
    try {
        let nickname =
            (message.mentions.users.first() ? users[message.mentions.users.first().id].nickname : args[0]) ||
            users[message.member.user.id].nickname;
        let stats = await WotBlitzAPI.getUserStatisticByName(nickname);

        let embed = new MessageEmbed({
            title: nickname,
            description: `Статистика игрока **${nickname}** по рейтинговым боям`,
        })
            .setColor('#ff0000')
            .addField(
                'Процент побед:',
                `${((stats.rating.wins / stats.rating.battles) * 100 || 0).toFixed(2)}%`,
                true
            )
            .addField('Количество боёв:', `${stats.rating.battles}`, true)
            .addField(
                'Средний урон:',
                `${Math.floor(stats.rating.damage_dealt / stats.rating.battles) || 0}`,
                true
            )
            .addField('Победил и выжил в боях:', `${stats.rating.win_and_survived}`, true)
            .addField('Выжил в боях:', `${stats.rating.survived_battles}`, true)
            .addField(
                'Процент попаданий:',
                `${((stats.rating.hits / stats.rating.shots) * 100 || 0).toFixed(2)}%`,
                true
            )
            .setThumbnail(message.author.avatarURL());

        message.channel.send({ embeds: [embed] });
    } catch (e) {
        message.channel.send(await WotBlitzAPI.errorResponse(e));
    }
};

module.exports.help = {
    name: 'playerRatingInfo',
    aliases: ['r'],
};
