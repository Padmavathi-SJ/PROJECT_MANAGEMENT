import React from 'react';
import instance from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';

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

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Send Team Invitation</h2>
        
        {selector.project_type === null ? (
          <div className="space-y-4">
            <p className="text-red-500">You must set your project type before inviting others</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
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
              <input
                name="registerNumber"
                value={inviteForm.registerNumber}
                onChange={handleInviteChange}
                type="text"
                required
                placeholder="Enter registration number"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-indigo-300"
              />
            </div>
            <div className="flex justify-between space-x-2">
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
                Send Invite
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default InviteForm;