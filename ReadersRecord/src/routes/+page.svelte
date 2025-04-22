<script lang="ts">
    import {SignIn, SignOut} from "@auth/sveltekit/components";
    import Book from "$lib/components/Book.svelte";
    import Cover from "$lib/pic/default-thumbnail.png";
    // import {page} from "$app/stores"

    export let data: {
        session: any;
    }
    //page.data.session tartalmazza a felhasználó auth adatait
    console.log(data.session)

    //Könyv keresés funkció implementálása
    let searchQuery: string = '';
    let books: Array<{
        title: string;
        thumbnail: string;
        id: string;
    }> = [];
    let loading: boolean = false;
    let error: string = '';

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            searchBooks();
        }
    }

    async function searchBooks() {
        if (!searchQuery) return;  //Ne keressen, ha nincs benne szöveg

        loading = true;
        error = '';

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${searchQuery}&maxResults=30&key=AIzaSyDemm48k83DIKcCmLUobV3qAR1wl2_V1L8`);
            const data = await response.json();

            // A kapott válasz "book" hoz való rendelése
            books = data.items?.map((item: any) => ({
                title: item.volumeInfo.title,
                thumbnail: item.volumeInfo.imageLinks?.thumbnail || Cover,
                id: item.id,
            })) || [];
        } catch (e) {
            error = 'Failed to fetch books';
        } finally {
            loading = false;
        }
    }
</script>

<div>
    <div class="search-container">
        <div class="input-wrapper">
            <input
                    bind:value={searchQuery}
                    on:keydown={handleKeyDown}
                    placeholder="Search for a book..."
                    type="text"
            />
            <i class="fas fa-search search-icon"></i>
        </div>
        {#if loading}
            <p>Loading...</p>
        {/if}

        {#if error}
            <p class="error">{error}</p>
        {/if}
    </div>

    <div class="books-list">
        {#each books as book}
            <Book title={book.title} thumbnail={book.thumbnail} id={book.id}/>
        {/each}
    </div>
</div>

<style>
    .search-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 2rem;
        text-align: center;
    }

    .input-wrapper {
        position: relative;
        width: 60%;
        max-width: 400px;
    }

    .input-wrapper input {
        padding: 0.5rem 2.5rem 0.5rem 0.75rem; /* space for the icon */
        font-size: 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    .search-icon {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: #888;
        pointer-events: none;
    }


    .books-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1.5rem;
        padding: 2rem;
        max-width: 1000px;
        margin: 0 auto;
    }

    .error {
        color: red;
        font-weight: bold;
    }
</style>