import React from 'react'
import './Search.css'
import search from '../search.png'

const Search = () => {
  return (
    <div className="input-icons">
    <i className="fa fa-user icon"><img src={search} style={{height: "10px", width: "10px"}}/></i>
    <input className="input-field"
           type="text"/>
    </div>
  )
}

export default Search