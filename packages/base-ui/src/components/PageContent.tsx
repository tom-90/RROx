import React from "react";
import { Layout } from "antd";

export function PageContent( props: React.ComponentProps<typeof Layout[ 'Content' ]> ) {
    return <Layout.Content {...props} className={props.className ? props.className + ' page-content' : 'page-content'} />;
}