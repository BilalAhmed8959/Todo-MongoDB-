import axios from 'axios';
import React, { useEffect, useState } from 'react';

const App = () => {
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [todo, setTodo] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/todo');
        setTodo(response.data.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    }
    fetchData();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/todo', {
        title: input,
        description,
      });
      setTodo((prevTodos) => [...prevTodos, response.data.data]);
      setInput('');
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/todo/${id}`);
      console.log(response.data.message);
  
      setTodo((e) => e.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  const editTodo = async (id, index) => {
    try {
      const updated = prompt("Enter updated Todo");
      if (!updated) return; // Agar user input na de to function return kar de
  
      const response = await axios.put(`http://localhost:5000/api/v1/todo/${id}`, {
        title: updated,
      });
  
      if (response.status === 200) {
        setTodo((prevTodos) =>
          prevTodos.map((todo, idx) =>
            idx === index ? { ...todo, title: updated } : todo
          )
        );
      } else {
        console.error("Failed to update todo:", response.data);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };
  
  
  
  
  

  return (
    <>
      <h1 className='text-center font-bold text-2xl p-8 bg-green-800 text-white'>Todo App</h1>
      <div>
        <form onSubmit={addTodo} className='flex justify-center gap-3 items-center p-8' >
          <input className='border p-2 rounded-lg  shadow'  type="text"  placeholder="Enter todo" onChange={(e) => setInput(e.target.value)} value={input} />
          <textarea className='border p-2 rounded-lg shadow mt-6'  onChange={(e) => setDescription(e.target.value)}  placeholder="Enter description" value={description}  />
          <button className='bg-green-800 w-22 h-12 mt-2 text-white p-2 rounded-lg shadow-lg' type="submit">Add Todo</button>
        </form>
      </div>
      <table className='flex flex-col gap-2  justify-center items-center'>
        <thead >
          <tr>
            <th className='pr-52'>Title</th>
            <th className='pr-40'>Description</th>
          </tr>
        </thead>
        <tbody>
          {todo ? todo.map((item,index)=>{
            return <tr className='shadow rounded-md ' key={index}>
              <td className='pr-28 p-2'>{item.title}</td>
              <td className='p-4 pr-20 pl-20'>{item.description}</td>
              <button className='bg-red-700 w-20 h-12  text-white  rounded-lg shadow-lg' onClick={()=> deleteTodo(item._id , index)}>delete</button>
              <button className='bg-green-800 w-20  h-12 ml-2 text-white  rounded-lg shadow-lg' onClick={()=> editTodo(item._id , index)}>edit</button>
            </tr>
          }):<h1>loading</h1>}
        </tbody>
       
      </table>
    </>
  );
};

export default App;
