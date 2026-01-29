// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Navbar = ({ onSearch, filters = {} }) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    experience: "",
    salary: "",
    function: "",
    industry: "",
    fullStack: "",
    jobType: "",
    keyword: ""
  });
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Filter options
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
  const experienceRanges = ["0-2 years", "2-5 years", "5-8 years", "8+ years"];
  const salaryRanges = [
    "₹0-3 LPA",
    "₹3-6 LPA",
    "₹6-10 LPA",
    "₹10-15 LPA",
    "₹15-20 LPA",
    "₹20+ LPA"
  ];
  const functions = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"];
  const industries = ["IT", "Healthcare", "Finance", "E-commerce", "Education", "Manufacturing"];



  const handleLogout=()=>{
    localStorage.removeItem('token')
    Swal.fire("User Logout Successfully")
    setTimeout(()=>{
      navigate('/login')
    },2000)
  }
  // Sync with external filters
  useEffect(() => {
    setSearchFilters(filters);
  }, [filters]);

  // Handle filter change with debounce
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...searchFilters, [filterName]: value };
    setSearchFilters(newFilters);
    
    console.log("Filter changed:", filterName, value);
    
    // Apply filters immediately with debounce
    if (onSearch) {
      // Clear existing timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      // Set new timeout for debouncing
      const timeout = setTimeout(() => {
        console.log("Applying filters after debounce:", newFilters);
        onSearch(newFilters);
      }, 500); // 500ms delay for better UX
      
      setSearchTimeout(timeout);
    }
  };

  // Handle immediate filter change (for select dropdowns)
  const handleImmediateFilterChange = (filterName, value) => {
    const newFilters = { ...searchFilters, [filterName]: value };
    setSearchFilters(newFilters);
    
    console.log("Immediate filter change:", filterName, value);
    
    if (onSearch) {
      console.log("Applying immediate filters:", newFilters);
      onSearch(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: "",
      experience: "",
      salary: "",
      function: "",
      industry: "",
      fullStack: "",
      jobType: "",
      keyword: ""
    };
    setSearchFilters(clearedFilters);
    console.log("Clearing all filters");
    
    if (onSearch) {
      onSearch(clearedFilters);
    }
    
    // Close search bar if open
    setShowSearchBar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search form submitted:", searchFilters);
    
    if (onSearch) {
      onSearch(searchFilters);
    }
    setShowSearchBar(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Count active filters
  const activeFilterCount = Object.values(searchFilters).filter(
    filter => filter && filter.toString().trim() !== ""
  ).length;

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          <Link
            to="/"
            className="text-xl font-semibold font-serif text-gray-800 hover:text-blue-700 transition"
          >
            CredePath
          </Link>
        </div>

        {/* Search Bar Trigger */}
        <div className="flex-1 max-w-3xl mx-8">
          <div className="relative">
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center text-gray-500 group-hover:text-blue-600 transition">
                <FaSearch className="mr-3" />
                <span>
                  {searchFilters.keyword 
                    ? `Searching: ${searchFilters.keyword}`
                    : "Search by company, jobs, skills..."}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FaFilter className="text-blue-500" />
                <span className="text-sm text-gray-600">
                  {activeFilterCount > 0 ? `${activeFilterCount} filter(s)` : "Filters"}
                </span>
              </div>
            </button>
            
            {/* Active Filters Preview */}
            {(searchFilters.location || searchFilters.experience || searchFilters.salary) && (
              <div className="absolute -bottom-8 left-0 flex items-center gap-2">
                {searchFilters.location && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                    📍 {searchFilters.location}
                  </span>
                )}
                {searchFilters.experience && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                    💼 {searchFilters.experience}
                  </span>
                )}
                {searchFilters.salary && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1">
                    ₹ {searchFilters.salary}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <ul className="flex gap-8 text-sm font-medium">
          <li>
            <Link to="/" className="hover:text-blue-700 transition font-bold text-gray-700">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="hover:text-blue-700 transition font-bold text-gray-700">
              Jobs
            </Link>
          </li>
        </ul>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 transition hover:scale-105"
            aria-label="Profile menu"
          >
            <FaUser className="text-blue-600" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
              <Link
                to="/profile"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <FaUser className="text-gray-500" />
                Profile
              </Link>
              <Link
                to="/login"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                🔐 Login
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              <p
             
                className="block px-4 py-3 cursor-pointer text-red-600 hover:bg-red-50 transition flex items-center gap-2"
               onClick={handleLogout}
              >
                🚪 Logout
              </p>
            </div>
          )}
        </div>

        {/* Expanded Search Bar Modal */}
        {showSearchBar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowSearchBar(false)}>
            <div 
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-5xl bg-white rounded-2xl shadow-2xl z-50 animate-fadeIn" 
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Advanced Job Search</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Find your perfect job by applying filters
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSearchBar(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-full transition"
                    aria-label="Close search"
                  >
                    ✕
                  </button>
                </div>

                {/* Keyword Search */}
                <div className="mb-8">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-4 text-gray-400 text-lg" />
                    <input
                      type="text"
                      placeholder="Search by company, job title, or skills (e.g., React, Manager, Google)"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
                      value={searchFilters.keyword}
                      onChange={(e) => handleFilterChange("keyword", e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      <span>Location</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City, State"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={searchFilters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Try: Delhi, Bangalore, Remote
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <span className="text-lg">💼</span>
                      <span>Experience</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      value={searchFilters.experience}
                      onChange={(e) => handleImmediateFilterChange("experience", e.target.value)}
                    >
                      <option value="">Select Experience</option>
                      {experienceRanges.map((exp) => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>

                  {/* Salary */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      <span>Salary</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      value={searchFilters.salary}
                      onChange={(e) => handleImmediateFilterChange("salary", e.target.value)}
                    >
                      <option value="">Select Salary</option>
                      {salaryRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>

                  {/* Function */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <span className="text-lg">🏢</span>
                      <span>Function</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      value={searchFilters.function}
                      onChange={(e) => handleImmediateFilterChange("function", e.target.value)}
                    >
                      <option value="">Select Function</option>
                      {functions.map((func) => (
                        <option key={func} value={func}>{func}</option>
                      ))}
                    </select>
                  </div>

                  {/* Industry */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <span className="text-lg">🏭</span>
                      <span>Industry</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      value={searchFilters.industry}
                      onChange={(e) => handleImmediateFilterChange("industry", e.target.value)}
                    >
                      <option value="">Select Industry</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  {/* Full Stack */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <span className="text-lg">🔧</span>
                      <span>Full Stack</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      value={searchFilters.fullStack}
                      onChange={(e) => handleImmediateFilterChange("fullStack", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {/* Job Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <span className="text-lg">⏰</span>
                      <span>Job Type</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      value={searchFilters.jobType}
                      onChange={(e) => handleImmediateFilterChange("jobType", e.target.value)}
                    >
                      <option value="">Select Job Type</option>
                      {jobTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {activeFilterCount > 0 && (
                  <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-blue-700 font-medium">
                        <FaFilter className="text-blue-600" />
                        Active Filters ({activeFilterCount})
                      </div>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-sm text-red-600 hover:text-red-800 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(searchFilters).map(([key, value]) => {
                        if (!value || value.toString().trim() === "") return null;
                        
                        const getLabel = (k) => {
                          const labels = {
                            location: "📍 Location",
                            experience: "💼 Experience",
                            salary: "💰 Salary",
                            function: "🏢 Function",
                            industry: "🏭 Industry",
                            fullStack: "🔧 Full Stack",
                            jobType: "⏰ Job Type",
                            keyword: "🔍 Keyword"
                          };
                          return labels[k] || k;
                        };
                        
                        return (
                          <div
                            key={key}
                            className="flex items-center bg-white text-blue-700 text-sm px-3 py-2 rounded-full border border-blue-200 shadow-sm"
                          >
                            <span className="mr-2">
                              {getLabel(key)}: <span className="font-semibold">{value}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newFilters = { ...searchFilters, [key]: "" };
                                setSearchFilters(newFilters);
                                if (onSearch) onSearch(newFilters);
                              }}
                              className="text-blue-500 hover:text-blue-800 ml-1"
                              aria-label={`Remove ${key} filter`}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-5 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition font-medium"
                    >
                      Clear all filters
                    </button>
                    <div className="text-sm text-gray-500">
                      {activeFilterCount > 0 
                        ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied`
                        : "No filters applied"}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowSearchBar(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <FaSearch />
                      Search Jobs
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </nav>
      
      {/* Add custom animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Navbar;