import {UserRepository} from "./data/UserRepository";
import {PostRepository} from "./data/PostRepository";
import {GetPosts} from "./domain/useCases/GetPosts";
import {ViewController} from "./presentation/ViewController";
import {init} from './presentation/htmlRenderer'
import {MockPostRepository, MockUserRepository} from "./data/mock";

// const postRepository = new MockPostRepository()
// const userRepository = new MockUserRepository()
const postRepository = new PostRepository()
const userRepository = new UserRepository()

const getPosts = new GetPosts(postRepository, userRepository)
const viewController = new ViewController(getPosts)

init(viewController)