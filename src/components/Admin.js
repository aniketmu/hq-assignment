import React, { useState, useEffect } from 'react';


function Admin() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    // Fetch data from the API
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setFilteredData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = () => {
    const filtered = data.filter(row =>
      Object.values(row).some(value =>
        value.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleSelectAllRows = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...filteredData.map(row => row.id)]);
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteSelected = () => {
    const updatedData = data.filter(row => !selectedRows.includes(row.id));
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRows([]);
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === filteredData.length}
                onChange={handleSelectAllRows}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.slice((currentPage - 1) * 10, currentPage * 10).map(row => (
            <tr key={row.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => {
                    setSelectedRows((prev) => {
                      if (prev.includes(row.id)) {
                        return prev.filter((id) => id !== row.id);
                      } else {
                        return [...prev, row.id];
                      }
                    });
                  }}
                />
              </td>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.role}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePagination(1)}>First Page</button>
        <button
          onClick={() => handlePagination(currentPage > 1 ? currentPage - 1 : 1)}
        >
          Previous Page
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() =>
            handlePagination(
              currentPage < Math.ceil(filteredData.length / 10)
                ? currentPage + 1
                : Math.ceil(filteredData.length / 10)
            )
          }
        >
          Next Page
        </button>
        <button onClick={() => handlePagination(Math.ceil(filteredData.length / 10))}>
          Last Page
        </button>
      </div>
      <button onClick={handleDeleteSelected}>Delete Selected</button>
    </div>
  );
}

export default Admin;
