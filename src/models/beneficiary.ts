import mongoose from 'mongoose';
import validator from 'validator';
const mongoosePaginate = require('mongoose-paginate-v2');

const beneficiarySchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: true
    },

    second_name: {
        type: String,
    },
    first_last_name: {
        type: String,
        required: true
    },
    second_last_name: {
        type: String,
    },
    identification_type: {
        type: String,
        required: true
    },
    identification: {
        type: String,
        required: true,
        unique: true
    },
    blody_type: {
        type: String,
        enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "NI"],
        required: true
    },
    eps: {
        type: String,
    },
    sisben_score: {
        type: String,
    },
    birthday: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Masculino', 'Femenino', 'Otro'],
    },
    sex: {
        type: String,
        enum: ['F', 'M'],
    },
    ethnic_affiliation: {
        type: String,
        enum: ['Indigena', 'Afro', 'Raizal', 'Palenquero', 'Rom', 'Ninguno']
    },
    marital_status: {
        type: String,
        enum: ['Casado', 'Unión Libre', 'Viudo', 'Separado']
    },
    is_disability: {
        type: Boolean,
        default: false
    },
    health_regimen: {
        type: String,
        enum: ['Subsidiado', 'Contributivo Cotizante', 'Contributivo Beneficiario', 'Régimen Especial', 'Retirado', 'No Afiliado' ]
    },
    residence_department: {
        type: String
    },
    sisben_department: {
        type: String
    },
    civil_status: {
        type: String,
        enum: ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Union libre', 'Separado']
    },
    ethnicity: {
        type: String,
        enum: ['Indígena', 'Afro', 'Raizal', 'Palenquero', 'Ninguno'],
    },
    disability: {
        type: String,
        enum: ['Ninguna', 'Motriz', 'Auditiva', 'Visual', 'Del gusto', 'Olfato', 'Tacto', 'Multiple', 'Mental-Cognitiva', 'Mental-Psicosocial', 'Otra'],
    },
    ocupation: {
        type: String,
        enum: ['Empleo formal', 'Empleo informal', 'Desempleado', 'Pensionado', 'Hogar', 'Campesino'],
    },
    education_level: {
        type: String,
        enum: ['Primaria', 'Secundaria', 'Técnica', 'Universitaria', 'Sin escolaridad', 'Otra'],
    },
    is_victim_armed_conflict: {
        type: String,
        default: "No"
    },
    type_of_disability: {
        type: String,
        /*
        validate: {
            validator: function (value) {
                const predefinedValues = ['Movilidad', 'Auditiva', 'Visual', 'Gusto', 'Olfato', 'Tacto', 'Sistémica', 'Múltiple', 'Mental-Cognitiva', 'Mental-Psicosocial', 'Voz y habla', 'Piel', 'Enanismo', 'N/A']; // Valores predefinidos en el enum
                return predefinedValues.includes(value) && value.length > 0 && this.is_disability; // Verifica si está en la lista o no está vacío
            },
            message: props => `${props.value} is not a valid value or is_disability is false`
        }
        */
    },
    place_of_birth: {
        type: String
    },
    municipality: {
        type: String
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    association: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Association',
    },
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
    },
    photo_url: {
        type: String
    },
    footprint_url: {
        type: String
    },
    id_front: {
        type: String
    },
    id_back: {
        type: String
    },
    fosiga_url: {
        type: String
    },
    sisben_url: {
        type: String
    },
    registry_doc_url: {
        type: String
    },
    neighborhood: {
        type: String
    },
    address: {
        type: String
    },
    phones: {
        type: [String]
    },
    responsible_family_member: {
        type: String
    },
    kinship: {
        type: String
    },
    status: {
        type: String,
        enum: ['enabled', 'disabled'],
        default: 'enabled'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isAttendee: {
        type: Boolean
    },
}, { timestamps: true });
beneficiarySchema.plugin(mongoosePaginate)
const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);

export default Beneficiary;   