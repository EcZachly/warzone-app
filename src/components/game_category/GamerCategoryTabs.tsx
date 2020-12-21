import React from "react";
import {GAME_CATEGORIES} from "../../../lib/constants";
import {Button, Box} from "../SimpleComponents";

export function GamerCategoryTabs({activeCategory, setCategory}) {
    function getTabs() {
        return Object.values(GAME_CATEGORIES).map((value) => {
            const isActive = (value === activeCategory);
            return (
                <Button key={value}
                            type={isActive ? 'dark' : 'link'}
                            style={{
                                paddingLeft: 10,
                                paddingRight: 10,
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                marginBottom: 0
                            }}
                            onClick={() => isActive ? '' : setCategory(value)}>
                    {value}
                </Button>
            )
        })
    }

    let tabs = getTabs();
    return (<Box> {tabs}</Box>);

}