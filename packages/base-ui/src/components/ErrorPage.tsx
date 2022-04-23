import React from "react";
import { PageContent } from "./PageContent";
import { PageLayout } from "./PageLayout";
import { Result } from "antd";

export function ErrorPage( { title, message }: { title?: string, message?: string } ) {
    return <PageLayout>
        <PageContent>
            <Result
                status="error"
                title={title ?? "Unexpected error"}
                subTitle={message ?? "RROx experienced an unexpected error"}
            />
        </PageContent>
    </PageLayout>;
}