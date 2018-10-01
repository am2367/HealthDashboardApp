const excel = require('node-excel-export');

const exportData = (req, username, callback) => {
    var MongoClient = require('mongodb').MongoClient;
    //Connection details for mLab if environmental variables exist (deployed from cloud)
    if (process.env.mLabUser){
        let dbUsername = process.env.mLabUser;
        let dbPassword = process.env.mLabPassword;
        var url = "mongodb://" + dbUsername + ':' + dbPassword + "@ds119052.mlab.com:19052/mydb";
    }
    //Local mongodb url
    else{
        var url = "mongodb://localhost:27017/myapp";
    }
    MongoClient.connect(url, function(err, db) {

        if (err) throw err;
        console.log("Database Connected!");
        
        if(process.env.mLabUser){
            var dbo = db.db("mydb");
        }
        else{
            var dbo = db.db("myapp")
        }

        let query = {Username: username}

        dbo.collection("Entries").find(query, {_id: 0, Username: 0}).toArray(function myFunc(err, result) {
            if (err) throw err;
            if(result.length){
                db.close();
                console.log(result)
                let data = restructureData(result);
                callback(generateExport(data));
            }
            else{
                db.close();
                return "Empty";
            }
        });
    });

    function restructureData(data){
        let arr = []

        for (let year in data[0]["Year"]) {
            for (let month in data[0]["Year"][year]["Month"]) {
                for (let day in data[0]["Year"][year]["Month"][month]["Day"]) {
                    let item = data[0]["Year"][year]["Month"][month]["Day"][day];
                    let activities = Object.keys(item).slice(1);
                    
                    for(const activity of activities){
                        let keys = Object.keys(item[activity]);
                        arr.push({  
                                "Date" : item["Date"],
                                "Activity" : activity,
                                [keys[0]] : item[activity][keys[0]],
                                [keys[1]] : item[activity][keys[1]],
                                [keys[2]] : item[activity][keys[2]],
                                [keys[3]] : item[activity][keys[3]],
                                [keys[4]] : item[activity][keys[4]],
                                [keys[5]] : item[activity][keys[5]],
                                [keys[6]] : item[activity][keys[6]],
                                [keys[7]] : item[activity][keys[7]],
                            })
                    }
                }
            }
        }
        //console.log(arr)
        return arr
    }

    function generateExport(data){
        // You can define styles as json object
        const styles = {
            headerDark: {
            fill: {
                fgColor: {
                rgb: 'FF000000'
                }
            },
            font: {
                color: {
                rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
            }
            },
            cellPink: {
            fill: {
                fgColor: {
                rgb: 'FFFFCCFF'
                }
            }
            },
            cellGreen: {
            fill: {
                fgColor: {
                rgb: 'FF00FF00'
                }
            }
            }
        };
        
        //Array of objects representing heading rows (very top)
        const heading = [
            ['Date', 
             'Activity', 
             'Time (Hours)',
             '',
             'Distance (Miles)',
             '',
             'Intensity (Percent)',
             '',
             'Calories (kCals)'],
             ['', 
              '',
              'Actual',
              'Expected',
              'Actual',
              'Expected',
              'Actual',
              'Expected',
              'Actual',
              'Expected']
        ];
        
        //Here you specify the export structure
        let specification = {}

        for(const key in data[0]){
            specification[key] = {
                displayName: key,
                headerStyle: styles.headerDark,
                /*cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
                    return (value == 1) ? 'Active' : 'Inactive';
                },*/
                width: '10' // <- width in chars (when the number is passed as string)
                }
        }

        //console.log(specification)


        
        // The data set should have the following shape (Array of Objects)
        // The ord  er of the keys is irrelevant, it is also irrelevant if the
        // dataset contains more fields as the report is build based on the
        // specification provided above. But you should have all the fields
        // that are listed in the report specification
        const dataset = data
        
        // Define an array of merges. 1-1 = A:1
        // The merges are independent of the data.
        // A merge will overwrite all data _not_ in the top-left cell.
        let merges = [
            { start: { row: 1, column: 1 }, end: { row: 2, column: 1 } },
            { start: { row: 1, column: 2 }, end: { row: 2, column: 2 } },
            { start: { row: 1, column: 3 }, end: { row: 1, column: 4 } },
            { start: { row: 1, column: 5 }, end: { row: 1, column: 6 } },
            { start: { row: 1, column: 7 }, end: { row: 1, column: 8 } },
            { start: { row: 1, column: 9 }, end: { row: 1, column: 10 } }
        ]

        /*let mergeAmount = data.length % 4

        for(let x = 3; x <= mergeAmount+3; x+4){
            merges.push({ start: { row: x, column: 1 }, end: { row: x+4, column: 1 } })
        }*/

        
        // Create the excel report.
        // This function will return Buffer
        const report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
                name: 'Report', // <- Specify sheet name (optional)
                heading: heading, // <- Raw heading array (optional)
                merges: merges, // <- Merge cell ranges
                specification: specification, // <- Report specification
                data: dataset // <-- Report data
            }
            ]
        );
        
        return report;
    }

}

module.exports = exportData;
