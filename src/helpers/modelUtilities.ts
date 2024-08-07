import * as config from "../config/config";
import mongoose from 'mongoose';
import ModelAssociation from "../models/references/association";
import { calculateAge } from "./helper";

const handlerProperties = async (
  property: string,
  item: any,
  array: any[],
  model: any
) => {
  if (item[`${property}`]) {
    const id = item[`${property}`];
    const getModel = await model.findById(id);
    const name = getModel?.name;
    array.push(name);
  } else {
    array.push(" ");
  }
  return array;
};

export const organizeDate = (
  date: Date | null | undefined,
  array: any[] | null
) => {
  const year = date?.getFullYear();
  const month = String(
    date?.getMonth() != null ? date?.getMonth() + 1 : ""
  ).padStart(2, "0");
  const day = String(date?.getDate()).padStart(2, "0");
  const hours = String(date?.getHours()).padStart(2, "0");
  const minutes = String(date?.getMinutes()).padStart(2, "0");
  const seconds = String(date?.getSeconds()).padStart(2, "0");

  let amPmIndicator: string;

  if (parseInt(hours) >= 0 && parseInt(hours) < 12) {
    amPmIndicator = "AM";
  } else {
    amPmIndicator = "PM";
  }
  let formattedHours = parseInt(hours) % 12 === 0 ? 12 : parseInt(hours) % 12;
  if (array) {
    array.push(
      `${year}-${month}-${day} ${formattedHours}:${minutes}:${seconds} ${amPmIndicator}`
    );
    return array;
  }
  return `${year}-${month}-${day} ${formattedHours}:${minutes}:${seconds} ${amPmIndicator}`;
};

export const jsonDataConvertToArray = async (
  arrayJson: any[] | null | undefined,
  properties: string[]
) => {
  let arrayParent: any[] = [];
  if (arrayJson) {
    for (let indexJson = 0; indexJson < arrayJson.length; indexJson++) {
      const item: any = arrayJson[indexJson];
      let arrayItem: any[] = [];
      arrayItem.push(indexJson + 1);
      for (let i = 0; i < properties.length; i++) {
        const property: string = properties[i];
        const optionsValidation = {
          // "municipality":()=>handlerProperties(property,item,arrayItem,ModelMunicipality),
          association: () =>
            handlerProperties(property, item, arrayItem, ModelAssociation),
          participants: () =>
            arrayItem.push(item.attendees.length),
          activity: () =>
            arrayItem.push(item.activity?.name || ""),
          age: () =>
            arrayItem.push(`${calculateAge(item?.birthday)} años`),
          first_name: () =>
            arrayItem.push(
              `${item[`${property}`] +
                " " +
                (item.second_name || '') +
                " " +
                item.first_last_name +
                " " +
                (item.second_last_name || '')
                }`.toUpperCase()
            ),
          createdAt: () => organizeDate(item.createdAt, arrayItem),
          author: () => arrayItem.push(item.author?.name || ""),
          communityOne: () => arrayItem.push(item?.activity?.participatingAssociations[0]?.community?.name || ""),
          community: () =>
            arrayItem.push(item.community?.name || ""),
        };
        if (optionsValidation[`${property}`]) {
          await optionsValidation[`${property}`]();
        } else {
          arrayItem.push(item[`${property}`] ? item[`${property}`] : "");
        }
      }
      arrayParent.push(arrayItem);
      arrayItem = [];
    }
  }
  return arrayParent;
};

