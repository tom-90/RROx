import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { PageLayout } from "@rrox/base-ui";
import { useRPC } from "@rrox/api";
import { StructListCommunicator, StructListDetails } from "../shared";
import { StructTree } from "./components/structTree";
import { StructCodeViewer } from "./components/structCodeViewer";

export function Structs() {
    const getStructList            = useRPC( StructListCommunicator );
    const [ selected, setSelected ] = useState<string | undefined>( undefined );
    const [ structs , setStructs  ] = useState<StructListDetails | undefined>( undefined );

    useEffect( () => {
        getStructList()
            .then( ( value ) => {
                setStructs( value );
            } ).catch( ( e ) => {
                console.error( e );
                setStructs( undefined );
            } );
    }, [] );

    return <PageLayout>
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Row style={{ height: '100%' }}>
                <Col span={12} style={{ height: '100%' }}>
                    <StructTree data={structs} onSelected={setSelected} selected={selected} />
                </Col>
                <Col span={12}>
                    <StructCodeViewer
                        selected={selected}
                        onSelected={setSelected}
                    />
                </Col>
            </Row>
        </div>
    </PageLayout>;
}