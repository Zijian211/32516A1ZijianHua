import { useState } from 'react';
import { changePasswordApi, deleteAccountApi } from '../services/api';

const AccountSettings = ({ isOpen, onClose, currentUser, logout }) => {
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '', confirm_new_password: '' });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen || !currentUser) return null;
  // --- Handle Password Change ---
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage(null); setError(null);
    try {
      await changePasswordApi(currentUser._id, passwords);
      setMessage("Password successfully updated!");
      setPasswords({ old_password: '', new_password: '', confirm_new_password: '' });
    } catch (err) {
      setError(err.message);
    }
  };
  
  // --- Handle Account Deletion ---
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure? This permanently deletes your account and cart.")) {
      try {
        await deleteAccountApi(currentUser._id);
        logout(); // --- Logs them out and clears local storage ---
        onClose();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-2000 flex items-center justify-center p-4" role="dialog">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">✕</button>
        <h2 className="text-2xl font-black mb-6 text-gray-900">Account Settings</h2>

        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 mb-8">
          <h3 className="font-bold text-gray-700 border-b pb-2">Change Password</h3>
          <input type="password" placeholder="Old Password" required
            value={passwords.old_password} onChange={(e) => setPasswords({...passwords, old_password: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
          <input type="password" placeholder="New Password" required
            value={passwords.new_password} onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
          <input type="password" placeholder="Confirm New Password" required
            value={passwords.confirm_new_password} onChange={(e) => setPasswords({...passwords, confirm_new_password: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
          <button type="submit" className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition">
            Update Password
          </button>
        </form>

        <div className="border-t pt-6">
          <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
          <button onClick={handleDeleteAccount} className="w-full py-3 border-2 border-red-100 text-red-600 font-bold rounded-lg hover:bg-red-50 transition">
            Delete Account Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;