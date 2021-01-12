import {queryView} from "../database_utils";

type ResponseData = Array<any> | Record<string, unknown>;
type Options = object;

export class ViewQuery {
    view: string;
    query: Record<string, unknown>;
    options: Options;
    data: ResponseData;
    sanitize: (input: ResponseData) => ResponseData;

    constructor(view, query, options: Options={}, sanitize=(record: Array<any>) => record) {
        this.view = view;
        this.query = query;
        this.options = options;
        this.sanitize = sanitize
    }

    async executeQuery() {
        this.data = this.sanitize(await queryView(this.view, this.query, this.options));
    }
}