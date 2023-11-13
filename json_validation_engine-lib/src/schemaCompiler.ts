class SchmemaCompiler {
    private schema: any;
    private baseDataType: string[] = ['string', 'number', 'boolean', 'object', 'array'];

    constructor(schema: any) {
        this.schema = schema;
    }
    
    public compile(dependency: Object): any {
        const schemaDataType = typeof this.schema;

        if (schemaDataType === 'string') {
            if (!this.baseDataType.includes(this.schema)) {
                throw new Error(`Invalid schema type: ${this.schema}`);
            }

            const generateNewSchema = {
                type: this.schema
            }

            this.schema = generateNewSchema;
        }

        if (schemaDataType === 'object') {
            this.schema = this.injectDependency(dependency, this.schema);
        }

        return this.schema;
    }

    public injectDependency(dependency: {[key: string]: any}, schema: any): any {
        if (schema.jsonSchema && typeof schema.jsonSchema === 'string') {
            schema = dependency[schema.jsonSchema];
            return schema;
        }

        if (schema.type === 'object' && schema.subType !== 'array') {
            for (const property in Object.keys(schema.childProps)) {
                const key = Object.keys(schema.childProps)[property];
                const newSchema = schema.childProps[key];

                schema.childProps[key] = this.injectDependency(dependency, newSchema);
            }
        }

        if (schema.type === 'object' && schema.subType === 'array') {
            schema.childProps = this.injectDependency(dependency, schema.childProps);
        }

        return schema;
    }

    public getSchema(): any {
        return this.schema;
    }

    public fetchAllDependencies(schema: any): Array<String> {
        const dependency: Array<String> = [];

        if (schema.jsonSchema && typeof schema.jsonSchema === 'string') {
            dependency.push(schema.jsonSchema);
            return dependency;
        }

        if (schema.type === 'object' && schema.subType !== 'array') {
            for (const property in Object.keys(schema.childProps)) {
                const key = Object.keys(schema.childProps)[property];
                const newSchema = schema.childProps[key];

                dependency.push(...this.fetchAllDependencies(newSchema));
            }
        }

        if (schema.type === 'object' && schema.subType === 'array') {
            dependency.push(...this.fetchAllDependencies(schema.childProps));
        }

        return dependency;
    }
}

export default SchmemaCompiler;