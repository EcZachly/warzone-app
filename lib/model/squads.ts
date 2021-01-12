import {VIEWS} from "../constants";
import {queryView} from "../database_utils";


export async function querySquads(query, options){
    const viewName = VIEWS.SQUADS

    return await queryView(viewName, query, options);
}

export async function getSquadDescriptionValues(query){
    const classDescriptions =  VIEWS.SQUAD_CLASS_DESCRIPTIONS
    return await queryView(classDescriptions, query, {});
}