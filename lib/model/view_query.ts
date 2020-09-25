import {queryView} from "./analysis";

export class ViewQuery{
    view: string;
    query: object;
    data: Array<any> | object;

    constructor(view, query) {
        this.view = view;
        this.query = query;
    }

    async executeQuery(){
        this.data = await queryView(this.view, this.query)
    }

}