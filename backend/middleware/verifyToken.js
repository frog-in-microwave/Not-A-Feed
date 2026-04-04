import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
        return res.status(401).json({ message: "No authorization headers" });
    }
    const token = authHeaders.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(
          token,
          "veryveryveryveryScereeeetkeyzatonelyzavrogzknowabt",
        );
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}



export default verifyToken;
