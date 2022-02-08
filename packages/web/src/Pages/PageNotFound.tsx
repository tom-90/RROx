import * as React from "react";
import { MapPageLayout } from "../components/MapPageLayout";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

export function PageNotFound() {
    const navigate = useNavigate();

    return (
        <MapPageLayout>
            <div className="notfound-container">
                <div className="center">
                    <Result
                        status="404"
                        title="404"
                        subTitle="Sorry, the page you visited could not be found."
                        extra={<Button type="primary" onClick={() => navigate( '/' )}>Back Home</Button>}
                    />
                </div>
            </div>
        </MapPageLayout>
    );
}