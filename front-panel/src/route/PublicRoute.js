import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
  const token = null;
  if (!token) return <Navigate to={`/signin`} />;
  return children;
}

export default PublicRoute;
