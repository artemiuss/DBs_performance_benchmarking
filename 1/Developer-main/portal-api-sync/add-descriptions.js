
module.exports = {
    /**
     * Adds descriptions to JSON schema properties based on a mapping array.
     *
     * @param {Object} schema - The JSON schema object.
     * @param {Array} mappings - An array of objects, each containing an Element and a Description.
     */
    addDescriptionsToDefinitions(schema, mappings) {
    // Helper function to recursively process each definition in the schema
    function processDefinitions(definitions, mappings) {
        for (const key in definitions) {
            const def = definitions[key];

            // Find a mapping for the current definition
            const mapping = mappings.find(m => m.Element === key);
            if (mapping) {
                // If found, add the description to the schema definition
                def.description = mapping.Description;
            }

            // If the definition has nested definitions, process them recursively
            if (def.definitions) {
                processDefinitions(def.definitions, mappings);
            }

            // Additionally, if the definition itself has properties, we should process them too
            if (def.properties) {
                processDefinitions(def.properties, mappings);
            }
        }
    }

    // Check if the schema has definitions and start the processing
    if (schema.definitions) {
        processDefinitions(schema.definitions, mappings);
    }
}
}
