import React from "react";
import { PageContent } from "./PageContent";
import { PageLayout } from "./PageLayout";
import { Result } from "antd";

export function ErrorPage() {
    return <PageLayout>
        <PageContent>
            <Result
                status="error"
                title="Unexpected error"
                subTitle="RROx experienced an unexpected error"
            />
        </PageContent>
    </PageLayout>;
}