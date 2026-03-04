import type Params from "@/base/core/params/params";

export default class LoginParams implements Params {
    public credential: string;
    public password: string;

    constructor(credential: string, password: string) {
        this.credential = credential;
        this.password = password;
    }

    toMap(): { [key: string]: any } {
        const data: { [key: string]: any } = {};
        data["credential"] = this.credential;
        data["password"] = this.password;
        return data;
    }
}

