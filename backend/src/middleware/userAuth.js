import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const { token } = req.cookies;


  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No Authorized Login Again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode) {
        req.user = tokenDecode;
    } else {
        return res.status(401).json({ message: "Unauthorized: Invalid Token Login Again" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Token Verification Failed Login Again", error: error.message });
  }
};

export default userAuth;


