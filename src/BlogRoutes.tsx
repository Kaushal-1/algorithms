
import React from 'react';
import { Route } from 'react-router-dom';
import BlogDetail from './pages/BlogDetail';
import Blogs from './pages/Blogs';
import Notifications from './pages/Notifications';
import UserProfile from './pages/UserProfile';

// This component exports routes to be included in the main App.tsx
const BlogRoutes: React.FC = () => {
  return (
    <>
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:blogId" element={<BlogDetail />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
    </>
  );
};

export default BlogRoutes;

// Note: You need to include this route in your App.tsx
// Import BlogRoutes and add it within your Routes component
