import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn: string;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "",
};

export function signJwt(
  payload: JwtPayload,
  option: SignOption = DEFAULT_SIGN_OPTION
) {
  const secretKey = process.env.JWT_USER_ID_SECRET!;
  const token = jwt.sign(payload, secretKey);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const secretKey = process.env.JWT_USER_ID_SECRET!;
    const payload = jwt.verify(token, secretKey);
    return payload as JwtPayload;
  } catch (error) {
    console.error("Error verifying jwt", error);
    return null;
  }
}
