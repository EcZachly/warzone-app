export function defaultStateData(defaultData: any = null, isLoading: boolean = true): { data: any, loading: boolean, error: null } {
    return {
        data: defaultData,
        loading: isLoading,
        error: null
    };
}



export function defaultStateDataUpdater(useStateResponse) {
    return [useStateResponse[0], (newData: { loading?: boolean, data?: any, error?: Error }) => {
        return useStateResponse[1]({...newData});
    }];
}



export default {
    defaultStateData,
    defaultStateDataUpdater
};