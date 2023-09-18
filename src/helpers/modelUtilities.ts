import * as config from '../config/config';

export const getTunnedDocument = async (model, populate, page, perPage, searchOptions: any = {}) => {
  try {
    let conditions = {};
    if (searchOptions?.queryString) {
      conditions = getSearchOptions(searchOptions);
      page = 0;
    }
    const options = getPaginationOptions(populate, page, perPage);
    const result = await model.paginate(conditions, options);

    return result;
  } catch (err) {
    console.log(err)
    throw err;
  }
}

const getSearchOptions = (searchOptions) => {
  const arrayRegex: any = [];
  searchOptions.searchableFields.forEach(field => {
    const object: any = { [field]: { $regex: new RegExp(searchOptions.queryString, "i") } }
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

const filterByString=(field, value)=>{
  return {
    [field]: { $regex: new RegExp(value, 'i') }
  }
}

const filterByDateRange=(field, startDate, endDate) => {
  return {
    [field]: {
      $gte: parseDate(startDate),
      $lte: parseDate(endDate)
    }
  }
}

const filterBySpecificDate=(field, date) =>{
  return {
    [field]:{ $eq: parseDate(date) } 
  }
}

const parseDate=(dateString)=>{
  return new Date(dateString);
}

const filterByNumber=(field, operator, value) => {
  if(operator === config.CONFIGS.numberTypeFilterOperators[0]){
    return {
      [field]:{$gt:value},
    }
  }else if(operator === config.CONFIGS.numberTypeFilterOperators[1]){
    return {
      [field]:{$lt:value},
    }
  }else if(operator === config.CONFIGS.numberTypeFilterOperators[2]){
    return {
      [field]:{$eq:value},
    }
  }
}

const validateOptionsFilter=(options)=>{
  for (let i = 0; i < options.length; i++) {
    const option:any = options[i];
    const keysOption=Object.keys(option);
    for (let j = 0; j < keysOption.length; j++) {
      const key:any = keysOption[j];
      if(option[key]===null || option[key]===undefined || option[key]===" " || option[key]===""){
        return true;
      }
      
    }
    
  }
  return false;
}

const handlerFilter=(options)=>{
  const conditions:any[]=[];
  
  for (let i = 0; i < options.length; i++) {
    const option:any = options[i];

    switch (option.filterType) {
      case config.CONFIGS.filterType[0]://dateRange
        conditions.push(filterByDateRange(option.field,option.startDate,option.endDate));
        break;
      case config.CONFIGS.filterType[1]://dateSpecific
        conditions.push(filterBySpecificDate(option.field,option.date));
        break;
      case config.CONFIGS.filterType[2]://number
        conditions.push(filterByNumber(option.field,option.operator,option.value));
        break;
      case config.CONFIGS.filterType[3]://string
        conditions.push(filterByString(option.field,option.value));
        break;
    }
  }
  return conditions;
}

export const getFilteredDocument=async (modelo, options) =>{
  const isNullValuesOption:boolean = validateOptionsFilter(options);
  if(isNullValuesOption===false){
    const conditions=handlerFilter(options);
    const data=await modelo.find({$and:conditions});
    return data;
  }
  return [];
}


