var RAML = require('./baseraml'),
    jsonHelper = require('../utils/json'),
    ramlHelper = require('../helpers/raml');

function RAML10() {}
RAML10.prototype = new RAML();

RAML10.prototype.version = function() {
    return '1.0';
};

RAML10.prototype.mapAuthorizationGrants = function(flow) {
    var ag = [];
    switch (flow) {
        case 'implicit':
            ag = ['implicit'];
            break;
        case 'password':
            ag = ['password'];
            break;
        case 'application':
            ag = ['client_credentials'];
            break;
        case 'accessCode':
            ag = ['authorization_code'];
            break;
    }
    return ag;
};

RAML10.prototype.mapRequestBodyJson = function(bodyData) {
    return {
        example: bodyData.example ? jsonHelper.format(bodyData.example) : '',
        type: bodyData.body
    };
};

RAML10.prototype.mapRequestBodyForm = function(bodyData) {
    var body = {
        properties: bodyData.properties
    };

    /**
     * Two different approaches to declare an optional parameter.
     * source https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#property-declarations
     * a) appending '?' to property name (without declaring required parameter).
     * b) set required = false
     */
    for (var i in body.properties) {
        var property = body.properties[i];
        property.required = false;
    }

    if (bodyData.required && bodyData.required.length > 0) {
        for(var j in bodyData.required) {
            var requiredParam = bodyData.required[j];
            if (body['properties'][requiredParam]) {
                body['properties'][requiredParam].required = true;
            }
        }
    }

    return body;
};

RAML10.prototype.mapResponseBody = function(bodyData) {
    return {
        type: jsonHelper.format(bodyData.body),
        example: jsonHelper.format(bodyData.example)
    };
};

RAML10.prototype.addSchema = function(ramlDef, schema) {
    ramlDef.types = schema;
};

RAML10.prototype.mapSchema = function(slSchemas) {
    var results = {};
    for (var i in slSchemas) {
        var schema = slSchemas[i];
        var definition = RAML10.prototype.convertRefAttFromObject(schema.Definition);
        results[schema.NameSpace] = definition;
    }
    return results;
};

module.exports = RAML10;