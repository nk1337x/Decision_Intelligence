import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Upload, Sparkles, Zap, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useEventData } from "../context/EventDataContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ImageProcessingPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [layoutResults, setLayoutResults] = useState(null);
  const fileInputRef = useRef(null);
  
  const { getEventData, getAnalysisResult } = useEventData();
  const navigate = useNavigate();
  
  const eventData = getEventData();
  const analysisResult = getAnalysisResult();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateLayouts = async () => {
    if (!uploadedImage) {
      alert('Please upload an image first');
      return;
    }

    if (!eventData || !analysisResult) {
      alert('No event planning data found. Please complete the AI Chat Assistant first.');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('image', uploadedImage);
      formData.append('eventData', JSON.stringify(eventData));
      formData.append('analysisResult', JSON.stringify(analysisResult));

      const response = await axios.post(
        'http://localhost:5000/api/image-processing/generate-layouts',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setLayoutResults(response.data.data);
      } else {
        alert('Failed to generate layouts: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate layouts. Please make sure the backend is running.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-xl border border-violet-500/30">
              <Image className="text-violet-400" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                Venue Layout Generator
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Upload your venue image to generate AI-powered layout variations
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

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <Upload className="text-violet-400" size={20} />
            <h2 className="text-xl font-semibold text-white">Upload Venue Image</h2>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
              ${
                isDragging
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-gray-600 bg-gray-900/50"
              }
              hover:border-violet-500 hover:bg-violet-500/5 cursor-pointer
            `}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-violet-500/20 rounded-full">
                <Upload className="text-violet-400" size={32} />
              </div>
              <div>
                <p className="text-gray-300 font-medium mb-1">
                  Drag & drop your venue image here
                </p>
                <p className="text-gray-500 text-sm">or click to browse</p>
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-lg font-semibold transition-all shadow-lg">
                Select Image
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Supported Formats */}
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-xs">
              Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
            </p>
          </div>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <Image className="text-violet-400" size={20} />
            <h2 className="text-xl font-semibold text-white">Preview</h2>
          </div>

          {/* Image Preview or Empty State */}
          {imagePreview ? (
            <div className="border-2 border-violet-500 rounded-xl overflow-hidden bg-gray-900/50">
              <img
                src={imagePreview}
                alt="Venue preview"
                className="w-full h-auto object-contain max-h-[400px]"
              />
            </div>
          ) : (
            <div className="border-2 border-gray-700 rounded-xl p-12 text-center bg-gray-900/50 min-h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-800 rounded-full">
                  <Image className="text-gray-600" size={32} />
                </div>
                <p className="text-gray-500">No image uploaded yet</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Generate Button */}
      {imagePreview && eventData && analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <button
            onClick={handleGenerateLayouts}
            disabled={isProcessing}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Generating Layouts...</span>
              </>
            ) : (
              <>
                <Sparkles size={24} />
                <span>Generate Layout Variations</span>
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Processing Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-gray-800 rounded-2xl p-8 border border-violet-500/30 max-w-md">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-violet-500/20 rounded-full animate-ping absolute"></div>
                  <div className="w-20 h-20 flex items-center justify-center relative">
                    <Loader2 className="animate-spin text-violet-400" size={40} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">Analyzing Venue</h3>
                <p className="text-gray-400 text-center">
                  AI is analyzing your venue image and generating optimized layout variations...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      {layoutResults && (
        <LayoutResults results={layoutResults} />
      )}

      {/* Features Section - Only show if no results */}
      {!layoutResults && (
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
                <Sparkles className="text-violet-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Advanced AI analyzes your venue space, layout, and limitations
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Zap className="text-purple-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">Smart Layouts</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Generates 3 optimized layout variations based on your event requirements
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 rounded-xl p-6 border border-pink-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Image className="text-pink-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">Visual Results</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Get detailed descriptions, key features, and trade-off analysis
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Layout Results Component
function LayoutResults({ results }) {
  const { layouts, recommendation, venueAnalysis } = results;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Venue Analysis */}
      {venueAnalysis && (
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="text-violet-400" size={24} />
            Venue Analysis
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Space Type</p>
              <p className="text-white font-semibold">{venueAnalysis.spaceType}</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Estimated Capacity</p>
              <p className="text-white font-semibold">{venueAnalysis.capacity}</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Key Features</p>
              <p className="text-white font-semibold">{venueAnalysis.features}</p>
            </div>
          </div>
          {venueAnalysis.limitations && (
            <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <p className="text-orange-400 font-semibold mb-2">Limitations:</p>
              <p className="text-gray-300 text-sm">{venueAnalysis.limitations}</p>
            </div>
          )}
        </div>
      )}

      {/* Layout Variations */}
      <div className="grid md:grid-cols-3 gap-6">
        {layouts.map((layout, index) => {
          const isRecommended = recommendation && layout.name === recommendation.selectedLayout;
          
          return (
            <div
              key={index}
              className={`bg-gray-800/50 rounded-2xl p-6 border-2 transition-all ${
                isRecommended
                  ? "border-violet-500 shadow-lg shadow-violet-500/20"
                  : "border-gray-700"
              }`}
            >
              {isRecommended && (
                <div className="flex items-center gap-2 mb-4 text-yellow-400">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Recommended</span>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-white mb-3">{layout.name}</h3>
              
              {/* Generated Layout Image */}
              {layout.imageUrl && (
                <div className="mb-4 rounded-lg overflow-hidden border-2 border-violet-500/30">
                  <img
                    src={layout.imageUrl}
                    alt={`${layout.name} visualization`}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Description:</p>
                  <p className="text-gray-300 text-sm line-clamp-1">{layout.description}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm mb-1">Key Features:</p>
                  <ul className="space-y-1">
                    {layout.keyFeatures.slice(0, 2).map((feature, idx) => (
                      <li key={idx} className="text-gray-300 text-xs flex items-start gap-2">
                        <span className="text-violet-400 mt-1">•</span>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 rounded-2xl p-6 border-2 border-violet-500">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="text-yellow-400" size={28} />
            Final Recommendation
          </h2>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-white font-semibold mb-2">{recommendation.selectedLayout}</p>
            <p className="text-gray-300 leading-relaxed">{recommendation.reason}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ImageProcessingPage;
