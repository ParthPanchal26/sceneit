import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search sm:mt-20 sticky-search">
        <div>
            <img src="search.svg" alt="Search_Icon" />
            <input 
            type="text"
            placeholder='Search through thousands of movies...' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
    </div>
  )
}

export default Search