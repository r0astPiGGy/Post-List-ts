import {User} from "./User";

export class Post {

    constructor(
        private title: string,
        private body: string,
        private author: User
    ) {}

    getTitle = () => this.title

    getBody = () => this.body

    getAuthor = () => this.author

}