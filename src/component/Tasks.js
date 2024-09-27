import React, { useState, useEffect } from "react";
import axios from "axios";
import "@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css";
import "./Tasks.css";

const Tasks = () => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    AssignedTo: "",
    Status: "",
    DueDate: "",
    Priority: "",
    Comments: "",
    Description: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tasks/all");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRefresh = () => {
    fetchTasks();
  };

  const handleNewTaskChange = (event) => {
    setNewTask({ ...newTask, [event.target.name]: event.target.value });
  };

  const handleAddTask = async () => {
    if (
      !newTask.AssignedTo ||
      !newTask.Status ||
      !newTask.DueDate ||
      !newTask.Priority
    ) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await axios.post("http://localhost:8000/tasks/add", newTask);
      fetchTasks();
      setIsNewTaskModalOpen(false);
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const handleEditTask = async () => {
    if (
      !currentTask.AssignedTo ||
      !currentTask.Status ||
      !currentTask.DueDate ||
      !currentTask.Priority
    ) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8000/tasks/update/${currentTask._id}`,
        currentTask
      );
      fetchTasks();
      setIsEditTaskModalOpen(false);
    } catch (error) {
      console.error("Error editing task: ", error);
    }
  };

  const handleEditTaskChange = (event) => {
    setCurrentTask({ ...currentTask, [event.target.name]: event.target.value });
  };

  const handleDeleteTask = async (taskId) => {
    console.log(taskId);
      try {
        await axios.delete(`http://localhost:8000/tasks/delete/${taskId}`);
        fetchTasks();
        setIsDeleteConfirmationOpen(false);
      } catch (error) {
        console.error("Error deleting task: ", error);
      }

  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsEditTaskModalOpen(true);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.AssignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.Status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.Priority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="asign-box">
        <div className="slds-page-header">
          <div className="slds-grid">
            <div className="slds-col slds-has-flexi-truncate">
              <p className="slds-text-heading_medium">Tasks</p>
              <p>All Tasks</p>
            </div>
            <div className="slds-col slds-no-flex slds-grid slds-align-top">
              <div className="slds-col">
                <button
                  className="slds-button slds-button_brand"
                  onClick={() => setIsNewTaskModalOpen(true)}
                >
                  New Task
                </button>
                <button
                  className="slds-button slds-button_neutral"
                  onClick={handleRefresh}
                >
                  Refresh
                </button>
              </div>
              <div className="slds-col">
                <div className="slds-form-element">
                  <div className="slds-form-element__control">
                    <input
                      type="text"
                      className="slds-input"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table className="slds-table slds-table_cell-buffer slds-table_bordered slds-table_fixed-layout">
          <thead>
            <tr className="slds-line-height_reset">
              <th>
                <input type="checkbox"></input>
              </th>
              <th scope="col">
                <div className="slds-truncate" title="Assigned To">
                  Assigned To
                </div>
              </th>
              <th scope="col">
                <div className="slds-truncate" title="Status">
                  Status
                </div>
              </th>
              <th scope="col">
                <div className="slds-truncate" title="Due Date">
                  Due Date
                </div>
              </th>
              <th scope="col">
                <div className="slds-truncate" title="Priority">
                  Priority
                </div>
              </th>
              <th scope="col">
                <div className="slds-truncate" title="Comments">
                  Comments
                </div>
              </th>
              <th scope="col">
                <div className="slds-truncate" title="Actions">
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id}>
                <td>
                  <input type="checkbox"></input>
                </td>
                <td data-label="Assigned To">{task.AssignedTo}</td>
                <td data-label="Status">{task.Status}</td>
                <td data-label="Due Date">
                  {new Date(task.DueDate).toLocaleDateString()}
                </td>
                <td data-label="Priority">{task.Priority}</td>
                <td data-label="Comments">{task.Comments}</td>
                <td data-label="Actions">
                  <button
                    className="slds-button slds-button_neutral"
                    onClick={() => openEditModal(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="slds-button slds-button_destructive"
                    onClick={() => {
                      setTaskToDelete(task);
                      setIsDeleteConfirmationOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="slds-modal slds-fade-in-open">
          <div className="slds-modal__container">
            <div className="slds-modal__header">
              <button
                className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse"
                onClick={() => setIsNewTaskModalOpen(false)}
                title="Close"
              >
                <svg
                  className="slds-button__icon slds-button__icon_large"
                  aria-hidden="true"
                >
                  <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span className="slds-assistive-text">Close</span>
              </button>
              <h2 className="slds-text-heading_medium">New Task</h2>
            </div>
            <div className="slds-modal__content slds-p-around_medium">
              <div className="slds-grid slds-gutters">
                <div className="slds-col slds-size_1-of-2">
                  <div className="slds-form-element">
                    <label
                      className="slds-form-element__label"
                      htmlFor="assignedTo"
                    >
                      Assigned To
                    </label>
                    <div className="slds-form-element__control">
                      <input
                        type="text"
                        id="assignedTo" // Added ID for accessibility
                        name="AssignedTo"
                        className="slds-input"
                        placeholder="Assigned To"
                        value={newTask.AssignedTo}
                        onChange={handleNewTaskChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="slds-col slds-size_1-of-2">
                  <div className="slds-form-element">
                    <label
                      className="slds-form-element__label"
                      htmlFor="status"
                    >
                      Status
                    </label>
                    <div className="slds-form-element__control">
                      <input
                        type="text"
                        id="status"
                        name="Status"
                        className="slds-input"
                        placeholder="Status"
                        value={newTask.Status}
                        onChange={handleNewTaskChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="slds-modal__content slds-p-around_medium">
              <div className="slds-grid slds-gutters">
                <div className="slds-col slds-size_1-of-2">
                  <div className="slds-form-element">
                    <label
                      className="slds-form-element__label"
                      htmlFor="dueDate"
                    >
                      Due Date
                    </label>
                    <div className="slds-form-element__control">
                      <input
                        type="date"
                        id="dueDate"
                        name="DueDate"
                        className="slds-input"
                        value={newTask.DueDate}
                        onChange={handleNewTaskChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="slds-col slds-size_1-of-2">
                  <div className="slds-form-element">
                    <label
                      className="slds-form-element__label"
                      htmlFor="priority"
                    >
                      Priority
                    </label>
                    <div className="slds-form-element__control">
                      <input
                        type="text"
                        id="priority"
                        name="Priority"
                        className="slds-input"
                        placeholder="Priority"
                        value={newTask.Priority}
                        onChange={handleNewTaskChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="slds-modal__content slds-p-around_medium">
              {/* <div className="slds-grid slds-gutters"> */}
              <div className="slds-col slds-size_1-of-1">
                <div className="slds-form-element">
                  <label
                    className="slds-form-element__label"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <div className="slds-form-element__control">
                    <textarea
                      id="description"
                      name="Description"
                      className="slds-textarea"
                      placeholder="Description"
                      value={newTask.Description}
                      onChange={handleNewTaskChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
            <div className="slds-modal__footer">
              <button
                className="slds-button slds-button_neutral"
                onClick={() => setIsNewTaskModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="slds-button slds-button_brand"
                onClick={handleAddTask}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditTaskModalOpen && currentTask && (
        <div className="slds-modal slds-fade-in-open">
          <div className="slds-modal__container">
            <div className="slds-modal__header">
              <button
                className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse"
                onClick={() => setIsEditTaskModalOpen(false)}
                title="Close"
              >
                <svg
                  className="slds-button__icon slds-button__icon_large"
                  aria-hidden="true"
                >
                  <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span className="slds-assistive-text">Close</span>
              </button>
              <h2 className="slds-text-heading_medium">Edit Task</h2>
            </div>
            <div className="slds-modal__content slds-p-around_medium">
              <div className="slds-grid slds-gutters">
                <div className="slds-col slds-size_1-of-2">
                  <div className="slds-form-element">
                    <label
                      className="slds-form-element__label"
                      htmlFor="assignedTo"
                    >
                      Assigned To
                    </label>
                    <div className="slds-form-element__control">
                      <input
                        type="text"
                        id="assignedTo" // Added ID for accessibility
                        name="AssignedTo"
                        className="slds-input"
                        placeholder="Assigned To"
                        value={currentTask.AssignedTo}
                        onChange={handleEditTaskChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="slds-col slds-size_1-of-2">
                  <div className="slds-form-element">
                    <label
                      className="slds-form-element__label"
                      htmlFor="status"
                    >
                      Status
                    </label>
                    <div className="slds-form-element__control">
                      <input
                        type="text"
                        id="status"
                        name="Status"
                        className="slds-input"
                        placeholder="Status"
                        value={currentTask.Status}
                        onChange={handleEditTaskChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="slds-modal__content slds-p-around_medium">
              <div className="slds-grid slds-gutters">
                <div className="slds-col slds-size_1-of-2">
                  <div className="slds-form-element">
                    <label
                      className="slds-form-element__label"
                      htmlFor="dueDate"
                    >
                      Due Date
                    </label>
                    <div className="slds-form-element__control">
                      <input
                        type="date"
                        id="dueDate"
                        name="DueDate"
                        className="slds-input"
                        value={currentTask.DueDate}
                        onChange={handleEditTaskChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="slds-col slds-size_1-of-2">
                  <div className="slds-form-element">
                    <label
                      className="slds-form-element__label"
                      htmlFor="priority"
                    >
                      Priority
                    </label>
                    <div className="slds-form-element__control">
                      <input
                        type="text"
                        id="priority"
                        name="Priority"
                        className="slds-input"
                        placeholder="Priority"
                        value={currentTask.Priority}
                        onChange={handleEditTaskChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="slds-modal__content slds-p-around_medium">
              {/* <div className="slds-grid slds-gutters"> */}
              <div className="slds-col slds-size_1-of-1">
                <div className="slds-form-element">
                  <label
                    className="slds-form-element__label"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <div className="slds-form-element__control">
                    <textarea
                      id="description"
                      name="Description"
                      className="slds-textarea"
                      placeholder="Description"
                      value={currentTask.Description}
                      onChange={handleEditTaskChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
            <div className="slds-modal__footer">
              <button
                className="slds-button slds-button_neutral"
                onClick={() => setIsEditTaskModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="slds-button slds-button_brand"
                onClick={handleEditTask}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationOpen && taskToDelete && (
        <div className="slds-modal slds-fade-in-open">
          <div className="slds-modal__container">
            <div className="slds-modal__header">
              <button
                className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse"
                onClick={() => setIsDeleteConfirmationOpen(false)}
                title="Close"
              >
                <svg
                  className="slds-button__icon slds-button__icon_large"
                  aria-hidden="true"
                >
                  <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span className="slds-assistive-text">Close</span>
              </button>
              <h2 className="slds-text-heading_medium">Delete Task</h2>
            </div>
            <div className="slds-modal__content slds-p-around_medium">
              <p>
                Are you sure you want to delete the task "
                {taskToDelete.AssignedTo}"?
              </p>
            </div>
            <div className="slds-modal__footer">
              <button
                className="slds-button slds-button_neutral"
                onClick={() => setIsDeleteConfirmationOpen(false)}
              >
                Cancel
              </button>
              <button
                className="slds-button slds-button_destructive"
                onClick={() => {
                  handleDeleteTask(taskToDelete._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
