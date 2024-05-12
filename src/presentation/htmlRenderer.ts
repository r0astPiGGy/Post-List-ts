import {ViewController} from "./ViewController";
import {Post} from "../domain/model/Post";

const noPostsView = document.querySelector<HTMLElement>("#no-posts")!
const searchView = document.querySelector<HTMLInputElement>("#search-bar")!
const postContainer = document.querySelector<HTMLElement>("#posts-list")!
const errorContainer = document.querySelector<HTMLElement>("#error-container")!
const retryButton = document.querySelector<HTMLElement>("#retry-button")!
const errorMessage = document.querySelector<HTMLElement>("#error")!
const loaderView = document.querySelector<HTMLElement>("#loader")!

export function init(viewController = new ViewController()) {
    viewController.searchQuery.observe(onSearchQueryUpdated)
    viewController.isLoading.observe(onIsLoadingUpdated)
    viewController.posts.observe(onPostsUpdated)
    viewController.nothingFound.observe(onNothingFoundChanged)
    viewController.error.observe(onErrorChanged)

    searchView.addEventListener("input", evt => {
        viewController.onQueryChanged((evt.target as HTMLInputElement).value)
    })
    window.addEventListener("scroll", () => {
        if (hasReachedBottom()) {
            viewController.onLoadMore()
        }
    });
    retryButton.addEventListener("click", viewController.onRetry)

    viewController.clearAndLoad()
}

function hasReachedBottom() {
    const contentHeight = postContainer.offsetHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    return scrollTop + windowHeight >= contentHeight
}

const onSearchQueryUpdated = (query: string | null) => searchView!.value = query!

function onErrorChanged(error: Error | null) {
    setVisible(errorContainer, error !== null)
    if (error !== null) {
        errorMessage!.textContent = error.toString()
        console.log("Caught error:", error)
    }
}

function onNothingFoundChanged(state: boolean) {
    setVisible(noPostsView, state)
}

function onIsLoadingUpdated(isLoading: boolean) {
    setVisible(loaderView, isLoading)
}

function setVisible(element: HTMLElement, enabled: boolean) {
    element.style.display = enabled ? "flex" : "none";
}

function onPostsUpdated(posts: Post[]) {
    postContainer.innerHTML = ""
    posts.map(createPost).forEach(postEl => postContainer.appendChild(postEl))
}

function createPost(post: Post) {
    const fullName = post.getAuthor().getName()
    const phone = post.getAuthor().getPhone()
    const email = post.getAuthor().getEmail()

    const postEl = document.createElement("div")

    postEl.className = "post"
    postEl.innerHTML = `
        <h2>${post.getTitle()}</h2>
        <div class="spacer-sm"></div>
        <p>${post.getBody()}</p>
        <div class="spacer"></div>
        <div class="author">
            <i class="person-icon">
                <img src="./../public/person.svg" height="24" width="24" alt="person-icon">
            </i>
            <div class="person-info">
                <p class="person-name">${fullName}</p>
                <a href="tel:${phone}">${phone}</a>
                <a href="mailto:${email}">${email}</a>
            </div>
        </div>
    `

    return postEl
}
