class SchemaProperties {
    private _required_properties: string[] = [
        'type',
        'required'
    ];
    private _optional_properties: string[] = [];

    constructor (type: string) {
        if (type === 'object') {
            this._required_properties = [];
            this._optional_properties = [];
        }
    }

    get required_properties (): string[] {
        return this._required_properties;
    }

    get optional_properties (): string[] {
        return this._optional_properties;
    }


    public add_required_property (property: string): void {
        this._required_properties.push(property);
    }

    public add_optional_property (property: string): void {
        this._optional_properties.push(property);
    }
}

export { SchemaProperties };