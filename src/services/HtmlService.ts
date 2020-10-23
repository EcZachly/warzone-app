import TypeService from './TypeService';

//--==--==----==--==--==--==----==--==----==--==----==--==--==--==----==--==--//
//PUBLIC METHODS

export function getElementPosition(element) {
    const returnObj = {
        top: null,
        left: null,
        height: null,
        width: null,
        offsetWidth: null,
        offsetHeight: null,
        bottom: null,
        right: null,
        leftRightMiddle: null,
        topBottomMiddle: null,
    };

    if (element) {
        const rect = element.getBoundingClientRect();

        returnObj.top = Number(rect.top + document.body.scrollTop);
        returnObj.left = Number(rect.left + document.body.scrollLeft);
        returnObj.height = Number(element.clientHeight);
        returnObj.width = Number(element.clientWidth);

        returnObj.offsetHeight = Number(element.offsetHeight);
        returnObj.offsetWidth = Number(element.offsetWidth);

        returnObj.bottom = Number(returnObj.top + returnObj.height);
        returnObj.right = Number(returnObj.left + returnObj.width);

        returnObj.leftRightMiddle = returnObj.left + (returnObj.width / 2);
        returnObj.topBottomMiddle = returnObj.top + (returnObj.height / 2);
    }

    return returnObj;
}



export default {
    getElementPosition
};