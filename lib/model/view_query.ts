import {queryView} from './analysis';

export class ViewQuery {
    view: string;
    query: Record<string, unknown>;
    options: Record<string, unknown>;
    data: Array<any> | Record<string, unknown>;

    constructor(view, query, options: Record<any, unknown>={}) {
        this.view = view;
        this.query = query;
        this.options = options;
    }

    async executeQuery() {
        this.data = await queryView(this.view, this.query, this.options);
    }

}