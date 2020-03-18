const Papa = require("papaparse")
const fs = require('fs')



const stream = fs.readFileSync('src/basedata.csv', {encoding: 'utf8'});
let teamDict = {}


Papa.parse(stream,{
    header: true,
    step:function(results, parser){
        const row = results.data
        console.log(row)
        teamDict[row["Team"]] = row
    },
    complete: function(results, file) {
        const o = JSON.stringify(teamDict)
        fs.writeFileSync('src/detailedoutput.json', o)
    }
})