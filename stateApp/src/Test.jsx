import React, { useState, useEffect } from "react";
import { GetDatas } from "./api/getRequest";
import { toast } from "react-toastify";
import { Modal, Button, Spinner } from "react-bootstrap";

const tableHeaderStyle = {
  padding: "10px",
  backgroundColor: "#48b1f8",
  color: "#fff",
  border: "1px solid #d3e9fe",
  fontWeight: "bold",
};

const tableCellStyle = {
  padding: "10px",
  border: "1px solid #d3e9fe",
};

function Manager() {
  const [datas, setDatas] = useState([]);
  const [items, setItems] = useState([]);
  const [modalIsOpenRmv, setModalIsOpenRmv] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleData = async () => {
    setLoading(true);
    try {
      const response = await GetDatas();
      setDatas(response.todos);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load products!", {
        autoClose: 1500,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedItem = localStorage.getItem("datas");
    if (savedItem) {
      setItems(JSON.parse(savedItem));
    }
    handleData();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("datas", JSON.stringify(items));
    }
  }, [items]);

  const addItem = (item) => {
    if (!items.some((el) => el.id === item.id)) {
      const newItem = {
        ...item,
        name: item.todo,
        userId: item.userId,
        completed: item.completed,
      };
      setItems((prevItem) => {
        const updatedItem = [...prevItem, newItem];
        localStorage.setItem("datas", JSON.stringify(updatedItem));
        return updatedItem;
      });
      toast.success(`${item.todo} Successfully added`, {
        autoClose: 1500,
      });
    } else {
      toast.warning("Already exist!", {
        autoClose: 1500,
      });
    }
  };

  const deleteItem = () => {
    if (itemToRemove) {
      const updatedItems = items.filter((item) => item.id !== itemToRemove.id);
      setItems(updatedItems);
      localStorage.setItem("datas", JSON.stringify(updatedItems));
      toast.success(`${itemToRemove.name} removed from your list!`, {
        autoClose: 1500,
      });
    }
    setModalIsOpenRmv(false);
  };

  const openRemoveModal = (item) => {
    setItemToRemove(item);
    setModalIsOpenRmv(true);
  };

  const isExist = (itemId) => {
    return items.some((recipe) => recipe.id === itemId);
  };

  return (
    <div
      style={{ maxWidth: "1200px", margin: "15px auto", textAlign: "center" }}
    >
      <h1 style={{ color: "#cefefd" }}>Todos</h1>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {loading ? (
          <div
            className="d-flex justify-content-center"
            style={{ width: "100%", height: "100vh" }}
          >
            <Spinner animation="border" variant="primary" className="mt-5" />
          </div>
        ) : (
          datas?.map((item) => (
            <div
              key={item.id}
              style={{
                margin: "10px",
                width: "250px",
                height: "200px",
                backgroundColor: item.completed ? "#cefefd" : "#f8d4d4", 
                border: "3px solid #98fa17",
                borderRadius: "8px",
                boxShadow: "10 12px 18px rgba(250, 185, 243, 0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <p className="mt-2" style={{ height: "180px" }}>
                {item.todo.slice(0, 50)}
              </p>
              <p className="mt-2" >
                {item.completed ? "Completed" : "Not Completed"}
              </p>

              <button
                onClick={() => addItem(item)}
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  backgroundColor: isExist(item.id) ? "#01615a" : "#00abd1",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {isExist(item.id) ? "Added" : "Add"}
              </button>
            </div>
          ))
        )}
      </div>
      <h4 className="mt-2">Your Todos</h4>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Task</th>
            <th style={tableHeaderStyle}>User ID</th>
            <th style={tableHeaderStyle}>Completed</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr
              key={item.id}
              style={{
                backgroundColor: item.completed ? "#d4f8e8" : "#f8d4d4",
                border: "2px solid #48b1f8",
                textAlign: "center",
              }}
            >
              <td style={tableCellStyle}>{item.name || item.todo}</td>
              <td style={tableCellStyle}>{item.userId}</td>
              <td style={tableCellStyle}>{item.completed ? "Yes" : "No"}</td>
              <td style={tableCellStyle}>
                <Button variant="danger" onClick={() => openRemoveModal(item)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={modalIsOpenRmv} onHide={() => setModalIsOpenRmv(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove <strong>{itemToRemove?.name}</strong>
          from your team?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalIsOpenRmv(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteItem}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Manager;
