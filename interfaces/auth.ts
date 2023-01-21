import { ILoginUser } from "./user";

export interface IResponseLogin {
    token: string,
    user: ILoginUser
}