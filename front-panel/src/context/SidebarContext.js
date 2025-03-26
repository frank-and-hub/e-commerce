import React, { createContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { get } from '../utils/AxiosUtils'
import { setUser } from '../store/authSlice'
import { notifyError } from '../components/admin/comman/notification/Notification'

import { setSideBar } from '../store/sideBarSlice'
import { setPermission } from '../store/permissionSlice'
import { setMenuData } from '../store/MenuRedux/menuActions'

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {

    const { logout } = useAuth();
    const [menus, setMenus] = useState({});
    // const [apiErrors, setApiErrors] = useState({});
    const [selectUserData, setSelectUserData] = useState({});
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch(),
        location = useLocation(),
        pathname = location.pathname !== '/' ? location.pathname.replace('admin/', '') : 'Dashboard',
        userId = localStorage.getItem('user_id') ?? null;

    const user = useSelector((state) => (state.auth.user));
    const token = useSelector((state) => (state.auth.token)) ?? localStorage.getItem('token');

    const hexToRGBA = (hex, alpha = 1) => {
        hex = hex.replace('#', '');

        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    useEffect(() => {
        const fetchData = async (token) => {
            setLoading(true)
            if (!token) await logout();
            try {
                // console.trace();
                const [settingData, sideBarData, permissionData, allUserData] = await Promise.all([
                    get('/settings'),
                    get('/menus'),
                    get('/permissions'),
                    get('/users?page=0'),
                ]);

                if (!user) {
                    const { data: LoadUser } = await get(`/users/${userId}`);
                    dispatch(setUser({ user: LoadUser }));
                }
                document.documentElement.style.setProperty('--light', settingData?.data?.color);
                document.documentElement.style.setProperty('--shadow', `0px 2px 5px 1px ${hexToRGBA(settingData?.data?.color, 0.3)}`);
                setMenus(sideBarData?.response);
                setSelectUserData(allUserData?.response);
                dispatch(setMenuData(sideBarData?.response));
                dispatch(setSideBar(sideBarData?.response?.data));
                dispatch(setPermission({ permission: permissionData?.response }));
            } catch (err) {
                notifyError(`Error fetching data: ${err.message}`);
                if (err.status === 401) logout();
            } finally {
                setLoading(false)
            }
        };
        (!token) ? logout() : fetchData(token);
    }, [logout, user, token, userId, setLoading, dispatch]);

    const propsAray = {
        menus,
        loading,
        pathname,
        selectUserData,
        // apiErrors,
        // setApiErrors
    };

    return (
        <SidebarContext.Provider value={{ ...propsAray }}>
            {children}
        </SidebarContext.Provider>
    );
};
