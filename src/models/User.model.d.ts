import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
