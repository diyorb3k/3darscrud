import axios from "axios";
import React, { useEffect, useState } from "react";
import './css/Tudu.css'

// Foydalanuvchilar interfeysi
interface User {
  id: number;
  ismi: string;
  familyasi: string;
  telefon_raqami: string;
  lavozimi: string;
}

const Tudu: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newUser, setNewUser] = useState<User>({ id: 0, ismi: '', familyasi: '', telefon_raqami: '', lavozimi: '' });
  
    useEffect(() => {
      const getData = async () => {
        try {
          const res = await axios.get("http://localhost:3000/User");
          setData(res.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      getData();
    }, []);
  
    const handleDelete = async (id: number) => {
      try {
        await axios.delete(`http://localhost:3000/User/${id}`);
        const filteredItems = data.filter(item => item.id !== id);
        setData(filteredItems);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    };
  
    const handleEdit = (user: User) => {
      setSelectedUser(user);
      setIsModalOpen(true);
    };

    const handleAdd = () => {
      setIsAddModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedUser(null);
    };

    const handleAddCloseModal = () => {
      setIsAddModalOpen(false);
      setNewUser({ id: 0, ismi: '', familyasi: '', telefon_raqami: '', lavozimi: '' });
    };

    const handleSave = async () => {
      if (selectedUser) {
        try {
          await axios.put(`http://localhost:3000/User/${selectedUser.id}`, selectedUser);
          const updatedData = data.map(user =>
            user.id === selectedUser.id ? selectedUser : user
          );
          setData(updatedData);
          handleCloseModal();
        } catch (error) {
          console.error("Error updating data:", error);
        }
      }
    };

    const handleAddSave = async () => {
      try {
        const res = await axios.post("http://localhost:3000/User", newUser);
        setData([...data, res.data]);
        handleAddCloseModal();
      } catch (error) {
        console.error("Error adding data:", error);
      }
    };
  
    const filteredData = data.filter(user =>
      user.ismi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.familyasi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div className="container">
        <div className="head">
          <div className="group input_had">
            <input 
              placeholder="Search" 
              value={searchTerm} 
              type="search" 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="input"
            />
          </div>
          <div>
            <button onClick={handleAdd} className="Add">ADD</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Ismi</th>
              <th>Familiyasi</th>
              <th>Telfon raqami</th>
              <th>Lavozimi</th>
              <th>Edit / Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr key={user.id}>
                <td>{user.ismi}</td>
                <td>{user.familyasi}</td>
                <td>{user.telefon_raqami}</td>
                <td>{user.lavozimi}</td>
                <td className="crud">
                  <button onClick={() => handleEdit(user)} className="edit">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="Dalet">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit User</h2>
              <input className="inp1"
                type="text" 
                value={selectedUser?.ismi || ''} 
                placeholder="Ismi"
                onChange={(e) => setSelectedUser({...selectedUser, ismi: e.target.value} as User)} 
              />
              <input className="inp1"
                type="text" 
                value={selectedUser?.familyasi || ''} 
                placeholder="Familiyasi"
                onChange={(e) => setSelectedUser({...selectedUser, familyasi: e.target.value} as User)} 
              />
              <input className="inp1"
                type="text" 
                value={selectedUser?.telefon_raqami || ''} 
                placeholder="Telefon raqami"
                onChange={(e) => setSelectedUser({...selectedUser, telefon_raqami: e.target.value} as User)} 
              />
              <input className="inp1"
                type="text" 
                value={selectedUser?.lavozimi || ''} 
                placeholder="Lavozimi"
                onChange={(e) => setSelectedUser({...selectedUser, lavozimi: e.target.value} as User)} 
              />
              <button onClick={handleSave} className="save">Save</button>
              <button onClick={handleCloseModal} className="close">Close</button>
            </div>
          </div>
        )}

        {isAddModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New User</h2>
              <input className="inp1"
                type="text" 
                value={newUser.ismi} 
                placeholder="Ismi"
                onChange={(e) => setNewUser({...newUser, ismi: e.target.value})} 
              />
              <input className="inp1"
                type="text" 
                value={newUser.familyasi} 
                placeholder="Familiyasi"
                onChange={(e) => setNewUser({...newUser, familyasi: e.target.value})} 
              />
              <input className="inp1"
                type="text" 
                value={newUser.telefon_raqami} 
                placeholder="Telefon raqami"
                onChange={(e) => setNewUser({...newUser, telefon_raqami: e.target.value})} 
              />
              <input className="inp1"
                type="text" 
                value={newUser.lavozimi} 
                placeholder="Lavozimi"
                onChange={(e) => setNewUser({...newUser, lavozimi: e.target.value})} 
              />
              <button onClick={handleAddSave} className="save">Save</button>
              <button onClick={handleAddCloseModal} className="close">Close</button>
            </div>
          </div>
        )}
      </div>
    );
};

export default Tudu;
