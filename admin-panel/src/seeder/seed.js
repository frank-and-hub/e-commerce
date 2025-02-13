const mongoose = require('mongoose');
const User = require('../models/user');
const Role = require('../models/role');
const Menu = require('../models/menu');
const Permission = require('../models/permission');
const { faker } = require('@faker-js/faker');
const connectDB = require('../config/db');
const AuthServices = require('../services/AuthServices');
const { getGuestRole } = require('../controllers/RoleController');

let i = 0;
const generateFakeData = async (fakePassword, guestRoleId) => {
  const basePhoneNumber = 1234567890;
  const baseZipCodeNumber = 99999;
  i++;
  const phoneNumber = basePhoneNumber + i;
  return {
    _id: new mongoose.Types.ObjectId(),
    name: faker.person.fullName(),
    phone: phoneNumber,
    email: faker.internet.email(),
    password: await AuthServices.hashPassword(fakePassword),
    password_text: fakePassword,
    role: await guestRoleId,
    status: faker.datatype.boolean(),
    image: null,
    gender: faker.person.sex(),
    address: faker.location.streetAddress(),
    about: faker.lorem.sentence(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipcode: baseZipCodeNumber + i,
    terms: true,
    updated_by: null,
    deleted_at: null
  }
};

const defaultRoleData = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "supper-admin",
    permissions: [],
    status: true,
    updated_by: null,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "admin",
    permissions: [],
    status: true,
    updated_by: null,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "user",
    permissions: [],
    status: true,
    updated_by: null,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "guest-user",
    permissions: [],
    status: true,
    updated_by: null,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "support-user",
    permissions: [],
    status: true,
    updated_by: null,
    deleted_at: null
  }
];

const menuSeederData = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Dashboard",
    route: "/dashboard",
    type: true,
    icon: "bi bi-grid",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "User",
    route: "#",
    type: true,
    icon: "bi bi-person-circle",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Menu",
    route: "#",
    type: true,
    icon: "bi bi-card-list",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Designation",
    route: "designations",
    type: true,
    icon: "bi bi-person-lines-fill",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Role",
    route: "roles",
    type: true,
    icon: "bi bi-person-badge",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Users List",
    route: "users",
    type: false,
    icon: "bi bi-person-fill",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Menu List",
    route: "menus",
    type: false,
    icon: "bi bi-card-checklist",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Profile",
    route: "profile",
    type: false,
    icon: "bi bi-person-bounding-box",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Social Media",
    route: "social-details",
    type: true,
    icon: "bi bi-phone",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Role And Permission",
    route: "menus/role-and-permission",
    type: true,
    icon: "bi bi-file-lock-fill",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Setting",
    route: "#",
    type: true,
    icon: "bi bi-gear-wide-connected",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Users Permissions",
    route: "users/permissions",
    type: true,
    icon: "bi bi-person-square",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Terms And Conditions",
    route: "settings/terms-and-conditions",
    type: true,
    icon: "bi bi-file-earmark-medical-fill",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "support",
    route: "settings/support",
    type: true,
    icon: "bi bi-headphones",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Frequently Asked Questions",
    route: "settings/faqs",
    type: true,
    icon: "bi bi-exclamation-circle-fill",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Project",
    route: "projects",
    type: true,
    icon: "bi bi-briefcase",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Contact",
    route: "contacts",
    type: true,
    icon: "bi bi-telephone-fill",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Testimonial",
    route: "testimonials",
    type: true,
    icon: "bi bi-file-earmark-person-fill",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Service",
    route: "services",
    type: true,
    icon: "bi bi-layout-text-window",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Plan",
    route: "plans",
    type: true,
    icon: "bi bi-sliders",
    parent: null,
    status: true,
    deleted_at: null
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Payment",
    route: "payments",
    type: true,
    icon: "bi bi-paypal",
    parent: null,
    status: true,
    deleted_at: null
  },
];

const seedUserData = async () => {
  try {
    // Connect to the database
    console.log(`try`);
    await connectDB();

    console.log('Database connected');
    const fakeData = [];
    const guestRoleId = getGuestRole('guest-user');

    await Role.deleteMany();
    await Role.insertMany(defaultRoleData);

    for (let i = 0; i < 50; i++) {
      const fakePassword = faker.string.alphanumeric(16);
      fakeData.push(await generateFakeData(fakePassword, guestRoleId));
    }

    // Insert user data
    await User.deleteMany();
    await User.insertMany(fakeData);
    await Menu.deleteMany();
    for (const data of menuSeederData) {
      // Check for existing menu
      const existingMenu = await Menu.findOne({ name: data.name });
      if (!existingMenu) {
        const newMenu = await Menu.create(data);
        console.log(`Inserted default menu: ${newMenu.name}`);
        // Seed permissions for the menu if route is `/`
        if (newMenu.route === '/') {
          const permissionNames = ['delete', 'read', 'update', 'create'];
          await Promise.all(permissionNames.map(async (permName) => {
            const permission = new Permission({
              _id: new mongoose.Types.ObjectId(),
              name: `${permName} - ${newMenu.name}`,
              menu: newMenu._id
            });
            await permission.save();
            console.log(`Permission created: ${permission.name}`);
          }));
        }
      }
    }

    console.log('data seeded successfully');
  } catch (err) {
    console.error('Error seeding data:', err);
    mongoose.disconnect();
  } finally {
    console.log('Database disconnected');
  }
};

// Run the Seeder
seedUserData();