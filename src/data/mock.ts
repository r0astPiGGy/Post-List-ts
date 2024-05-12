import {POSTS_PER_PAGE} from "./const";
import {PostDto, PostRepository} from "./PostRepository";
import {UserDto, UserRepository} from "./UserRepository";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function postOf(id: number, userId: number): PostDto {
    return {
        id: id.toString(),
        userId: userId.toString(),
        title: `Lorem ipsum ${id}`,
        body: "Dolor sit amet body body body"
    };
}

export class MockPostRepository extends PostRepository {

    #posts = Array.from({length: 100}, (_, i) => postOf(i, i % 10))

    getPosts = async (
        titleQuery: string | null = null,
        page = 0,
        perPage = POSTS_PER_PAGE
    ) => {
        await sleep(500)

        if (Math.random() > 0.5) {
            throw new Error("Something went wrong")
        }

        return this.#posts
            .filter(it => it.title.includes(titleQuery || ""))
            .slice(page * perPage, (page + 1) * perPage)
    }

}

export class MockUserRepository extends UserRepository {

    getUserById = async (id: string): Promise<UserDto> => {
        await sleep(400)
        return (
            {
                id: id,
                name: `User-${id}`,
                email: `test${id}@email.com`,
                phone: `+4445234234${id}`
            }
        )
    }

}