import React, { createContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { get } from '../utils/AxiosUtils'
import { setUser } from '../store/authSlice'
import { notifyError } from '../components/Admin/Comman/Notification/Notification'

import { setSideBar } from '../store/sideBarSlice'
import { setPermission } from '../store/permissionSlice'
import { setMenuData } from '../store/MenuRedux/menuActions'
import { setRole } from '../store/roleSlice'
import { setSelectUser } from '../store/Select/userSlice'
import { setSelectRole } from '../store/Select/roleSlice'
import { setSelectCategory } from '../store/Select/categorySlice'

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {

    const dispatch = useDispatch();
    const { logout } = useAuth();
    const location = useLocation();
    const [menus, setMenus] = useState({});
    const [loading, setLoading] = useState(false);
    const pathname = location.pathname !== '/' ? location.pathname.replace('admin/', '') : 'Dashboard';

    const userId = localStorage.getItem('user_id') ?? null;
    const user = useSelector((state) => (state.auth.user));
    const token = useSelector((state) => (state.auth.token)) ?? localStorage.getItem('token');
    const selectUserData = useSelector((state) => (state.selectUser.selectUserData));
    const selectRoleData = useSelector((state) => (state.selectRole.selectRoleData));
    const selectCategoryData = useSelector((state) => (state.selectCategory.selectCategoryData));

    useEffect(() => {
        const fetchData = async (token) => {
            // console.log(`token is hear ${token}`)
            setLoading(true)
            if (!token) await logout();
            // console.log(`token is still hear ${token}`)
            try {
                // console.trace();
                const [roleData, sideBarData, permissionData, userSelectData, categorySelectData] = await Promise.all([
                    get('/roles'),
                    get('/menus'),
                    get('/permissions'),
                    get('/users?page=0'),
                    get('/categories?page=0')
                ]);

                if (!user) {
                    const { data: LoadUser } = await get(`/users/${userId}`);
                    dispatch(setUser({ user: LoadUser }));
                }

                setMenus(sideBarData?.response);
                dispatch(setMenuData(sideBarData?.response));
                dispatch(setRole({ role: roleData?.response }));
                dispatch(setSideBar(sideBarData?.response?.data));
                dispatch(setSelectRole({ selectRole: roleData?.response }));
                dispatch(setSelectUser({ selectUser: userSelectData?.response }));
                dispatch(setPermission({ permission: permissionData?.response }));
                dispatch(setSelectCategory({ selectCategory: categorySelectData?.response }));

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
        menus, loading, pathname, selectUserData, selectRoleData, selectCategoryData
    };

    return (
        <SidebarContext.Provider value={{ ...propsAray }}>
            {children}
        </SidebarContext.Provider>
    );
};
