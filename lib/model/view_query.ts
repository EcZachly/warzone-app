import {queryView} from './analysis';

export class ViewQuery {
    view: string;
    query: Record<string, unknown>;
    options: object;
    data: Array<any> | object;
    sanitize: (input: Array<any>| object) => Array<any> | object;

    constructor(view, query, options: object={}, sanitize=(record: Array<any>) => record) {
        this.view = view;
        this.query = query;
        this.options = options;
        this.sanitize = sanitize
    }

    async executeQuery() {

        this.data = this.sanitize(await queryView(this.view, this.query, this.options));
        console.log('got data back from view', this.view);
    }
}