import React from "react";
import { PageContent } from "./PageContent";
import { PageLayout } from "./PageLayout";
import { Result } from "antd";

export function NotFoundPage() {
    return <PageLayout>
        <PageContent>
            <Result
                status="error"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
            />
        </PageContent>
    </PageLayout>;
}