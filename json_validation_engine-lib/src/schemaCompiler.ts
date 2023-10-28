class SchmemaCompiler {
    private schema: any;
    private baseDataType: string[] = ['string', 'number', 'boolean', 'object', 'array'];

    constructor(schema: any) {
        this.schema = schema;
    }
    
    public compile(): any {
        const schemaDataType = typeof this.schema;

        if (schemaDataType === 'object') {
            for (const property in Object.keys(this.schema)) {
                const key = Object.keys(this.schema)[property];
                const value = this.schema[key];
            }
        }

        if (schemaDataType === 'string') {
            if (!this.baseDataType.includes(this.schema)) {
                throw new Error(`Invalid schema type: ${this.schema}`);
            }

            const generateNewSchema = {
                type: this.schema
            }

            this.schema = generateNewSchema;
        }

        return this.schema;
    }

    public getSchema(): any {
        return this.schema;
    }
}

export default SchmemaCompiler;