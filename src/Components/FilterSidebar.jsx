// components/FilterSidebar.jsx
import React, { useState } from 'react';
import { 
  FaFilter, 
  FaTimes, 
  FaMapMarkerAlt, 
  FaRegCalendarAlt, 
  FaRupeeSign,
  FaBriefcase,
  FaIndustry,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaSlidersH
} from 'react-icons/fa';

const FilterSidebar = ({ onFilterChange, currentFilters = {} }) => {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    experience: true,
    salary: true,
    function: true,
    industry: true,
    jobType: true
  });

  // Sample data with counts
  const filterOptions = {
    location: [
      { value: 'bangalore', label: 'Bangalore', count: 999 },
      { value: 'delhi', label: 'Delhi', count: 899 },
      { value: 'mumbai', label: 'Mumbai', count: 799 },
      { value: 'hyderabad', label: 'Hyderabad', count: 689 },
      { value: 'chennai', label: 'Chennai', count: 589 },
      { value: 'pune', label: 'Pune', count: 489 },
      { value: 'remote', label: 'Remote', count: 389 },
      { value: 'gurgaon', label: 'Gurgaon', count: 289 },
      { value: 'noida', label: 'Noida', count: 189 },
      { value: 'kolkata', label: 'Kolkata', count: 89 }
    ],
    
    experience: [
      { value: '0-1', label: '0 - 1 Years', count: 999 },
      { value: '1-2', label: '1 - 2 Years', count: 899 },
      { value: '2-3', label: '2 - 3 Years', count: 799 },
      { value: '3-5', label: '3 - 5 Years', count: 699 },
      { value: '5-8', label: '5 - 8 Years', count: 599 },
      { value: '8-10', label: '8 - 10 Years', count: 299 },
      { value: '10+', label: '10+ Years', count: 99 }
    ],
    
    salary: [
      { value: '0-3', label: '₹0-3 LPA', count: 999 },
      { value: '3-6', label: '₹3-6 LPA', count: 899 },
      { value: '6-10', label: '₹6-10 LPA', count: 799 },
      { value: '10-15', label: '₹10-15 LPA', count: 599 },
      { value: '15-20', label: '₹15-20 LPA', count: 299 },
      { value: '20-30', label: '₹20-30 LPA', count: 99 },
      { value: '30+', label: '₹30+ LPA', count: 49 }
    ],
    
    function: [
      { value: 'engineering', label: 'Engineering', count: 1299 },
      { value: 'marketing', label: 'Marketing', count: 799 },
      { value: 'sales', label: 'Sales', count: 699 },
      { value: 'hr', label: 'HR', count: 299 },
      { value: 'finance', label: 'Finance', count: 399 },
      { value: 'operations', label: 'Operations', count: 499 },
      { value: 'design', label: 'Design', count: 199 }
    ],
    
    industry: [
      { value: 'it', label: 'IT', count: 1899 },
      { value: 'healthcare', label: 'Healthcare', count: 699 },
      { value: 'finance', label: 'Finance', count: 799 },
      { value: 'ecommerce', label: 'E-commerce', count: 599 },
      { value: 'education', label: 'Education', count: 299 },
      { value: 'manufacturing', label: 'Manufacturing', count: 199 },
      { value: 'retail', label: 'Retail', count: 99 }
    ],
    
    jobType: [
      { value: 'full-time', label: 'Full-time', count: 1999 },
      { value: 'part-time', label: 'Part-time', count: 299 },
      { value: 'contract', label: 'Contract', count: 199 },
      { value: 'internship', label: 'Internship', count: 499 },
      { value: 'remote', label: 'Remote', count: 699 }
    ]
  };

  const [showMore, setShowMore] = useState({
    location: false,
    experience: false,
    salary: false,
    function: false,
    industry: false,
    jobType: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleShowMore = (section) => {
    setShowMore(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (section, value) => {
    const currentSectionFilters = currentFilters[section] || [];
    let newFilters;
    
    if (currentSectionFilters.includes(value)) {
      newFilters = currentSectionFilters.filter(item => item !== value);
    } else {
      newFilters = [...currentSectionFilters, value];
    }
    
    const updatedFilters = {
      ...currentFilters,
      [section]: newFilters
    };
    
    if (newFilters.length === 0) {
      delete updatedFilters[section];
    }
    
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const clearAllFilters = () => {
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const clearSection = (section) => {
    const updatedFilters = { ...currentFilters };
    delete updatedFilters[section];
    
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const getActiveFilterCount = () => {
    return Object.values(currentFilters).reduce((total, filters) => total + filters.length, 0);
  };

  const getSectionIcon = (section) => {
    switch (section) {
      case 'location': return <FaMapMarkerAlt className="text-blue-500" />;
      case 'experience': return <FaRegCalendarAlt className="text-green-500" />;
      case 'salary': return <FaRupeeSign className="text-yellow-500" />;
      case 'function': return <FaBriefcase className="text-purple-500" />;
      case 'industry': return <FaIndustry className="text-red-500" />;
      case 'jobType': return <FaCheck className="text-indigo-500" />;
      default: return <FaFilter className="text-gray-500" />;
    }
  };

  const getSectionTitle = (section) => {
    const titles = {
      location: 'Location',
      experience: 'Experience',
      salary: 'Salary',
      function: 'Function',
      industry: 'Industry',
      jobType: 'Job Type'
    };
    return titles[section] || section;
  };

  const renderFilterSection = (section) => {
    const options = filterOptions[section];
    const visibleOptions = showMore[section] ? options : options.slice(0, 5);
    const selectedOptions = currentFilters[section] || [];
    const hasSelectedOptions = selectedOptions.length > 0;

    return (
      <div key={section} className="border-b border-gray-100 pb-5">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => toggleSection(section)}
            className="flex items-center gap-2 text-gray-800 font-semibold hover:text-gray-900 text-sm"
          >
            {getSectionIcon(section)}
            <span>{getSectionTitle(section)}</span>
            {selectedOptions.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                {selectedOptions.length}
              </span>
            )}
          </button>
          <div className="flex items-center gap-1">
            {hasSelectedOptions && (
              <button
                onClick={() => clearSection(section)}
                className="text-xs text-red-500 hover:text-red-700 p-1"
                title="Clear section"
              >
                <FaTimes />
              </button>
            )}
            <button
              onClick={() => toggleSection(section)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              {expandedSections[section] ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
          </div>
        </div>

        {expandedSections[section] && (
          <div className="space-y-1.5">
            {visibleOptions.map((option) => {
              const isSelected = selectedOptions.includes(option.value);
              return (
                <div key={option.value} className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded w-full">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(section, option.value)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className={`flex-1 text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {option.count.toLocaleString()}
                    </span>
                  </label>
                </div>
              );
            })}

            {options.length > 5 && (
              <button
                onClick={() => toggleShowMore(section)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1 mt-2"
              >
                {showMore[section] ? (
                  <>
                    <FaChevronUp className="text-xs" />
                    Show Less Options
                  </>
                ) : (
                  <>
                    <FaChevronDown className="text-xs" />
                    Show More Options
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm h-fit sticky top-8">
      {/* Filter Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <FaSlidersH className="text-blue-600 text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <p className="text-xs text-gray-500">Refine your search</p>
            </div>
          </div>
          
          {getActiveFilterCount() > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-bold">
                {getActiveFilterCount()}
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:text-red-800 hover:underline"
              >
                Reset All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-4 space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto">
        {Object.keys(filterOptions).map(section => renderFilterSection(section))}
      </div>

      {/* Selected Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Filters:</h3>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(currentFilters).map(([section, values]) => {
              if (!values || values.length === 0) return null;
              
              return values.map(value => {
                const option = filterOptions[section]?.find(opt => opt.value === value);
                if (!option) return null;
                
                return (
                  <div
                    key={`${section}-${value}`}
                    className="flex items-center gap-1 bg-white border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full"
                  >
                    <span className="font-medium">{getSectionTitle(section)}:</span>
                    <span>{option.label}</span>
                    <button
                      onClick={() => {
                        const currentSectionFilters = currentFilters[section] || [];
                        const newFilters = currentSectionFilters.filter(item => item !== value);
                        const updatedFilters = {
                          ...currentFilters,
                          [section]: newFilters
                        };
                        if (newFilters.length === 0) {
                          delete updatedFilters[section];
                        }
                        if (onFilterChange) {
                          onFilterChange(updatedFilters);
                        }
                      }}
                      className="text-gray-500 hover:text-red-600 ml-0.5"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                );
              });
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;