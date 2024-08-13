import { Secret, sign } from "jsonwebtoken";

export const createToken = (data: any) => {
  return sign(data, process.env.SECRET as Secret, { expiresIn: "7d" });
};
