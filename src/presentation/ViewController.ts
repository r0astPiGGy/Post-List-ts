import {GetPosts} from "../domain/useCases/GetPosts";
import {observableListOf, observableOf} from "./property/ObservableProperty";
import {debounce, isEmpty} from "./utils";
import {Post} from "../domain/model/Post";

const DEBOUNCE_TIMEOUT_MILLIS = 500

export class ViewController {

    private page = 0
    private noMorePages = false

    #isLoading = observableOf(false)
    #searchQuery = observableOf<string | null>(null)
    #posts = observableListOf<Post>([])
    #nothingFound = observableOf(false)
    #error = observableOf<Error | null>(null)

    constructor(
        private getPosts = new GetPosts()
    ) {}

    onLoadMore = () => {
        if (this.isLoading.getValue()) return

        this.#loadPosts(this.searchQuery.getValue())
    }

    onQueryChanged = (searchQuery: string) => {
        this.#searchQuery.setValue(searchQuery)
        this.#loadByQueryDebounced(searchQuery)
    }

    #loadByQueryDebounced = debounce(searchQuery => this.clearAndLoad(searchQuery), DEBOUNCE_TIMEOUT_MILLIS)

    clearAndLoad = (searchQuery = null) => {
        this.page = 0
        this.noMorePages = false
        this.#posts.setValue([])
        this.#loadPosts(searchQuery)
    }

    onRetry = () => this.#loadPosts(this.searchQuery.getValue())

    #loadPosts = (searchQuery: string | null) => {
        this.#error.setValue(null)

        if (this.isLoading.getValue() || this.noMorePages) return

        this.#isLoading.setValue(true)
        this.#nothingFound.setValue(false)

        this.getPosts
            .execute(this.page, searchQuery)
            .then(this.#onPostsLoaded)
            .catch(e => this.#error.setValue(e))
            .finally(() => this.#isLoading.setValue(false))
    }

    #onPostsLoaded = (posts: Post[]) => {
        this.#nothingFound.setValue(
            posts.length === 0 &&
            !isEmpty(this.searchQuery.getValue()) &&
            this.page === 0
        )

        if (posts.length === 0) {
            this.noMorePages = true
            return
        }

        this.#posts.append(posts);
        this.page++
    }

    get isLoading() { return this.#isLoading.toImmutable() }

    get searchQuery() { return this.#searchQuery.toImmutable() }

    get posts() { return this.#posts.toImmutable() }

    get nothingFound() { return this.#nothingFound.toImmutable() }

    get error() { return this.#error.toImmutable() }

}