export const getTunnedDocument = async (
  model,
  populate,
  page,
  perPage,
  searchOptions: any = {}
) => {
  try {
    let conditions = {};
    if (searchOptions?.queryString) {
      conditions = getSearchOptions(searchOptions);
      page = 0;
    } else {
      conditions = getStatusOptions(searchOptions);
    }
    if (searchOptions?.directSearch) {
      conditions['$and'] = [...searchOptions?.directSearch]
    }

    const options = getPaginationOptions(populate, page, perPage);
    const response = await model.paginate(conditions, options);

    const result = {
      currentPage: response.page,
      itemsPerPage: response.limit,
      totalItems: response.totalDocs,
      totalPages: response.totalPages,
      data: response.docs,
    };

    return result;
  } catch (err) {
    throw err;
  }
};
export const getTunnedDocument2 = async (
  model,
  populate,
  page,
  perPage,
  searchOptions: any = {}
) => {
  try {
    let conditions: any = [];
    conditions.push(...buildAggregate(model, populate, searchOptions));
    const aggregate = model.aggregate(conditions);
    const options = getPaginationOptions(populate, page, perPage);
    const response = await model.aggregatePaginate(aggregate, options);

    const result = {
      currentPage: response.page,
      itemsPerPage: response.limit,
      totalItems: response.totalDocs,
      totalPages: response.totalPages,
      data: response.docs,
    };

    return result;
  } catch (err) {
    throw err;
  }
};


const buildAggregate = (model, populate, searchOptions) => {
  let aggregate: any[] = [];
  let lookupArray: any = [];
  let orArray: any = [];
  let andArray: any = [];
  let addFieldObject = {};
  let ProjectObject = {};

  /// ['type', {attendee: [name, identification]}, {author: [name, user_name]}]
  //for (const localField of populate) {
  const schema = model.schema;
  schema.eachPath((localField, schemaType) => {
    if (schemaType.options.ref) {
    console.log(localField);

      const fieldObject = {
        $lookup: {
          from: mongoose.model(schemaType.options.ref).collection.name,
          localField: localField,
          foreignField: "_id",
          as: `${localField}Info`
        }
      };

      addFieldObject[localField] = { $arrayElemAt: [`$${localField}Info`, 0] };
      ProjectObject[`${localField}Info`] = 0;
      lookupArray.push(fieldObject);
    }

  });
  searchOptions?.searchableFields?.forEach((field) => {
    if (isObject(field)) {
      const localField = Object.keys(field)[0];
      for (const subfield of field[localField]) {

        if (searchOptions.queryString) {
          const andObject = {
            [`${localField}Info.${subfield}`]: { $regex: new RegExp(searchOptions.queryString, "i") }
          }
          orArray.push(andObject)
        }


      }
    } else {
      if (searchOptions.queryString) {
        const andObject = {
          [field]: { $regex: new RegExp(searchOptions.queryString, "i") }
        }
        orArray.push(andObject)
      }
    }



  });
  aggregate.push(...lookupArray,
    {
      $match:
      {
        $and: [
          {
            $or: [
              { status: { $regex: new RegExp("enabled", "i") } },
              { status: { $exists: false } },
            ],
          }

        ]
      }
    }

  );

  if (Object.keys(addFieldObject).length > 0) {
    aggregate.push({
      $addFields: {
        ...addFieldObject
      }
    });
  }

  if (Object.keys(ProjectObject).length > 0) {
    aggregate.push({
      $project: ProjectObject

    });
  }

  for (const itemAggregate of aggregate) {
    if (itemAggregate['$match']) {
      if (orArray.length > 0) {
        itemAggregate['$match']['$and'].push({ $or: orArray });
      }
      if (searchOptions.directCondition) {
        itemAggregate['$match']['$and'].push(...searchOptions.directCondition)
      }

    }
  }
  console.log(JSON.stringify(aggregate))
  return aggregate;
}

const getSearchOptions = (searchOptions) => {
  const arrayRegex: any = [];
  searchOptions.searchableFields.forEach((field) => {
    const object: any = {
      [field]: { $regex: new RegExp(searchOptions.queryString, "i") },
    };
    arrayRegex.push(object);
  });
  const searchOptionsRegex = {
    $and: [
      {
        $or: [
          { status: { $regex: new RegExp("enabled", "i") } },
          { status: { $exists: false } },
        ],
      },
      { $or: arrayRegex },
    ],
  };
  return searchOptionsRegex;
};

