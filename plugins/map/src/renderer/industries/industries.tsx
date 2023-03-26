import { Avatar, Button, List } from 'antd';
import { ControlOutlined, AimOutlined, InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { IndustryDefinitions } from '../map/definitions';
import { IIndustry, ProductType } from '@rrox-plugins/world/shared';
import { ProductDefinitions } from '../map/definitions';

export function IndustryList( {
    data,
    onLocate
}: {
    data: { index: number, industry: IIndustry }[],
    onLocate: ( index: number ) => void,
} ) {

	const [expandedIndustries, setExpandedIndustries] = useState(new Set<number>());

    return <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={( { industry, index } ) => {
            const definition = IndustryDefinitions[ industry.type ];
			
            let actions = [];

			actions.push(<Button
                    title='Info'
                    icon={<InfoCircleOutlined />}
                    onClick={() => {
                        const isExpanded = expandedIndustries.has(index);
                        const newSet = new Set(expandedIndustries);
                        if(isExpanded)
                            newSet.delete(index);
                        else
                            newSet.add(index);
                        setExpandedIndustries(newSet);
                    }}
                    size='large'
                />);

            actions.push( <Button
                title="Locate on the map"
                icon={<AimOutlined />}
                onClick={() => onLocate( index )}
                size='large'
            /> );

            return <List.Item
                actions={actions}
                className={'industry-list-item'}
            >
                <List.Item.Meta
                    title={`${definition.name.toUpperCase()}`}
                    description={
						<div id={'industry_details_' + index}>
							{expandedIndustries.has(index) ? 
								<div>
									{(industry.educts.length > 0) ? 
										<table style={{
											width: '100%',
											marginBottom: 20,
											color: 'black',
										}}>
											<thead>
												<tr>
													<th style={{
														textAlign: 'center',
														color: 'black',
													}} colSpan={2}>
														Input
													</th>
												</tr>
											</thead>
											
											{industry.educts.map( ( { currentAmount, maxAmount, type } ) => 
													<tbody>
														<tr>
															<td style={{
																textAlign: 'center',
																width: '50%',
																paddingRight: 5,	
															}}>
																<span style={{ color: currentAmount < 10 ? (maxAmount == 0 ? "black" : "red") : "black" }}>{currentAmount} </span> / {maxAmount}
															</td>
															<td style={{ width: '50%' }}>
																{type.split( ' ' ).map( ( item: ProductType ) => <img
																	className="dark-mode-invert"
																	src={ProductDefinitions[ item ]?.image}
																	height={50}
																	style={{ display: 'block', marginLeft: ProductDefinitions[ item ]?.offset ? ProductDefinitions[ item ].offset : 0 }}
																/>)}
															</td>
														</tr>
													</tbody>
											)}
										</table>
										:
										null // no inputs
									}
									
									{(industry.products.length > 0) ? 
										<table style={{
											width: '100%',
											marginBottom: 20,
											color: 'black',
										}}>
											<thead>
												<tr>
													<th style={{
														textAlign: 'center',
														color: 'black',
													}} colSpan={2}>
														Output
													</th>
												</tr>
											</thead>
											
											{industry.products.map( ( { currentAmount, maxAmount, type } ) => 
													<tbody>
														<tr>
															<td style={{
																textAlign: 'center',
																width: '50%',
																paddingRight: 5,	
															}}>
																{currentAmount} / {maxAmount}
															</td>
															<td style={{ width: '50%' }}>
																{type.split( ' ' ).map( ( item: ProductType ) => <img
																	className="dark-mode-invert"
																	src={ProductDefinitions[ item ]?.image}
																	height={50}
																	style={{ display: 'block', marginLeft: ProductDefinitions[ item ]?.offset ? ProductDefinitions[ item ].offset : 0 }}
																/>)}
															</td>
														</tr>
													</tbody>
											)}
										</table>
										:
										null // no outputs
									}
								</div> // expanded
								:
								null // unexpanded
							}
						</div>
                    } // description end.
                />
            </List.Item>;
        }}
    />;
}