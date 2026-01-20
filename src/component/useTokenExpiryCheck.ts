

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import type { RootState, AppDispatch } from '../components/app/store';

const parseDurationToMs = (duration: string | null): number | null => {
    if (!duration) return null;

    const matches = duration.match(/^(\d+)([smhd])$/);
    if (!matches) return null;

    const value = parseInt(matches[1], 10);
    const unit = matches[2];

    switch (unit) {
        case 's':
            return value * 1000;
        case 'm':
            return value * 60 * 1000;
        case 'h':
            return value * 60 * 60 * 1000;
        case 'd':
            return value * 24 * 60 * 60 * 1000;
        default:
            return null;
    }
};

export const useTokenExpiryCheck = (): void => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const expiresAt = useSelector((state: RootState) => state.auth.expiresAt);
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );

    const performLogout = useCallback((): void => {
        dispatch(logout());
        navigate('/auth/login', { replace: true });
    }, [dispatch, navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;

        if (!expiresAt) {
            performLogout();
            return;
        }

        // Backend sends something like "15d" or "2h"
        const durationMs = parseDurationToMs(expiresAt);
        if (durationMs === null) {
            performLogout();
            return;
        }

        const expirySeconds = Math.round(durationMs / 1000);

        const timer = window.setTimeout(() => {
            performLogout();
        }, durationMs);

        return () => {
            clearTimeout(timer);
        };
    }, [isAuthenticated, expiresAt, performLogout]);
};
