import {queryView} from '../database_utils';
import {AnyObject} from '../components/Types';

type ResponseData = Array<any> | AnyObject;
type Options = AnyObject;

export class ViewQuery {
    view: string;
    query: AnyObject;
    options: Options;
    data: ResponseData;
    sanitize: (input: ResponseData) => ResponseData;

    constructor(view, query, options: Options={}, sanitize=(record: Array<any>) => record) {
        this.view = view;
        this.query = query;
        this.options = options;
        this.sanitize = sanitize;
    }

    async executeQuery() {
        this.data = this.sanitize(await queryView(this.view, this.query, this.options));
    }
}