const fetch = require('node-fetch');
const tanks_info = require('../jsons/tanks_info.json');
const errorsMessages = require('../jsons/errorsMessages.json');
const config = require('../jsons/config.json');

type Vocabulary = Record<string, string>;

export class WotBAPI {
    protected urls: Record<keyof typeof config, any>;
    protected errorsMessages: Record<keyof typeof errorsMessages, any>;
    protected tanks_info: Record<keyof typeof tanks_info, any>;
    constructor() {
        this.urls = config;
        this.tanks_info = tanks_info;
        this.errorsMessages = errorsMessages;
    }
    async getUserIdByName(name: string) {
        if (typeof name !== 'string') throw new Error('ERROR_ARGUMENT_IS_NOT_STRING');
        if (name.split(/\s+/g).length > 1) throw new Error('ERROR_STRING_MUST_BE_WITHOUT_SPACES');

        let link: string = `${this.urls.getUserIdByName}${name}`;
        let response = await fetch(link, { method: 'GET' }).then((res: any) => res.json());
        if (!response?.data?.[0]) throw new Error('ERROR_COULD_NOT_FIND_PLAYER');
        let account_id: number = response.data[0].account_id;
        return account_id;
    }
    async getUserStatisticById(id: number | string) {
        if (typeof id !== 'number' && !parseInt(id)) throw new Error('ERROR_ARGUMENT_IS_NOT_ID');
        let link: string = `${this.urls.getUserStatistic}${id}`;
        let response = await fetch(link, { method: 'GET' }).then((res: any) => res.json());

        if (!response?.data[id]) throw new Error('ERROR_COULD_NOT_FIND_PLAYER');
        let statistics: Record<string, Record<string, number>> = response.data[id].statistics;
        return statistics;
    }
    async getUserStatisticByName(name: string) {
        let userId: number = await this.getUserIdByName(name);
        let userStatistic: Record<string, Record<string, number>> = await this.getUserStatisticById(userId); // prettier-ignore
        return userStatistic;
    }
    async getTankById(id: number | string) {
        if (typeof id !== 'number' && !parseInt(id)) throw new Error('ERROR_ARGUMENT_IS_NOT_ID');

        if (this.tanks_info[id]) return this.tanks_info[id];
        // Если нету в спсиске (сделано во избежании ошибки 429)
        let link: string = `${this.urls.getTankById}${id}`;
        let response = await fetch(link, { method: 'GET' }).then((res: any) => res.json());

        let tank: Record<string, any> | undefined = response.data?.[id];
        return tank;
    }
    async getTankStatistic(id: number | string) {
        if (typeof id !== 'number' && !parseInt(id)) throw new Error('ERROR_ARGUMENT_IS_NOT_ID');

        let link: string = `${this.urls.getAngarStatistic}${id}`;
        let response = await fetch(link, { method: 'GET' }).then((res: any) => res.json());

        if (!response.data[id]) throw new Error('ERROR_COULD_NOT_FIND_TANK');
        let statistic: Array<Record<string, any>> = response.data[id];
        return statistic;
    }
    async errorResponse(error: Error) {
        let [name, message] = [error.name, error.message];
        if (!this.errorsMessages[message]) return `${name}: ${message}`;
        return `${name}: ${this.errorsMessages[message]}`;
    }
}
