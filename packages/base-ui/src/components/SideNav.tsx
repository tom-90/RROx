import React, { useMemo } from 'react';
import { Menu } from "antd";
import { useLocation, matchPath, Link } from "react-router-dom";
import { MenuButtonRegistration, useRegistration } from '@rrox/api';

export function SideNav() {
    const { pathname } = useLocation();

    const buttons = useRegistration( MenuButtonRegistration );

    const [ menuItems, menuLinks ] = useMemo( () => {
        const mappedLinks: { [ key: string ]: string } = {};

        const mappedButtons = buttons.map( ( button, i ) => {
            let link: string | undefined;
            const { linkTo, ...props } = button.parameters[ 1 ] ?? {};

            if( linkTo ) {
                if( linkTo.startsWith( '/' ) )
                    link = linkTo;
                else
                    link = '/' + button.metadata.plugin + '/' + linkTo;

                mappedLinks[ i ] = link;
            }

            return <Menu.Item
                {...props}
                key={i.toString()}
            >
                {link ? <Link to={link}>
                    {button.parameters[ 0 ]}
                </Link> : button.parameters[ 0 ]}
            </Menu.Item>
        } );

        return [ mappedButtons, mappedLinks ];
    }, [ buttons ] );

    const selectedKeys = useMemo( () => {
        return Object.entries( menuLinks ).filter( ( [ , link ] ) => matchPath( link, pathname ) ).map( ( [ key ] ) => key );
    }, [ pathname, menuLinks ] );

    return (
        <Menu mode="inline" selectedKeys={selectedKeys}>
            {menuItems}
        </Menu>
    );
}
