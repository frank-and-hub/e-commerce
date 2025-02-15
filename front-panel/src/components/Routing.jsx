import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../utils/AuthContext'
import PrivateRoute from '../route/PrivateRoute'

// sign-in page
import SignIn from './Admin/SignIn/SignIn'
// sign-up page
import SignUp from './Admin/SignUp/SignUp'
// admin layout
import AdminLayout from './Admin/Index/AdminLayout'
// error page
import Error from './Admin/Pages/Error'
// blank page
import Blank from './Admin/Pages/Blank'
// dashboard page
import Dashboard from './Admin/Dashboard/Dashboard'
// user profile page
import Profile from './Admin/Profile/Profile'
// user permissions
import PermissionTable from './Admin/PermissionManagement/PermissionTable'
// settings
// import SiteForm from './Admin/SettingManagement/SiteForm'
import Support from './Admin/SettingManagement/Support'
import TermsAndConditions from './Admin/SettingManagement/TermsAndConditions'
import FaqList from './Admin/SettingManagement/faq/List'
import AddFaq from './Admin/SettingManagement/faq/Add'
// users
import UserForm from './Admin/UserManagement/form/Add'
import UserView from './Admin/UserManagement/form/View'
import UserEdit from './Admin/UserManagement/form/Edit'
import UsersTable from './Admin/UserManagement/UserTable'
import UserRolePermission from './Admin/UserManagement/UserRolePermission'
// role
import RoleTable from './Admin/RoleManagement/RoleTable'
import RoleAdd from './Admin/RoleManagement/form/Add'
import RoleEdit from './Admin/RoleManagement/form/Edit'
import RoleView from './Admin/RoleManagement/form/View'
// menu
import MenuTable from './Admin/MenuManagement/MenuTable'
import MenuAdd from './Admin/MenuManagement/form/Add'
import MenuEdit from './Admin/MenuManagement/form/Edit'
import MenuView from './Admin/MenuManagement/form/View'
// // service
// import ServiceTable from './Admin/ServiceManagement/ServiceTable'
// import ServiceAdd from './Admin/ServiceManagement/form/Add'
// import ServiceEdit from './Admin/ServiceManagement/form/Edit'
// import ServiceView from './Admin/ServiceManagement/form/View'
// // testimonials
// import TestimonialTable from './Admin/TestimonialManagement/TestimonialTable'
// import TestimonialAdd from './Admin/TestimonialManagement/form/Add'
// import TestimonialEdit from './Admin/TestimonialManagement/form/Edit'
// import TestimonialView from './Admin/TestimonialManagement/form/View'
// contacts
import ContactTable from './Admin/ContactManagement/ContactTable'
import ContactView from './Admin/ContactManagement/form/View'
// social-media
import SocialDetailTable from './Admin/SettingManagement/SocialDetail/SocialDetailTable'
import SocialDetailAdd from './Admin/SettingManagement/SocialDetail/form/Add'
import SocialDetailEdit from './Admin/SettingManagement/SocialDetail/form/Edit'
import SocialDetailView from './Admin/SettingManagement/SocialDetail/form/View'
// projects
// import ProjectTable from './Admin/ProjectManagement/ProjectTable'
// import ProjectAdd from './Admin/ProjectManagement/form/Add'
// import ProjectEdit from './Admin/ProjectManagement/form/Edit'
// import ProjectView from './Admin/ProjectManagement/form/View'
// // plas
// import PlanTable from './Admin/PlanManagement/PlanTable'
// // import PlanAdd from './Admin/PlanManagement/form/Add'
// import PlanEdit from './Admin/PlanManagement/form/Edit'
// import PlanView from './Admin/PlanManagement/form/View'
// import { CreatePlan } from '../controllers/planController'

import FrontLayout from './Front/Index/FrontLayout'
import FrontPage from './Front/Page/FrontPage/FrontPage'
import AboutPage from './Front/Page/AboutPage/AboutPage'
import ContactPage from './Front/Page/ContactPage/ContactPage'
import ProductList from './Front/Page/ProductList/ProductList'
import Product from './Front/Page/Product/Product'


class Routing extends Component {
    render() {
        return (
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path={`/`} element={<FrontLayout />} >
                            <Route path='/' element={<FrontPage />} />
                            <Route path='index' element={<FrontPage />} />
                            <Route path={`about`} element={<AboutPage />} />
                            <Route path={`contact`} element={<ContactPage />} />
                            <Route path={`shop`} element={<ProductList />} />
                            <Route path={`product`} element={<Product />} />
                        </Route>
                        <Route path="/admin/" element={<PrivateRoute ><AdminLayout /></PrivateRoute>} >
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
                                <Route path={`category`}>
                                    <Route index element={<Blank />} />
                                    <Route path={`create`} element={<Blank />} />
                                    <Route path={`:id/edit`} element={<Blank />} />
                                    <Route path={`:id`} element={<Blank />} />
                                </Route>
                                <Route path={`sub-category`}>
                                    <Route index element={<Blank />} />
                                    <Route path={`create`} element={<Blank />} />
                                    <Route path={`:id/edit`} element={<Blank />} />
                                    <Route path={`:id`} element={<Blank />} />
                                </Route>
                            </Route>

                            <Route path={`contacts`}>
                                <Route index element={<ContactTable />} />
                                <Route path={`:id`} element={<ContactView />} />
                            </Route>

                            <Route path={`banners`}>
                                <Route index element={<Blank />} />
                                <Route path={`create`} element={<Blank />} />
                                <Route path={`:id/edit`} element={<Blank />} />
                                <Route path={`:id`} element={<Blank />} />
                            </Route>


                            <Route path={`brands`}>
                                <Route index element={<Blank />} />
                                <Route path={`create`} element={<Blank />} />
                                <Route path={`:id/edit`} element={<Blank />} />
                                <Route path={`:id`} element={<Blank />} />
                            </Route>

                            {/* <Route path={`services`}>
                                <Route index element={<Blank />} />
                                <Route path={`create`} element={<Blank />} />
                                <Route path={`:id/edit`} element={<Blank />} />
                                <Route path={`:id`} element={<Blank />} />
                            </Route> */}

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