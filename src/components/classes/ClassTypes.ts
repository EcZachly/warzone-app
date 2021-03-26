export type RawClass = {
    category: string,
    description?: string,
    percentiles: ClassPercentileMap
}



export type ClassDescriptionMap = Record<string, { game_category: string } & RawClass>;



export type ClassPercentileMap = Record<string, ClassPercentile>



export type ClassPercentile = {
    value: number,
    percentile: number
};