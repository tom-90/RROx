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
                    <li>RRO Mapper (ian76g)</li>
                    <li>Unreal Engine Dumper (guttir14)</li>
                    <li>UE4 CheatEngine Table (Cake-san)</li>
                </ul>
            </p>
        </PageLayout>
    );
}