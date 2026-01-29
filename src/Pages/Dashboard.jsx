// Pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'
import JobDetails from '../components/JobDetails.jsx'
import { useJobs } from '../context/JobsContext'

const Dashboard = () => {
  const { applyFilters, jobs, filters } = useJobs()
  const [selectedJob, setSelectedJob] = useState(null)
  const [sidebarFilters, setSidebarFilters] = useState({})

  // Combine Navbar and Sidebar filters
  useEffect(() => {
    const allFilters = {
      ...filters,
      ...convertSidebarFilters(sidebarFilters)
    };
    
    console.log("Combined filters:", allFilters);
    applyFilters(allFilters);
  }, [filters, sidebarFilters, applyFilters]);

  // Convert sidebar filters to Navbar filter format
  const convertSidebarFilters = (filters) => {
    const result = {};
    
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        // For multi-select, join with comma
        result[key] = values.join(',');
      }
    });
    
    return result;
  };

  // Handle sidebar filter changes
  const handleSidebarFilterChange = (newFilters) => {
    console.log("Sidebar filters changed:", newFilters);
    setSidebarFilters(newFilters);
  };

  // Handle job selection
  const handleJobSelect = (job) => {
    console.log("Job selected:", job.title);
    setSelectedJob(job);
  };

  // Automatically select first job
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0])
    }
  }, [jobs, selectedJob])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={applyFilters} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Job List (Sidebar) */}
          <div className="lg:w-2/5 xl:w-1/3">
            <Sidebar 
              onJobSelect={handleJobSelect} 
              selectedJobId={selectedJob?._id}
            />
          </div>
          
          {/* Middle Column - Job Details */}
          <div className="lg:w-2/5 xl:w-2/5">
            {selectedJob ? (
              <>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-700 text-sm">
                      <span>🔍 Showing {jobs.length} jobs</span>
                      {Object.keys(filters).length > 0 && (
                        <span className="text-blue-600">
                          (Filtered results)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        applyFilters({});
                        setSidebarFilters({});
                      }}
                      className="text-sm text-red-600 hover:text-red-800 hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
                <JobDetails job={selectedJob}  />
              </>
            ) : (
              <div className="bg-white rounded-lg border p-8 shadow-sm text-center h-full flex flex-col justify-center items-center min-h-[500px]">
                <div className="text-gray-300 mb-4">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Select a Job</h2>
                <p className="text-gray-600 max-w-md">
                  {jobs.length > 0 
                    ? "Click on any job from the list to view its complete details here."
                    : "No jobs available. Try adjusting your filters."}
                </p>
              </div>
            )}
          </div>
          
          {/* Right Column - Filters */}
          <div className="lg:w-1/4 xl:w-1/4">
            <FilterSidebar 
              onFilterChange={handleSidebarFilterChange}
              currentFilters={sidebarFilters}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard