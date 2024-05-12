import {BASE_URL, POSTS_PER_PAGE} from "./const";

export type PostDto = {
    id: string
    title: string
    body: string
    userId: string
}

export class PostRepository {

    getPosts = async (
        titleQuery: string | null = null,
        page = 0,
        perPage = POSTS_PER_PAGE
    ) => {
        const paramObj: Record<string, string> = {
            "_per_page": perPage.toString(),
            "_page": page.toString(),
            "_limit": perPage.toString()
        }

        if (titleQuery !== null && titleQuery !== "") {
            paramObj["title_like"] = titleQuery
        }

        const params = new URLSearchParams(paramObj).toString()
        let response = await fetch(`${BASE_URL}/posts?${params}`);
        return await response.json() as PostDto[];
    }
}