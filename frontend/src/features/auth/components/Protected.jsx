import React from 'react'
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Loader from './Loader';

const Protected = ({children}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className='w-full h-screen flex items-center justify-center'><Loader /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default Protected;
