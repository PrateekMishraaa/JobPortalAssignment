// pages/Apply.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaPhone, FaBriefcase,
  FaArrowLeft, FaCheckCircle
} from 'react-icons/fa';
import { useJobs } from '../context/JobsContext';
import Swal from "sweetalert2"
import axios from 'axios';

const Apply = () => {
  const { id } = useParams(); // Get Job ID from URL
  const jobs = useJobs();
  const navigate = useNavigate();

  // Find job by ID
  const job = jobs.allJobs?.find(j => j._id === id);

  const [formData, setFormData] = useState({
    fullName: '', 
    email: '', 
    phone: '', 
    coverLetter: '', 
    resume: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  if (!job) return <p className="text-center mt-20 text-xl font-semibold">Job not found.</p>;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'file' ? files[0] : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // IMPORTANT: Use correct field names that match backend
      formDataToSend.append('fullname', formData.fullName); // Note: 'fullname' not 'fullName'
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobile', formData.phone); // Note: 'mobile' not 'phone'
      formDataToSend.append('coverLetter', formData.coverLetter);
      
      // Add resume file if exists
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      } else {
        Swal.fire('Error', 'Please upload your resume', 'error');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Sending form data:', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        hasResume: !!formData.resume
      });
      
      // Send request WITHOUT setting Content-Type header (axios sets it automatically for FormData)
      const response = await axios.post(
        `https://jobportalassignmentbackend.onrender.com/api/applyjobs/${id}`,
        formDataToSend
        // Remove the headers object - let axios set it automatically
      );
      
      console.log('Response:', response.data);
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
        resume: null
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Job Applied Successfully',
        timer: 2000,
        showConfirmButton: false
      });
      
      setIsSubmitted(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.log('Error details:', error);
      
      // Show detailed error message
      let errorMessage = 'Something went wrong';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Application Failed',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
        Swal.fire('Please fill all fields', '', 'warning');
        return;
      }
      if (!/^\d{10}$/.test(formData.phone)) {
        Swal.fire('Phone must be 10 digits', '', 'warning');
        return;
      }
    }
    if (currentStep === 2 && !formData.coverLetter.trim()) {
      Swal.fire('Please write a cover letter', '', 'warning');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Add file validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('File too large', 'Maximum size is 5MB', 'error');
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        Swal.fire('Invalid file type', 'Please upload PDF, DOC, DOCX, JPG, or PNG', 'error');
        return;
      }
      
      setFormData(prev => ({ ...prev, resume: file }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Your application for <span className="font-semibold text-blue-600">{job.title}</span> has been received.
          </p>
          <div className="space-y-3">
            <button onClick={() => navigate('/jobs')} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg">Browse More Jobs</button>
            <button onClick={() => navigate('/dashboard')} className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition duration-300">View Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <FaArrowLeft /> Back to Job
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
          <p className="text-gray-700 mb-4">{job.company}</p>
          <div className="text-sm text-gray-500">
            <p>Application Steps: 
              <span className={`ml-2 ${currentStep >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>Personal Info</span> → 
              <span className={`ml-2 ${currentStep >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>Cover Letter</span> → 
              <span className={`ml-2 ${currentStep >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>Resume Upload</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-blue-600" />
                </div>
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    placeholder="Enter your full name" 
                    required 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Enter your email" 
                    required 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="10-digit phone number" 
                    required 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <p className="text-sm text-gray-500 mt-1">Must be 10 digits</p>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                >
                  Continue to Cover Letter →
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaBriefcase className="text-blue-600" />
                </div>
                Cover Letter
              </h2>
              <div>
                <label className="block text-gray-700 mb-2">Tell us why you're a good fit *</label>
                <textarea 
                  name="coverLetter" 
                  value={formData.coverLetter} 
                  onChange={handleChange} 
                  rows={6} 
                  placeholder="Write your cover letter here..." 
                  required 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <p className="text-sm text-gray-500 mt-1">Minimum 50 characters recommended</p>
              </div>
              <div className="flex justify-between mt-8">
                <button 
                  type="button" 
                  onClick={prevStep} 
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300 font-medium"
                >
                  ← Back
                </button>
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                >
                  Continue to Resume Upload →
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaBriefcase className="text-blue-600" />
                </div>
                Resume Upload
              </h2>
              <div>
                <label className="block text-gray-700 mb-2">Upload Resume/CV *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition duration-300 cursor-pointer">
                  <input 
                    type="file" 
                    name="resume" 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden" 
                    id="resume-upload"
                    required
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FaBriefcase className="text-blue-500 text-2xl" />
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-1">Click to upload resume</p>
                      <p className="text-gray-500 text-sm">PDF, DOC, DOCX, JPG, or PNG (Max 5MB)</p>
                    </div>
                  </label>
                  {formData.resume && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-700 font-medium">✓ File selected: {formData.resume.name}</p>
                      <p className="text-green-600 text-sm">{(formData.resume.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button 
                  type="button" 
                  onClick={prevStep} 
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300 font-medium"
                >
                  ← Back
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !formData.resume}
                  className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                    isSubmitting || !formData.resume
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Apply;