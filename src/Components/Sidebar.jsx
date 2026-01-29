// components/Sidebar.jsx
import React from "react";
import { useJobs } from "../context/JobsContext.jsx";
import { 
  FaRegCalendarAlt, 
  FaMapMarkerAlt, 
  FaRupeeSign,
  FaFilter,
  FaTimes,
  FaCheckCircle
} from "react-icons/fa";

const Sidebar = ({ onJobSelect, selectedJobId }) => {
  const { 
    jobs, 
    loading, 
    error, 
    filters, 
    clearFilters,
    clearSingleFilter 
  } = useJobs();

  const handleJobClick = (job) => {
    if (onJobSelect) {
      onJobSelect(job);
    }
  };

  if (loading) return (
    <div className="w-full">
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-4 bg-gray-100 h-40"></div>
        ))}
      </div>
    </div>
  );
  
  if (error) return (
    <div className="w-full">
      <p className="text-red-500 bg-red-50 p-4 rounded-lg">Failed to load jobs. Please try again later.</p>
    </div>
  );

  return (
    <aside className="w-full space-y-6">
      {/* Filter Status Section */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Job List</h3>
          </div>
          {Object.values(filters).some(filter => filter && filter.trim() !== "") && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 hover:underline transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {Object.values(filters).some(filter => filter && filter.trim() !== "") && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value.trim() === "") return null;
              return (
                <div
                  key={key}
                  className="flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full border border-blue-100"
                >
                  <span className="mr-2">
                    {key === 'location' && '📍'}
                    {key === 'experience' && '💼'}
                    {key === 'salary' && '💰'}
                    {key === 'function' && '🏢'}
                    {key === 'industry' && '🏭'}
                    {key === 'fullStack' && '🔧'}
                    {key === 'jobType' && '⏰'}
                    {key === 'keyword' && '🔍'}
                    {key}: {value}
                  </span>
                  <button
                    onClick={() => clearSingleFilter(key)}
                    className="text-blue-500 hover:text-blue-800 transition"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-gray-700">
            <span className="font-bold text-gray-900">{jobs.length}</span> jobs found
          </span>
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center shadow-sm">
          <div className="text-gray-300 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-6">
            {Object.values(filters).some(filter => filter && filter.trim() !== "")
              ? "Try adjusting your filters"
              : "No jobs available"}
          </p>
          {Object.values(filters).some(filter => filter && filter.trim() !== "") && (
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isSelected = selectedJobId === job._id;
            
            return (
              <div
                key={job._id}
                onClick={() => handleJobClick(job)}
                className={`border rounded-lg p-5 shadow-sm transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-300' 
                    : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                {isSelected && (
                  <div className="flex items-center gap-2 text-blue-600 mb-3">
                    <FaCheckCircle className="text-blue-600" />
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}

                {/* Job Title & Company */}
                <div className="mb-4">
                  <h3 className={`font-bold text-lg ${
                    isSelected ? 'text-blue-800' : 'text-gray-900'
                  }`}>
                    {job.title || "Role - Heading"}
                  </h3>
                  <p className={`font-medium ${
                    isSelected ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {job.company || "Company - Name"}
                  </p>
                </div>

                {/* Job Info */}
                <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <FaRegCalendarAlt className={isSelected ? 'text-blue-500' : 'text-gray-500'} />
                    <span>
                      {typeof job.experience === "object"
                        ? `${job.experience.min || 0} - ${job.experience.max || 0} yrs`
                        : job.experience || "Not specified"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className={isSelected ? 'text-blue-500' : 'text-gray-500'} />
                    <span>
                      {typeof job.location === "object"
                        ? `${job.location.city || ""}, ${job.location.state || ""}`
                        : job.location || "Remote"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaRupeeSign className={isSelected ? 'text-blue-500' : 'text-gray-500'} />
                    <span>
                      {typeof job.salary === "object"
                        ? `₹${job.salary.min?.toLocaleString() || 0} - ₹${job.salary.max?.toLocaleString() || 0}`
                        : job.salary || "Negotiable"}
                    </span>
                  </div>
                </div>

                {/* View Similar Jobs Button */}
                <button className={`text-sm font-medium ${
                  isSelected ? 'text-blue-600 hover:text-blue-800' : 'text-gray-600 hover:text-gray-800'
                }`}>
                  View Similar Jobs →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;