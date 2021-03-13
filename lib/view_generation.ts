import fs from 'fs';
import database from './database';



const basePath = __dirname + '/sql/views';
import {DATABASE_SCHEMA} from './constants';

const coreViewNames = fs.readdirSync(basePath + '/core').filter((view)=> view.includes('.sql'));
const coreViews = coreViewNames.map((file) => basePath + '/core/' + file);

const materializedCoreViewsNames = fs.readdirSync(basePath + '/core/materialized');
const materializedCoreViews = materializedCoreViewsNames.map((file) => basePath + '/core/materialized/' + file);

const detailViewNames = fs.readdirSync(basePath + '/detail').filter((view)=> view.includes('.sql'));
const detailViews = detailViewNames.map((file) => basePath + '/detail/' + file);
const materializedDetailViewNames = fs.readdirSync(basePath + '/detail/materialized');
const materializedDetailViews = materializedDetailViewNames.map((file) => basePath + '/detail/materialized/' + file);

const viewObj = {
    'core': coreViews,
    'core_materialized': materializedCoreViews,
    'detail': detailViews,
    'detail_materialized': materializedDetailViews
};

async function dropAllViews(){
    const db = await database;

    const mappedQueries =
        coreViewNames.map((view)=> `DROP VIEW IF EXISTS ${DATABASE_SCHEMA}.${view.split('.')[0]} CASCADE`).concat(
            detailViewNames.map((view)=> `DROP VIEW IF EXISTS ${DATABASE_SCHEMA}.${view.split('.')[0]} CASCADE`)
        );
    return Promise.all(mappedQueries.map(async (query)=>{
        console.log('running\n' + query);
        return await db.query(query);
    }));
}


async function runViews(viewName){

    const db = await database;

    const views = viewObj[viewName];
    const sql = views.map((view)=> {
        return {query: fs.readFileSync(view, 'utf-8'), path: view};
    });
    return Promise.all(sql.map(async (s)=>{
        console.log('running view ' + s.path);
        console.log('this query ' + s.query);
        await db.query(s.query);
    })).catch((err)=>{
        console.log('error', err);
        return 'error executing view';
    });
}

// dropAllViews()
async function runAllViews(){
    Promise.all(Object.keys(viewObj).map((key)=>{
        return runViews(key);
    })).then((data)=>{

        console.log(data);
    });
}

async function createTypes(){


}


async function cleanAndRecreateViews(){
    await dropAllViews();

    let result = await runViews('core');
    //We want to execute all the views twice otherwise we have to care about ordering them
    if(result === 'error executing view'){
        await runViews('core');
    }

    await runViews('core_materialized');
    result = await runViews('detail');
    //We want to execute all the views twice otherwise we have to care about ordering them
    if(result === 'error executing view'){
        await runViews('detail');
    }

    await runViews('detail_materialized');


    if(result === 'error executing view'){
        await runViews('detail');
    }

    await runViews('detail_materialized');
}

cleanAndRecreateViews();