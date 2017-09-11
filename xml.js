const fs        = require("fs"),
        xml     = require("xml2js"),
        parser  = new xml.Parser();

const parse = (filename) =>{
    var json;
    var xmlFile = fs.readFileSync("./"+filename+".xml").toString();

    parser.parseString(xmlFile, (err, res) => {
        if (err) {
            console.log("didnt work");
            json =  err;
        } else {
            console.log("worked");
            json = res;
        }
    })
    return json;
}
       

module.exports = parse;