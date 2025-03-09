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
const FaqList = lazy(() => import('./Admin/SettingManagement/faq/List'))
const AddFaq = lazy(() => import('./Admin/SettingManagement/faq/Add'))
// static pages
const AboutUsPage = lazy(() => import('./Admin/Pages/AboutUsPage'))
const ReturnPolicyPage = lazy(() => import('./Admin/Pages/ReturnPolicyPage'))
const TermsAndConditions = lazy(() => import('./Admin/Pages/TermsAndConditions'))
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
// product sub-category
const DiscountTable = lazy(() => import('./Admin/DiscountManagement/DiscountTable'))
const DiscountAdd = lazy(() => import('./Admin/DiscountManagement/form/Add'))
const DiscountEdit = lazy(() => import('./Admin/DiscountManagement/form/Edit'))
const DiscountView = lazy(() => import('./Admin/DiscountManagement/form/View'))
// product
const ProductTable = lazy(() => import('./Admin/ProductManagement/ProductTable'))
const ProductAdd = lazy(() => import('./Admin/ProductManagement/form/Add'))
const ProductEdit = lazy(() => import('./Admin/ProductManagement/form/Edit'))
const ProductView = lazy(() => import('./Admin/ProductManagement/form/View'))
// unit
const UnitTable = lazy(() => import('./Admin/UnitManagement/UnitTable'))
const UnitAdd = lazy(() => import('./Admin/UnitManagement/form/Add'))
const UnitEdit = lazy(() => import('./Admin/UnitManagement/form/Edit'))
const UnitView = lazy(() => import('./Admin/UnitManagement/form/View'))
// warranty
const WarrantyTable = lazy(() => import('./Admin/WarrantyManagement/WarrantyTable'))
const WarrantyAdd = lazy(() => import('./Admin/WarrantyManagement/form/Add'))
const WarrantyEdit = lazy(() => import('./Admin/WarrantyManagement/form/Edit'))
const WarrantyView = lazy(() => import('./Admin/WarrantyManagement/form/View'))
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
            { path: `shops`, component: ProductList },
        ];

        return (
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route exact path={`/`} element={<FrontLayout />} >
                            {frontPanelRoutes.map((route, index) => (
                                <Route key={index} exact path={route?.path} element={<route.component />} />
                            ))}
                        </Route>
                        <Route exact path={`admin`}>
                            <Route exact path={``} element={<PrivateRoute ><AdminLayout /></PrivateRoute>} >
                                <Route exact path='' element={<Dashboard />} />
                                <Route exact path={`index`} element={<Dashboard />} />
                                <Route exact path={`profile`} element={<Profile />} />
                                <Route exact path={`blank`} element={<Blank />} />

                                <Route exact path={`users`}>
                                    <Route index element={<UsersTable />} />
                                    <Route exact path={`create`} element={<UserForm />} />
                                    <Route exact path={`:id/edit`} element={<UserEdit />} />
                                    <Route exact path={`:id`} element={<UserView />} />
                                    <Route exact path={`permissions`} element={<UserRolePermission />} />
                                </Route>

                                <Route exact path={`menus`}>
                                    <Route index element={<MenuTable />} />
                                    <Route exact path={`create`} element={<MenuAdd />} />
                                    <Route exact path={`:id/edit`} element={<MenuEdit />} />
                                    <Route exact path={`:id`} element={<MenuView />} />
                                    <Route exact path={`role-and-permission`} element={<PermissionTable />} />
                                </Route>

                                <Route exact path={`roles`}>
                                    <Route index element={<RoleTable />} />
                                    <Route exact path={`create`} element={<RoleAdd />} />
                                    <Route exact path={`:id/edit`} element={<RoleEdit />} />
                                    <Route exact path={`:id`} element={<RoleView />} />
                                </Route>

                                <Route exact path={`settings`}>
                                    <Route index element={<Blank />} />

                                    <Route exact path={`faqs`}>
                                        <Route index element={<FaqList />} />
                                        <Route exact path={`create`} element={<AddFaq />} />
                                    </Route>

                                    <Route exact path={`social-details`} >
                                        <Route index element={<SocialDetailTable />} />
                                        <Route exact path={`create`} element={<SocialDetailAdd />} />
                                        <Route exact path={`:id/edit`} element={<SocialDetailEdit />} />
                                        <Route exact path={`:id`} element={<SocialDetailView />} />
                                    </Route>
                                </Route>

                                <Route exact path={`supports`}>
                                    <Route index element={<Support />} />
                                    <Route exact path={`create`} element={<Support />} />
                                </Route>

                                <Route exact path={`pages`}>
                                    <Route exact path={`terms-and-conditions`} element={<TermsAndConditions />} />
                                    <Route exact path={`about-us`} element={<AboutUsPage />} />
                                    <Route exact path={`return-and-refund-policies`} element={<ReturnPolicyPage />} />
                                </Route>

                                <Route exact path={`products`}>
                                    <Route index element={<ProductTable />} />
                                    <Route exact path={`create`} element={<ProductAdd />} />
                                    <Route exact path={`:id/edit`} element={<ProductEdit />} />
                                    <Route exact path={`:id`} element={<ProductView />} />

                                    <Route exact path={`categories`}>
                                        <Route index element={<CategoryTable />} />
                                        <Route exact path={`create`} element={<CategoryAdd />} />
                                        <Route exact path={`:id/edit`} element={<CategoryEdit />} />
                                        <Route exact path={`:id`} element={<CategoryView />} />
                                    </Route>

                                    <Route exact path={`sub-categories`}>
                                        <Route index element={<SubCategoryTable />} />
                                        <Route exact path={`create`} element={<SubCategoryAdd />} />
                                        <Route exact path={`:id/edit`} element={<SubCategoryEdit />} />
                                        <Route exact path={`:id`} element={<SubCategoryView />} />
                                    </Route>

                                    <Route exact path={`tags`}>
                                        <Route index element={<TagTable />} />
                                        <Route exact path={`create`} element={<TagAdd />} />
                                        <Route exact path={`:id/edit`} element={<TagEdit />} />
                                        <Route exact path={`:id`} element={<TagView />} />
                                    </Route>

                                    <Route exact path={`colors`}>
                                        <Route index element={<ColorTable />} />
                                        <Route exact path={`create`} element={<ColorAdd />} />
                                        <Route exact path={`:id/edit`} element={<ColorEdit />} />
                                        <Route exact path={`:id`} element={<ColorView />} />
                                    </Route>

                                    <Route exact path={`discounts`}>
                                        <Route index element={<DiscountTable />} />
                                        <Route exact path={`create`} element={<DiscountAdd />} />
                                        <Route exact path={`:id/edit`} element={<DiscountEdit />} />
                                        <Route exact path={`:id`} element={<DiscountView />} />
                                    </Route>

                                    <Route exact path={`units`}>
                                        <Route index element={<UnitTable />} />
                                        <Route exact path={`create`} element={<UnitAdd />} />
                                        <Route exact path={`:id/edit`} element={<UnitEdit />} />
                                        <Route exact path={`:id`} element={<UnitView />} />
                                    </Route>
                                </Route>

                                <Route exact path={`contacts`}>
                                    <Route index element={<ContactTable />} />
                                    <Route exact path={`:id`} element={<ContactView />} />
                                </Route>

                                <Route exact path={`banners`}>
                                    <Route index element={<BannerTable />} />
                                    <Route exact path={`create`} element={<BannerAdd />} />
                                    <Route exact path={`:id/edit`} element={<BannerEdit />} />
                                    <Route exact path={`:id`} element={<BannerView />} />
                                </Route>

                                <Route exact path={`brands`}>
                                    <Route index element={<BrandTable />} />
                                    <Route exact path={`create`} element={<BrandAdd />} />
                                    <Route exact path={`:id/edit`} element={<BrandEdit />} />
                                    <Route exact path={`:id`} element={<BrandView />} />
                                </Route>

                                <Route exact path={`payments`}>
                                    <Route index element={<Blank />} />
                                    <Route exact path={`create`} element={<Blank />} />
                                    <Route exact path={`:id/edit`} element={<Blank />} />
                                    <Route exact path={`:id`} element={<Blank />} />
                                </Route>

                                <Route exact path={`warranties`}>
                                    <Route index element={<WarrantyTable />} />
                                    <Route exact path={`create`} element={<WarrantyAdd />} />
                                    <Route exact path={`:id/edit`} element={<WarrantyEdit />} />
                                    <Route exact path={`:id`} element={<WarrantyView />} />
                                </Route>
                            </Route>
                            <Route exact path={`signin`} element={<SignIn />} />
                            <Route exact path={`signup`} element={<SignUp />} />
                            <Route exact path={`error-404`} element={<Error />} />
                            <Route exact path={`*`} element={<Error />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider >
        );
    }
}

export default Routing;