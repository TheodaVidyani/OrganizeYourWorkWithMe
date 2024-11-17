import React, { useState } from "react";

const Home = () => {
  const [tab, setTab] = useState(1); // Track the active tab
  const [tasks, setTasks] = useState(null); // Track the tasks

  const handleTabs = (tab) => {
    setTab(tab); // Set the active tab
    console.log(tab); // Log the active tab (for debugging)

  };

  const handleAddTask = (e) => {
    e.preventDefault();
    console.log(tasks); // Log the tasks (for debugging)
  } 

  return (
    <div className="bg-gray-100 w-screen h-screen">
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        <div>
          <h2 className="text-3xl font-bold text-center mt-10">To Do List</h2>
        </div>
        <div>
          <input
          value = {tasks}
          onChange = {(e) => setTasks(e.target.value)}
            type="text"
            placeholder="Enter your To Do"
            className="border-2 border-gray-300 p-2 m-2"
          />
          <button onClick = {handleAddTask} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add
          </button>
        </div>

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
        <div className="flex justify-between bg-white p-3 w-80">
          <div>
            <p className="text-lg font-semibold">Buy Rice</p>
            <p className="text-sm font-semibold">Description</p>
            <p className="text-xs text-grey-600">2024-10-11</p>
            <p className="text-sm text-grey-700">Status: Active</p>
          </div>

          <div className="flex flex-col text-sm justify-start items-start">
            <button className="text-green-600 hover:text-green-900 cursor-pointer">
              Done
            </button>
            <button className="text-red-600 hover:text-red-900 cursor-pointer">
              Delete
            </button>
            <button className="text-blue-600 hover:text-blue-900 cursor-pointer">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
