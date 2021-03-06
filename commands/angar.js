const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { WotBAPI } = require('../api/api.js');
let WotBlitzAPI = new WotBAPI();
const users = require('../jsons/users.json');

const backButton = new MessageButton({
    style: 'SECONDARY',
    label: 'Back',
    emoji: '⬅️',
    customId: 'back',
    disabled: true,
});
const forwardButton = new MessageButton({
    style: 'SECONDARY',
    label: 'Forward',
    emoji: '➡️',
    customId: 'forward',
    disabled: false,
});

const tiers = { 1: 'l', 2: 'll', 3: 'lll', 4: 'lV', 5: 'V', 6: 'Vl', 7: 'Vll', 8: 'Vlll', 9: 'lX', 10: 'X' };
module.exports.run = async (bot, message, args) => {
    try {
        let nickname =
            (message.mentions.users.first() ? users[message.mentions.users.first().id].nickname : args[0]) ||
            users[message.member.user.id].nickname;

        let account_id = await WotBlitzAPI.getUserIdByName(nickname);
        const whole_tanks = await WotBlitzAPI.getTankStatistic(account_id);

        statistic = [];
        whole_tanks.forEach(async (element) => {
            let tank = await WotBlitzAPI.getTankById(element.tank_id);
            if (!tank) return;
            let tank_name = tank.name;
            let tank_tier = tank.tier;
            let PofW = Math.floor((element.all.wins / element.all.battles) * 100) || 0;
            let battles = element.all.battles;
            let avarege_damage_dealt = element.all.damage_dealt / element.all.battles;
            let avarege_xp = element.all.xp / element.all.battles;

            statistic.push([
                tank_tier,
                tank_name,
                battles,
                PofW,
                Math.floor(avarege_damage_dealt),
                Math.floor(avarege_xp),
            ]);
        });

        const { author, channel } = message;

        let currentIndex = 0;
        const generateEmbed = async (start) => {
            if (!statistic.length) await new Promise((r) => setTimeout(r, 1000));

            statistic.sort((a, b) => b[0] - a[0]);

            const current = statistic.slice(start, start + 10);

            return new MessageEmbed({
                title: `Статистика по технике, всего танков было на аккаунте: ${statistic.length}`,
                fields: await Promise.all(
                    current.map(async (s) => ({
                        name: `${tiers[s[0]]} ${s[1]} | ${s[2]} battles`,
                        value: `Процент побед: ${s[3] || 0}% **|** Средний урон: ${
                            s[4] || 0
                        } **|** Средний опыт: ${s[5] || 0}exp`,
                    }))
                ),
            });
        };

        const embedMessage = await channel.send({
            embeds: [await generateEmbed(0)],
            components: [new MessageActionRow({ components: [backButton, forwardButton] })],
        });
        const collector = embedMessage.createMessageComponentCollector({
            filter: ({ user }) => user.id === author.id,
        });

        collector.on('collect', async (interaction) => {
            interaction.customId === backButton.customId ? (currentIndex -= 10) : (currentIndex += 10);

            await interaction.update({
                embeds: [await generateEmbed(currentIndex)],
                components: [
                    new MessageActionRow({
                        components: [
                            ...(currentIndex
                                ? [backButton.setDisabled(false)]
                                : [backButton.setDisabled(true)]),
                            ...(currentIndex + 10 < statistic.length
                                ? [forwardButton.setDisabled(false)]
                                : [forwardButton.setDisabled(true)]),
                        ],
                    }),
                ],
            });
        });
    } catch (e) {
        message.channel.send(await WotBlitzAPI.errorResponse(e));
    }
};

module.exports.help = {
    name: 'angar',
    aliases: ['ang'],
};
