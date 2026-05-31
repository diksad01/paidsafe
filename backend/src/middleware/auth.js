import { auth } from "../services/firebase.js";

const authMiddleware = async (req, res, next) => {
try {
const authHeader = req.headers.authorization;

```
if (!authHeader) {
  return res.status(401).json({
    error: "Unauthorized"
  });
}

const token = authHeader.split(" ")[1];

const decodedToken = await auth.verifyIdToken(token);

req.user = decodedToken;

next();
```

} catch (error) {
return res.status(401).json({
error: "Unauthorized"
});
}
};

export default authMiddleware;
