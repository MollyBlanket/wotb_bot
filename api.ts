import fetch from 'node-fetch';

type Vocabulary = Record<string, string>;

export class WotBAPI {
    protected urls: Vocabulary;
    constructor(apiUrls: Vocabulary) {
        this.urls = apiUrls;
    }
    async getUserIdByName(name: string) {
        if (typeof name !== 'string') throw 'ERROR_ARGUMENT_IS_NOT_STRING';
        if (name.split(/\s+/g).length > 1) throw 'ERROR_STRING_MUST_BE_WITHOUT_SPACES';

        let link: string = `${this.urls.getUserIdByName}${name}`;
        let response = await fetch(link, { method: 'GET' }).then((res) => res.json());

        if (!response.data[0]) throw 'ERROR_COULD_NOT_FIND_PLAYER';
        let account_id: number = response.data[0].account_id;
        return account_id;
    }
    async getUserStatisticById(id: number | string) {
        if (typeof id !== 'number' && !parseInt(id)) throw 'ERROR_ARGUMENT_IS_NOT_ID';
        let link: string = `${this.urls.getUserStatistic}${id}`;
        let response = await fetch(link, { method: 'GET' }).then((res) => res.json());

        if (!response.data[id]) throw 'ERROR_COULD_NOT_FIND_PLAYER';
        let statistics: Record<string, Record<string, number>> = response.data[id].statistics;
        return statistics;
    }
    async getUserStatisticByName(name: string) {
        let userId: number = await this.getUserIdByName(name);
        let userStatistic: Record<string, Record<string, number>> = await this.getUserStatisticById(userId); // prettier-ignore
        return userStatistic;
    }
}
