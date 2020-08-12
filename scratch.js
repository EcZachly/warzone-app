


let arrayOfArrays = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
]


let arrayOfListOfMatches = [
    {
        matches: [{
           id: 'match 1'
        }, {
            id: 'match 2'
        }]
    },
    {
        matches: [{
            id: 'match 3'
        }, {
            id: 'match 4'
        }]
    }
];


let flattened = arrayOfArrays.flatMap((array)=> array);
let flattenedMatches = arrayOfListOfMatches.flatMap((value)=>  value.matches);
console.log(flattened);
console.log(flattenedMatches);