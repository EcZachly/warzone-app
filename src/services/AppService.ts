export function isSSR() {
    return typeof window === 'undefined';
}


export function isClientSide() {
    return !isSSR();
}




export default {
    isSSR,
    isClientSide
};