import { Divider, Layout } from "antd";
import React, { useState, useEffect } from "react";
import { PageLayout } from "../components/PageLayout";

export function Info() {

    let [ version, setVersion ] = useState( 'Unknown' );
    useEffect( () => {
        window.ipc.invoke( 'get-version' )
            .then( ( version ) => setVersion( version ) )
            .catch( ( err ) => console.log( 'Unable to retrieve app version', err ) );
    }, [] );

    return (
        <PageLayout>
            <Layout.Content style={{ padding: '0 50px', overflowY: 'auto' }}>
                <Divider orientation="left" style={{ margin: '20px -25px' }}>How to use</Divider>
                <p>
                    To use the app, first configure all the options you would like in the settings-tab.
                    It is recommended to set multiple autosave-slots such that if the game crashes during an autosave, you can revert back to the autosave before that.
                    To test if autosaving is working, click the 'Autosave now'-button and check whether the game saved.
                </p>
                <p>
                    Within the game, there are two shortcuts available: 
                    <ul>
                        <li><code>F1</code>: Show/hide map</li>
                        <li><code>F2</code>: Trigger autosave</li>
                    </ul>
                </p>
                <p>
                    The minimap can follow players or locomotives.
                    To select a target to follow, click on the player or locomotive on the map and choose follow.
                    If you want to follow your own player, you can also click the 'Follow Player'-button under the zoom-controls.
                    To stop following, click the 'Stop Following'-button uner the zoom-controls.
                </p>
                <Divider orientation="left" style={{ margin: '20px -25px' }}>Antivirus</Divider>
                <p>
                    RROx needs to inject code into the game to function. However, this is not something regular programs do, and as such, it might get detected by your antivirus.
                    If attaching to the game is not working, check your antivirus to see if it is blocking RROx.
                    If necessary, you can add an exception to your antivirus for the following folder: <code>%localappdata%\RailroadsOnlineExtended</code>
                </p>
                <Divider orientation="left" style={{ margin: '20px -25px' }}>Credits</Divider>
                <p>
                    RailroadsOnline Extended has been made with the help of the following open-source tools:
                    <ul>
                        <li>RRO Mapper (ian76g)</li>
                        <li>Unreal Engine Dumper (guttir14)</li>
                        <li>UE4 CheatEngine Table (Cake-san)</li>
                    </ul>
                </p>
                <Divider style={{ margin: '20px -25px' }}/>
                <p>
                    <i>RROx - Version {version}</i>
                </p>
            </Layout.Content>
        </PageLayout>
    );
}