const users = require('./users.json');
const fs = require('fs');
const urls = require('../config.json');
const { WotBAPI } = require('../api');
let WotBlitzAPI = new WotBAPI(urls);

module.exports.run = async (bot, message, args) => {
    try {
        if (message.author.id !== '768788268053430292')
            throw new Error('Команда доступна только разработчику');
        let member = message.mentions.users.first() || message.member.user;
        if (users[member.id]) throw new Error('ERROR_USER_ALREADY_HAS_ACCOUNT');

        let nickname = message.mentions.users.first() ? args[1] : args[0];

        let userId = await WotBlitzAPI.getUserIdByName(nickname);

        users[member.id] = {
            userId,
            nickname,
            username: member.username,
        };
        fs.writeFileSync('./commands/users.json', JSON.stringify(users, null, 4));

        message.channel.send('Аккаунт добавлен');
    } catch (e) {
        message.channel.send(e.name + ': ' + e.message);
        console.log(e);
    }
};

module.exports.help = {
    name: 'add',
    aliases: ['a'],
};
