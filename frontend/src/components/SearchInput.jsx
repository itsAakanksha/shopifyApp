import React from 'react';
import SearchIcon from './SearchIcon';

const SearchInput = ({ searchQuery, setSearchQuery }) => (
  <div className="relative flex-1">
    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
    <input
      type="text"
      placeholder="Search products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-10 pr-4 py-2 rounded-md bg-white dark:bg-gray-800 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
    />
  </div>
);

export default SearchInput;
