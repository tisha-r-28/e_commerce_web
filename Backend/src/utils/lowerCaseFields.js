const getLowercaseFields = (model) => {
    const fields = [];

    const getFields = (schema, prefix = "") => {
        Object.keys(schema.paths).forEach(field => {
            if (schema.paths[field].instance === "Embedded") {
                getFields(schema.paths[field].schema, `${prefix}${field}.`);
            } else {
                fields.push(`${prefix}${field}`.toLowerCase());
            }
        });
    };

    getFields(model.schema);
    return fields;
};

module.exports = getLowercaseFields;
