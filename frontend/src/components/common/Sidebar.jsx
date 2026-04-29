import {
  BarChart2,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <motion.div
      className="text-white text-center flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="text-xl font-bold tracking-wider mt-1">
        <span className="text-gradient bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          DecisionAI
        </span>
      </div>
      <div className="text-xs text-gray-500 mt-1">Decision Intelligence</div>
    </motion.div>
  );
};

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: BarChart2,
    color: "#3B82F6",
    href: "/",
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("/");

  useEffect(() => {
    setActiveItem(window.location.pathname);
  }, []);

  return (
    <motion.div
      className="relative z-10 transition-all duration-300 ease-in-out flex-shrink-0"
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gradient-to-b from-[#0f0a1e] to-[#1a1035] backdrop-blur-lg p-4 flex flex-col border-r border-violet-900/40 shadow-xl">
        <div className="flex items-center justify-start mb-4 mt-2 space-x-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: isSidebarOpen ? 0 : 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-violet-900/50 transition-all duration-300 bg-[#1a1035] border border-violet-900/40"
          >
            <Menu size={22} className="text-gray-300" />
          </motion.button>
          {isSidebarOpen && <Logo />}
        </div>

        <div className="relative h-px w-full bg-gradient-to-r from-transparent via-violet-700/30 to-transparent my-2">
          <div
            className="absolute h-px w-16 bg-gradient-to-r from-transparent via-violet-500/60 to-transparent animate-pulse"
            style={{ left: "40%" }}
          ></div>
        </div>

        <nav className="mt-4 flex-grow space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activeItem === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setActiveItem(item.href)}
              >
                <motion.div
                  className={`flex items-center p-3 text-base font-medium rounded-lg hover:bg-violet-900/30 transition-all duration-300 mb-1 relative overflow-hidden ${
                    isActive
                      ? "bg-violet-900/40 shadow-lg border-l-2 border-violet-500"
                      : "bg-white/5"
                  }`}
                  whileHover={{ x: 3 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent opacity-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.15 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                  )}

                  <div
                    className={`flex items-center justify-center w-8 h-8 ${
                      isActive ? "text-violet-400" : "text-gray-400"
                    }`}
                  >
                    <item.icon
                      size={22}
                      style={{ color: isActive ? "#8B5CF6" : item.color }}
                    />
                  </div>

                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className={`ml-3 whitespace-nowrap ${
                          isActive ? "text-violet-400" : "text-gray-400"
                        }`}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>


                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-700/30 to-transparent mb-4"></div>
          {isSidebarOpen && (
            <motion.div
              className="text-xs text-gray-500 text-center px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              DecisionAI Platform v1.0
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
