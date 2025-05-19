
import React from 'react';
import { Route } from 'react-router-dom';
import BlogDetail from './pages/BlogDetail';

// This component exports routes to be included in the main App.tsx
const BlogRoutes: React.FC = () => {
  return (
    <>
      <Route path="/blogs/:blogId" element={<BlogDetail />} />
    </>
  );
};

export default BlogRoutes;

// Note: You need to include this route in your App.tsx
// Import BlogRoutes and add it within your Routes component
