export class User {

    constructor(
        private name: string,
        private phone: string,
        private email: string
    ){}

    getName = () => this.name

    getPhone = () => this.phone

    getEmail = () => this.email

}