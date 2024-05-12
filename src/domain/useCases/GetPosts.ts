import {PostDto, PostRepository} from "../../data/PostRepository";
import {UserDto, UserRepository} from "../../data/UserRepository";
import {Post} from "../model/Post";
import {User} from "../model/User";
import {distinct} from "../utils";

export class GetPosts {

    constructor(
        private postRepository = new PostRepository(),
        private userRepository = new UserRepository()
    ) {}

    execute = async (page = 0, searchQuery: string | null = null) => {
        const postDtoList = await this.postRepository.getPosts(searchQuery, page)
        const userIds = distinct(postDtoList.map(it => it.userId))

        const userDtoList = await Promise.all(
            userIds.map(userId => this.userRepository.getUserById(userId))
        )

        const usersById = userDtoList
            .reduce<Record<string, User>>((acc, dto) => {
                acc[dto.id] = this.#toUser(dto)
                return acc
            }, {})

        return postDtoList.map(dto => this.#toPost(dto, usersById[dto.userId]))
    }

    #toPost = (dto: PostDto, author: User) => new Post(dto.title, dto.body, author)

    #toUser = (dto: UserDto) => new User(dto.name, dto.phone, dto.email)

}