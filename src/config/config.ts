

export const CONFIGS = {
    company: { name: "EMPRESA BUENA", logoUrl: "https://logo.png" },
    pdfTitle: "Document",
    s3BaseUrl: `${process.env.S3_CLOUD_ENDPOINT}/swift/v1/1e325b6357b7498d909f5f789f02df29/${process.env.BUCKET_NAME}`,
    searchableFields: {
        events: ["name"],
        winerie: ["name", "type"],
        item: ["name", "code"],
        beneficiary: ['first_name', 'second_name', 'first_last_name', 'second_last_name', 'identification'],
        user: ['name', 'user_name'],
        association: ['name', 'department', 'municipality'],
        rating:['rating_type'],
        activity: ["name"],
        workshop: ["name"],
        delivery: ['type', 'beneficiary.first_name', 'beneficiary.identification', 'representant.name', 'representant.identification']
        
    },
    filterType: ["dateRange", "dateSpecific", "number", "string"],
    numberTypeFilterOperators: [">", "<", "="],

    configFilePdf: {
        logoPdfDirection:"uped-logo.png",
        replegalprint:"replegalprint.png",
        infoContentFooterPdf: {
            nameAfterSignature:"YAIM JULIAN VACCA MESENES",
            representantLegal:`UNIDAD ESPECIALIZADA EN SERVICIOS Y SUMINISTRO EN SALUD S.A.S
            `,
            content: [
                { info: ["Calle 9N #5E-43, Barrio Riviera - Cúcuta", "3182695176", "upedserviciossuministro@gmail.com"] },
            ],
            titleInfo:["Dirección:","Telefono:","Correo:"]

        },
        titleMainRatingsPdf: "CONSORCIO PARA LA ATENCION INTEGRAL Y PSICOSOCIAL DEL ADULTO MAYOR",
        headersTableRetings: ["#", "Documento", "Nombre", "Municipio", "Asociación", "Usuario", "Fecha"],
        headersTableAttendees: ["#", "Documento", "Nombre", "Municipio", "Asociación", "Fecha"],
        headersContentBeforeTableAttendees: ["ACTIVIDAD:", "FECHA TALLER:", "TOTAL:"],
        headersContentBeforeTableRetings: ["DESDE:", "HASTA:", "TOTAL:"],
        propertiesAttendeesPdf: ["identification", "first_name", "municipality", "association", "createdAt"],
        propertiesRatingsPdf: ["identification", "first_name", "municipality", "association", "author_name", "createdAt"],

        headerDocument:{
            titleMain:`
                UNIDAD ESPECIALIZADA EN SERVICIOS
                Y SUMINISTRO EN SALUD S.A.S
            `,
            infoContrato:"N CONTRATO LP-SEG-02678-2023",
            textAditional:`objetivo del contrato : apoyo al fortalecimiento a los programas de atención integral del adulto mayor, promiviendo el funcionamiento de los centros de bienestar del anciano y centro de vida para la tercera edad en el departamento norte de santander`,
        }
    },
    wineries: {
        types: ["Principal", "Secundaria"]
    },
    resourceDocuments: [
        { name: 'photo_url' },
        { name: 'id_front' },
        { name: 'footprint_url' },
        { name: 'id_back' },
        { name: 'fosiga_url' },
        { name: 'sisben_url' },
        { name: 'registry_doc_url' }
    ],
    specialRoles:["Super Admin", "admin"],
    reportColumNames:{
        event_assistance: {
            first_name: "Primer Nombre",
            second_name: "Segundo Nombre",
            first_last_name: "Primer Apellido",
            second_last_name: "Segundo Apellido",
            identification_type: "Tipo de Identificación",
            identification: "Identificación",
            blody_type: "Tipo de Sangre",
            eps: "EPS",
            sisben_score: "Puntaje Sisbén",
            birthday: "Fecha de Nacimiento",
            gender: "Género",
            sex: "Sexo",
            is_disability: "Tiene Discapacidad",
            health_regimen: "Régimen de Salud",
            residence_department: "Departamento de Residencia",
            sisben_department: "Departamento Sisbén",
            civil_status: "Estado Civil",
            ethnicity: "Etnicidad",
            disability: "Tipo de Discapacidad",
            ocupation: "Ocupación",
            education_level: "Nivel de Educación",
            is_victim_armed_conflict: "Es Víctima de Conflicto Armado",
            municipality: "Municipio",
            community: "Comunidad",
            association: "Asociación",
            address: "Dirección",
            phones: "Teléfonos",
            status: "Estado",        
            activity: "Actividad",
          }
    }
};