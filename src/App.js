import './App.css';
import { useState, useEffect } from 'react'
import trash from "./delete.png";
import edit from "./edit.png";
import search from "./search.png";
import save from "./save.png";


const App = () => {
  const [checkedRows, setCheckedRows] = useState([]);
  const [userData, setUserData] = useState([]);
  const [localData, setLocalData] = useState(userData);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [clearCount, setClearCount] = useState(1)
  const [selectChecked, setSelectChecked] = useState(false);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = localData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(localData.length / itemsPerPage);

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const selectAllRows = () => {
    if (checkedRows.length === 0) {
      setCheckedRows([...currentItems.map((user) => user.id)]);
    } else {
      setCheckedRows([]);
    }
    setSelectChecked((prev) => !prev);
  };

  const searchUser = () => {
    if (searchTerm.trim() === "") {
      setLocalData(userData);
      setClearCount((prev) => prev + 1)
      setCurrentPage(1)
    } else {
      
      setClearCount((prev) => prev + 1)
      console.log(searchTerm)
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filteredUsers = userData.filter((user) =>
        Object.values(user).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerSearchTerm)
        )
      );
      setLocalData(filteredUsers);
    }
  };

  const handleSearchInput = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.trim() === "") {
        setLocalData(userData);  // Reset to original data when search term is empty
        setCurrentPage(1);  // Reset the current page to the first page
        setSearchTerm("");
      } else {
        searchUser();
      }
    } else {
      setSearchTerm(e.target.value);
    }
  };
  

  const deleteRow = (rowId) => {
    if (checkedRows.includes(rowId)) {
      const updated = localData.filter((user) => user.id !== rowId);
      const updatedMem = userData.filter((user) => user.id !== rowId);
      setUserData((prev) => updatedMem);
      setLocalData((prev) => updated);
  
      // Adjust current page only if the current page becomes empty
      if (currentItems.length === 1) {
        const newPage = Math.max(currentPage - 1, 1);
        setCurrentPage(newPage);
      }
  
      setCheckedRows((prev) => [...prev.filter((row_id) => row_id !== rowId)]);
    } else {
      return;
    }
  };
  
  const deleteMultipleRows = () => {
    if (checkedRows.length === 0) {
      return;
    } else {
      const updated = localData.filter(
        (user) => !checkedRows.includes(user.id)
      );
      const updatedMem = userData.filter(
        (user) => !checkedRows.includes(user.id)
      );
      setUserData(updatedMem);
      setLocalData(updated);
  
      // Adjust current page only if the current page becomes empty
      if (currentItems.length === checkedRows.length) {
        const newPage = Math.max(currentPage - 1, 1);
        setCurrentPage(newPage);
      }
  
      setCheckedRows([]);
      setSelectChecked(false);
    }
  };
  

  const startEditing = (rowId) => {
    if (checkedRows.includes(rowId)) {
      setEditingRow(rowId);
    } else {
      return;
    }
  };

  const finishEditing = (rowId) => {
    setEditingRow(null);
    setCheckedRows((prev) => prev.filter((row_id) => row_id !== rowId));
  };

  const handlePageChange = (page) => {
    setCheckedRows([]);
    if (page <= totalPages && page >= 1) {
      setCurrentPage(page);
    }
    setSelectChecked(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [clearCount]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        const data = await response.json();
        setUserData(data);
        setLocalData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="table-container">
        <div className="input-container">
          <input placeholder="Search" onKeyUp={handleSearchInput} />
          <img
            src={search}
            onClick={searchUser}
            alt="search"
            className="search-icon"
          />
          <img src={trash} onClick={deleteMultipleRows} alt="delete" />
        </div>
        <table className="content-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectChecked}
                  onChange={selectAllRows}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          {userData.length !== 0 ? <tbody>
            {currentItems.map((user) => (
              <tr
                key={user.id}
                className={checkedRows.includes(user.id) ? "highlighted" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={checkedRows.includes(user.id)}
                    onChange={() => {
                      if (checkedRows.includes(user.id)) {
                        setCheckedRows((prev) => [
                          ...prev.filter((rowId) => rowId !== user.id),
                        ]);
                      } else {
                        setCheckedRows((prev) => [...prev, user.id]);
                      }
                    }}
                  />
                </td>
                <td>
                  {editingRow === user.id ? (
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => {
                        setLocalData((prevData) =>
                          prevData.map((u) =>
                            u.id === user.id
                              ? { ...u, name: e.target.value }
                              : u
                          )
                        );
                        setUserData((prevData) =>
                        prevData.map((u) =>
                          u.id === user.id
                            ? { ...u, name: e.target.value }
                            : u
                        )
                      );
                      }}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingRow === user.id ? (
                    <input
                      type="text"
                      value={user.email}
                      onChange={(e) => {
                        setLocalData((prevData) =>
                          prevData.map((u) =>
                            u.id === user.id
                              ? { ...u, email: e.target.value }
                              : u
                          )
                        );
                        setUserData((prevData) =>
                        prevData.map((u) =>
                          u.id === user.id
                            ? { ...u, email: e.target.value }
                            : u
                        )
                      );
                      }}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingRow === user.id ? (
                    <select
                      value={user.role}
                      onChange={(e) => {
                        setLocalData((prevData) =>
                          prevData.map((u) =>
                            u.id === user.id
                              ? { ...u, role: e.target.value }
                              : u
                          )
                        );
                        setUserData((prevData) =>
                        prevData.map((u) =>
                          u.id === user.id
                            ? { ...u, role: e.target.value }
                            : u
                        )
                      );
                      }}
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  <button
                    type="submit"
                    disabled={checkedRows.length > 1 || editingRow !== null}
                    onClick={() => startEditing(user.id)}
                    className="edit"
                  >
                    <img
                      src={edit}
                      alt="edit"
                      border="0"
                      style={{ height: "15px" }}
                    />
                  </button>
                  <button
                    disabled={checkedRows.length > 1}
                    onClick={() => deleteRow(user.id)}
                    className="delete"
                  >
                    <img
                      src={trash}
                      alt="delete"
                      border="0"
                      style={{ height: "15px" }}
                    />
                  </button>
                  {editingRow === user.id && (
                    <button
                      onClick={() => finishEditing(user.id)}
                      className="save"
                    >
                      <img
                        src={save}
                        alt="save"
                        border="0"
                        style={{ height: "15px" }}
                      />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody> : <div className="spinner-container">
      <div className="loading-spinner">
      </div>
    </div> }
          
        </table>
        <div className="pagination-container">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="first-page"
          >
            First Page
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="previous-page"
          >
            Previous Page
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              disabled={pageNumber === currentPage}
              className={pageNumber.toString()}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentItems.length < itemsPerPage || currentItems.length === 0 ||currentPage == totalPages
            }
            className="next-page"
          >
            Next Page
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || (currentPage === totalPages && (currentItems.length - itemsPerPage < 10)) || currentItems.length === 0}
            className="last-page"
          >
            Last Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
