const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } 
    );
};

const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: "Refresh token is required." });
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired refresh token." });
    }
};

module.exports = { generateAccessToken, generateRefreshToken, refreshToken };