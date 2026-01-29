// context/JobsContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import React from "react";

const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    experience: "",
    salary: "",
    function: "",
    industry: "",
    fullStack: "",
    jobType: ""
  });

  // Function to normalize data
  const normalizeJobData = (job) => {
    return {
      ...job,
      // Ensure all required fields exist
      title: job.title || "",
      company: job.company || "",
      location: job.location || "Remote",
      experience: job.experience || { min: 0, max: 0 },
      salary: job.salary || { min: 0, max: 0 },
      skills: job.skills || [],
      industry: job.industry || "IT",
      function: job.function || "Engineering",
      jobType: job.jobType || "Full-time",
      description: job.description || "",
      // Add mock data for missing fields
      postedDate: job.postedDate || new Date().toISOString(),
      openings: job.openings || 1
    };
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get("https://jobportalassignmentbackend.onrender.com/api/alljobs");
      const jobs = (response.data.jobsdata || []).map(normalizeJobData);
      setAllJobs(jobs);
      setFilteredJobs(jobs);
      setLoading(false);
      console.log("Jobs loaded:", jobs.length);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(true);
      setLoading(false);
    }
  };

  // Main filter function
  const applyFilters = useCallback((newFilters) => {
    console.log("Applying filters:", newFilters);
    setFilters(newFilters);
    
    if (allJobs.length === 0) {
      console.log("No jobs to filter");
      return;
    }
    
    let filtered = allJobs;
    
    // Keyword search (company, title, skills)
    if (newFilters.keyword && newFilters.keyword.trim() !== "") {
      const keyword = newFilters.keyword.toLowerCase().trim();
      console.log("Keyword search for:", keyword);
      
      filtered = filtered.filter(job => {
        // Create searchable text from all relevant fields
        const searchText = [
          job.title,
          job.company,
          job.description,
          job.skills?.join(' '),
          job.industry,
          job.function
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        
        const found = searchText.includes(keyword);
        if (found) {
          console.log("Found job with keyword:", job.title);
        }
        return found;
      });
      console.log("After keyword filter:", filtered.length);
    }
    
    // Location filter
    if (newFilters.location && newFilters.location.trim() !== "") {
      const location = newFilters.location.toLowerCase().trim();
      console.log("Location filter for:", location);
      
      filtered = filtered.filter(job => {
        if (typeof job.location === 'object') {
          const city = job.location.city?.toLowerCase() || '';
          const state = job.location.state?.toLowerCase() || '';
          const country = job.location.country?.toLowerCase() || '';
          
          const found = city.includes(location) || 
                       state.includes(location) || 
                       country.includes(location);
          
          if (found) {
            console.log("Found job with location:", job.title, job.location);
          }
          return found;
        }
        
        const jobLocation = (job.location || '').toLowerCase();
        const found = jobLocation.includes(location);
        if (found) {
          console.log("Found job with location:", job.title, job.location);
        }
        return found;
      });
      console.log("After location filter:", filtered.length);
    }
    
    // Experience filter
    if (newFilters.experience && newFilters.experience !== "") {
      console.log("Experience filter for:", newFilters.experience);
      
      filtered = filtered.filter(job => {
        const jobExp = job.experience;
        
        // Extract min and max experience from job
        let jobMin = 0;
        let jobMax = 0;
        
        if (typeof jobExp === 'object') {
          jobMin = jobExp.min || 0;
          jobMax = jobExp.max || jobMin;
        } else if (typeof jobExp === 'string') {
          // Try to parse string like "2-5 years"
          const match = jobExp.match(/(\d+)\s*(?:-|\s+to\s+)\s*(\d+)/i);
          if (match) {
            jobMin = parseInt(match[1]);
            jobMax = parseInt(match[2]);
          } else {
            // Single value like "5 years"
            const singleMatch = jobExp.match(/(\d+)/);
            if (singleMatch) {
              jobMin = parseInt(singleMatch[1]);
              jobMax = jobMin;
            }
          }
        }
        
        // Parse filter range
        const filterExp = newFilters.experience;
        
        if (filterExp.includes('+')) {
          // "8+ years" case
          const minYears = parseInt(filterExp.replace('+', '').replace('years', '').trim());
          return jobMin >= minYears;
        } else if (filterExp.includes('-')) {
          // "2-5 years" case
          const [minRange, maxRange] = filterExp.split('-').map(str => 
            parseInt(str.replace('years', '').trim())
          );
          return jobMin >= minRange && jobMax <= maxRange;
        }
        
        return true;
      });
      console.log("After experience filter:", filtered.length);
    }
    
    // Salary filter
    if (newFilters.salary && newFilters.salary !== "") {
      console.log("Salary filter for:", newFilters.salary);
      
      filtered = filtered.filter(job => {
        const jobSalary = job.salary;
        
        let jobMinLPA = 0;
        let jobMaxLPA = 0;
        
        if (typeof jobSalary === 'object') {
          // Convert to LPA (Lakhs per annum)
          jobMinLPA = (jobSalary.min || 0) / 100000;
          jobMaxLPA = (jobSalary.max || jobMinLPA) / 100000;
        }
        
        // Parse salary filter
        const filterSalary = newFilters.salary;
        
        if (filterSalary.includes('+')) {
          // "₹20+ LPA" case
          const minLPA = parseInt(filterSalary.replace('₹', '').replace('+ LPA', '').trim());
          return jobMinLPA >= minLPA;
        } else if (filterSalary.includes('-')) {
          // "₹3-6 LPA" case
          const [minRange, maxRange] = filterSalary
            .replace('₹', '')
            .replace(' LPA', '')
            .split('-')
            .map(str => parseInt(str.trim()));
          return jobMinLPA >= minRange && jobMaxLPA <= maxRange;
        }
        
        return true;
      });
      console.log("After salary filter:", filtered.length);
    }
    
    // Function filter
    if (newFilters.function && newFilters.function !== "") {
      console.log("Function filter for:", newFilters.function);
      
      filtered = filtered.filter(job => {
        const jobFunction = job.function || '';
        const filterFunction = newFilters.function.toLowerCase();
        
        const found = jobFunction.toLowerCase() === filterFunction;
        if (found) {
          console.log("Found job with function:", job.title, job.function);
        }
        return found;
      });
      console.log("After function filter:", filtered.length);
    }
    
    // Industry filter
    if (newFilters.industry && newFilters.industry !== "") {
      console.log("Industry filter for:", newFilters.industry);
      
      filtered = filtered.filter(job => {
        const jobIndustry = job.industry || '';
        const filterIndustry = newFilters.industry.toLowerCase();
        
        const found = jobIndustry.toLowerCase() === filterIndustry;
        if (found) {
          console.log("Found job with industry:", job.title, job.industry);
        }
        return found;
      });
      console.log("After industry filter:", filtered.length);
    }
    
    // Full Stack filter
    if (newFilters.fullStack && newFilters.fullStack !== "") {
      console.log("Full Stack filter for:", newFilters.fullStack);
      
      filtered = filtered.filter(job => {
        const searchText = [
          job.title,
          job.description,
          job.skills?.join(' ')
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        
        const isFullStack = 
          searchText.includes('full stack') ||
          searchText.includes('full-stack') ||
          searchText.includes('mern') ||
          searchText.includes('mean') ||
          searchText.includes('frontend') && searchText.includes('backend');
        
        return newFilters.fullStack === 'yes' ? isFullStack : !isFullStack;
      });
      console.log("After full stack filter:", filtered.length);
    }
    
    // Job Type filter
    if (newFilters.jobType && newFilters.jobType !== "") {
      console.log("Job Type filter for:", newFilters.jobType);
      
      filtered = filtered.filter(job => {
        const jobType = job.jobType || '';
        const filterJobType = newFilters.jobType.toLowerCase();
        
        const found = jobType.toLowerCase() === filterJobType;
        if (found) {
          console.log("Found job with job type:", job.title, job.jobType);
        }
        return found;
      });
      console.log("After job type filter:", filtered.length);
    }
    
    console.log("Final filtered jobs:", filtered.length);
    setFilteredJobs(filtered);
  }, [allJobs]);

  const clearFilters = useCallback(() => {
    console.log("Clearing filters");
    const clearedFilters = {
      keyword: "",
      location: "",
      experience: "",
      salary: "",
      function: "",
      industry: "",
      fullStack: "",
      jobType: ""
    };
    setFilters(clearedFilters);
    setFilteredJobs(allJobs);
  }, [allJobs]);

  const clearSingleFilter = useCallback((filterName) => {
    console.log("Clearing single filter:", filterName);
    const newFilters = { ...filters, [filterName]: "" };
    setFilters(newFilters);
    applyFilters(newFilters);
  }, [filters, applyFilters]);

  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply initial filters when jobs load
  useEffect(() => {
    if (allJobs.length > 0) {
      applyFilters(filters);
    }
  }, [allJobs, applyFilters, filters]);

  return (
    <JobsContext.Provider
      value={{ 
        jobs: filteredJobs, 
        allJobs,
        loading, 
        error,
        filters,
        applyFilters,
        clearFilters,
        clearSingleFilter,
        refetchJobs: fetchJobs
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};