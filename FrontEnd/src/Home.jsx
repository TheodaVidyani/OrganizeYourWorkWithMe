import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from "./components/Toast";


const Home = () => {
  const [tab, setTab] = useState(1); // Track the active tab
  const [tasks, setTasks] = useState(""); // Track the task input
  const [Description, setDescription] = useState(""); // Track the description input
  const [error, setError] = useState(""); // Track errors
  const [todos, setTodos] = useState([]); // Track the list of tasks
  const [isEdit, setIsEdit] = useState(false); // Track the edit status

  const handleTabs = (tab) => {
    setTab(tab); // Set the active tab
    console.log(tab); // Log the active tab - All/Active/Completed
  };

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  }); //type: add, edit, delete

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "" });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    setError("");

    if (!tasks || !Description) {
      setError("Task and Description are required."); // Validate inputs
      return;
    }

    const payload = {
      task: tasks.trim(),
      Description: Description.trim(),
    };

    axios
      .post("http://localhost:5000/new-task", payload)
      .then((response) => {
        console.log("Task added successfully:", response.data);
        setTasks(""); // Clear the task input
        setDescription(""); // Clear the description input
        showToastMessage("Task Added Successfully.");


        const newTask = {
          id: response.data.id, 
          task: tasks.trim(),
          Description: Description.trim(),
          DateTime: new Date().toISOString(),
        };

        setTodos((prevTodos) => [...prevTodos, newTask]); // Adding the new task to the list
      })
      .catch((error) => {
        console.error("Error adding task:", error);
        setError("Failed to add task. Please try again."); // Display an error message
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/read-tasks")
      .then((res) => {
        console.log("Tasks fetched successfully:", res.data);
        setTodos(res.data); // Update todo with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  const [updateId, setUpdateId] = useState(null);
  const [updateTask, setUpdateTask] = useState('');
  const [updateDescription, setUpdateDescription] = useState(''); // Track the description input

  const handleEdit = (id, task, Description) => {
    setIsEdit(true); // Set the edit status to true when I'm editing... Useful when changing the button to 'Edit' when updating.
    console.log(id);
    setUpdateTask(task); // Set the task input
    setUpdateDescription(Description); // Set the description input
    setUpdateId(id); // Set the task ID to update
  };

  const handleUpdateTask = () => {

    // Check if any field is missing and alert the user
    if (!updateId || !updateTask || !updateDescription) {
      console.error('Error: All fields must be provided!');
      alert("All fields (ID, Task, Description) are required.");
      return; // Prevent the API call if any field is missing
    }

    // Make the request to update the task
    axios
      .post('http://localhost:5000/edit-task', {
        updateId,
        updateTask,
        updateDescription
      })
      .then((response) => {
        console.log('Response:', response.data);

        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === updateId
              ? { ...todo, task: updateTask, Description: updateDescription }
              : todo
          )
        );
        setIsEdit(false); // Reset the edit mode after the update
        showToastMessage("Task Edited Succesfully.");

      })
      .catch((error) => {
        console.error('Error:', error.response ? error.response.data : error.message);
      });
  };

  const handleDelete = (id) => {
    console.log("Received id:", id);
    axios.delete("http://localhost:5000/delete-task", { data: { id } })
    .then((res) => {
      console.log("Task deleted successfully:", res.data);
      showToastMessage("Task deleted successfully.", "delete");
      setTodos(res.data); // Update the task list with the new list of tasks
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
    });
  }

const handleComplete = (id) => {
  axios.post("http://localhost:5000/complete-task", { id })
  .then((res) => {
    console.log("Task completed successfully:", res.data);
    setTodos(res.data); // Update the task list with the new list of tasks
    showToastMessage("Task Completed.");
  })
}

  return (
    <div className="bg-gray-100 w-screen h-overflow">
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        <div>
          <h2 className="text-3xl font-bold text-center mb-5 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            ToDo List
          </h2>
        </div>
        <div>
          <input
            value={isEdit ? updateTask : tasks}
            onChange={(e) => isEdit ? setUpdateTask(e.target.value) : setTasks(e.target.value)}
            type="text"
            placeholder="Enter your To Do"
            className="border-2 border-gray-300 p-2 m-2"
          />
          <input
            value={isEdit ? updateDescription : Description}
            onChange={(e) => isEdit ? setUpdateDescription(e.target.value) : setDescription(e.target.value)}
            type="text"
            placeholder="Enter a Description"
            className="border-2 border-gray-300 p-2 m-2"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={isEdit ? handleUpdateTask : handleAddTask}
          >
            {isEdit ? "Update" : "Add"}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex text-sm w-80 justify-evenly mt-3 mb-3">
          <p
            onClick={() => handleTabs(1)}
            className={tab === 1 ? "text-blue-600 font-semibold" : "cursor-pointer"}
          >
            All
          </p>
          <p
            onClick={() => handleTabs(2)}
            className={tab === 2 ? "text-blue-600 font-semibold" : "cursor-pointer"}
          >
            Active
          </p>
          <p
            onClick={() => handleTabs(3)}
            className={tab === 3 ? "text-blue-600 font-semibold" : "cursor-pointer"}
          >
            Completed
          </p>
        </div>

        {/* Task List */}
        <div className="flex flex-col w-80 mt-5">
          {
          tab == 1 && todos.map((todo) => (
            <div key={todo.id} className="flex justify-between bg-white p-3 mb-3">
              <div>
                <p className="text-lg font-semibold">{todo.task}</p>
                <p className="text-sm font-semibold">{todo.Description}</p>
                <p className="text-xs text-gray-600">{new Date(todo.DateTime).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700">Status: {todo.status}</p>
              </div>

              <div className="flex flex-col text-sm justify-start items-start">
                <button className="text-green-600 hover:text-green-900 cursor-pointer" onClick={() => handleComplete(todo.id)}>
                  Completed
                </button>
                <button className="text-red-600 hover:text-red-900 cursor-pointer" onClick={() => handleDelete(todo.id)}>
                  Delete
                </button>
                <button className="text-blue-600 hover:text-blue-900 cursor-pointer" onClick={() => handleEdit(todo.id, todo.task, todo.Description)}>
                  Edit
                </button>
              </div>
            </div>
          ))}

          {
          tab == 2 && todos.filter(todo => todo.status == 'Active').map((todo) => (
            <div key={todo.id} className="flex justify-between bg-white p-3 mb-3">
              <div>
                <p className="text-lg font-semibold">{todo.task}</p>
                <p className="text-sm font-semibold">{todo.Description}</p>
                <p className="text-xs text-gray-600">{new Date(todo.DateTime).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700">Status: {todo.status}</p>
              </div>

              <div className="flex flex-col text-sm justify-start items-start">
                <button className="text-green-600 hover:text-green-900 cursor-pointer" onClick={() => handleComplete(todo.id)}>
                  Completed
                </button>
                <button className="text-red-600 hover:text-red-900 cursor-pointer" onClick={() => handleDelete(todo.id)}>
                  Delete
                </button>
                <button className="text-blue-600 hover:text-blue-900 cursor-pointer" onClick={() => handleEdit(todo.id, todo.task, todo.Description)}>
                  Edit
                </button>
              </div>
            </div>
          ))}

{
          tab == 3 && todos.filter(todo => todo.status == 'completed').map((todo) => (
            <div key={todo.id} className="flex justify-between bg-white p-3 mb-3">
              <div>
                <p className="text-lg font-semibold">{todo.task}</p>
                <p className="text-sm font-semibold">{todo.Description}</p>
                <p className="text-xs text-gray-600">{new Date(todo.DateTime).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700">Status: {todo.status}</p>
              </div>

              <div className="flex flex-col text-sm justify-start items-start">
                <button className="text-green-600 hover:text-green-900 cursor-pointer" onClick={() => handleComplete(todo.id)}>
                  Completed
                </button>
                <button className="text-red-600 hover:text-red-900 cursor-pointer" onClick={() => handleDelete(todo.id)}>
                  Delete
                </button>
                <button className="text-blue-600 hover:text-blue-900 cursor-pointer" onClick={() => handleEdit(todo.id, todo.task, todo.Description)}>
                  Edit
                </button>
              </div>
            </div>
          ))}

<Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />

        </div>
      </div>
    </div>
  );
};

export default Home;
