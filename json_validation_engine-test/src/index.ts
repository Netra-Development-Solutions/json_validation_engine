// Test lib for json_validation_engine

import * as  JsonValidationEngine from 'json_validation_engine-lib';
import {default as data} from './data.json';
import {default as schema} from './schemav2.json';

// time to test the lib
const startTime = Date.now();
const validateSchema = new JsonValidationEngine.ValidateSchema(data, schema, true);
const endTime = Date.now();

const dependency = {
    addressSchema: {
        "type": "object",
        "childProps": {
            "street": {
                "type": "string",
                "required": true
            },
            "city": {
                "type": "string"
            },
            "state": {
                "type": "string"
            },
            "zip": {
                "type": "number"
            }
        }
    },
    nestedArraySchema: {
        "type": "object",
        "subType": "array",
        "childProps": {
            "type": "string"
        }
    }
}

validateSchema.compileSchema(dependency);

console.log(validateSchema.validateData());
console.log(JSON.stringify(validateSchema.errors));
console.log(`Time to validate: ${endTime - startTime}ms`);