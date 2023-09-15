
export const getTunnedDocument = async (model, populate, page, perPage, searchOptions: any = {}) => {
  try {
    let conditions = {};
    if (searchOptions?.queryString) {
      getSearchOptions(searchOptions?.queryString);
      page = 0;
    }
    const options = getPaginationOptions(populate, page, perPage);

    const result = await model.paginate(conditions, options);

    return result;
  } catch (err) {
    throw err;
  }
}

const getSearchOptions = async (searchOptions) => {
  const arrayRegex: any = [];
  searchOptions.searchableFields.forEach(field => {
    const object: any = { field: { $regex: new RegExp(searchOptions.queryString, "i") } }
    arrayRegex.push(object);
  });
  const searchOptionsRegex = { $or: arrayRegex }
  return searchOptionsRegex;
}

const getPaginationOptions = (populate, page, perPage): object => {
  let paginationAvailable = page > 0 ? true : false
  const options = {
    page: page || 1,
    limit: perPage || 10,
    pagination: paginationAvailable,
    populate: populate
  };
  return options;
}