const getStatusOptions = (searchOptions) => {
  const arrayRegex: any = [];
  arrayRegex.push({ status: { $regex: new RegExp("enabled", "i") } });
  arrayRegex.push({ status: { $exists: false } });
  if (searchOptions.isLoggedUser) {
    arrayRegex.push(searchOptions.isLoggedUser)
  }
  const searchOptionsRegex = { $or: arrayRegex };
  return searchOptionsRegex;
};

const getPaginationOptions = (populate, page, perPage): object => {
  let paginationAvailable = page > 0 ? true : false;
  const options = {
    page: page || 1,
    limit: perPage || 10,
    pagination: paginationAvailable,
    populate: populate,
    sort: { updatedAt: -1 },
  };
  return options;
};

const filterByString = (field, value) => {
  return {
    [field]: { $regex: new RegExp(value, "i") },
  };
};

export const filterByDateRangeAndString = (
  fieldDate: string,
  startDate: string,
  endDate: string,
  fieldString?: string,
  valueFieldString?: any,
  valueAuthor?: any
) => {
  const filter = {
    [fieldDate]: {
      $gte: parseDate(startDate),
      $lte: parseDate(endDate),
    },
    [`${fieldString}`]:
      fieldString !== null && valueFieldString !== null
        ? { $regex: new RegExp(valueFieldString, "i") }
        : {},
    // author: valueAuthor !== null ? valueAuthor :{},
  };
  console.log(valueAuthor);
  if(valueAuthor!==null && valueAuthor !== undefined){
    filter["author"]=valueAuthor;
  }
  return filter;
  // [fieldString]: { $regex: new RegExp(valueFieldString, 'i') }
};

export const filterByDateRange = (field, startDate, endDate) => {
  return {
    [field]: {
      $gte: parseDate(startDate),
      $lte: parseDate(endDate),
    },
  };
};

const filterBySpecificDate = (field, date) => {
  return {
    [field]: { $eq: parseDate(date) },
  };
};

const parseDate = (dateString) => {
  return new Date(dateString);
};

const filterByNumber = (field, operator, value) => {
  if (operator === config.CONFIGS.numberTypeFilterOperators[0]) {
    return {
      [field]: { $gt: value },
    };
  } else if (operator === config.CONFIGS.numberTypeFilterOperators[1]) {
    return {
      [field]: { $lt: value },
    };
  } else if (operator === config.CONFIGS.numberTypeFilterOperators[2]) {
    return {
      [field]: { $eq: value },
    };
  }
};

const validateOptionsFilter = (options) => {
  for (let i = 0; i < options.length; i++) {
    const option: any = options[i];
    const keysOption = Object.keys(option);
    for (let j = 0; j < keysOption.length; j++) {
      const key: any = keysOption[j];
      if (
        option[key] === null ||
        option[key] === undefined ||
        option[key] === " " ||
        option[key] === ""
      ) {
        return false;
      }
    }
  }
  return true;
};

const handlerFilter = (options) => {
  const conditions: any[] = [];

  for (let i = 0; i < options.length; i++) {
    const option: any = options[i];
    const filterFunctions = {
      [config.CONFIGS.filterType[0]]: () =>
        conditions.push(
          filterByDateRange(option.field, option.startDate, option.endDate)
        ),
      [config.CONFIGS.filterType[1]]: () =>
        conditions.push(filterBySpecificDate(option.field, option.date)),
      [config.CONFIGS.filterType[2]]: () =>
        conditions.push(
          filterByNumber(option.field, option.operator, option.value)
        ),
      [config.CONFIGS.filterType[3]]: () =>
        conditions.push(filterByString(option.field, option.value)),
    };
    if (filterFunctions[option.filterType]) {
      filterFunctions[option.filterType]();
    }
  }
  return conditions;
};

export const getFilteredDocument = async (modelo, options) => {
  const isValid: boolean = validateOptionsFilter(options);
  if (isValid) {
    const conditions = handlerFilter(options);
    const data = await modelo.find({ $and: conditions });
    return data;
  }
  return [];
};


const isObject = (obj) => {
  return obj !== null && typeof obj === 'object';
}