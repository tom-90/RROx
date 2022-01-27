import React, { useState } from "react";
import { Input, Button } from 'antd';

export function SearchPopup({} : {

}){
    const [ inputValue, setInputValue] = useState('');
    let searchItems : {
        title: string,
        desc: string
    }[] = [];

    searchItems.push({
        title: 'test1',
        desc: 'a1'
    });
    searchItems.push({
        title: 'test2',
        desc: 'a2'
    });
    searchItems.push({
        title: 'test3',
        desc: 'b1'
    });

    return (<div className="search-div">
        <div className="search-button-div">
            <button>Search</button>
        </div>
        <div className="search-popup-div">
            <div className="search-popup">
                <Input
                    placeholder="Search...."
                    onChange={(e) => setInputValue(e.target.value) }
                />
                <div className="search-results">
                    {searchItems.filter((item) => {
                        if (inputValue.length !== 0){
                            return (item.title.includes(inputValue) || item.desc.includes(inputValue));
                        }else{
                            return item;
                        }
                    }).map(({title, desc}) => <div className="search-result">
                        <div className="text">
                            <span className="result-title">{title}</span>
                            <span className="result-desc">{desc}</span>
                        </div>
                        <div className="button">
                            <Button>Go To</Button>
                        </div>
                    </div>)}
                </div>
                <div className="search-close">
                    x
                </div>
            </div>
        </div>
    </div>);
}