

async function paginateModel(model, populate, page, perPage) {
    try {
        var paginationAvailable = false 
        if(page > 0){
            paginationAvailable = true
        }
    
        var options = {
            page: page || 1,
            limit: perPage || 10,
            pagination: paginationAvailable,
            populate: populate
          };
      const result = await model.paginate({}, options);
  
      return result;
    } catch (err) {
      throw err;
    }
  }
  
  module.exports = { paginateModel };