import { User } from "../models/user.model.js";
export const getUser = async (req, res) => {
    const email = req.user.email;
    const user = await User.findOne({ email }, { username: 1, email: 1, _id: 0 });
    if (user === null) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    res.status(200).json(user).end();
};
//# sourceMappingURL=user.controller.js.map