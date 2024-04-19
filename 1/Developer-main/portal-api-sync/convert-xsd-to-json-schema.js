"use strict";

const fs = require('fs');
const URI = require('urijs');
const xml2js = require("xml2js");
const {Xsd2JsonSchema} = require("xsd2jsonschema");

module.exports = {
    extractSchemaLocations: function (xmlSchemaString) {
        const parser = new xml2js.Parser();

        return new Promise((resolve, reject) => {
            parser.parseString(xmlSchemaString, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                const schemaLocations = [];
                // Function to recursively find xs:include elements
                function findIncludes(obj) {
                    if (Array.isArray(obj)) {
                        obj.forEach(findIncludes);
                    } else if (typeof obj === 'object' && obj !== null) {
                        for (const [key, value] of Object.entries(obj)) {
                            if (key === 'xs:include' || key === 'include') {
                                if (Array.isArray(value)) {
                                    value.forEach(includeObj => {
                                        if (includeObj.$ && includeObj.$.schemaLocation) {
                                            schemaLocations.push(includeObj.$.schemaLocation);
                                        }
                                    });
                                } else if (value && value.$ && value.$.schemaLocation) {
                                    schemaLocations.push(value.$.schemaLocation);
                                }
                            } else {
                                findIncludes(value);
                            }
                        }
                    }
                }

                findIncludes(result);
                resolve(schemaLocations);
            });
        });
    },

    convertXmlSchemaToJson: async function(schemaName) {
        // read initial schema
        const xmlSchema = fs.readFileSync("./xsd/"+schemaName+".xsd", "utf8");

        // get list of xs:includes
        const includes = await this.extractSchemaLocations(xmlSchema);

        // Build object of schemas for conversion
        // e.g. Credit Sale needs the ElementDefs and PurchaseData schemas at time of conversion,
        // so that the element definitions are properly referenced between the files
        const schemas = {};
        if(includes.length > 0) {
            includes.forEach((schema) => {
                schemas[schema] = fs.readFileSync("./xsd/"+schema+"", "utf8");
            })
            schemas[schemaName] = xmlSchema
        } else {
            schemas[schemaName] = xmlSchema
        }

        const xs2js = new Xsd2JsonSchema({
            generateTitle: false,
        });
        let jsonSchemas = xs2js.processAllSchemas({
            schemas: schemas
        });

        return this.writeJsonSchemas(jsonSchemas, './json-schemas', '  ');
    },

    writeJsonSchemas: function (jsonSchemas, outputDir, spacing) {
    if (jsonSchemas == undefined) {
        throw new Error('The parameter jsonSchema is required');
    }
    if (spacing == undefined) {
        spacing = '\t';
    }

    let finalSchemas = new Map();
    Object.keys(jsonSchemas).forEach((uri) => {
        let jsonSchema = jsonSchemas[uri];
        // finalSchemas.push(jsonSchema.getJsonSchema());
        uri = uri.replace('.xsd', '');
        finalSchemas[uri]=jsonSchema.getJsonSchema();
    })
        return finalSchemas;
}
}
