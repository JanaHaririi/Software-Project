// src/components/user/ProfilePage.jsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import UpdateProfileForm from './UpdateProfileForm';
import Loader from '../shared/Loader';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/users/profile', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          logout();
        } else {
          toast.error('Failed to fetch profile data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, logout]);

  if (loading) {
    return <Loader />;
  }

  if (!profile) {
    return <div className="alert alert-warning">No profile data available</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card profile-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>My Profile</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        <div className="card-body">
          {isEditing ? (
            <UpdateProfileForm 
              profile={profile} 
              setProfile={setProfile}
              setIsEditing={setIsEditing}
            />
          ) : (
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={profile.profilePicture || '/default-profile.png'}
                  alt="Profile"
                  className="img-fluid rounded-circle mb-3 profile-img"
                />
              </div>
              <div className="col-md-8">
                <div className="profile-details">
                  <h5>Name</h5>
                  <p>{profile.name}</p>
                </div>
                <div className="profile-details">
                  <h5>Email</h5>
                  <p>{profile.email}</p>
                </div>
                <div className="profile-details">
                  <h5>Role</h5>
                  <p className="text-capitalize">{profile.role}</p>
                </div>
                <div className="profile-details">
                  <h5>Member Since</h5>
                  <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;