import {queryView} from './analysis';

export class ViewQuery {
    view: string;
    query: Record<string, unknown>;
    data: Array<any> | Record<string, unknown>;

    constructor(view, query) {
        this.view = view;
        this.query = query;
    }

    async executeQuery() {
        this.data = await queryView(this.view, this.query);
    }

}