const routes = [
    { path: '/api', module: require('../auths') },
    { path: '/api/faq', module: require('../faq') },
    { path: '/api/users', module: require('../users') },
    { path: '/api/roles', module: require('../roles') },
    { path: '/api/menus', module: require('../menus') },
    { path: '/api/plans', module: require('../plans') },
    { path: '/api/messages', module: require('../messages') },
    { path: '/api/contacts', module: require('../contacts') },
    { path: '/api/projects', module: require('../projects') },
    { path: '/api/services', module: require('../services') },
    { path: '/api/dashboard', module: require('../dashboard') },
    { path: '/api/permissions', module: require('../permissions') },
    { path: '/api/designations', module: require('../designations') },
    { path: '/api/testimonials', module: require('../testimonials') },
    { path: '/api/about-details', module: require('../about_details') },
    { path: '/api/social-details', module: require('../social_details') },
    { path: '/api/support-details', module: require('../support_details') },
    { path: '/api/terms-and-conditions', module: require('../terms_and_conditions') },
];

module.exports = routes;