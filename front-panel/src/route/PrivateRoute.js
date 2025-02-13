import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => (state.auth.token)) ?? localStorage.getItem('token');
  if (!token) return <Navigate to={`/admin/signin`} />;
  return children;
}

export default PrivateRoute;
