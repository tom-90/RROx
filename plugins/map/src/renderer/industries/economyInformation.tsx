import { Avatar, Button, List } from 'antd';
import { ControlOutlined, AimOutlined, InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

export function EconomyInformation( ) {
	
	let bor1px = '1px solid';
	let bor2px = '2px solid';
	
	return <div>
		
		<table id='magic' style={{
			width: '100%',
			marginBottom: 20,
			
			border: bor2px,
			textAlign:'center', 
			paddingRight: 5,
		}}>
			<tr style={{ border: bor2px, fontWeight: 'bold', borderBottom: bor2px }}>
				<th style={{ border: bor2px, }} colSpan={11}>Industry Inputs and Outputs<br/>Reference Chart</th>
			</tr>
			<tr style={{ border: bor2px, fontWeight: 'bold', }}>
				<td style={{ border: bor2px, }} rowSpan={2} >Location</td>
				<td style={{ border: bor2px, }} colSpan={5} >Input</td>
				<td style={{ border: bor2px, }} colSpan={5} >Output</td>
			</tr>
			<tr style={{ border: bor2px, fontWeight: 'bold', }}>
				<td style={{ border: bor2px, }} >Type</td>
				<td style={{ border: bor2px, }} >Amount</td>
				<td style={{ border: bor2px, }} >Easy</td>
				<td style={{ border: bor2px, }} >Med</td>
				<td style={{ border: bor2px, }} >Hard</td>
				<td style={{ border: bor2px, }} >Type</td>
				<td style={{ border: bor2px, }} >Amount</td>
				<td style={{ border: bor2px, }} >Easy</td>
				<td style={{ border: bor2px, }} >Med</td>
				<td style={{ border: bor2px, }} >Hard</td>
			</tr>
			<tr style={{
				border: bor1px,
			}}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={2}>Logging Camp</td>
				<td style={{ border: bor1px, }} rowSpan={2}>-</td>
				<td style={{ border: bor1px, }} rowSpan={2}>-</td>
				<td style={{ border: bor1px, }} rowSpan={2}>-</td>
				<td style={{ border: bor1px, }} rowSpan={2}>-</td>
				<td style={{ border: bor1px, }} rowSpan={2}>-</td>
				<td style={{ border: bor1px, }} >Logs</td>
				<td style={{ border: bor1px, }} >200</td>
				<td style={{ border: bor1px, }} >-</td>
				<td style={{ border: bor1px, }} >-</td>
				<td style={{ border: bor1px, }} >-</td>
			</tr>
			<tr style={{
				border: bor1px,
				borderBottom: bor2px,
			}}>
				<td style={{ border: bor1px, }} >Cordwood</td>
				<td style={{ border: bor1px, }} >64</td>
				<td style={{ border: bor1px, }} >-</td>
				<td style={{ border: bor1px, }} >-</td>
				<td style={{ border: bor1px, }} >-</td>
			</tr>
			<tr style={{
				border: bor1px,
			}}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={2}>Sawmill</td>
				<td style={{ border: bor1px, }} rowSpan={2}>Logs</td>
				<td style={{ border: bor1px, }} rowSpan={2}>100</td>
				<td style={{ border: bor1px, }} rowSpan={2}>1</td>
				<td style={{ border: bor1px, }} rowSpan={2}>1</td>
				<td style={{ border: bor1px, }} rowSpan={2}>2</td>
				<td style={{ border: bor1px, }} >Lumber</td>
				<td style={{ border: bor1px, }} >100</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >1</td>
			</tr>
			<tr style={{
				border: bor1px,
				borderBottom: bor2px,
			}}>
				<td style={{ border: bor1px, }} >Beams</td>
				<td style={{ border: bor1px, }} >100</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >1</td>
			</tr>
			<tr style={{
				border: bor1px,
			}}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={2}>Smelter</td>
				<td style={{ border: bor1px, }} >Iron Ore</td>
				<td style={{ border: bor1px, }} >1000</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >4</td>
				<td style={{ border: bor1px, }} >Rails</td>
				<td style={{ border: bor1px, }} >100</td>
				<td style={{ border: bor1px, }} >4</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >2</td>
			</tr>
			<tr style={{
				border: bor1px,
				borderBottom: bor2px,
			}}>
				<td style={{ border: bor1px, }} >Cordwood</td>
				<td style={{ border: bor1px, }} >100</td>
				<td style={{ border: bor1px, }} >4</td>
				<td style={{ border: bor1px, }} >4</td>
				<td style={{ border: bor1px, }} >8</td>
				<td style={{ border: bor1px, }} >Raw Iron</td>
				<td style={{ border: bor1px, }} >100</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >1</td>
			</tr>		
			<tr style={{
				border: bor1px,
			}}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={2}>Iron Ore Mine</td>
				<td style={{ border: bor1px, }} >Lumber</td>
				<td style={{ border: bor1px, }} >50</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >4</td>
				<td style={{ border: bor1px, }} rowSpan={2}>Iron Ore</td>
				<td style={{ border: bor1px, }} rowSpan={2}>290</td>
				<td style={{ border: bor1px, }} rowSpan={2}>10</td>
				<td style={{ border: bor1px, }} rowSpan={2}>5</td>
				<td style={{ border: bor1px, }} rowSpan={2}>5</td>
			</tr>
			<tr style={{
				border: bor1px,
				borderBottom: bor2px,
			}}>
				<td style={{ border: bor1px, }} >Beams</td>
				<td style={{ border: bor1px, }} >30</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >2</td>
			</tr>
			<tr style={{
				border: bor1px,
			}}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={2}>Coal Mine</td>
				<td style={{ border: bor1px, }} >Beams</td>
				<td style={{ border: bor1px, }} >30</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >4</td>
				<td style={{ border: bor1px, }} rowSpan={2}>Coal</td>
				<td style={{ border: bor1px, }} rowSpan={2}>750</td>
				<td style={{ border: bor1px, }} rowSpan={2}>20</td>
				<td style={{ border: bor1px, }} rowSpan={2}>10</td>
				<td style={{ border: bor1px, }} rowSpan={2}>10</td>
			</tr>
			<tr style={{
				border: bor1px,
				borderBottom: bor2px,
			}}>
				<td style={{ border: bor1px, }} >Rails</td>
				<td style={{ border: bor1px, }} >60</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >2</td>
			</tr>
			<tr style={{
				border: bor1px,
			}}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={3}>Ironworks</td>
				<td style={{ border: bor1px, }} >Coal</td>
				<td style={{ border: bor1px, }} >1000</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >Steel Pipes</td>
				<td style={{ border: bor1px, }} >100</td>
				<td style={{ border: bor1px, }} >8</td>
				<td style={{ border: bor1px, }} >4</td>
				<td style={{ border: bor1px, }} >4</td>
			</tr>	
			<tr style={{
				border: bor1px,
			}}>	
				<td style={{ border: bor1px, }} >Lumber</td>
				<td style={{ border: bor1px, }} >50</td>
				<td style={{ border: bor1px, }} >3</td>
				<td style={{ border: bor1px, }} >3</td>
				<td style={{ border: bor1px, }} >6</td>
				<td style={{ border: bor1px, }} rowSpan={2}>Tools</td>
				<td style={{ border: bor1px, }} rowSpan={2}>100</td>
				<td style={{ border: bor1px, }} rowSpan={2}>32</td>
				<td style={{ border: bor1px, }} rowSpan={2}>16</td>
				<td style={{ border: bor1px, }} rowSpan={2}>16</td>
			</tr>
			<tr style={{
				border: bor1px,
				borderBottom: bor2px,
			}}>
				<td style={{ border: bor1px, }} >Raw Iron</td>
				<td style={{ border: bor1px, }} >100</td>
				<td style={{ border: bor1px, }} >4</td>
				<td style={{ border: bor1px, }} >4</td>
				<td style={{ border: bor1px, }} >8</td>
			</tr>
			<tr style={{
				border: bor1px,
			}}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={3}>Oil Field</td>
				<td style={{ border: bor1px, }} >Steel Pipes</td>
				<td style={{ border: bor1px, }} >30</td>
				<td style={{ border: bor1px, }} >3</td>
				<td style={{ border: bor1px, }} >3</td>
				<td style={{ border: bor1px, }} >6</td>
				<td style={{ border: bor1px, }} rowSpan={3}>Crude Oil</td>
				<td style={{ border: bor1px, }} rowSpan={3}>1000</td>
				<td style={{ border: bor1px, }} rowSpan={3}>48</td>
				<td style={{ border: bor1px, }} rowSpan={3}>24</td>
				<td style={{ border: bor1px, }} rowSpan={3}>24</td>
			</tr>	
			<tr style={{
				border: bor1px,
			}}>	
				<td style={{ border: bor1px, }} >Beams</td>
				<td style={{ border: bor1px, }} >30</td>
				<td style={{ border: bor1px, }} >3</td>
				<td style={{ border: bor1px, }} >3</td>
				<td style={{ border: bor1px, }} >6</td>
			</tr>
			<tr style={{
				border: bor1px,
				borderBottom: bor2px,
			}}>
				<td style={{ border: bor1px, }} >Tools</td>
				<td style={{ border: bor1px, }} >100</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >2</td>
			</tr>
			<tr style={{
				border: bor1px,
			}}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={3}>Refinery</td>
				<td style={{ border: bor1px, }} >Lumber</td>
				<td style={{ border: bor1px, }} >50</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} >4</td>
				<td style={{ border: bor1px, }} >Oil Barrel</td>
				<td style={{ border: bor1px, }} >100</td>
				<td style={{ border: bor1px, }} >10</td>
				<td style={{ border: bor1px, }} >5</td>
				<td style={{ border: bor1px, }} >5</td>
			</tr>
			<tr style={{
				border: bor1px,
			}}>	
				<td style={{ border: bor1px, }} >Steel Pipes</td>
				<td style={{ border: bor1px, }} >100</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >1</td>
				<td style={{ border: bor1px, }} >2</td>
				<td style={{ border: bor1px, }} rowSpan={3}>Oil Barrel</td>
				<td style={{ border: bor1px, }} rowSpan={3}>100</td>
				<td style={{ border: bor1px, }} rowSpan={3}>10</td>
				<td style={{ border: bor1px, }} rowSpan={3}>5</td>
				<td style={{ border: bor1px, }} rowSpan={3}>5</td>
			</tr>
			<tr style={{
				border: bor1px,
				borderBottom: bor2px,
			}}>
				<td style={{ border: bor1px, }} >Crude Oil</td>
				<td style={{ border: bor1px, }} >1000</td>
				<td style={{ border: bor1px, }} >12</td>
				<td style={{ border: bor1px, }} >12</td>
				<td style={{ border: bor1px, }} >24</td>
			</tr>		
		</table>

		<hr/>
		<br/>
		
		<table style={{
			width: '100%',
			marginBottom: 20,
			border: bor2px,
			textAlign:'center', 
			paddingRight: 5,
		}}>
			<tr style={{ border: bor2px, fontWeight: 'bold', borderBottom: bor2px, }}>
				<th colSpan={5}>Item/Cargo Price<br/>Reference Chart</th>
			</tr>
			<tr style={{ border: bor2px, fontWeight: 'bold', }}>
				<td style={{ border: bor2px, }} >Item</td>
				<td style={{ border: bor2px, }} >Unit Price</td>
				<td style={{ border: bor2px, }} >Car Type</td>
				<td style={{ border: bor2px, }} >Capacity</td>
				<td style={{ border: bor2px, }} >Price per Carload</td>
			</tr>
			<tr style={{ border: bor1px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={2}>Logs</td>
				<td style={{ border: bor1px, }} rowSpan={2}>10</td>
				<td style={{ border: bor1px, }} >Tier 1 Flatcar</td>
				<td style={{ border: bor1px, }} >6</td>
				<td style={{ border: bor1px, }} >60</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor1px, }} >Skeleton Car</td>
				<td style={{ border: bor1px, }} >5</td>
				<td style={{ border: bor1px, }} >50</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} >Cordwood</td>
				<td style={{ border: bor1px, }} >10</td>
				<td style={{ border: bor1px, }} >Tier 3 Bulkhead Flatcar</td>
				<td style={{ border: bor1px, }} >8</td>
				<td style={{ border: bor1px, }} >80</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} >Lumber</td>
				<td style={{ border: bor1px, }} >12</td>
				<td style={{ border: bor1px, }} >Tier 2 Stake Flatcar</td>
				<td style={{ border: bor1px, }} >6</td>
				<td style={{ border: bor1px, }} >72</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} >Beams</td>
				<td style={{ border: bor1px, }} >24</td>
				<td style={{ border: bor1px, }} >Tier 2 Stake Flatcar</td>
				<td style={{ border: bor1px, }} >3</td>
				<td style={{ border: bor1px, }} >72</td>
			</tr>
			<tr style={{ border: bor1px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={2}>Iron Ore</td>
				<td style={{ border: bor1px, }} rowSpan={2}>20</td>
				<td style={{ border: bor1px, }} >Hopper</td>
				<td style={{ border: bor1px, }} >10</td>
				<td style={{ border: bor1px, }} >200</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor1px, }} >EBT Hopper</td>
				<td style={{ border: bor1px, }} >8</td>
				<td style={{ border: bor1px, }} >160</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} >Rails</td>
				<td style={{ border: bor1px, }} >25</td>
				<td style={{ border: bor1px, }} >Tier 2 Stake Flatcar</td>
				<td style={{ border: bor1px, }} >10</td>
				<td style={{ border: bor1px, }} >250</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} >Raw Iron</td>
				<td style={{ border: bor1px, }} >25</td>
				<td style={{ border: bor1px, }} >Tier 2 Stake Flatcar</td>
				<td style={{ border: bor1px, }} >3</td>
				<td style={{ border: bor1px, }} >75</td>
			</tr>
			<tr style={{ border: bor1px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={2}>Coal</td>
				<td style={{ border: bor1px, }} rowSpan={2}>15</td>
				<td style={{ border: bor1px, }} >Hopper</td>
				<td style={{ border: bor1px, }} rowSpan={2}>10</td>
				<td style={{ border: bor1px, }} rowSpan={2}>150</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor1px, }} >EBT Hopper</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} >Steel Pipes</td>
				<td style={{ border: bor1px, }} >40</td>
				<td style={{ border: bor1px, }} >Tier 1 Flatcar</td>
				<td style={{ border: bor1px, }} >9</td>
				<td style={{ border: bor1px, }} >360</td>
			</tr>
			<tr style={{ border: bor1px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={2}>Tools</td>
				<td style={{ border: bor1px, }} rowSpan={2}>30</td>
				<td style={{ border: bor1px, }} >Boxcar</td>
				<td style={{ border: bor1px, }} rowSpan={2}>32</td>
				<td style={{ border: bor1px, }} rowSpan={2}>960</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor1px, }} >Stock car</td>
			</tr>
			<tr style={{ border: bor1px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} rowSpan={2}>Crude Oil</td>
				<td style={{ border: bor1px, }} rowSpan={2}>25</td>
				<td style={{ border: bor1px, }} >Tanker</td>
				<td style={{ border: bor1px, }} >12</td>
				<td style={{ border: bor1px, }} >300</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor1px, }} >Coffin Tank Car</td>
				<td style={{ border: bor1px, }} >8</td>
				<td style={{ border: bor1px, }} >200</td>
			</tr>
			<tr style={{ border: bor1px, borderBottom: bor2px, }}>
				<td style={{ border: bor2px, fontWeight: 'bold', }} >Oil Barrel</td>
				<td style={{ border: bor1px, }} >40</td>
				<td style={{ border: bor1px, }} >Tier 3 Bulkhead Flatcar</td>
				<td style={{ border: bor1px, }} >46</td>
				<td style={{ border: bor1px, }} >1840</td>
			</tr>			
		</table>

	</div> // main/parent div
	
}