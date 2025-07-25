import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import instance from '../../utils/axiosInstance';

const ReviewProgress = () => {
  const userRegNum = useSelector((state) => state.userSlice?.reg_num);
  const [activeTab, setActiveTab] = useState('guide');
  const [guideReviews, setGuideReviews] = useState([]);
  const [subExpertReviews, setSubExpertReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userRegNum) {
      setError('Registration number not found');
      setLoading(false);
      return;
    }

    const fetchAllReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [guideResponse, subExpertResponse] = await Promise.all([
          instance.get(`/api/guide/${userRegNum}/schedules`),
          instance.get(`/api/sub-expert/${userRegNum}/schedules`)
        ]);

        if (guideResponse.data.status) {
          setGuideReviews(guideResponse.data.schedules?.map(review => ({
            ...review,
            status: review.status || 'Not completed'
          })) || []);
        }

        if (subExpertResponse.data.status) {
          setSubExpertReviews(subExpertResponse.data.schedules?.map(review => ({
            ...review,
            status: review.status || 'Not completed'
          })) || []);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.response?.data?.error || err.message || "Failed to load review schedules");
      } finally {
        setLoading(false);
      }
    };

    fetchAllReviews();
  }, [userRegNum]);

  const handleStatusChange = async (reviewId, newStatus, isGuideReview) => {
    try {
      setUpdatingStatus(true);
      
      const endpoint = isGuideReview
        ? `/api/guide/${userRegNum}/review/${reviewId}/status`
        : `/api/sub-expert/${userRegNum}/review/${reviewId}/status`;

      await instance.patch(endpoint, { status: newStatus });
      
      if (isGuideReview) {
        setGuideReviews(prev => prev.map(review => 
          review.review_id === reviewId ? { ...review, status: newStatus } : review
        ));
      } else {
        setSubExpertReviews(prev => prev.map(review => 
          review.review_id === reviewId ? { ...review, status: newStatus } : review
        ));
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.error || err.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAwardMarks = (review) => {
    navigate(`/guide/award-marks/${userRegNum}/team/${review.team_id}`, {
      state: { 
        reviewId: review.review_id,
        teamId: review.team_id,
        projectId: review.project_id,
        reviewType: review.review_type,
        semester: review.semester 
      }
    });
  };

  const formatDateTime = (dateString, timeString) => {
    try {
      if (!dateString || !timeString) return 'Not scheduled';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      date.setHours(hours, minutes, seconds || 0);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date/time';
    }
  };

  const renderTable = (reviews, isGuideReview = true) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border text-left">Team</th>
              <th className="py-3 px-4 border text-left">Project</th>
              <th className="py-3 px-4 border text-left">Type</th>
              <th className="py-3 px-4 border text-left">Scheduled Time</th>
              <th className="py-3 px-4 border text-left">Venue</th>
              <th className="py-3 px-4 border text-left">Status</th>
              <th className="py-3 px-4 border text-left">Meeting</th>
              <th className="py-3 px-4 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.review_id} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="py-3 px-4 border font-medium">{review.team_id || 'N/A'}</td>
                <td className="py-3 px-4 border">{review.project_id || 'N/A'}</td>
                <td className="py-3 px-4 border">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {review.review_type || 'N/A'}
                  </span>
                </td>
                <td className="py-3 px-4 border">
                  {formatDateTime(review.date, review.time)}
                </td>
                <td className="py-3 px-4 border">{review.venue || 'Not specified'}</td>
                <td className="py-3 px-4 border">
                  <select
                    value={review.status}
                    onChange={(e) => handleStatusChange(review.review_id, e.target.value, isGuideReview)}
                    className="border rounded px-2 py-1 text-sm"
                    disabled={updatingStatus}
                  >
                    <option value="Not completed">Not completed</option>
                    <option value="Completed">Completed</option>
                    <option value="Rescheduled">Rescheduled</option>
                  </select>
                </td>
                <td className="py-3 px-4 border">
                  {review.meeting_link ? (
                    <a href={review.meeting_link} target="_blank" rel="noopener noreferrer"
                      className="text-purple-600 hover:underline flex items-center">
                      <span>Join</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="py-3 px-4 border">
                  {review.status === 'Completed' && (
                    <button
                      onClick={() => handleAwardMarks(review)}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 text-sm"
                    >
                      Award Marks
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid"></div>
        <p className="mt-4 text-gray-600">Loading review schedules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="bg-red-50 p-4 rounded border border-red-200">
          <h3 className="text-red-700 font-medium">Error Loading Reviews</h3>
          <p className="text-red-600 mt-1">{typeof error === 'string' ? error : JSON.stringify(error)}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold text-purple-700">Review Schedules</h1>
        <Link 
          to="/guide/optional_review_progress"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          View Optional Reviews
        </Link>
      </div>
      
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'guide' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-purple-600'}`}
          onClick={() => setActiveTab('guide')}
        >
          Guide Reviews
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'subExpert' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-purple-600'}`}
          onClick={() => setActiveTab('subExpert')}
        >
          Sub-Expert Reviews
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {activeTab === 'guide' ? 'Guide Review Schedules' : 'Sub-Expert Review Schedules'}
          </h2>
          <span className="text-sm text-gray-500">
            {activeTab === 'guide' ? guideReviews.length : subExpertReviews.length} total reviews
          </span>
        </div>
        
        {activeTab === 'guide' ? (
          guideReviews.length === 0 ? (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800">No guide review schedules found.</p>
            </div>
          ) : (
            renderTable(guideReviews, true)
          )
        ) : (
          subExpertReviews.length === 0 ? (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800">No sub-expert review schedules found.</p>
            </div>
          ) : (
            renderTable(subExpertReviews, false)
          )
        )}
      </div>
    </div>
  );
};

export default ReviewProgress;