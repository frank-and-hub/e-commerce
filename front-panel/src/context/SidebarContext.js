import React, { createContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { get } from '../utils/AxiosUtils'
import { setUser } from '../store/authSlice'
import { notifyError } from '../components/Admin/Comman/Notification/Notification'

import { setRole } from '../store/roleSlice'
import { setSideBar } from '../store/sideBarSlice'
import { setPermission } from '../store/permissionSlice'
import { setMenuData } from '../store/MenuRedux/menuActions'
import { setSelectUser } from '../store/Select/userSlice'
import { setSelectRole } from '../store/Select/roleSlice'
import { setSelectCategory } from '../store/Select/categorySlice'
import { setSelectBanner } from '../store/Select/bannerSlice'
import { setSelectBrand } from '../store/Select/brandSlice'
import { setSelectColor } from '../store/Select/colorSlice'
import { setSelectDiscount } from '../store/Select/discountSlice'
import { setSelectSubCategory } from '../store/Select/subCategorySlice'
import { setSelectTag } from '../store/Select/tagSlice'

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
    const selectBannerData = useSelector((state) => (state.selectBanner.selectBannerData));
    const selectBrandData = useSelector((state) => (state.selectBrand.selectBrandData));
    const selectColorData = useSelector((state) => (state.selectColor.selectColorData));
    const selectDiscountData = useSelector((state) => (state.selectDiscount.selectDiscountData));
    const selectSubCategoryData = useSelector((state) => (state.selectSubCategory.selectSubCategoryData));
    const selectTagData = useSelector((state) => (state.selectTag.selectTagData));

    useEffect(() => {
        const fetchData = async (token) => {
            // console.log(`token is hear ${token}`)
            setLoading(true)
            if (!token) await logout();
            // console.log(`token is still hear ${token}`)
            try {
                // console.trace();
                const [roleData, sideBarData, permissionData, userSelectData, categorySelectData, bannerSelectData, brandSelectData, colorSelectData, discountSelectData, subCategorySelectData, tagSelectData,] = await Promise.all([
                    get('/roles?page=0'),
                    get('/menus'),
                    get('/permissions'),
                    get('/users?page=0'),
                    get('/categories?page=0'),
                    get('/banners?page=0'),
                    get('/brands?page=0'),
                    get('/colors?page=0'),
                    get('/discounts?page=0'),
                    get('/sub-categories?page=0'),
                    get('/tags?page=0')
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
                dispatch(setSelectBanner({ selectBanner: bannerSelectData?.response }));
                dispatch(setSelectBrand({ selectBrand: brandSelectData?.response }));
                dispatch(setSelectColor({ selectColor: colorSelectData?.response }));
                dispatch(setSelectDiscount({ selectDiscount: discountSelectData?.response }));
                dispatch(setSelectSubCategory({ selectSubCategory: subCategorySelectData?.response }));
                dispatch(setSelectTag({ selectTag: tagSelectData?.response }));
            } catch (err) {
                notifyError(`Error fetching data: ${err.message}`);
                if (err.status === 401) logout();
            } finally {
                setLoading(false)
            }
        };
        (!token) ? logout() : fetchData(token);
    }, [logout, user, token, userId, setLoading, dispatch]);

    const propsAray = { menus, loading, pathname, selectUserData, selectRoleData, selectCategoryData, selectBannerData, selectBrandData, selectColorData, selectDiscountData, selectSubCategoryData, selectTagData };

    return (
        <SidebarContext.Provider value={{ ...propsAray }}>
            {children}
        </SidebarContext.Provider>
    );
};
