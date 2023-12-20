

export const CONFIGS = {
    company: { name: "EMPRESA BUENA", logoUrl: "https://logo.png" },
    pdfTitle: "Document",
    s3BaseUrl: `${process.env.S3_CLOUD_ENDPOINT}/swift/v1/1e325b6357b7498d909f5f789f02df29/${process.env.BUCKET_NAME}`,
    searchableFields: {
        events: ["name"],
        winerie: ["name", "type"],
        item: ["name", "code"],
        beneficiary: [
            'first_name', 
            'second_name', 
            'first_last_name', 
            'second_last_name', 
            'identification',
            {association: ['name']},
            {author: ['name', 'user_name']}
        
        ],
        user: ['name', 'user_name'],
        association: ['name', 'department', 'municipality'],
        rating:['rating_type', {attendee: ['first_name', 'identification', 'first_last_name']}, {author: ['name', 'user_name']}],
        activity: ["name"],
        workshop: ["name"],
        delivery: [{beneficiary: ['first_name', 'last_name', 'identification']}, {representant: ['name', 'identification']},{author: ['name', 'user_name']} ]
        
    },
    filterType: ["dateRange", "dateSpecific", "number", "string"],
    numberTypeFilterOperators: [">", "<", "="],
    statusDelivery:"enabled",
    configFilePdf: {
        titleSecundadyListBeneficiarie:"Listado de beneficiarios registrados",
        logoPdfDirection:"uped-logo.png",
        titleUped: `
            UNIDAD ESPECIALIZADA EN SERVICIOS
            Y SUMINISTRO EN SALUD S.A.S
            `,
        replegalprint:"replegalprint.png",
        textDataBeforeFooter:"Los Artículos entregados por la gobernación del norte de Santander al adulto mayor son de uso exclusivo del adulto mayor, está prohibida su comercialización",
        infoContentFooterPdf: {
            nameAfterSignature:"YAIM JULIAN VACCA MESENES",
            representantLegal:`UNIDAD ESPECIALIZADA EN SERVICIOS Y SUMINISTRO EN SALUD S.A.S
            `,
            content: [
                { info: ["Calle 9N #5E-43, Barrio Riviera - Cúcuta", "3182695176", "upedserviciossuministro@gmail.com"] },
            ],
            titleInfo:["Dirección:","Telefono:","Correo:"]

        },
        headersTablebeneficiarie: ["#", "Documento", "Nombre", "Municipio", "Asociación", "Actividad", "Fecha"],
        titleMainRatingsPdf: `
            UNIDAD ESPECIALIZADA EN SERVICIOS
            Y SUMINISTRO EN SALUD S.A.S
        `,
        titleSecundaryListWorkshops:"LISTA DE TALLERES REGISTRADOS",
        titleSecundaryListArticles:"CONSOLIDADO DE EVENTO - ",
        titleSecundaryListAssitanceActivity:"ASISTENTES A LA ACTIVIDAD - ",
        headersTableAssistanceActivity: ["#","Nombre","Identificación", "Nivel de SISBEN",  "Edad" , "Regimen de salud", "Comuna", "Asociación"],
        propertiesAttendeesActivityPdf: ["first_name","identification", "sisben_score", "age","health_regimen", "community", "association"],
        headersContentBeforeTableAttendeesActivity: ["MUNICIPIO", "FECHA:", "TOTAL:"],

        headersTableRetings: ["#", "Documento", "Nombre", "Municipio", "Asociación", "Fecha"],
        headersTableGeneralRetings: ["#", "Documento", "Nombre", "Municipio", "Asociación", "Usuario", "Fecha"],
        headersTableAttendees: ["#", "Documento", "Nombre", "Municipio", "Asociación", "Fecha"],
        headersTableListArticles: ["#", "Nombre", "Cantidad"],
        headersTableListWorkshop: ["#", "Fecha" ,"Taller" ,"Actividad" ,"# Participantes","Comuna", "Usuario"],
        headersContentBeforeTableAttendees: ["ACTIVIDAD:", "FECHA TALLER:", "TOTAL:"],
        headersContentBeforeTableBeneficiare: ["DESDE:", "HASTA:", "TOTAL:","USUARIO:"],
        headerContentEventAssistance: ["EVENTO:", "FECHA:", "TOTAL:"],
        headersContentBeforeTableListArticles: ["TOTAL ASISTENTES:", "ARTICULOS ENTREGADOS:"],
        headersContentBeforeTableListWorkshops: ["DESDE:", "HASTA:", "TOTAL:"],
        headersContentBeforeTableRetings: ["DESDE:", "HASTA:", "TOTAL:", "USUARIO:"],
        headersContentBeforeTableGeneralRetings: ["DESDE:", "HASTA:", "TOTAL:"],
        propertiesListWorkshops: ["createdAt","name", "activity","participants","communityOne", "author"],
        propertiesAttendeesPdf: ["identification", "first_name", "municipality", "association", "createdAt"],
        propertiesRatingsPdf: ["identification", "first_name", "municipality", "association", "createdAt"],
        propertiesGeneralRatingsPdf: ["identification", "first_name", "municipality", "association", "author", "createdAt"],
        propertiesTableBeneficiaries: ["identification", "first_name", "municipality", "association", "activity", "createdAt"],
        propertiesTableListArticles: ["name", "amount"],

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
        beneficiary: {
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
            activity: "Actividad",
            author: 'Usuario',
            createdAt: "Fecha de creación",
            updatedAt: "Fecha de actualización",
            isAttendee: "Asistió a evento?"
        },
        benWithSupports: {
            first_name: "Primer Nombre",
            second_name: "Segundo Nombre",
            first_last_name: "Primer Apellido",
            second_last_name: "Segundo Apellido",
            identification: "Identificación",
            eps: "EPS",
            sisben_score: "Puntaje Sisbén",
            birthday: "Fecha de Nacimiento",
            health_regimen: "Régimen de Salud",
            residence_department: "Departamento de Residencia",
            sisben_department: "Departamento Sisbén",
            municipality: "Municipio",
            community: "Comunidad",
            association: "Asociación",
            activity: "Actividad",
            author: 'Usuario',
            photo_url: 'Foto',
            footprint_url: 'Huella',
            id_front: 'Cedula Frontal',
            id_back: 'Cedula Posterior',
            fosiga_url: 'Soporte EPS',
            sisben_url: 'Soporte SISBEN',
            registry_doc_url: 'Soporte Registraduria'
        },
        activities: {
            name: "Actividad",
            execution_date: "Fecha",
            description: "Descripción",
            estimate_attendance: "Asistencia estimada",
            attending_beneficiary: "Asistencia confirmada"
        }
    },
};