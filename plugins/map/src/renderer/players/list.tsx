import { PageContent, PageLayout } from "@rrox/base-ui";
import { useWorld } from "@rrox-plugins/world/renderer";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
//import { FrameDefinitions } from "../map/definitions";
import { PlayerList } from "./players";

export function PlayersListPage() {
    const navigate = useNavigate();

    const world = useWorld();

    const locate = (index: number) => {
        navigate('/@rrox-plugins/map/map', {
            state: {
                locate: {
                    type: 'players',
                    index: index,
                }
            }
        });
    }

    return (
        <PageLayout>
            <PageContent style={{ maxWidth: 1200 }}>
                <PlayerList
                    data={world?.players.map((player, index) => ({ player, index })) ?? []}
                    onLocate={locate}
                />
            </PageContent>
        </PageLayout>
    );
}