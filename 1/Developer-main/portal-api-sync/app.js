// Sample usage
const https = require('https');
const fs = require('fs');
const {get} = require("axios");


// Download XML Schemas from TRX CDN
const downloadFile = async (url, savePath) => {
    try {
        const response = await get(url, {responseType: 'text'});
        fs.writeFileSync(savePath, response.data);
        return response.data
    } catch (err) {
        console.error('Download failed:', err.message);
    }
}

// Convert XML Schemas to JSON schemas
const converter = require('./convert-xsd-to-json-schema');

const convertSchema = async (schemaName) => {
     return await converter.convertXmlSchemaToJson(schemaName);
}

const removeAllXsd = (directory) => {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = join(directory, file);
        fs.unlinkSync(filePath);
    }
}

const remove = require('./remove-elements');
const {readFromCsv} = require("./csv");
const {join} = require("node:path");
const {addDescriptionsToDefinitions} = require("./add-descriptions");


const sync = async (schemaName, elementDescriptions, schemaBaseUrl) => {
    // Download and save the schema
    const fileUrl = schemaBaseUrl+schemaName+'.xsd';
    const savePath = './xsd/'+schemaName+'.xsd';
    const xsdString = await downloadFile(fileUrl, savePath);

    // convert xml schemas to JSON schema
    const convertedSchemas = await convertSchema(schemaName);

    for (const name of Object.keys(convertedSchemas)) {

        // replace the TransType and TransAction enums with a single value.
        // This ensures that the API consumer only sees that option when they're in the developer sandbox.
        if (name === 'ElementDefs') {
            const typeAndAction = schemaName.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
            convertedSchemas['ElementDefs']['definitions']['TransType']['enum'] = [typeAndAction[0]];
            convertedSchemas['ElementDefs']['definitions']['TransAction']['enum'] = [typeAndAction[1]];
        }

        // Remove elements that should not be surfaced to API consumers
        const elementsToRemove = await readFromCsv('./config/elements-to-remove/'+schemaName+'.csv');
        if (elementsToRemove.length > 0) {
            const elementArray = [];
            elementsToRemove.forEach(element => {
                elementArray.push(element.ElementName);
            })
            remove.removeDisallowedStrings(convertedSchemas[name], elementArray);
        }

        // add element descriptions
        addDescriptionsToDefinitions(convertedSchemas[name], elementDescriptions);

        // This object makes it so that the "Message" object is properly displayed in the developer sandbox.
        convertedSchemas[name]["definitions"]["TopLevelRequestObject"] = {
            "type": "object",
            "required": [
                "Message"
            ],
            "properties": {
                "Message": {
                    "$ref": "#/definitions/Message"
                }
            }
        }

        // save final schemas
        const dir ='../static-api/' + schemaName;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        fs.writeFileSync('../static-api/' + schemaName + '/'+ name +'.json', JSON.stringify(convertedSchemas[name], null, '\t'));
    }
    console.log('Synced ' + schemaName);
}

const syncPortalApi = async () => {
    // determine which CDN to use for xml schemas
    const env = process.env.ENV;
    let schemaBaseUrl;
    if (env === 'local' || env === 'dev') {
        schemaBaseUrl = process.env.DEV_SCHEMA_BASE_URL;
    } else {
        schemaBaseUrl = process.env.UAT_SCHEMA_BASE_URL;
    }
    console.log(schemaBaseUrl)

    // load list of schemas to be converted
    const schemasToSync = await readFromCsv('./config/schemas.csv');
    const elementDescriptions = await readFromCsv('./config/element-defs.csv');


    for (const schema of schemasToSync) {
        // All API operations should have a request schema
        await sync(schema.RequestSchema, elementDescriptions, schemaBaseUrl);

        // Unclear if all API operations also have a distinct response schema (but I think most do)
        if(schema.ResponseSchema) {
            await sync(schema.ResponseSchema, elementDescriptions, schemaBaseUrl);
        }

    }

    // Post conversion file cleanup
    removeAllXsd('./xsd');

}

syncPortalApi();




