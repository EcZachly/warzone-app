import React from 'react';

export const ModalShouldBeClosedContext = React.createContext({
    ModalShouldBeClosedContext: false,
    changeModalCloseValue: (any) => {}
});