import {Service} from "../handler";

class UserService extends Service {
  constructor(name: string) {
    super(name);
  }

  async signOut() {
    return await this.post("/sign-out", {}, {}, true);
  }


}

const userService = new UserService("/users");

export default userService;
