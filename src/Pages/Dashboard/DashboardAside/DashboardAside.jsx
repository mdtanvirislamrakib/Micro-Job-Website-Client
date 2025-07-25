// DashboardAside.jsx

import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ArrowRightCircle, X, Briefcase } from 'lucide-react'; // Briefcase icon imported
import { NavLink, Link } from 'react-router';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../Provider/AuthProvider';
import WorkerNavigation from '../../../Component/DashboardNav/WorkerNavigation/WorkerNavigation';
import BuyerNavigation from '../../../Component/DashboardNav/BuyerNavigation/BuyerNavigation';
import AdminNavigation from '../../../Component/DashboardNav/AdminNavigation/AdminNavigation';
import useRole from '../../../Hooks/useRole';
import LoadingSpinner from '../../../Shared/LoadingSpinner';

const DashboardAside = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const { logOut } = useContext(AuthContext);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const logout = () => {
        logOut();
        toast.success('Successfully Logout!');
    };

    const { role, isRoleLoading } = useRole();

    if (isRoleLoading) return <LoadingSpinner></LoadingSpinner>

    return (
        <div className="flex flex-col text-gray-100">
            {/* Mobile Sidebar Toggle Button - Visible only on mobile/tablet */}
            {!isSidebarOpen && isMobileView && (
                <motion.button
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed top-4 left-6 p-2 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-40 lg:hidden text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Open sidebar"
                >
                    <ArrowRightCircle className="h-6 w-6" />
                </motion.button>
            )}

            {/* Desktop Sidebar - Fixed on large screens */}
            {!isMobileView && (
                <aside
                    className="hidden lg:flex flex-col w-64 bg-black/30 backdrop-blur-md border-r border-white/10 p-6 shadow-lg relative z-20 
                                lg:fixed lg:h-screen lg:w-64 lg:top-0 lg:left-0 overflow-y-auto"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(15px) brightness(1.1)',
                        WebkitBackdropFilter: 'blur(15px) brightness(1.1)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {/* Logo Section - Replaced with your provided code */}
                    <div className="flex items-center gap-4 mb-8 justify-center"> {/* Added mb-8 and justify-center for spacing and centering */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-1 shadow-sm">
                                <Briefcase className="h-8 w-8 lg:h-5 lg:w-5 text-white" />
                            </div>
                            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent hidden lg:block">
                                MicroJobs
                            </h1>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1">
                        <ul className="space-y-3">
                            <li>
                                <motion.div
                                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer group"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        backdropFilter: 'blur(5px)',
                                        WebkitBackdropFilter: 'blur(5px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                    }}
                                >
                                    <NavLink
                                        to="/dashboard"
                                        end
                                        className={({ isActive }) =>
                                            `flex items-center w-full h-full ${isActive
                                                ? 'text-white font-semibold'
                                                : 'text-gray-400 hover:text-blue-300'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <LayoutDashboard
                                                    className={`h-5 w-5 mr-3 transition-colors duration-200 ${isActive
                                                        ? 'text-blue-300'
                                                        : 'text-purple-400 group-hover:text-blue-300'
                                                        }`}
                                                />
                                                <span className="font-medium">Home</span>
                                                {isActive && (
                                                    <motion.div
                                                        className="ml-auto h-2 w-2 rounded-full bg-blue-400"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                </motion.div>
                            </li>
                            {
                                role === "worker" && <WorkerNavigation />
                            }
                            {
                                role === "buyer" && <BuyerNavigation />
                            }
                            {
                                role === "admin" && <AdminNavigation />
                            }
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <div className="mt-auto pt-6 border-t border-white/10 text-center">
                        <button
                            onClick={logout}
                            className="mt-3 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </aside>
            )}

            {/* Mobile Sidebar - Visible on mobile/tablet */}
            <AnimatePresence>
                {isSidebarOpen && isMobileView && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                            className="flex flex-col w-72 h-full bg-black/60 backdrop-blur-xl p-6 border-r border-white/20 overflow-y-auto"
                            style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(20px) brightness(1.2)',
                                WebkitBackdropFilter: 'blur(20px) brightness(1.2)',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header (with close button and optional mobile logo) */}
                            <div className="flex justify-between items-center mb-10 mt-2">
                                {/* Mobile Logo - Using your provided code here as well */}
                                <div className="flex items-center gap-4 flex-grow justify-center">
                                    <Link to="/" className="flex items-center space-x-2">
                                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-1 shadow-sm">
                                            <Briefcase className="h-8 w-8 text-white" /> {/* Removed lg:h-5 lg:w-5 for mobile */}
                                        </div>
                                        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                            MicroJobs
                                        </h1>
                                    </Link>
                                </div>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="text-gray-300 hover:text-blue-400 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Close sidebar"
                                >
                                    <X className="h-7 w-7" />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1">
                                <ul className="space-y-3">
                                    <li>
                                        <motion.div
                                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer group"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.02)',
                                                backdropFilter: 'blur(5px)',
                                                WebkitBackdropFilter: 'blur(5px)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                            }}
                                        >
                                            <NavLink
                                                to="/dashboard"
                                                end
                                                className={({ isActive }) =>
                                                    `flex items-center w-full h-full ${isActive
                                                        ? 'text-white font-semibold'
                                                        : 'text-gray-400 hover:text-blue-300'
                                                    }`
                                                }
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <LayoutDashboard
                                                            className={`h-5 w-5 mr-3 transition-colors duration-200 ${isActive
                                                                ? 'text-blue-300'
                                                                : 'text-purple-400 group-hover:text-blue-300'
                                                                }`}
                                                        />
                                                        <span className="font-medium">Dashboard Home</span>
                                                        {isActive && (
                                                            <motion.div
                                                                className="ml-auto h-2 w-2 rounded-full bg-blue-400"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </NavLink>
                                        </motion.div>
                                    </li>
                                    {
                                        role === "worker" && <WorkerNavigation />
                                    }
                                    {
                                        role === "buyer" && <BuyerNavigation />
                                    }
                                    {
                                        role === "admin" && <AdminNavigation />
                                    }
                                </ul>
                            </nav>

                            {/* Footer */}
                            <div className="mt-auto pt-6 border-t border-white/10 text-center">
                                <button
                                    onClick={logout}
                                    className="mt-3 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardAside;