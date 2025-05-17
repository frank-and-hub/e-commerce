import React, { createContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useAuth } from 'utils/AuthContext'
import { get } from 'utils/AxiosUtils'
import { setUser } from 'store/authSlice'
import { notifyError } from 'components/admin/comman/notification/Notification'

import { setRole } from 'store/roleSlice'
import { setSideBar } from 'store/sideBarSlice'
import { setPermission } from 'store/permissionSlice'
import { setMenuData } from 'store/MenuRedux/menuActions'
import { handleToggleSidebar, hexToRGBA, pickReadableTextColor } from 'utils/helper'

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

    useEffect(() => {
        const fetchData = async (token) => {
            setLoading(true)
            if (!token) await logout();
            try {
                const [settingData, sideBarData, allRoleData, permissionData, allUserData] = await Promise.all([
                    get('/settings'),
                    get('/menus'),
                    get('/roles?page=0'),
                    get('/permissions'),
                    get('/users?page=0'),
                ]);

                if (!user) {
                    const { data: LoadUser } = await get(`/users/${userId}`);
                    dispatch(setUser({ user: LoadUser }));
                }

                if (settingData) {
                    const {
                        color,
                        background,
                        theme,
                        filter,
                        isSidebarToggled,
                    } = settingData?.data;

                    if (color) {
                        document.documentElement.style.setProperty('--light', color);
                        document.documentElement.style.setProperty('--shadow', `0px 2px 5px 1px ${hexToRGBA(color, 0.3)}`);
                    }

                    if (background) {
                        document.documentElement.style.setProperty('--background', background);
                        const textColor = pickReadableTextColor(background);
                        document.documentElement.style.setProperty('--dark', textColor);
                    }

                    if (filter) document.documentElement.style.setProperty('filter', `var(--${filter})`);

                    if (theme) {
                        const themeClasses = ['light', 'dark'];
                        themeClasses.forEach(cls => document.getElementById('root').classList.remove(cls));
                        document.getElementById('root').classList.add(`${theme}`);
                    }

                    if(isSidebarToggled) handleToggleSidebar();
                }

                if (sideBarData) {
                    setMenus(sideBarData?.response);
                    dispatch(setMenuData(sideBarData?.response));
                    dispatch(setSideBar(sideBarData?.response?.data));
                }

                if (allRoleData) dispatch(setRole({ role: allRoleData?.response }));
                if (allUserData) setSelectUserData(allUserData?.response);
                if (permissionData) dispatch(setPermission({ permission: permissionData?.response }));

            } catch (err) {
                notifyError(`Error fetching data: ${err?.message ?? err}`);
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
