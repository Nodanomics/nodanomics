import React, {useEffect, useState} from 'react';
import {Box} from "@mui/material";
import {LandingHeaderNavListItem} from "./LandingHeaderNavListItem";
import {ELinks} from "../../../../service";
import {useCurrentPath} from "../../../../hooks/useCurrentPath";


const pages = [
    {
        name: 'Projects',
        link: ELinks.project,
    }, {
        name: 'Teams',
        link: ELinks.team,
    }, {
        name: 'Account',
        link: ELinks.accountManageData,
    }
]

export const LandingHeaderNavList: React.FC = () => {
    const [selected, setSelected] = useState<ELinks>()
    const currentPath = useCurrentPath()

    useEffect(() => {
        if (currentPath) {
            const openedPath = pages.find((page) => currentPath.includes(page.link))
            setSelected(openedPath?.link)
        }
    }, [currentPath])
    return (
        <>
            <Box style={{
                display: 'flex',
                flex: 1,
                alignSelf: 'stretch',
            }}>
                {pages.map((page) => (
                    <LandingHeaderNavListItem
                        name={page.name}
                        link={page.link}
                        isSelected={selected === page.link}
                        setSelected={setSelected}
                        key={page.name}
                    />
                ))}


            </Box>
        </>
    );
};
