

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { useTokenExpiryCheck } from '../component/useTokenExpiryCheck';
import type { RootState, AppDispatch } from '../components/app/store';

const AuthListener: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );

    useTokenExpiryCheck();

    useEffect(() => {
        if (!isAuthenticated) return;

        const handleStorageChange = (event: StorageEvent): void => {
            if (event.key === 'logout' && event.newValue) {

                // 1. Dispatch logout to clear Redux/Cookies
                dispatch(logout());

                // 2. Remove the key from localStorage
                localStorage.removeItem('logout');

                // 3. Redirect to login
                navigate('/auth/login', { replace: true });
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [dispatch, isAuthenticated, navigate]);

    return null;
};

export default AuthListener;
