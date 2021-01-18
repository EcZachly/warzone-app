import oldDatabase from './database';
import newDatabase from './database_new';



async function insertPartitionedRecords(db, schema, table, data, increment, totalSize, updateTarget){
    let start = increment;
    while(start < totalSize){
        console.log(start - increment, start, totalSize);
        let splitData = data.slice(start - increment, start);
        console.log('inserting ' + splitData.length);
        try{
            await db[schema][table].insert(splitData,  {
                onConflict: {
                    target: updateTarget,
                    action: 'ignore'
                }, // if the id exists, do nothing
            });
        }
        catch(e){
            console.log('error', e);
        }
        start += increment;
    }
    console.log(start - increment, totalSize)
    let splitData = data.slice(start - increment, totalSize);
    console.log('inserting ' + splitData.length);

    try{
        return await db[schema][table].insert(splitData, {
            onConflict: {
                target: updateTarget,
                action: 'ignore'
            },
        });
    }
    catch(e){
        console.log('error', e);
        return ;
    }

}

async function selectAndInsert(){
    let oldDb = await oldDatabase;
    let newDb = await newDatabase;

    // let data = await oldDb['warzone']['matches'].find();
    //
    // let matchLength = data.length;
    // await insertPartitionedRecords(newDb, 'warzone', 'matches', data, 1000, matchLength, 'match_id')

    //
    // let gamers = await oldDb['warzone']['gamers'].find();
    //
    // let gamerLength = gamers.length;
    // await insertPartitionedRecords(newDb, 'warzone', 'gamers', gamers, 1000, gamerLength, ['username', 'platform'])



    let gamerMatchLength = 2105757;
    let offset = 2005757;
    let increment = 10000;
    while(offset <  gamerMatchLength){
        let gamerMatchData = await oldDb['warzone']['uno_id_filled_gamer_matches'].find({}, {offset: offset, order: [{field: 'match_id'}], limit: increment})
        gamerMatchData = gamerMatchData.map((row)=>{
            row.loadout = JSON.stringify(row.loadout);
            return row;
        })
        await insertPartitionedRecords(newDb, 'warzone', 'gamer_matches', gamerMatchData, 1000, gamerMatchData.length, ['uno_id', 'match_id']);
        offset += increment;
    }
}

selectAndInsert();