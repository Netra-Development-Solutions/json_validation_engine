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

    generateGUID (): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: any) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });
    }

    public validateData (): boolean {
        if (this._data === undefined || this._schema === undefined) {
            this.errors = 'Data or Schema is invalid';
            return false;
        }

        if (typeof this._data === 'object' && typeof this._schema === 'object') {
            if (this.isArray(this._data)) {
                return this.validateArray();
            }

            if (this.isNull(this._data)) {
                return this.validateNull();
            }

            if (this.isString(this._data)) {
                return this.validateString();
            }

            if (this.isNumber(this._data)) {
                return this.validateNumber();
            }

            Object.keys(this._schema).forEach((key: any, index: number) => {
                if (this._data[key] === undefined) {
                    this.errors[key] = 'Key not found';
                }

                let validateSchema = new ValidateSchema(this._data[key], this._schema[key], false, this._transactionId);
                if (!validateSchema.validateData()) {
                    this.errors[key] = validateSchema.errors;
                }
            });
        }

        if (this.errors.length > 0) {
            return false;
        }

        return true;
    }

    validateNumber (): boolean {
        return true;
    }

    validateString(): boolean {
        if (this.isObject(this._schema)) {
            Object.keys(this._schema).forEach((key: string) => {
                const validationFunctionName = `validate${key}`;
                const validationFunction = (this as any)[validationFunctionName]; // Get the validation function dynamically

                if (typeof validationFunction === 'function') {
                    const isValid = validationFunction.call(this, this._schema[key]);
                    if (!isValid) {
                        // Handle validation error, e.g., set an error message
                        this.errors = `Validation failed for key: ${key}`;
                        return false;
                    }
                } else {
                    // Handle missing validation function
                    this.errors = `Validation function for key: ${key} is missing`;
                    return false;
                }
            });
            // All validations passed
            return true;
        } else {
            this.errors = 'Schema is not an object';
            return false;
        }
    }

    validateType (): boolean {
        let expectedDataType = typeof this._schema?.Type;

        if (expectedDataType !== typeof this._data) {
            this.errors = `Expected data type is ${expectedDataType}. Received ${typeof this._data}`;
            return false;
        }

        return true;
    }

    validateMaxLength (): boolean {
        if (this._schema?.MaxLength) {
            if (this._data.length > this._schema.MaxLength) {
                this.errors = `${this._schema.Type} is too long`;
                return false;
            }
        }

        return true;
    }

    validateMinLength (): boolean {
        if (this._schema?.MinLength) {
            if (this._data.length < this._schema.MinLength) {
                this.errors = `${this._schema.Type} is too short`;
                return false;
            }
        }

        return true;
    }

    validateNull (): boolean {
        if (this._schema?.Required === true) {
            this.errors = 'Required field is null';
            return false;
        }

        return true;
    }

    // Call this function if the data is an array
    validateArray (): boolean {
        if (!this.isArray(this._schema)) {
            this.errors = 'Schema is not an array';
            return false;
        }
        if (this._schema.length === 0) {
            this.errors = 'Schema is empty';
            return false;
        }

        this._data.forEach((element: any, index: number) => {
            let validateSchema = new ValidateSchema(element, this._schema[0], false, this._transactionId);
            if (!validateSchema.validateData()) {
                this.errors[index] = validateSchema.errors;
            }
        });

        if (this._loggerEnabled) {
            console.log(this._transactionId)
            // TODO: Log the errors
        }
        return Object.keys(this.errors).length === 0 ? true : false;
    }

    public updateSchema (schema: object): void {
        this._schema = schema;
    }

    public updateData (data: object): void {
        this._data = data;
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
}

export { ValidateSchema };