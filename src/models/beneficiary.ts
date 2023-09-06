import mongoose from 'mongoose';
import validator from 'validator';

const beneficiarySchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: true
    },

    second_name: {
        type: String,
        required: true
    },
    first_last_name: {
        type: String,
        required: true
    },
    second_last_name: {
        type: String,
        required: true
    },
    identification_type: {
        type: String,
        required: true
    },
    identification: {
        type: String,
        required: true
    },
    eps: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Eps',
        required: true
    },
    sisben_score: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    birthday: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Masculino', 'Femenino'],
        required: true
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
    region: {
        type: String
    },
    municipality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Municipality',
        require: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        require: true
    },
    association: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Association',
        require: true
    },
    photo_url: {
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
    }
}, { timestamps: true });

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);

export default Beneficiary;   