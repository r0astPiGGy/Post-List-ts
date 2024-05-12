import {BASE_URL} from "./const";

export type UserDto = {
    id: string
    name: string
    email: string
    phone: string
}

export class UserRepository {

    getUserById = (id: string) =>
        fetch(`${BASE_URL}/users/${id}`)
        .then<UserDto>(r => r.json())

}