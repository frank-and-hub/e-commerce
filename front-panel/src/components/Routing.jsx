import React, { Component, lazy } from 'react'
// import PropTypes from 'prop-types'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../utils/AuthContext'
import PrivateRoute from '../route/PrivateRoute'

// admin-panel start // ----------------------------------------------
// sign-in page
const SignIn = lazy(() => import('./Admin/SignIn/SignIn'))
// sign-up page
const SignUp = lazy(() => import('./Admin/SignUp/SignUp'))
// admin layout
const AdminLayout = lazy(() => import('./Admin/Index/AdminLayout'))
// error page
const Error = lazy(() => import('./Admin/Pages/Error'))
// blank page
const Blank = lazy(() => import('./Admin/Pages/Blank'))
// dashboard page
const Dashboard = lazy(() => import('./Admin/Dashboard/Dashboard'))
// user profile page
const Profile = lazy(() => import('./Admin/Profile/Profile'))
// user permissions
const PermissionTable = lazy(() => import('./Admin/PermissionManagement/PermissionTable'))
// settings
// const SiteForm = lazy(() => import ('./Admin/SettingManagement/SiteForm'))
const Support = lazy(() => import('./Admin/SettingManagement/Support'))
const TermsAndConditions = lazy(() => import('./Admin/SettingManagement/TermsAndConditions'))
const FaqList = lazy(() => import('./Admin/SettingManagement/faq/List'))
const AddFaq = lazy(() => import('./Admin/SettingManagement/faq/Add'))
// users
const UserForm = lazy(() => import('./Admin/UserManagement/form/Add'))
const UserView = lazy(() => import('./Admin/UserManagement/form/View'))
const UserEdit = lazy(() => import('./Admin/UserManagement/form/Edit'))
const UsersTable = lazy(() => import('./Admin/UserManagement/UserTable'))
const UserRolePermission = lazy(() => import('./Admin/UserManagement/UserRolePermission'))
// role
const RoleTable = lazy(() => import('./Admin/RoleManagement/RoleTable'))
const RoleAdd = lazy(() => import('./Admin/RoleManagement/form/Add'))
const RoleEdit = lazy(() => import('./Admin/RoleManagement/form/Edit'))
const RoleView = lazy(() => import('./Admin/RoleManagement/form/View'))
// menu
const MenuTable = lazy(() => import('./Admin/MenuManagement/MenuTable'))
const MenuAdd = lazy(() => import('./Admin/MenuManagement/form/Add'))
const MenuEdit = lazy(() => import('./Admin/MenuManagement/form/Edit'))
const MenuView = lazy(() => import('./Admin/MenuManagement/form/View'))
// contact
const ContactTable = lazy(() => import('./Admin/ContactManagement/ContactTable'))
const ContactView = lazy(() => import('./Admin/ContactManagement/form/View'))
// social-media
const SocialDetailTable = lazy(() => import('./Admin/SettingManagement/SocialDetail/SocialDetailTable'))
const SocialDetailAdd = lazy(() => import('./Admin/SettingManagement/SocialDetail/form/Add'))
const SocialDetailEdit = lazy(() => import('./Admin/SettingManagement/SocialDetail/form/Edit'))
const SocialDetailView = lazy(() => import('./Admin/SettingManagement/SocialDetail/form/View'))
// banner
const BannerTable = lazy(() => import('./Admin/BannerManagement/BannerTable'))
const BannerAdd = lazy(() => import('./Admin/BannerManagement/form/Add'))
const BannerEdit = lazy(() => import('./Admin/BannerManagement/form/Edit'))
const BannerView = lazy(() => import('./Admin/BannerManagement/form/View'))
// brand
const BrandTable = lazy(() => import('./Admin/BrandManagement/BrandTable'))
const BrandAdd = lazy(() => import('./Admin/BrandManagement/form/Add'))
const BrandEdit = lazy(() => import('./Admin/BrandManagement/form/Edit'))
const BrandView = lazy(() => import('./Admin/BrandManagement/form/View'))
// tag
const TagTable = lazy(() => import('./Admin/TagManagement/TagTable'))
const TagAdd = lazy(() => import('./Admin/TagManagement/form/Add'))
const TagEdit = lazy(() => import('./Admin/TagManagement/form/Edit'))
const TagView = lazy(() => import('./Admin/TagManagement/form/View'))
// color
const ColorTable = lazy(() => import('./Admin/ColorManagement/ColorTable'))
const ColorAdd = lazy(() => import('./Admin/ColorManagement/form/Add'))
const ColorEdit = lazy(() => import('./Admin/ColorManagement/form/Edit'))
const ColorView = lazy(() => import('./Admin/ColorManagement/form/View'))
// product category
const CategoryTable = lazy(() => import('./Admin/CategoryManagement/CategoryTable'))
const CategoryAdd = lazy(() => import('./Admin/CategoryManagement/form/Add'))
const CategoryEdit = lazy(() => import('./Admin/CategoryManagement/form/Edit'))
const CategoryView = lazy(() => import('./Admin/CategoryManagement/form/View'))
// product sub-category
const SubCategoryTable = lazy(() => import('./Admin/SubCategoryManagement/SubCategoryTable'))
const SubCategoryAdd = lazy(() => import('./Admin/SubCategoryManagement/form/Add'))
const SubCategoryEdit = lazy(() => import('./Admin/SubCategoryManagement/form/Edit'))
const SubCategoryView = lazy(() => import('./Admin/SubCategoryManagement/form/View'))
// admin-panel end // ------------------------------------------------------

