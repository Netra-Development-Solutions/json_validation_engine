// JSON Validation Engine is a library for validating JSON objects against a JSON schema.
class ValidateSchema {
    private _data: any;
    private _schema: any;
    private _transactionId: string;
    private _loggerEnabled: boolean;
    public errors: any = {};

    constructor (data: object, schema: object, loggerEnabled: boolean = false, transactionId?: string) {
        this._data = data;
        this._schema = schema;
        this._loggerEnabled = loggerEnabled;
        this._transactionId = transactionId || this.generateGUID();
    }

    public validateData (): boolean {
        for (const property in Object.keys(this._schema)) {
            const key = Object.keys(this._schema)[property];
            const value = this._schema[key];
            const functionName = `validate_${key}`;

            if (typeof (this as any)[functionName] === 'function') {
                try {
                    (this as any)[functionName](this._data, this._schema);
                } catch (e: any) {
                    this.errors[key] = e.message;
                }
            }
        }

        if (Object.keys(this.errors).length > 0) {
            return false;
        }

        return true;
    }

    private validate_childProps (data: any, schema: any): boolean {

        if (schema.type === 'object') {
            for (const property in Object.keys(schema.childProps)) {
                const key = Object.keys(schema.childProps)[property];
                const newSchema = schema.childProps[key];
                
                const validationSchema = new ValidateSchema(data[key], newSchema, false, this._transactionId);

                if (!validationSchema.validateData()) {
                    this.errors[key] = validationSchema.errors;
                }
            }

            if (Object.keys(this.errors).length > 0) {
                return false;
            }
        }

        if (schema.type === 'array') {}

        return true;
    }

    private validate_required (data: any, schema: any): boolean {
        const required = schema.required;

        if (required) {
            const data_type = typeof data;
            const schema_type = schema.type;

            if (data_type !== schema_type) {
                throw new Error(`Data type is not valid. Expected ${schema_type} but got ${data_type}`);
            }

            if (this.isString(data)) {
                if (data.length === 0) {
                    throw new Error(`String is empty.`);
                }
            }

            if (this.isArray(data)) {
                if (data.length === 0) {
                    throw new Error(`Array is empty.`);
                }
            }
        }

        return true;
    }

    private validate_type (data: any, schema: any): boolean {
        const data_type = typeof data;
        const schema_type = schema.type;

        if (data_type !== 'undefined' && data_type !== schema_type) {
            throw new Error(`Data type is not valid. Expected ${schema_type} but got ${data_type}`);
        }

        return true;
    }

    private isArray (data: object): boolean {
        return Array.isArray(data);
    }

    private isNull (data: object): boolean {
        return data === null;
    }

    private isObject (data: object): boolean {
        return typeof data === 'object';
    }

    private isString (data: object): boolean {
        return typeof data === 'string';
    }

    private isNumber (data: object): boolean {
        return typeof data === 'number';
    }
    
    generateGUID (): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: any) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });
    }
}

export { ValidateSchema };