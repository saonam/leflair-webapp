import { FilterProps, FilterOptionProps } from '../api/sales';

export const transformFilter = (filter: FilterProps) => {
  const result: any = {
    gender: [],
    category: [],
    color: [],
    size: [],
    brand: []
  };
  
  Object.keys(filter).forEach((filterName: string) => {
    if (['category', 'size'].indexOf(filterName) !== -1) {
      filter[filterName].forEach((option: FilterOptionProps) => {
        const foundOpt: any = result[filterName].find((opt: any) => option.display.toLowerCase() === opt.display.toLowerCase());
        
        if (foundOpt) {
          foundOpt.variations = foundOpt.variations || [{
            value: foundOpt.value,
            display: foundOpt.display
          }];
          foundOpt.variations.push(option);
        } else {
          result[filterName].push(option);
        }
      });
    } else {
      result[filterName] = filter[filterName];
    }
  });

  return Object.assign(result, {
    gender: [],   // hide gender for now
    category: result.category.length > 1 ? result.category : [],
    color: [],    // hide color for now
    size: result.size.length > 1 ? result.size : [],
    brand: result.brand.length > 0 ? result.brand : []
  });
}

export const jsonToQs = (json: any) => {
  const params: any[] = Object.keys(json).filter(key => {
    return Array.isArray(json[key]) ? json[key].length : json[key];
  }).map(key => {
    return `${key}=${Array.isArray(json[key]) ? json[key].join(',') : json[key]}`;
  });

  return params.length ? `?${params.join('&')}` : '';
}

export const qsToJson = (qs: string) => {
  if (!qs || qs === '?') {
    return {};
  }

  const params: any[] = qs.replace('?', '').split('&');
  const json: any = {};
  params.forEach(param => {
    const [key, value] = param.split('=');
    json[key] = key === 'sort' ? value : value.split(',');
  });

  return json;
}

export const isObjectEmpty = (o: any) => !Object.keys(o).length || !Object.keys(o).reduce((a, b) => o[b] && o[b].length > 0 ? a.concat(o[b]) : a, []).length;
