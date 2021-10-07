const { MessageEmbed } = require('discord.js');
const urls = require('../jsons/config.json');
const errors = require('../jsons/errorsMessages.json');
const { WotBAPI } = require('../api');
let WotBlitzAPI = new WotBAPI(urls, errors);
const users = require('../jsons/users.json');

module.exports.run = async (bot, message, args) => {
    try {
        let nickname =
            (message.mentions.users.first() ? users[message.mentions.users.first().id].nickname : args[0]) ||
            users[message.member.user.id].nickname;
        let stats = await WotBlitzAPI.getUserStatisticByName(nickname);

        let embed = new MessageEmbed({
            title: nickname,
            description: `Статистика игрока **${nickname}** по обычным боям`,
        })
            .setColor('#ff0000')
            .addField(
                'Процент побед:',
                `${((stats.all.wins / stats.all.battles) * 100 || 0).toFixed(2)}%`,
                true
            )
            .addField('Количество боёв:', `${stats.all.battles}`, true)
            .addField('Средний урон:', `${Math.floor(stats.all.damage_dealt / stats.all.battles) || 0}`, true)
            .addField('Победил и выжил в боях:', `${stats.all.win_and_survived}`, true)
            .addField('Выжил в боях:', `${stats.all.survived_battles}`, true)
            .addField(
                'Процент попаданий:',
                `${((stats.all.hits / stats.all.shots) * 100 || 0).toFixed(2)}%`,
                true
            )
            .addField('Максимальное количество фрагов:', `${stats.all.max_frags}`, true)
            .addField('Максимальное опыт за бой:', `${stats.all.max_xp} EXP`, true)
            .addField('Количество обнаруженной техники:', `${stats.all.spotted}`, true)
            .setThumbnail(message.author.avatarURL());

        message.channel.send({ embeds: [embed] });
    } catch (e) {
        message.channel.send(await WotBlitzAPI.errorResponse(e));
    }
};

module.exports.help = {
    name: 'playerInfo',
    aliases: ['p'],
};
