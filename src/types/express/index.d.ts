import { IUser } from "../../app/models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: string };
    }
  }
}
