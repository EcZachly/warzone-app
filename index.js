const API = require('call-of-duty-api')({ platform: "battle" });

let friends = ['EcZachly', 'Wapanator']
let EMAIL = process.env.WARZONE_EMAIL;
let PASSWORD = process.env.WARZONE_PASSWORD;

if(!EMAIL || !PASSWORD){
    throw new Exception("WARZONE_EMAIL OR PASSWORD IS NULL");
}


API.login(EMAIL, PASSWORD).then((response, api)=>{

    API.MWfullcombatwz('EcZachly', API.platforms.xbl).then((output) => {
        console.log(output.length);
    }).catch((err) => {
        console.log(err);
    });

}).catch(console.log);


