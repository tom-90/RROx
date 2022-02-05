import * as React from "react";
import {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPageLayout } from "../../components/MapPageLayout";
import {Input, Card, Pagination, Select, Button} from 'antd';
import {EditOutlined} from '@ant-design/icons';
const { Meta } = Card;
const { Option } = Select;

export function LayoutControlPage() {
    let { serverKey } = useParams();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [layoutData, setLayoutData] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        setLayoutData([
            {
                id: 1,
                name: 'test 1 title',
                desc: 'test 1 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 1
            },
            {
                id: 2,
                name: 'test 2 title',
                desc: 'test 2 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 2
            },
            {
                id: 99,
                name: 'test 3 title',
                desc: 'test 3 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 3
            },
            {
                id: 99,
                name: 'test 4 title',
                desc: 'test 4 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 4
            },
            {
                id: 99,
                name: 'test 5 title',
                desc: 'test 5 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 5
            },
            {
                id: 99,
                name: 'test 6 title',
                desc: 'test 6 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 6
            },
            {
                id: 99,
                name: 'test 7 title',
                desc: 'test 7 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 7
            },
            {
                id: 99,
                name: 'test 8 title',
                desc: 'test 8 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 8
            },
            {
                id: 99,
                name: 'test 9 title',
                desc: 'test 9 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 9
            },
            {
                id: 99,
                name: 'test 10 title',
                desc: 'test 10 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 10
            },
            {
                id: 99,
                name: 'test 11 title',
                desc: 'test 9 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 11
            },
            {
                id: 99,
                name: 'test 12 title',
                desc: 'test 9 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 12
            },
            {
                id: 99,
                name: 'test 13 title',
                desc: 'test 9 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 13
            },
            {
                id: 99,
                name: 'test 14 title',
                desc: 'test 9 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 14
            },
            {
                id: 99,
                name: 'test 15 title',
                desc: 'test 9 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 15
            },
            {
                id: 99,
                name: 'test 16 title',
                desc: 'test 9 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 16
            },
            {
                id: 99,
                name: 'test 17 title',
                desc: 'test 9 desc',
                img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
                dateTime: 17
            }
        ]);
    }, []);

    return (
        <MapPageLayout>
            <div className="layout-select-siv">
                <div className="layout-search">
                    <Input placeholder="Search for layouts..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <Select defaultValue={1} size='large' onChange={(value) => setSort(value)}>
                        <Option value={1}>Order By Date ASC</Option>
                        <Option value={2}>Order By Date DESC</Option>
                        <Option value={3}>Order By Name ASC</Option>
                        <Option value={4}>Order By Name DESC</Option>
                        <Option value={5}>Order By Desc ASC</Option>
                        <Option value={6}>Order By Desc DESC</Option>
                    </Select>
                </div>
                <div className="layout-select">

                    {layoutData.filter((item) => {
                        if (search.toLowerCase().startsWith("name:")){
                            return item.name.toLowerCase().includes(search.replace("name:", "").toLowerCase());
                        }
                        if (search.toLowerCase().startsWith("desc:")){
                            return item.desc.toLowerCase().includes(search.replace("desc:", "").toLowerCase());
                        }
                        return item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase());
                    }).sort((a, b) => {
                        let nameA = a.name.toUpperCase();
                        let nameB = b.name.toUpperCase();
                        let descA = a.desc.toUpperCase();
                        let descB = b.desc.toUpperCase();
                        let dateA = a.dateTime;
                        let dateB = b.dateTime;

                        if (sort == 1){
                            if (dateA < dateB) {
                                return -1;
                            }
                            if (dateA > dateB) {
                                return 1;
                            }
                        }
                        if (sort == 2){
                            if (dateA > dateB) {
                                return -1;
                            }
                            if (dateA < dateB) {
                                return 1;
                            }
                        }
                        if (sort == 3){
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                        }
                        if (sort == 4){
                            if (nameA > nameB) {
                                return -1;
                            }
                            if (nameA < nameB) {
                                return 1;
                            }
                        }
                        if (sort == 5){
                            if (descA < descB) {
                                return -1;
                            }
                            if (descA > descB) {
                                return 1;
                            }
                        }
                        if (sort == 6){
                            if (descA > descB) {
                                return -1;
                            }
                            if (descA < descB) {
                                return 1;
                            }
                        }
                        return 0;
                    }).filter((_, index) => {
                        return index >= (currentPage  * pageSize) - pageSize && index < currentPage * pageSize;
                    }).map(({ id, name, desc, img, dateTime }) => <Card
                        key={id+name}
                        hoverable
                        style={{ width: 200, maxHeight: '300px' }}
                        onClick={() => navigate( `/${serverKey}/controls/layout/${id}/view` )}
                        cover={
                            <img alt="thumbnail" width={200} style={{aspectRatio: '16/9', objectFit: 'cover'}} src={img} />
                        }
                        className="layout-option"
                    >
                        <Meta title={name} description={desc} />
                        <small style={{color: 'rgba(0, 0, 0, 0.45)'}}>Date: {dateTime}</small>
                        <Button onClick={() => navigate( `/${serverKey}/controls/layout/${id}/edit`)} ><EditOutlined /></Button>
                    </Card>)}

                </div>
                <div className="layout-pagination">
                    <Pagination
                        defaultCurrent={1}
                        defaultPageSize={pageSize}
                        total={layoutData.filter((item) => {
                            return item.name.includes(search);
                        }).length}
                        onChange={(page) => {
                            setCurrentPage(page);
                        }}
                        responsive
                        hideOnSinglePage
                    />
                </div>
            </div>
        </MapPageLayout>
    );
}