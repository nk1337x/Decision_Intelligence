import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, RotateCw, ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function VenueVisualizationPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAfter, setShowAfter] = useState(false);
  const viewerRef = useRef(null);
  const navigate = useNavigate();

  // Before and After skybox IDs
  const beforeSkyboxId = "2e2acaa95b6c3148dcde2015f2caee01"; // Hall before event management
  const afterSkyboxId = "526844dc32b2f1d3f42ecddec8cdf9ed"; // Hall after event setup

  // Listen for fullscreen changes (e.g., when user presses ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      try {
        await viewerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error("Error entering fullscreen:", err);
      }
    } else {
      // Exit fullscreen
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error("Error exiting fullscreen:", err);
      }
    }
  };

  const toggleView = () => {
    setShowAfter(!showAfter);
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-xl border border-violet-500/30">
              <RotateCw className="text-violet-400" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                360° Venue Visualization
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Compare your venue before and after event setup
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/chatbot-planning")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border border-gray-700"
          >
            <ArrowLeft size={18} />
            <span>Back to Chat</span>
          </button>
        </div>
      </motion.div>

      {/* 360° Viewer Container */}
      <motion.div
        ref={viewerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative bg-gray-800/50 rounded-2xl border border-violet-500/30 overflow-hidden"
        style={{
          // When in fullscreen, make the container fill the screen
          ...(isFullscreen && {
            width: '100vw',
            height: '100vh',
          })
        }}
      >
        {/* Controls Bar */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="p-3 bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800 rounded-lg transition-all border border-violet-500/30 text-violet-400"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </motion.button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className={`px-4 py-2 rounded-lg border backdrop-blur-sm ${
            showAfter 
              ? "bg-green-900/80 border-green-500/30" 
              : "bg-gray-900/80 border-violet-500/30"
          }`}>
            <p className="text-sm font-semibold">
              {showAfter ? "✨ After Event Setup" : "📍 Before Event Setup"}
            </p>
          </div>
        </div>

        {/* Toggle Button - Centered at Bottom */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleView}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-xl transition-all shadow-lg border border-violet-400/30 font-semibold"
          >
            <Eye size={20} />
            <span>{showAfter ? "View Before Setup" : "View After Setup"}</span>
            <ArrowRight size={20} />
          </motion.button>
        </div>

        {/* 360° Skybox Iframes - Both preloaded, toggle visibility */}
        <div className="relative w-full h-full" style={{ minHeight: isFullscreen ? '100vh' : '600px' }}>
          {/* Before Setup Iframe */}
          <iframe
            src={`https://skybox.blockadelabs.com/e/${beforeSkyboxId}`}
            className="absolute inset-0 w-full h-full border-0 transition-opacity duration-500"
            style={{ opacity: showAfter ? 0 : 1, pointerEvents: showAfter ? 'none' : 'auto' }}
            allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
            allowFullScreen
            title="360° Venue View - Before"
          />
          
          {/* After Setup Iframe */}
          <iframe
            src={`https://skybox.blockadelabs.com/e/${afterSkyboxId}`}
            className="absolute inset-0 w-full h-full border-0 transition-opacity duration-500"
            style={{ opacity: showAfter ? 1 : 0, pointerEvents: showAfter ? 'auto' : 'none' }}
            allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
            allowFullScreen
            title="360° Venue View - After"
          />
        </div>
      </motion.div>

      {/* Information Cards */}
      {!isFullscreen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Feature Card 1 */}
          <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 rounded-xl p-6 border border-violet-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <Eye className="text-violet-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">Before & After</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Compare your venue before and after event setup with a single click
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <RotateCw className="text-purple-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">360° View</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Explore every angle with immersive 360° panoramic views
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 rounded-xl p-6 border border-pink-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Maximize2 className="text-pink-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">Fullscreen Mode</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Expand to fullscreen for a truly immersive venue exploration
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default VenueVisualizationPage;
