import ModelAssociation from '../models/references/association';
import ModelCommunity from '../models/references/community';
import ModelEps from '../models/references/eps';
import ModelLifeWellnessCenter from '../models/references/life_wellness_center';
import ModelMunicipality from '../models/references/municipality';
import ModelNeighborhood from '../models/references/neighborhood';

//const modelName = Model.modelName;

export const getAll = async (req, res, next) => {
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

export const getByRefName = async (req, res, next) => {
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
        associations: async () =>  await ModelAssociation.find({}),
        communities: async () => await ModelCommunity.find({}),
        eps: async () => await ModelEps.find({}),
        life_wellness_centers: async () => await ModelLifeWellnessCenter.find({}),
        municipalities: async () => await ModelMunicipality.find({}),
        neighborhoods: async () => await ModelNeighborhood.find({}),
        default: "no data"
    }
    return options.hasOwnProperty(target) ? await options[target]() : options['default']
}