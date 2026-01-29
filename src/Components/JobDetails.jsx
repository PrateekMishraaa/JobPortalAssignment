// components/JobDetails.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaRegCalendarAlt, 
  FaMapMarkerAlt, 
  FaRupeeSign,
  FaShareAlt,
  FaBookmark,
  FaExternalLinkAlt,
  FaUsers,
  FaClock,
  FaArrowLeft
} from 'react-icons/fa';

const JobDetails = ({ job }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // Format salary
  const formatSalary = () => {
    if (typeof job.salary === "object") {
      const min = job.salary.min || 0;
      const max = job.salary.max || 0;
      return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')} LPA`;
    }
    return job.salary || "Negotiable";
  };

  // Format experience
  const formatExperience = () => {
    if (typeof job.experience === "object") {
      return `${job.experience.min || 0} - ${job.experience.max || 0} yrs`;
    }
    return job.experience || "Not specified";
  };

  // Format location
  const formatLocation = () => {
    if (typeof job.location === "object") {
      return `${job.location.city || ""}, ${job.location.state || ""}`;
    }
    return job.location || "Remote";
  };

  // Navigate to Apply page with ID in URL
  const handleApply = () => {
    navigate(`/apply/${job._id}`);
  };

  const skills = job.skills || ["JavaScript", "React", "Node.js", "MongoDB", "AWS", "Git", "REST APIs"];

  return (
    <div className="space-y-6 w-full p-4 md:p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <FaArrowLeft /> Back to Jobs
      </button>

      {/* Top Job Card */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border border-blue-200">
                <span className="font-bold text-blue-700 text-xl">{job.company?.[0]?.toUpperCase() || "C"}</span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title || "Role"}</h1>
                <p className="text-lg text-gray-700 font-medium mb-4">{job.company || "Company"}</p>
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-6">
                  <div className="flex items-center gap-2"><FaClock className="text-gray-400" /> Posted 2 days ago</div>
                  <div className="flex items-center gap-2"><FaUsers className="text-gray-400" /> Over 25 applicants</div>
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FaRegCalendarAlt className="text-blue-600 text-lg" />
                    </div>
                    <div><div className="text-sm text-gray-600">Experience</div><div className="font-bold text-gray-900">{formatExperience()}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <FaMapMarkerAlt className="text-green-600 text-lg" />
                    </div>
                    <div><div className="text-sm text-gray-600">Location</div><div className="font-bold text-gray-900">{formatLocation()}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                      <FaRupeeSign className="text-yellow-600 text-lg" />
                    </div>
                    <div><div className="text-sm text-gray-600">Salary</div><div className="font-bold text-gray-900">{formatSalary()}</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <button 
              onClick={handleApply}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >Apply</button>
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                isSaved ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >{isSaved ? 'Saved' : 'Save'}</button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <FaShareAlt /> Share
            </button>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Skills Required:</h3>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-medium hover:bg-blue-100 transition cursor-pointer">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
