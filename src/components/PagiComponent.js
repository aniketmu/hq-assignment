// PaginationComponent.js
import React, { useState, useEffect } from 'react';

const PaginationComponent = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set the number of items per page

  useEffect(() => {
    // Fetch data from your API endpoint
    const fetchData = async () => {
      const response = await fetch(`https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`);
      const datar = await response.json()
      setData(datar);
      console.log(datar)
    };

    fetchData();
  }, [currentPage]);

  // Calculate the indexes of the first and last items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Render the list of items
  const renderItems = currentItems.map(item => (
    <div key={item.id}>{item.name}</div>
  ));

  // Handle page navigation
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      {renderItems}
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous Page
      </button>
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentItems.length < itemsPerPage}>
        Next Page
      </button>
    </div>
  );
};

export default PaginationComponent;
