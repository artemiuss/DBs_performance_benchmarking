const fs = require("fs");
const csvParser = require("csv-parser");

module.exports = {
    async readFromCsv(path) {
        const result = [];

        if (!fs.existsSync(path)) {
            // console.log('skipping non existent file ' + path);
            return result;
        }

        await new Promise(resolve => {
            fs.createReadStream(path)
                .pipe(csvParser())
                .on("data", (data) => {
                    result.push(data);
                })
                .on("end", () => {
                    resolve();
            });
        })
        return result;
    }
}
