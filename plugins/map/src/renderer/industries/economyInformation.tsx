import { Avatar, Button, List } from 'antd';
import { ControlOutlined, AimOutlined, InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

export function EconomyInformation( ) {

	return <div>
		<table style={{
			width: '100%',
			marginBottom: 20,
			color: 'black',
			border:'2px solid black',
			textAlign:'center', 
			paddingRight: 5,
		}}>
			<tr style={{ border:'1px solid black', fontWeight: 'bold', borderBottom:'2px solid black', }}>
				<th style={{ border:'1px solid black', }} colSpan={11}>Industry Inputs and Outputs<br/>Reference Chart</th>
			</tr>
			<tr style={{ border:'2px solid black', fontWeight: 'bold', }}>
				<td style={{ border:'1px solid black', }} rowSpan={2} >Location</td>
				<td style={{ border:'1px solid black', }} colSpan={5} >Input</td>
				<td style={{ border:'1px solid black', }} colSpan={5} >Output</td>
			</tr>
			<tr style={{ border:'2px solid black', fontWeight: 'bold', }}>
				<td style={{ border:'1px solid black', }} >Type</td>
				<td style={{ border:'1px solid black', }} >Amount</td>
				<td style={{ border:'1px solid black', }} >Easy</td>
				<td style={{ border:'1px solid black', }} >Med</td>
				<td style={{ border:'1px solid black', }} >Hard</td>
				<td style={{ border:'1px solid black', }} >Type</td>
				<td style={{ border:'1px solid black', }} >Amount</td>
				<td style={{ border:'1px solid black', }} >Easy</td>
				<td style={{ border:'1px solid black', }} >Med</td>
				<td style={{ border:'1px solid black', }} >Hard</td>
			</tr>
			<tr style={{
				border:'1px solid black',
			}}>
				<td style={{ border:'1px solid black', fontWeight: 'bold', }} rowSpan={2}>Logging Camp</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>-</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>-</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>-</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>-</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>-</td>
				<td style={{ border:'1px solid black', }} >Logs</td>
				<td style={{ border:'1px solid black', }} >200</td>
				<td style={{ border:'1px solid black', }} >-</td>
				<td style={{ border:'1px solid black', }} >-</td>
				<td style={{ border:'1px solid black', }} >-</td>
			</tr>
			<tr style={{
				border:'1px solid black',
				borderBottom:'2px solid black',
			}}>
				<td style={{ border:'1px solid black', }} >Cordwood</td>
				<td style={{ border:'1px solid black', }} >64</td>
				<td style={{ border:'1px solid black', }} >-</td>
				<td style={{ border:'1px solid black', }} >-</td>
				<td style={{ border:'1px solid black', }} >-</td>
			</tr>
			<tr style={{
				border:'1px solid black',
			}}>
				<td style={{ border:'1px solid black', fontWeight: 'bold', }} rowSpan={2}>Sawmill</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>Logs</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>100</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>1</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>1</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>2</td>
				<td style={{ border:'1px solid black', }} >Lumber</td>
				<td style={{ border:'1px solid black', }} >100</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >1</td>
			</tr>
			<tr style={{
				border:'1px solid black',
				borderBottom:'2px solid black',
			}}>
				<td style={{ border:'1px solid black', }} >Beams</td>
				<td style={{ border:'1px solid black', }} >100</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >1</td>
			</tr>
			<tr style={{
				border:'1px solid black',
			}}>
				<td style={{ border:'1px solid black', fontWeight: 'bold', }} rowSpan={2}>Smelter</td>
				<td style={{ border:'1px solid black', }} >Iron Ore</td>
				<td style={{ border:'1px solid black', }} >1000</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >4</td>
				<td style={{ border:'1px solid black', }} >Rails</td>
				<td style={{ border:'1px solid black', }} >100</td>
				<td style={{ border:'1px solid black', }} >4</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >2</td>
			</tr>
			<tr style={{
				border:'1px solid black',
				borderBottom:'2px solid black',
			}}>
				<td style={{ border:'1px solid black', }} >Cordwood</td>
				<td style={{ border:'1px solid black', }} >100</td>
				<td style={{ border:'1px solid black', }} >4</td>
				<td style={{ border:'1px solid black', }} >4</td>
				<td style={{ border:'1px solid black', }} >8</td>
				<td style={{ border:'1px solid black', }} >Raw Iron</td>
				<td style={{ border:'1px solid black', }} >100</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >1</td>
			</tr>		
			<tr style={{
				border:'1px solid black',
			}}>
				<td style={{ border:'1px solid black', fontWeight: 'bold', }} rowSpan={2}>Iron Ore Mine</td>
				<td style={{ border:'1px solid black', }} >Lumber</td>
				<td style={{ border:'1px solid black', }} >50</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >4</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>Iron Ore</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>290</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>10</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>5</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>5</td>
			</tr>
			<tr style={{
				border:'1px solid black',
				borderBottom:'2px solid black',
			}}>
				<td style={{ border:'1px solid black', }} >Beams</td>
				<td style={{ border:'1px solid black', }} >30</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >2</td>
			</tr>
			<tr style={{
				border:'1px solid black',
			}}>
				<td style={{ border:'1px solid black', fontWeight: 'bold', }} rowSpan={2}>Coal Mine</td>
				<td style={{ border:'1px solid black', }} >Beams</td>
				<td style={{ border:'1px solid black', }} >30</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >4</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>Coal</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>750</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>20</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>10</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>10</td>
			</tr>
			<tr style={{
				border:'1px solid black',
				borderBottom:'2px solid black',
			}}>
				<td style={{ border:'1px solid black', }} >Rails</td>
				<td style={{ border:'1px solid black', }} >60</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >2</td>
			</tr>
			<tr style={{
				border:'1px solid black',
			}}>
				<td style={{ border:'1px solid black', fontWeight: 'bold', }} rowSpan={3}>Ironworks</td>
				<td style={{ border:'1px solid black', }} >Coal</td>
				<td style={{ border:'1px solid black', }} >1000</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >Steel Pipes</td>
				<td style={{ border:'1px solid black', }} >100</td>
				<td style={{ border:'1px solid black', }} >8</td>
				<td style={{ border:'1px solid black', }} >4</td>
				<td style={{ border:'1px solid black', }} >4</td>
			</tr>	
			<tr style={{
				border:'1px solid black',
			}}>	
				<td style={{ border:'1px solid black', }} >Lumber</td>
				<td style={{ border:'1px solid black', }} >50</td>
				<td style={{ border:'1px solid black', }} >3</td>
				<td style={{ border:'1px solid black', }} >3</td>
				<td style={{ border:'1px solid black', }} >6</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>Tools</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>100</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>32</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>16</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>16</td>
			</tr>
			<tr style={{
				border:'1px solid black',
				borderBottom:'2px solid black',
			}}>
				<td style={{ border:'1px solid black', }} >Raw Iron</td>
				<td style={{ border:'1px solid black', }} >100</td>
				<td style={{ border:'1px solid black', }} >4</td>
				<td style={{ border:'1px solid black', }} >4</td>
				<td style={{ border:'1px solid black', }} >8</td>
			</tr>
			<tr style={{
				border:'1px solid black',
			}}>
				<td style={{ border:'1px solid black', fontWeight: 'bold', }} rowSpan={3}>Oil Field</td>
				<td style={{ border:'1px solid black', }} >Steel Pipes</td>
				<td style={{ border:'1px solid black', }} >30</td>
				<td style={{ border:'1px solid black', }} >3</td>
				<td style={{ border:'1px solid black', }} >3</td>
				<td style={{ border:'1px solid black', }} >6</td>
				<td style={{ border:'1px solid black', }} rowSpan={3}>Crude Oil</td>
				<td style={{ border:'1px solid black', }} rowSpan={3}>1000</td>
				<td style={{ border:'1px solid black', }} rowSpan={3}>48</td>
				<td style={{ border:'1px solid black', }} rowSpan={3}>24</td>
				<td style={{ border:'1px solid black', }} rowSpan={3}>24</td>
			</tr>	
			<tr style={{
				border:'1px solid black',
			}}>	
				<td style={{ border:'1px solid black', }} >Beams</td>
				<td style={{ border:'1px solid black', }} >30</td>
				<td style={{ border:'1px solid black', }} >3</td>
				<td style={{ border:'1px solid black', }} >3</td>
				<td style={{ border:'1px solid black', }} >6</td>
			</tr>
			<tr style={{
				border:'1px solid black',
				borderBottom:'2px solid black',
			}}>
				<td style={{ border:'1px solid black', }} >Tools</td>
				<td style={{ border:'1px solid black', }} >100</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >2</td>
			</tr>
			<tr style={{
				border:'1px solid black',
			}}>
				<td style={{ border:'1px solid black', fontWeight: 'bold', }} rowSpan={3}>Refinery</td>
				<td style={{ border:'1px solid black', }} >Lumber</td>
				<td style={{ border:'1px solid black', }} >50</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} >4</td>
				<td style={{ border:'1px solid black', }} >Oil Barrel</td>
				<td style={{ border:'1px solid black', }} >100</td>
				<td style={{ border:'1px solid black', }} >10</td>
				<td style={{ border:'1px solid black', }} >5</td>
				<td style={{ border:'1px solid black', }} >5</td>
			</tr>
			<tr style={{
				border:'1px solid black',
			}}>	
				<td style={{ border:'1px solid black', }} >Steel Pipes</td>
				<td style={{ border:'1px solid black', }} >100</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >1</td>
				<td style={{ border:'1px solid black', }} >2</td>
				<td style={{ border:'1px solid black', }} rowSpan={3}>Oil Barrel</td>
				<td style={{ border:'1px solid black', }} rowSpan={3}>100</td>
				<td style={{ border:'1px solid black', }} rowSpan={3}>10</td>
				<td style={{ border:'1px solid black', }} rowSpan={3}>5</td>
				<td style={{ border:'1px solid black', }} rowSpan={3}>5</td>
			</tr>
			<tr style={{
				border:'1px solid black',
				borderBottom:'2px solid black',
			}}>
				<td style={{ border:'1px solid black', }} >Crude Oil</td>
				<td style={{ border:'1px solid black', }} >1000</td>
				<td style={{ border:'1px solid black', }} >12</td>
				<td style={{ border:'1px solid black', }} >12</td>
				<td style={{ border:'1px solid black', }} >24</td>
			</tr>		
		</table>

		<hr/>
		<br/>
		
		<table style={{
			width: '100%',
			marginBottom: 20,
			color: 'black',
			border:'2px solid black',
			textAlign:'center', 
			paddingRight: 5,
		}}>
			<tr style={{ border:'2px solid black', fontWeight: 'bold', borderBottom:'2px solid black', }}>
				<th colSpan={5}>Item/Cargo Price<br/>Reference Chart</th>
			</tr>
			<tr style={{ border:'2px solid black', fontWeight: 'bold', }}>
				<td style={{ border:'2px solid black', }} >Item</td>
				<td style={{ border:'1px solid black', }} >Unit Price</td>
				<td style={{ border:'1px solid black', }} >Car Type</td>
				<td style={{ border:'1px solid black', }} >Capacity</td>
				<td style={{ border:'1px solid black', }} >Price per Carload</td>
			</tr>
			<tr style={{ border:'1px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} rowSpan={2}>Logs</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>10</td>
				<td style={{ border:'1px solid black', }} >Tier 1 Flatcar</td>
				<td style={{ border:'1px solid black', }} >6</td>
				<td style={{ border:'1px solid black', }} >60</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'1px solid black', }} >Skeleton Car</td>
				<td style={{ border:'1px solid black', }} >5</td>
				<td style={{ border:'1px solid black', }} >50</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} >Cordwood</td>
				<td style={{ border:'1px solid black', }} >10</td>
				<td style={{ border:'1px solid black', }} >Tier 3 Bulkhead Flatcar</td>
				<td style={{ border:'1px solid black', }} >8</td>
				<td style={{ border:'1px solid black', }} >80</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} >Lumber</td>
				<td style={{ border:'1px solid black', }} >12</td>
				<td style={{ border:'1px solid black', }} >Tier 2 Stake Flatcar</td>
				<td style={{ border:'1px solid black', }} >6</td>
				<td style={{ border:'1px solid black', }} >72</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} >Beams</td>
				<td style={{ border:'1px solid black', }} >24</td>
				<td style={{ border:'1px solid black', }} >Tier 2 Stake Flatcar</td>
				<td style={{ border:'1px solid black', }} >3</td>
				<td style={{ border:'1px solid black', }} >72</td>
			</tr>
			<tr style={{ border:'1px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} rowSpan={2}>Iron Ore</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>20</td>
				<td style={{ border:'1px solid black', }} >Hopper</td>
				<td style={{ border:'1px solid black', }} >10</td>
				<td style={{ border:'1px solid black', }} >200</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'1px solid black', }} >EBT Hopper</td>
				<td style={{ border:'1px solid black', }} >8</td>
				<td style={{ border:'1px solid black', }} >160</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} >Rails</td>
				<td style={{ border:'1px solid black', }} >25</td>
				<td style={{ border:'1px solid black', }} >Tier 2 Stake Flatcar</td>
				<td style={{ border:'1px solid black', }} >10</td>
				<td style={{ border:'1px solid black', }} >250</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} >Raw Iron</td>
				<td style={{ border:'1px solid black', }} >25</td>
				<td style={{ border:'1px solid black', }} >Tier 2 Stake Flatcar</td>
				<td style={{ border:'1px solid black', }} >3</td>
				<td style={{ border:'1px solid black', }} >75</td>
			</tr>
			<tr style={{ border:'1px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} rowSpan={2}>Coal</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>15</td>
				<td style={{ border:'1px solid black', }} >Hopper</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>10</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>150</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'1px solid black', }} >EBT Hopper</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} >Steel Pipes</td>
				<td style={{ border:'1px solid black', }} >40</td>
				<td style={{ border:'1px solid black', }} >Tier 1 Flatcar</td>
				<td style={{ border:'1px solid black', }} >9</td>
				<td style={{ border:'1px solid black', }} >360</td>
			</tr>
			<tr style={{ border:'1px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} rowSpan={2}>Tools</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>30</td>
				<td style={{ border:'1px solid black', }} >Boxcar</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>32</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>960</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'1px solid black', }} >Stock car</td>
			</tr>
			<tr style={{ border:'1px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} rowSpan={2}>Crude Oil</td>
				<td style={{ border:'1px solid black', }} rowSpan={2}>25</td>
				<td style={{ border:'1px solid black', }} >Tanker</td>
				<td style={{ border:'1px solid black', }} >12</td>
				<td style={{ border:'1px solid black', }} >300</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'1px solid black', }} >Coffin Tank Car</td>
				<td style={{ border:'1px solid black', }} >8</td>
				<td style={{ border:'1px solid black', }} >200</td>
			</tr>
			<tr style={{ border:'1px solid black', borderBottom:'2px solid black', }}>
				<td style={{ border:'2px solid black', fontWeight: 'bold', }} >Oil Barrel</td>
				<td style={{ border:'1px solid black', }} >40</td>
				<td style={{ border:'1px solid black', }} >Tier 3 Bulkhead Flatcar</td>
				<td style={{ border:'1px solid black', }} >46</td>
				<td style={{ border:'1px solid black', }} >1840</td>
			</tr>			
		</table>

	</div> // main/parent div
	
}