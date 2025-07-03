import React from 'react';
import instance from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';

<<<<<<< HEAD
function InviteForm({ inviteForm, handleInviteChange, setIsInviteOpen }) {
  const selector = useSelector((Store) => Store.userSlice);

async function handleInviteSubmit(e) {
  e.preventDefault();
  
  const fromReg = selector.reg_num?.trim();
  const toReg = inviteForm.registerNumber?.trim();

  try {
    console.log("Sending invite from:", fromReg, "to:", toReg);
    
    const response = await instance.post("/student/join_request", {
      from_reg_num: fromReg,
      to_reg_num: toReg
    });

    // Handle successful response
    if (response.data.success) {
      alert(`✅ ${response.data.message}`);
      setIsInviteOpen(false);
      setTimeout(() => window.location.href = "/student", 1000);
    } else {
      // This handles cases where success=false but status code is 200
      alert(`⚠️ ${response.data.error || response.data.message}`);
    }
} catch (err) {
  console.error("Full error details:", err);
  alert(err.extractedMessage || "❌ Something went wrong!");
}

}
=======

function InviteForm({ inviteForm, handleInviteChange, setIsInviteOpen }) {
  const selector = useSelector((Store) => Store.userSlice);
  console.log(selector, "logg");

async function handleInviteSubmit(e) {
  e.preventDefault();
  console.log("Submitting invite...");

  try {
    const response = await instance.post("/student/join_request", {
      from_reg_num: selector.reg_num,
      to_reg_num: inviteForm.registerNumber  // Changed from registerNumber to to_reg_num
    });

    // Ensure we properly handle both string and object responses
    const successMessage = typeof response.data === 'string' 
      ? response.data 
      : response.data.message || "Invite sent successfully!";
    
    alert(successMessage);
    setIsInviteOpen(false);
    window.location.href = "/student";

  } catch (err) {
    console.error("Error sending invite", err);
    
    // Improved error handling
    let errorMessage = "Failed to send invite";
    
    if (err.response) {
      // Handle different error response formats
      if (typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response.data?.error) {
        errorMessage = err.response.data.error;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }

    alert(errorMessage);
  }
}

>>>>>>> c997d5a6db3e7e1e32a04496fe2303a0cd5b0a8f

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
<<<<<<< HEAD
        <h2 className="text-xl font-semibold mb-4">Send Team Invitation</h2>
        
        {selector.project_type === null ? (
          <div className="space-y-4">
            <p className="text-red-500">You must set your project type before inviting others</p>
            <div className="flex justify-end">
=======
        <h2 className="text-xl font-semibold bg-white mb-4">Alert</h2>
        {selector.project_type === null ?
          <form onSubmit={handleInviteSubmit} className=" bg-white space-y-4">
            <div className=' bg-white '>
              <label className="block text-sm font-semibold bg-white  text-gray-700">Project Type to invite member</label>

            </div>
            <div className="mt-6 flex bg-white  justify-between space-x-2">
>>>>>>> c997d5a6db3e7e1e32a04496fe2303a0cd5b0a8f
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
<<<<<<< HEAD
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
=======
                Cancel
              </button>

            </div>
          </form> : <form onSubmit={handleInviteSubmit} className=" bg-white space-y-4">
            <div className=' bg-white '>
              <label className="block text-sm font-medium bg-white  text-gray-700">Register Number</label>
>>>>>>> c997d5a6db3e7e1e32a04496fe2303a0cd5b0a8f
              <input
                name="registerNumber"
                value={inviteForm.registerNumber}
                onChange={handleInviteChange}
                type="text"
                required
<<<<<<< HEAD
                placeholder="Enter registration number"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-indigo-300"
              />
            </div>
            <div className="flex justify-between space-x-2">
=======
                placeholder="Enter Register Number"
                className="mt-1 block w-full border bg-white  border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-indigo-300"
              />
            </div>
            <div className="mt-6 flex bg-white  justify-between space-x-2">
>>>>>>> c997d5a6db3e7e1e32a04496fe2303a0cd5b0a8f
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 transition"
              >
<<<<<<< HEAD
                Send Invite
              </button>
            </div>
          </form>
        )}
=======
                Invite
              </button>
            </div>
          </form>
        }

>>>>>>> c997d5a6db3e7e1e32a04496fe2303a0cd5b0a8f
      </div>
    </div>
  );
}

export default InviteForm;