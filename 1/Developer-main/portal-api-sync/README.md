# TRX Dev Portal API Sync

### Reason for existing
TRX API's are primarily exposed via XML schemas, however the Developer Portal needed to expose the JSON version of that API functionality, both to increase ease of adoption by developers and leverage developer experience tooling that is built for JSON.

To automate as much of this process as possible, this API Sync tool allows the Developer Portal to act as a downstream consumer of the TRX APIs, and automate the process of syncing an upstream API change (e.g. new element added to CreditSale.xsd), with the downstream developer experience in the Portal.

### What it does
1. Downloads all xml schemas present in the ./config/schemas.csv file.
2. Converts each downloaded xml schema into a corresponding JSON schema. 
3. Removes elements from the converted JSON schema that should not be surfaced to API consumers. The tool removes all the elements present in the .csv file located ./config/elements-to-remove/ with the same name as the schema (e.g. CreditSale.csv contains elements to be removed from CreditSale.json).
4. Shortens the TransType and TransAction enums in the converted JSON schemas so that they only contain the appropriate values for that operation. E.g. ElementDefs.csv for CreditSale would have TransType.Enum = ["Credit"] and TransAction.Enum = ["Sale"].
5. Adds element descriptions to the converted JSON schemas, using the element descriptions in the ./config/element-defs.csv file.


### Running the project locally
NPM needs to be installed.

1. Install the node dependencies
```bash
npm install
```

2. Run the conversion scripts
```bash
node app.js
```

### Notes on xsd2jsonschema 
Getting quality xsd to JSON schema generation proved to be a challenge. Many libraries didn't handle certain elements well, or were only available within GUIs or with enterprise priced yearly license costs.

This library got the closest out of the box of the free and open source options, but it didn't have support for <xs:all> implemented. I added that functionality to the xsdFileXmlDom.js file, which is why it is configured as a local dependency for the project.