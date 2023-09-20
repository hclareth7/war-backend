import swaggerAutogen from 'swagger-autogen';

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
            "first_name": "Alice",
            "second_name": "Marie",
            "first_last_name": "Johnson",
            "second_last_name": "Smith",
            "identification_type": "Cedula",
            "identification": "987654321",
            "eps": "615cd24b8e60a0a123456789", // Replace with a valid ObjectId referencing an Eps
            "sisben_score": "75",
            "birthday": "1995-08-20",
            "gender": "Femenino",
            "sex": "Mujer",
            "ethnic_affiliation": "Afro",
            "marital_status": "Soltero",
            "is_disability": true,
            "health_regimen": "Contributivo",
            "residence_department": "Bogotá",
            "sisben_department": "Cundinamarca",
            "civil_status": "Soltero",
            "ethnicity": "Afro",
            "disability": "Visual",
            "ocupation": "Empleo formal",
            "education_level": "Universitaria",
            "is_victim_armed_conflict": "No",
            "type_of_disability": "Visual",
            "place_of_birth": "Bogotá",
            "municipality": "Bogotá",
            "community": "615cd24b8e60a0a523456789", // Replace with a valid ObjectId referencing a Community
            "association": "615cd24b8e60a0a623456789", // Replace with a valid ObjectId referencing an Association
            "activity": "615cd24b8e60a0a723456789", // Replace with a valid ObjectId referencing an Activity
            "photo_url": "https://example.com/alice_johnson.jpg",
            "neighborhood": "Downtown",
            "address": "456 Elm St",
            "phones": ["123-456-7890", "987-654-3210"],
            "responsible_family_member": "John Johnson",
            "kinship": "Padre"
        },
        activity: {
            "name": "Community Cleanup",
            "description": "A day of cleaning up the local park.",
            "execution_date": "2023-10-15T09:00:00Z",
            "participatingAssociations": [
                "615cd24b8e60a0a123456789", // Replace with a valid ObjectId referencing an Association
                "615cd24b8e60a0a223456789" // Replace with another valid ObjectId referencing an Association
            ]
        },

        workshop: {
            "name": "Workshop on Web Development",
            "execution_date": "2023-09-25T10:00:00Z",
            "activity": "615cd24b8e60a0a123456789", // Replace with a valid ObjectId referencing an Activity
            "attendees": [
                "615cd24b8e60a0a223456789", // Replace with valid ObjectId(s) referencing Beneficiaries
                "615cd24b8e60a0a323456789"
            ]
        },
        rating: {
            "name": "Participant Rating",
            "execution_date": "2023-09-30T15:30:00Z",
            "activity": "615cd24b8e60a0a123456789", // Replace with a valid ObjectId referencing an Activity
            "attendees": [
                "615cd24b8e60a0a223456789", // Replace with valid ObjectId(s) referencing Beneficiaries
                "615cd24b8e60a0a323456789",
                "615cd24b8e60a0a423456789"
            ]
        },
        association: {
            "name": "Community Welfare Association",
            "type": "Centro de vida",
            "address": "123 Main Street",
            "coordinator_name": "Yon Guic",
            "phones": ["123-456-7890", "987-654-3210"],
            "department": "Cundinamarca",
            "municipality": "Bogotá",
            "community": "615cd24b8e60a0a123456789", // Replace with a valid ObjectId referencing a Community
            "membersCount": 50
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/router'];
import app from './src/app';

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => { app });