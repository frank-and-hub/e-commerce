const User = require('../models/user');
const { hashPassword } = require('./AuthServices');
const status_active = `${process.env.STATUS_ACTIVE}`;

class UserService {
    async selectUser(id, res) {

        const userData = await User.findById(id)
            .select('_id name email phone password password_text role designations image gender address about city state zipcode terms status updated_by')
            // .where('status').equals(status_active)
            .populate('role', '_id name')
            .populate('updated_by', '_id name')
            .populate('image', '_id name path')
            .populate({
                path: 'designations',
                select: '_id name'
            });

        if (!userData) return res.status(404).json({ message: `User not found!`, data: [] });

        return userData;
    }

    async insertUser(userData, user_id, designations) {
        const { name, email, phone, password, role_id } = userData;
        try {
            const hashPassword = await hashPassword(password);

            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                name,
                email,
                password: hashPassword,
                password_text: password,
                phone: phone.trim().replace('-', '').replace('-', '').replace(' ', ''),
                designations: designations,
                role: role_id,
                updated_by: user_id ?? null,
            });

            const newData = await user.save();
            return newData;
        } catch (err) {
            next(err)
        }
    }

    async update() {

    }

    async delete() {

    }
}
module.exports = new UserService();