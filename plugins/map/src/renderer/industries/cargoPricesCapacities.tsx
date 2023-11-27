import { Avatar, Button, List, Table } from 'antd';
import { ControlOutlined, AimOutlined, InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

export function CargoPricesCapacities( ) {

	// Array of Products & Prices
	let productDetailsArray = [
		{
			name: "Logs",
			price: 10,
		},
		{
			name: "Cordwood",
			price: 10,
		},
		{
			name: "Lumber",
			price: 12,
		},
		{
			name: "Beams",
			price: 24,
		},
		{
			name: "Iron Ore",
			price: 20,
		},
		{
			name: "Rails",
			price: 25,
		},
		{
			name: "Raw Iron",
			price: 25,
		},
		{
			name: "Coal",
			price: 15,
		},
		{
			name: "Steel Pipes",
			price: 40,
		},
		{
			name: "Tools",
			price: 30,
		},
		{
			name: "Crude Oil",
			price: 25,
		},
		{
			name: "Oil Barrel",
			price: 40,
		},
		{
			name: "Seed Pallet",
			price: 5,
		},
		{
			name: "Straw Bale",
			price: 5,
		},
		{
			name: "Grain",
			price: 10,
		},
	];
	
	
	// Array of Rolling Stock & Product Capacity Details
	let jsonCargoData = [
		{
			key: "Logs",
			name: "Logs",
			price: getProductPrice("Logs"),
			rollingStock: [
				{
					product: "Logs",
					key: "Logs" + "Plantation Logging Car",
					carType: "Plantation Logging Car",
					carCapacity: 5,
				},
				{
					product: "Logs",
					key: "Logs" + "Skeleton Car",
					carType: "Skeleton Car",
					carCapacity: 5,
				},
				{
					product: "Logs",
					key: "Logs" + "Tier 1 Flatcar",
					carType: "Tier 1 Flatcar",
					carCapacity: 6,
				},
			],
		},
		{
			key: "Cordwood",
			name: "Cordwood",
			price: getProductPrice("Cordwood"),
			rollingStock: [
				{
					product: "Cordwood",
					key: "Cordwood" + "Plantation Bulkhead Flatcar",
					carType: "Plantation Bulkhead Flatcar",
					carCapacity: 2,
				},
				{
					product: "Cordwood",
					key: "Cordwood" + "Tier 3 Bulkhead Flatcar",
					carType: "Tier 3 Bulkhead Flatcar",
					carCapacity: 8,
				},
			],
		},
		{
			key: "Lumber",
			name: "Lumber",
			price: getProductPrice("Lumber"),
			rollingStock: [
				{
					product: "Lumber",
					key: "Lumber" + "Plantation Stake Flatcar",
					carType: "Plantation Stake Flatcar",
					carCapacity: 3,
				},
				{
					product: "Lumber",
					key: "Lumber" + "Tier 2 Stake Flatcar",
					carType: "Tier 2 Stake Flatcar",
					carCapacity: 6,
				},
			],
		},
		{
			key: "Beams",
			name: "Beams",
			price: getProductPrice("Beams"),
			rollingStock: [
				{
					product: "Beams",
					key: "Beams" + "Plantation Stake Flatcar",
					carType: "Plantation Stake Flatcar",
					carCapacity: 3,
				},
				{
					product: "Beams",
					key: "Beams" + "Tier 2 Stake Flatcar",
					carType: "Tier 2 Stake Flatcar",
					carCapacity: 3,
				},
			],
		},
		{
			key: "Iron Ore",
			name: "Iron Ore",
			price: getProductPrice("Iron Ore"),
			rollingStock: [
				{
					product: "Iron Ore",
					key: "Iron Ore" + "Plantation Lowside Gondola",
					carType: "Plantation Lowside Gondola",
					carCapacity: 2,
				},
				{
					product: "Iron Ore",
					key: "Iron Ore" + "Plantation Medium Gondola",
					carType: "Plantation Medium Gondola",
					carCapacity: 3,
				},
				{
					product: "Iron Ore",
					key: "Iron Ore" + "Plantation Highside Gondola",
					carType: "Plantation Highside Gondola",
					carCapacity: 6,
				},
				{
					product: "Iron Ore",
					key: "Iron Ore" + "EBT Hopper",
					carType: "EBT Hopper",
					carCapacity: 8,
				},
				{
					product: "Iron Ore",
					key: "Iron Ore" + "Hopper",
					carType: "Hopper",
					carCapacity: 10,
				},
			],
		},
		{
			key: "Rails",
			name: "Rails",
			price: getProductPrice("Rails"),
			rollingStock: [
				{
					product: "Rails",
					key: "Rails" + "Plantation Stake Flatcar",
					carType: "Plantation Stake Flatcar",
					carCapacity: 4,
				},
				{
					product: "Rails",
					key: "Rails" + "Tier 2 Stake Flatcar",
					carType: "Tier 2 Stake Flatcar",
					carCapacity: 10,
				},
			],
		},
		{
			key: "Raw Iron",
			name: "Raw Iron",
			price: getProductPrice("Raw Iron"),
			rollingStock: [
				{
					product: "Raw Iron",
					key: "Raw Iron" + "Plantation Stake Flatcar",
					carType: "Plantation Stake Flatcar",
					carCapacity: 3,
				},
				{
					product: "Raw Iron",
					key: "Raw Iron" + "Tier 2 Stake Flatcar",
					carType: "Tier 2 Stake Flatcar",
					carCapacity: 3,
				},
			],
		},
		{
			key: "Coal",
			name: "Coal",
			price: getProductPrice("Coal"),
			rollingStock: [
				{
					product: "Coal",
					key: "Coal" + "Plantation Lowside Gondola",
					carType: "Plantation Lowside Gondola",
					carCapacity: 2,
				},
				{
					product: "Coal",
					key: "Coal" + "Plantation Medium Gondola",
					carType: "Plantation Medium Gondola",
					carCapacity: 3,
				},
				{
					product: "Coal",
					key: "Coal" + "Plantation Highside Gondola",
					carType: "Plantation Highside Gondola",
					carCapacity: 6,
				},
				{
					product: "Coal",
					key: "Coal" + "EBT Hopper",
					carType: "EBT Hopper",
					carCapacity: 10,
				},
				{
					product: "Coal",
					key: "Coal" + "Hopper",
					carType: "Hopper",
					carCapacity: 10,
				},
			],
		},
		{
			key: "Steel Pipes",
			name: "Steel Pipes",
			price: getProductPrice("Steel Pipes"),
			rollingStock: [
				{
					product: "Steel Pipes",
					key: "Steel Pipes" + "Plantation Stake Flatcar",
					carType: "Plantation Stake Flatcar",
					carCapacity: 7,
				},
				{
					product: "Steel Pipes",
					key: "Steel Pipes" + "Tier 2 Stake Flatcar",
					carType: "Tier 2 Stake Flatcar",
					carCapacity: 9,
				},
			],
		},
		{
			key: "Tools",
			name: "Tools",
			price: getProductPrice("Tools"),
			rollingStock: [
				{
					product: "Tools",
					key: "Tools" + "Plantation Flatcar",
					carType: "Plantation Flatcar",
					carCapacity: 6,
				},
				{
					product: "Tools",
					key: "Tools" + "Plantation Box Car",
					carType: "Plantation Box Car",
					carCapacity: 12,
				},
				{
					product: "Tools",
					key: "Tools" + "Boxcar",
					carType: "Boxcar",
					carCapacity: 32,
				},
				{
					product: "Tools",
					key: "Tools" + "Stock car",
					carType: "Stock car",
					carCapacity: 32,
				},
			],
		},
		{
			key: "Crude Oil",
			name: "Crude Oil",
			price: getProductPrice("Crude Oil"),
			rollingStock: [
				{
					product: "Crude Oil",
					key: "Crude Oil" + "Waialua Tank Car",
					carType: "Waialua Tank Car",
					carCapacity: 2,
				},
				{
					product: "Crude Oil",
					key: "Crude Oil" + "Coffin Tank Car",
					carType: "Coffin Tank Car",
					carCapacity: 8,
				},
				{
					product: "Crude Oil",
					key: "Crude Oil" + "Tanker",
					carType: "Tanker",
					carCapacity: 12,
				},
			],
		},
		{
			key: "Oil Barrel",
			name: "Oil Barrel",
			price: getProductPrice("Oil Barrel"),
			rollingStock: [
				{
					product: "Oil Barrel",
					key: "Oil Barrel" + "Plantation Lowside Gondola",
					carType: "Plantation Lowside Gondola",
					carCapacity: 15,
				},
				{
					product: "Oil Barrel",
					key: "Oil Barrel" + "Plantation Medium Gondola",
					carType: "Plantation Medium Gondola",
					carCapacity: 15,
				},
				{
					product: "Oil Barrel",
					key: "Oil Barrel" + "Plantation Highside Gondola",
					carType: "Plantation Highside Gondola",
					carCapacity: 15,
				},
				{
					product: "Oil Barrel",
					key: "Oil Barrel" + "Plantation Box Car",
					carType: "Plantation Box Car",
					carCapacity: 15,
				},
				{
					product: "Oil Barrel",
					key: "Oil Barrel" + "Tier 3 Bulkhead Flatcar<",
					carType: "Tier 3 Bulkhead Flatcar<",
					carCapacity: 46,
				},
			],
		},
		{
			key: "Seed Pallet",
			name: "Seed Pallet",
			price: getProductPrice("Seed Pallet"),
			rollingStock: [				
				{
					product: "Seed Pallet",
					key: "Seed Pallet" + "Plantation Flatcar",
					carType: "Plantation Flatcar",
					carCapacity: 6,
				},
				{
					product: "Seed Pallet",
					key: "Seed Pallet" + "Plantation Box Car",
					carType: "Plantation Box Car",
					carCapacity: 3,
				},
				{
					product: "Seed Pallet",
					key: "Seed Pallet" + "Boxcar",
					carType: "Boxcar",
					carCapacity: 14,
				},
			],
		},
		{
			key: "Straw Bale",
			name: "Straw Bale",
			price: getProductPrice("Straw Bale"),
			rollingStock: [
				{
					product: "Straw Bale",
					key: "Straw Bale" + "Plantation Bulkhead Flatcar",
					carType: "Plantation Bulkhead Flatcar",
					carCapacity: 4,
				},
				{
					product: "Straw Bale",
					key: "Straw Bale" + "Tier 3 Bulkhead Flatcar",
					carType: "Tier 3 Bulkhead Flatcar",
					carCapacity: 15,
				},
			],
		},
		{
			key: "Grain",
			name: "Grain",
			price: getProductPrice("Grain"),
			rollingStock: [
				{
					product: "Grain",
					key: "Grain" + "Boxcar",
					carType: "Boxcar",
					carCapacity: 12,
				},
			],
		},
		
	];
	
	
	// Define the columns for the table.
	const mainColumns = [
		{ title: 'Item', dataIndex: 'name', key: 'item' },
		{ title: 'Unit Price', dataIndex: 'price', key: 'price', },
		{ title: 'Car Type', dataIndex: 'carType', key: 'carType' },
		{ title: 'Capacity', dataIndex: 'carCapacity', key: 'carCapacity' },
		{ title: 'Price per Carload', key: 'pricePerCarload',
			render: (value:any, row:any, index:any) => <div> {generateRowPrice(row)} </div>
		},
	];
	
	
	// Return the "div" that defines this page.
	return <div>
		<Table
			className="components-table-demo-nested"
			columns={mainColumns}
			childrenColumnName="rollingStock"
			dataSource={jsonCargoData}
			tableLayout='fixed'
			expandRowByClick
			pagination={false}
			bordered
			style={{
				width: '100%',
				marginBottom: 10,
				paddingRight: 10,
			}}
			onRow={(record, index) => ({
				style: {
					fontWeight: (record.name == null) ? 'normal' : 'bold',
				}
			})}
		/>
	</div> // main/parent div
	
	
	// Supporting functions
	
	function getProductPrice(productString:string){
		// Get the Price of the given productString from the productDetailsArray.
		return productDetailsArray.filter(item => item.name === productString)[0].price;
	}
	
	function generateRowPrice(row:any){
		// Generate the String value to be displayed as the pricePerCarload value.
		let result = '';
		if (row.product == null){
			result = '';
		}
		else {
			result = '' + (getProductPrice(row.product) * row.carCapacity);
		}
		return result;
	}
	
}