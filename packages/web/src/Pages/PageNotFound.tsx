import * as React from "react";
import { MapPageLayout } from "../components/MapPageLayout";
import { Button } from "antd";

export function PageNotFound() {
    return (
        <MapPageLayout>
            <div className="notfound-container">
                <div className="center">
                    <h1 className="title">404</h1>
                    <p className="sub-title">Page Not Found</p>

                    <p className="info">It looks like that page does not exists</p>
                    <p className="info">Would you like to go home</p>
                    <Button size="large" type="primary">Home</Button>
                </div>
            </div>
        </MapPageLayout>
    );
}