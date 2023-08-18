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
        apiKeyAuth: {
            type: 'apiKey',
            in: 'header', // can be 'header', 'query' or 'cookie'
            name: 'x-access-token', // name of the header, query parameter or cookie
            description: ''
        }
    },
    definitions: {
        beneficiary: {
            "full_name": "John Doe",
            "identification_type": "Cedula",
            "identification": "123456789",
            "eps": "615aeb801dc581234567890a", // Example ObjectId reference
            "sisben_score": 85,
            "birthday": "1990-05-15",
            "gender": "Masculino",
            "ethnic_affiliation": "Indigena",
            "marital_status": "Casado",
            "is_disability": true,
            "type_of_disability": "Movilidad",
            "place_of_birth": "Bogota",
            "region": "Andina",
            "municipality": "Bogota",
            "neighborhood": "Chapinero",
            "address": "Calle 123, Carrera 45",
            "phones": ["123-456-7890", "987-654-3210"],
            "responsible_family_member": "Jane Doe",
            "kinship": "Esposa"
        },
        activity: {
            "name": "Community Cleanup",
            "description": "Volunteer event to clean up the local park",
            "execution_date": "2023-08-20T10:00:00Z",
            "municipality": "615aeb801dc581234567890b", // Example ObjectId reference
            "community": "615aeb801dc581234567890c", // Example ObjectId reference
            "participatingAssociations": ["615aeb801dc581234567890d", "615aeb801dc581234567890e"], // Example ObjectId references
            "attendees": ["615aeb801dc581234567890f", "615aeb801dc5812345678910"] // Example ObjectId references
        }
    }
};

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/router']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./src/app')
});