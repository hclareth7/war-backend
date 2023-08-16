const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        version: "1.0.0",
        title: "qualty API",
        description: "Documentation for qualty API"
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
    ],
    securityDefinitions: {
        
    },
    definitions: {
    }
};

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/router']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./src/app')
});