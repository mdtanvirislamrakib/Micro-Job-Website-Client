import { Pencil, Trash2, X, Info } from "lucide-react";
import { useLoaderData } from "react-router";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

const MyTasks = () => {
    const loadedTasks = useLoaderData();
    const [tasks, setTasks] = useState(loadedTasks || []);
    const [editingTask, setEditingTask] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const tasksPerPage = 10;

    const formatDate = (dateString) => {
        if (!dateString) return "No date";
        try {
            const date = new Date(dateString);
            const options = { year: "numeric", month: "short", day: "numeric" };
            return date.toLocaleDateString("en-US", options);
        } catch {
            return "Invalid date";
        }
    };

    const truncateText = (text = "", wordLimit) => {
        const words = text.toString().split(" ");
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(" ") + "...";
        }
        return text;
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditingTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        if (!editingTask) return;

        try {
            const { data } = await axios.patch(
                `${import.meta.env.VITE_API_URL}/tasks/${editingTask._id}`,
                editingTask
            );

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === editingTask._id ? editingTask : task
                )
            );

            setEditingTask(null);

            if (data?.modifiedCount > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Task Updated!",
                    text: "Your task has been successfully updated.",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error("Error updating task:", error);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: `Failed to update task: ${error.message}`,
            });
        }
    };

    const handleCloseEdit = () => {
        setEditingTask(null);
    };

    const handleDeleteTask = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(
                        `${import.meta.env.VITE_API_URL}/tasks/${id}`
                    );
                    setTasks((prevTasks) =>
                        prevTasks.filter((task) => task._id !== id)
                    );
                    Swal.fire(
                        "Deleted!",
                        "Your task has been deleted.",
                        "success"
                    );
                } catch (error) {
                    console.error("Error deleting task:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: `Failed to delete task: ${error.message}`,
                    });
                }
            }
        });
    };

    const pageCount = Math.ceil(tasks.length / tasksPerPage);
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };
    const offset = currentPage * tasksPerPage;
    const currentTasks = tasks.slice(offset, offset + tasksPerPage);

    return (
        <div className="min-h-screen  p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-4 md:p-8">
                    <div className="text-center mb-6 md:mb-8">
                        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                            My Tasks Dashboard
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base">
                            Manage and track your tasks efficiently
                        </p>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="bg-gray-700/30 rounded-xl p-8 max-w-md mx-auto">
                                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    No Tasks Yet
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    Start by adding your first task to get organized!
                                </p>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                    Add New Task
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="hidden lg:block bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[700px]">
                                        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
                                            <tr>
                                                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                                    Task
                                                </th>
                                                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                                    Workers
                                                </th>
                                                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                                    Payment
                                                </th>
                                                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                                    Due Date
                                                </th>
                                                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-700/50">
                                            {currentTasks.map((task, index) => (
                                                <tr
                                                    key={task?._id || index}
                                                    className={`hover:bg-gray-700/30 transition-all duration-200 ${
                                                        index % 2 === 0
                                                            ? "bg-gray-800/20"
                                                            : "bg-gray-800/40"
                                                    }`}
                                                >
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    src={task?.image || "/placeholder.svg"}
                                                                    alt={task?.taskTitle || "Task"}
                                                                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover border-2 border-gray-600"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center">
                                                                    <p className="text-sm font-semibold text-white truncate max-w-[200px]">
                                                                        {truncateText(task?.taskTitle, 8)}
                                                                    </p>
                                                                    {task?.taskTitle && task.taskTitle.split(" ").length > 8 && (
                                                                        <span className="relative group ml-1 flex-shrink-0">
                                                                            <Info className="h-3 w-3 text-gray-400 cursor-help" />
                                                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                                                                {task.taskTitle}
                                                                            </span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-400">
                                                                    ID: {task?._id || "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-4 text-center">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/50">
                                                            {task?.requiredWorkers || 0}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4 text-center">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-900/50 text-green-300 border border-green-700/50">
                                                            $
                                                            {Number.parseFloat(task?.payableAmount || 0).toFixed(2)}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4 text-center">
                                                        <div className="text-sm text-gray-300 font-medium">
                                                            {formatDate(task?.completationDate)}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <div className="flex justify-center items-center space-x-2">
                                                            <button
                                                                onClick={() => handleEditClick(task)}
                                                                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition-all duration-200 group"
                                                                title="Edit Task"
                                                            >
                                                                <Pencil className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTask(task?._id)}
                                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all duration-200 group"
                                                                title="Delete Task"
                                                            >
                                                                <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {currentTasks.map((task, index) => (
                                    <div
                                        key={task?._id || index}
                                        className="bg-gray-800/40 border border-gray-700/50 rounded-xl shadow-lg p-4 sm:p-5 flex flex-col justify-between hover:bg-gray-700/30 transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-4 mb-4">
                                            <img
                                                src={task?.image || "/placeholder.svg"}
                                                alt={task?.taskTitle || "Task"}
                                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-600 flex-shrink-0"
                                            />
                                            <div className="flex-grow min-w-0">
                                                <h3 className="text-lg font-bold text-white mb-1 truncate">
                                                    {task?.taskTitle || "Untitled Task"}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    Task ID: {task?._id || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Workers Needed:</p>
                                                <span className="font-semibold text-blue-300">
                                                    {task?.requiredWorkers || 0}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Payment:</p>
                                                <span className="font-bold text-green-300">
                                                    ${Number.parseFloat(task?.payableAmount || 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-gray-400">Due Date:</p>
                                                <span className="font-semibold text-gray-300">
                                                    {formatDate(task?.completationDate)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-2 border-t border-gray-700/50 pt-4">
                                            <button
                                                onClick={() => handleEditClick(task)}
                                                className="flex-1 px-4 py-2 text-blue-400 bg-blue-900/30 hover:bg-blue-900/50 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
                                                title="Edit Task"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="hidden sm:inline">Update</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task?._id)}
                                                className="flex-1 px-4 py-2 text-red-400 bg-red-900/30 hover:bg-red-900/50 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
                                                title="Delete Task"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="hidden sm:inline">Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-center">
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel="next >"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    pageCount={pageCount}
                                    previousLabel="< previous"
                                    renderOnZeroPageCount={null}
                                    containerClassName="pagination flex space-x-2 text-white"
                                    pageLinkClassName="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                                    previousLinkClassName="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                                    nextLinkClassName="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                                    activeLinkClassName="!bg-blue-600 !text-white cursor-pointer"
                                    disabledClassName="opacity-50 cursor-not-allowed"
                                />
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-400">
                                    Displaying{" "}
                                    <span className="font-semibold text-white">
                                        {currentTasks.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-white">
                                        {tasks.length}
                                    </span>{" "}
                                    task
                                    {tasks.length !== 1 ? "s" : ""} • Last updated: {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">Edit Task</h2>
                            <button
                                onClick={handleCloseEdit}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateTask}>
                            <div className="mb-4">
                                <label htmlFor="taskTitle" className="block text-gray-300 text-sm font-semibold mb-2">
                                    Task Title
                                </label>
                                <input
                                    type="text"
                                    id="taskTitle"
                                    name="taskTitle"
                                    value={editingTask.taskTitle || ""}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="taskDetails" className="block text-gray-300 text-sm font-semibold mb-2">
                                    Task Details
                                </label>
                                <textarea
                                    id="taskDetails"
                                    name="taskDetails"
                                    value={editingTask.taskDetails || ""}
                                    onChange={handleFormChange}
                                    rows="4"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="submissionInfo" className="block text-gray-300 text-sm font-semibold mb-2">
                                    Submission Info (e.g., URL)
                                </label>
                                <input
                                    type="text"
                                    id="submissionInfo"
                                    name="submissionInfo"
                                    value={editingTask.submissionInfo || ""}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseEdit}
                                    className="px-6 py-2 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-700 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTasks;