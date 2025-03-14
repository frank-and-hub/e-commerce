import React, { Component, lazy } from 'react'
// import PropTypes from 'prop-types'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../utils/AuthContext'
import PrivateRoute from '../route/PrivateRoute'

// admin-panel start // ----------------------------------------------
// sign-in page
const SignIn = lazy(() => import('./admin/signIn/SignIn'))
// sign-up page
const SignUp = lazy(() => import('./admin/signUp/SignUp'))
// admin layout
const AdminLayout = lazy(() => import('./admin/layout/AdminLayout'))
// error page
const Error = lazy(() => import('./admin/pages/Error'))
// blank page
const Blank = lazy(() => import('./admin/pages/Blank'))
// dashboard page
const Dashboard = lazy(() => import('./admin/dashboard/Dashboard'))
// user profile page
const Profile = lazy(() => import('./admin/profile/Profile'))
// user permissions
const PermissionTable = lazy(() => import('./admin/permissionManagement/PermissionTable'))
// settings
// const SiteForm = lazy(() => import ('./Admin/SettingManagement/SiteForm'))
const Support = lazy(() => import('./admin/settingManagement/Support'))
const FaqList = lazy(() => import('./admin/settingManagement/faq/List'))
const AddFaq = lazy(() => import('./admin/settingManagement/faq/Add'))
// static pages
const AboutUsPage = lazy(() => import('./admin/pages/AboutUsPage'))
const ReturnPolicyPage = lazy(() => import('./admin/pages/ReturnPolicyPage'))
const TermsAndConditions = lazy(() => import('./admin/pages/TermsAndConditions'))
// users
const UserForm = lazy(() => import('./admin/userManagement/form/Add'))
const UserView = lazy(() => import('./admin/userManagement/form/View'))
const UserEdit = lazy(() => import('./admin/userManagement/form/Edit'))
const UsersTable = lazy(() => import('./admin/userManagement/UserTable'))
const UserRolePermission = lazy(() => import('./admin/userManagement/UserRolePermission'))
// role
const RoleTable = lazy(() => import('./admin/roleManagement/RoleTable'))
const RoleAdd = lazy(() => import('./admin/roleManagement/form/Add'))
const RoleEdit = lazy(() => import('./admin/roleManagement/form/Edit'))
const RoleView = lazy(() => import('./admin/roleManagement/form/View'))
// menu
const MenuTable = lazy(() => import('./admin/menuManagement/MenuTable'))
const MenuAdd = lazy(() => import('./admin/menuManagement/form/Add'))
const MenuEdit = lazy(() => import('./admin/menuManagement/form/Edit'))
const MenuView = lazy(() => import('./admin/menuManagement/form/View'))
// contact
const ContactTable = lazy(() => import('./admin/contactManagement/ContactTable'))
const ContactView = lazy(() => import('./admin/contactManagement/form/View'))
// social-media
const SocialDetailTable = lazy(() => import('./admin/settingManagement/SocialDetail/SocialDetailTable'))
const SocialDetailAdd = lazy(() => import('./admin/settingManagement/SocialDetail/form/Add'))
const SocialDetailEdit = lazy(() => import('./admin/settingManagement/SocialDetail/form/Edit'))
const SocialDetailView = lazy(() => import('./admin/settingManagement/SocialDetail/form/View'))
// banner
const BannerTable = lazy(() => import('./admin/bannerManagement/BannerTable'))
const BannerAdd = lazy(() => import('./admin/bannerManagement/form/Add'))
const BannerEdit = lazy(() => import('./admin/bannerManagement/form/Edit'))
const BannerView = lazy(() => import('./admin/bannerManagement/form/View'))
// brand
const BrandTable = lazy(() => import('./admin/brandManagement/BrandTable'))
const BrandAdd = lazy(() => import('./admin/brandManagement/form/Add'))
const BrandEdit = lazy(() => import('./admin/brandManagement/form/Edit'))
const BrandView = lazy(() => import('./admin/brandManagement/form/View'))
// tag
const TagTable = lazy(() => import('./admin/tagManagement/TagTable'))
const TagAdd = lazy(() => import('./admin/tagManagement/form/Add'))
const TagEdit = lazy(() => import('./admin/tagManagement/form/Edit'))
const TagView = lazy(() => import('./admin/tagManagement/form/View'))
// color
const ColorTable = lazy(() => import('./admin/colorManagement/ColorTable'))
const ColorAdd = lazy(() => import('./admin/colorManagement/form/Add'))
const ColorEdit = lazy(() => import('./admin/colorManagement/form/Edit'))
const ColorView = lazy(() => import('./admin/colorManagement/form/View'))
// product category
const CategoryTable = lazy(() => import('./admin/categoryManagement/CategoryTable'))
const CategoryAdd = lazy(() => import('./admin/categoryManagement/form/Add'))
const CategoryEdit = lazy(() => import('./admin/categoryManagement/form/Edit'))
const CategoryView = lazy(() => import('./admin/categoryManagement/form/View'))
// product sub-category
const SubCategoryTable = lazy(() => import('./admin/subCategoryManagement/SubCategoryTable'))
const SubCategoryAdd = lazy(() => import('./admin/subCategoryManagement/form/Add'))
const SubCategoryEdit = lazy(() => import('./admin/subCategoryManagement/form/Edit'))
const SubCategoryView = lazy(() => import('./admin/subCategoryManagement/form/View'))
// product sub-category
const DiscountTable = lazy(() => import('./admin/discountManagement/DiscountTable'))
const DiscountAdd = lazy(() => import('./admin/discountManagement/form/Add'))
const DiscountEdit = lazy(() => import('./admin/discountManagement/form/Edit'))
const DiscountView = lazy(() => import('./admin/discountManagement/form/View'))
// product
const ProductTable = lazy(() => import('./admin/productManagement/ProductTable'))
const ProductAdd = lazy(() => import('./admin/productManagement/form/Add'))
const ProductEdit = lazy(() => import('./admin/productManagement/form/Edit'))
const ProductView = lazy(() => import('./admin/productManagement/form/View'))
// unit
const UnitTable = lazy(() => import('./admin/unitManagement/UnitTable'))
const UnitAdd = lazy(() => import('./admin/unitManagement/form/Add'))
const UnitEdit = lazy(() => import('./admin/unitManagement/form/Edit'))
const UnitView = lazy(() => import('./admin/unitManagement/form/View'))
// warranty
const WarrantyTable = lazy(() => import('./admin/warrantyManagement/WarrantyTable'))
const WarrantyAdd = lazy(() => import('./admin/warrantyManagement/form/Add'))
const WarrantyEdit = lazy(() => import('./admin/warrantyManagement/form/Edit'))
const WarrantyView = lazy(() => import('./admin/warrantyManagement/form/View'))
// shop
const StoreTable = lazy(() => import('./admin/storeManagement/StoreTable'))
const StoreAdd = lazy(() => import('./admin/storeManagement/form/Add'))
const StoreEdit = lazy(() => import('./admin/storeManagement/form/Edit'))
const StoreView = lazy(() => import('./admin/storeManagement/form/View'))
// warehouse
const WarehouseTable = lazy(() => import('./admin/warehouseManagement/WarehouseTable'))
const WarehouseAdd = lazy(() => import('./admin/warehouseManagement/form/Add'))
const WarehouseEdit = lazy(() => import('./admin/warehouseManagement/form/Edit'))
const WarehouseView = lazy(() => import('./admin/warehouseManagement/form/View'))
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

                                <Route exact path={`storage`}>
                                    <Route index element={<StoreTable />} />
                                    
                                    <Route exact path={`stores`}>
                                        <Route index element={<StoreTable />} />
                                        <Route exact path={`create`} element={<StoreAdd />} />
                                        <Route exact path={`:id/edit`} element={<StoreEdit />} />
                                        <Route exact path={`:id`} element={<StoreView />} />
                                    </Route>

                                    <Route exact path={`warehouses`}>
                                        <Route index element={<WarehouseTable />} />
                                        <Route exact path={`create`} element={<WarehouseAdd />} />
                                        <Route exact path={`:id/edit`} element={<WarehouseEdit />} />
                                        <Route exact path={`:id`} element={<WarehouseView />} />
                                    </Route>
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