// front-panel start // ------------------------------------
const FrontLayout = lazy(() => import('./Front/Index/FrontLayout'))
const FrontPage = lazy(() => import('./Front/Page/FrontPage/FrontPage'))
const AboutPage = lazy(() => import('./Front/Page/AboutPage/AboutPage'))
const ContactPage = lazy(() => import('./Front/Page/ContactPage/ContactPage'))
const ProductList = lazy(() => import('./Front/Page/ProductList/ProductList'))
const Product = lazy(() => import('./Front/Page/Product/Product'))
// front-panel end // ------------------------------------

class Routing extends Component {
    render() {

        const frontPanelRoutes = [
            { path: ``, component: FrontPage },
            { path: `index`, component: FrontPage },
            { path: `about`, component: AboutPage },
            { path: `contact`, component: ContactPage },
            { path: `shop`, component: Product },
            { path: `product`, component: ProductList },
        ];

        return (
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path={`/`} element={<FrontLayout />} >
                            {frontPanelRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={<route.component />} />
                            ))}
                        </Route>
                        <Route path="/admin" element={<PrivateRoute ><AdminLayout /></PrivateRoute>} >
                            <Route path='' element={<Dashboard />} />
                            <Route path={`index`} element={<Dashboard />} />
                            <Route path={`profile`} element={<Profile />} />
                            <Route path={`blank`} element={<Blank />} />

                            <Route path={`users`}>
                                <Route index element={<UsersTable />} />
                                <Route path={`create`} element={<UserForm />} />
                                <Route path={`:id/edit`} element={<UserEdit />} />
                                <Route path={`:id`} element={<UserView />} />
                                <Route path={`permissions`} element={<UserRolePermission />} />
                            </Route>

                            <Route path={`menus`}>
                                <Route index element={<MenuTable />} />
                                <Route path={`create`} element={<MenuAdd />} />
                                <Route path={`:id/edit`} element={<MenuEdit />} />
                                <Route path={`:id`} element={<MenuView />} />
                                <Route path={`role-and-permission`} element={<PermissionTable />} />
                            </Route>

                            <Route path={`roles`}>
                                <Route index element={<RoleTable />} />
                                <Route path={`create`} element={<RoleAdd />} />
                                <Route path={`:id/edit`} element={<RoleEdit />} />
                                <Route path={`:id`} element={<RoleView />} />
                            </Route>

                            <Route path={`settings`}>
                                <Route index element={<Blank />} />
                                <Route path={`terms-and-conditions`} element={<TermsAndConditions />} />

                                <Route path={`support`}>
                                    <Route index element={<Support />} />
                                    <Route path={`create`} element={<Support />} />
                                </Route>

                                <Route path={`faqs`}>
                                    <Route index element={<FaqList />} />
                                    <Route path={`create`} element={<AddFaq />} />
                                </Route>

                                <Route path={`social-details`} >
                                    <Route index element={<SocialDetailTable />} />
                                    <Route path={`create`} element={<SocialDetailAdd />} />
                                    <Route path={`:id/edit`} element={<SocialDetailEdit />} />
                                    <Route path={`:id`} element={<SocialDetailView />} />
                                </Route>
                            </Route>

                            <Route path={`products`}>
                                <Route index element={<Blank />} />
                                <Route path={`create`} element={<Blank />} />
                                <Route path={`:id/edit`} element={<Blank />} />
                                <Route path={`:id`} element={<Blank />} />

                                <Route path={`categories`}>
                                    <Route index element={<CategoryTable />} />
                                    <Route path={`create`} element={<CategoryAdd />} />
                                    <Route path={`:id/edit`} element={<CategoryEdit />} />
                                    <Route path={`:id`} element={<CategoryView />} />
                                </Route>
                                
                                <Route path={`sub-categories`}>
                                    <Route index element={<SubCategoryTable />} />
                                    <Route path={`create`} element={<SubCategoryAdd />} />
                                    <Route path={`:id/edit`} element={<SubCategoryEdit />} />
                                    <Route path={`:id`} element={<SubCategoryView />} />
                                </Route>

                                <Route path={`tags`}>
                                    <Route index element={<TagTable />} />
                                    <Route path={`create`} element={<TagAdd />} />
                                    <Route path={`:id/edit`} element={<TagEdit />} />
                                    <Route path={`:id`} element={<TagView />} />
                                </Route>

                                <Route path={`colors`}>
                                    <Route index element={<ColorTable />} />
                                    <Route path={`create`} element={<ColorAdd />} />
                                    <Route path={`:id/edit`} element={<ColorEdit />} />
                                    <Route path={`:id`} element={<ColorView />} />
                                </Route>
                            </Route>

                            <Route path={`contacts`}>
                                <Route index element={<ContactTable />} />
                                <Route path={`:id`} element={<ContactView />} />
                            </Route>

                            <Route path={`banners`}>
                                <Route index element={<BannerTable />} />
                                <Route path={`create`} element={<BannerAdd />} />
                                <Route path={`:id/edit`} element={<BannerEdit />} />
                                <Route path={`:id`} element={<BannerView />} />
                            </Route>

                            <Route path={`brands`}>
                                <Route index element={<BrandTable />} />
                                <Route path={`create`} element={<BrandAdd />} />
                                <Route path={`:id/edit`} element={<BrandEdit />} />
                                <Route path={`:id`} element={<BrandView />} />
                            </Route>

                            <Route path={`payments`}>
                                <Route index element={<Blank />} />
                                <Route path={`create`} element={<Blank />} />
                                <Route path={`:id/edit`} element={<Blank />} />
                                <Route path={`:id`} element={<Blank />} />
                            </Route>
                        </Route>
                        <Route path={`/admin/signin`} element={<SignIn />} />
                        <Route path={`/admin/signup`} element={<SignUp />} />
                        <Route path={`/admin/error-404`} element={<Error />} />
                        <Route path={`/*`} element={<Error />} />
                    </Routes>
                </Router>
            </AuthProvider>
        );
    }
}

export default Routing;