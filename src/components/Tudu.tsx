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

interface TuduProps {
  users: User[];
}

const Tudu: React.FC<TuduProps> = ({ users }) => {
    const [data, setData] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
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
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedUser(null);
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
  
    const filteredData = data.filter(user =>
      user.ismi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.familyasi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div className="container">
        <div className="head">
          <div className="group input_had">
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input 
              placeholder="Search" 
              value={searchTerm} 
              type="search" 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="input"
            />
          </div>
          <div>
            <button className="Add">ADD</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Ismi</th>
              <th>Familiyasi</th>
              <th>Telfon raqami</th>
              <th>Lavozimi</th>
              <th>Edit</th>
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
      </div>
    );
  };

export default Tudu;
