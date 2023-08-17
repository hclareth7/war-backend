const ModelAssociation = require('../models/references/association');
const ModelCommunity = require('../models/references/community');
const ModelEps = require('../models/references/eps');
const ModelLifeWellnessCenter = require('../models/references/life_wellness_center');
const ModelMunicipality = require('../models/references/municipality');
const ModelNeighborhood = require('../models/references/neighborhood');

//const modelName = Model.modelName;

exports.getAll = async (req, res, next) => {
    // #swagger.tags = ['References']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const getAllAssociation = await ModelAssociation.find({});
        const getAllCommunity = await ModelCommunity.find({});
        const getAllEps = await ModelEps.find({});
        const getAllLifeWellnessCenter = await ModelLifeWellnessCenter.find({});
        const getAllMunicipality = await ModelMunicipality.find({});
        const getAllNeighborhood = await ModelNeighborhood.find({});

        res.status(200).json({
            associations: getAllAssociation,
            communities: getAllCommunity,
            eps: getAllEps,
            life_wellness_centers: getAllLifeWellnessCenter,
            municipalities: getAllMunicipality,
            neighborhoods: getAllNeighborhood
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.getByRefName = async (req, res, next) => {
    // #swagger.tags = ['References']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const target = req.params.ref;
        const data = await getReferenceByName(target);

        res.status(200).json({
            data
        });
    } catch (error) {
        next(error);
    }
};

async function getReferenceByName(target) {

    const options = {
        associations: async () => data = await ModelAssociation.find({}),
        communities: async () => data = await ModelCommunity.find({}),
        eps: async () => data = await ModelEps.find({}),
        life_wellness_centers: async () => data = await ModelLifeWellnessCenter.find({}),
        municipalities: async () => data = await ModelMunicipality.find({}),
        neighborhoods: async () => data = await ModelNeighborhood.find({}),
        default: "no data"
    }
    return options.hasOwnProperty(target) ? await options[target]() : options['default']
}