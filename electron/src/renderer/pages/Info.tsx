import { Divider } from "antd";
import React from "react";
import { PageLayout } from "../components/PageLayout";

export function Info() {
    return (
        <PageLayout>
            <Divider orientation="left">Credits</Divider>
            <p>
                RailroadsOnline Extended has been made with the help of the following open-source tools:
                <ul>
                    <li>ian76g (Map rendering)</li>
                    <li>guttir14 (Unreal Engine Dumper)</li>
                    <li>Cake-san (UE4 CheatEngine Table)</li>
                </ul>
            </p>
        </PageLayout>
    );
}