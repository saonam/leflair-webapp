import { CityProps, DistrictProps, getCities, getDistricts } from '../api/addresses';

const CITY_RESPONSE = 'locations/CITY_RESPONSE';
const DISTRICT_RESPONSE = 'locations/DISTRICT_RESPONSE';

export const loadCities = () => async (dispatch: Function) => {
  const cities: CityProps[] = await getCities();

  dispatch({
    type: CITY_RESPONSE,
    cities
  });
};

export const loadDistricts = (cityId: string) => async (dispatch: Function) => {
  const districts = await getDistricts(cityId);

  dispatch({
    type: DISTRICT_RESPONSE,
    districts,
    cityId
  });
};

/* REDUCER */

const initialState = {
  cities: {},
  districts: {}
};

export const locationsReducer = (state = initialState, action: any) => {
  switch(action.type) {
    case CITY_RESPONSE:
      const cities = action.cities.reduce((result: any, city: CityProps) => {
        result[city.id] = city;
        return result;
      }, {});

      return {
        ...state,
        cities
      };
    
    case DISTRICT_RESPONSE:
      const districtObject = action.districts.reduce((result: any, district: DistrictProps) => {
        result[district.id] = district;
        return result;
      }, {});

      return {
        ...state,
        districts: {
          ...state.districts,
          [action.cityId]: districtObject
        }
      };

    default:
      return state;
  };
};


/* SELECTORS */

export const getCityList = (state: any): Array<CityProps> => Object.values(state.locations.cities);
export const getDistrictList = (state: any, cityId: string): Array<DistrictProps> => state.locations.districts[cityId] ? Object.values(state.locations.districts[cityId]) : [];