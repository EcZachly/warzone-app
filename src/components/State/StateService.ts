import UtilityService from '../../services/UtilityService';


export function defaultStateData(defaultData: any = null, isLoading = true): { data: any, loading: boolean, error: null } {
    return {
        data: defaultData,
        loading: isLoading,
        error: null
    };
}



export function defaultStateDataUpdater(useStateResponse) {
    return [useStateResponse[0], (newData: { loading?: boolean, data?: any, error?: string }) => {
        return useStateResponse[1](UtilityService.copyObject({...useStateResponse[0], ...newData}));
    }];
}



export default {
    defaultStateData,
    defaultStateDataUpdater
};