// JSON Validation Engine is a library for validating JSON objects against a JSON schema.
import { SchemaProperties } from './properties';

class ValidateSchema {
    private _data: object | string | number | boolean | null | undefined;
    private _schema: object | string | number | boolean | null | undefined;
    public errors: any [] = [];

    constructor (data: object | string | number | boolean | null | undefined, schema: object | string | number | boolean | null | undefined) {
        this._data = data;
        this._schema = schema;
    }

    public validateData (): boolean {
        if (this._schema === undefined) {
            this.errors.push('Schema is undefined.');
            return false;
        }
        return true;
    }

    public updateSchema (schema: object | string | number | boolean | null | undefined): void {
        this._schema = schema;
    }

    public updateData (data: object | string | number | boolean | null | undefined): void {
        this._data = data;
    }
}

export { ValidateSchema };