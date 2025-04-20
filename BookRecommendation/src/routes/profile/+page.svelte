<script lang="ts">
    import ProfileCard from "$lib/components/ProfileCard.svelte";
    import {onMount} from "svelte";
    import Book from "$lib/components/Book.svelte";

    export let data: {
        session: any;
    };

    let favourites: Array<{
        title: string;
        thumbnailUrl: string;
        id: string;
    }> = [];

    let currentlyReading: {
        id: string;
        title: string;
        thumbnailUrl: string;
    }

    onMount(async () => {
        if (data.session?.user?.id) {
            const res = await fetch(`/api/favourite?userId=${data.session.user.id}`);
            const json = await res.json();
            favourites = json.favourites.map((item: any) => ({
                id: item.bookId, // rename to match what's expected
                title: item.title,
                thumbnailUrl: item.thumbnailUrl
            }));

            const readingRes = await fetch(`/api/reading_status?userId=${data.session.user.id}`);
            const readingJson = await readingRes.json();
            if (readingJson.read?.length > 0) {
                const item = readingJson.read[0];
                currentlyReading = {
                    id: item.bookId,
                    title: item.title,
                    thumbnailUrl: item.thumbnailUrl
                };
            }
        }
    });

    //Horizontális görgetés
    let scrollContainer: HTMLDivElement;

    function scrollLeft() {
        scrollContainer.scrollBy({left: -300, behavior: "smooth"});
    }

    function scrollRight() {
        scrollContainer.scrollBy({left: 300, behavior: "smooth"});
    }
</script>

<h1>Profile</h1>
<div class="top-section">
    <div class="profile-card-wrapper">
        <ProfileCard data={data}/>
    </div>
    <div class="currently-reading">
        {#if currentlyReading}
            <Book title={currentlyReading.title} thumbnail={currentlyReading.thumbnailUrl} id={currentlyReading.id}/>
        {:else}
            You don't read anything right now!
        {/if}
    </div>
</div>
<h2>Favourite Books:</h2>
{#if favourites.length > 0}
    <div class="slider-wrapper">
        {#if favourites.length > 5}
            <button class="scroll-btn left" on:click={scrollLeft} aria-label="Scroll left">
                <i class="fas fa-arrow-left"></i>
            </button>
        {/if}
        <div class="scroll-container" bind:this={scrollContainer}>
            {#each favourites as book}
                <Book title={book.title} thumbnail={book.thumbnailUrl} id={book.id}/>
            {/each}
        </div>
        {#if favourites.length > 5}
            <button class="scroll-btn right" on:click={scrollRight} aria-label="Scroll right">
                <i class="fas fa-arrow-right"></i>
            </button>
        {/if}
    </div>
{:else}
    <p>You haven't added any favorite books yet.</p>
{/if}
<style>
    h1, h2 {
        text-align: center;
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-weight: 600;
    }

    h1 {
        font-size: 2.25rem;
    }

    h2 {
        font-size: 1.5rem;
        color: #444;
    }

    .slider-wrapper {
        position: relative;
        max-width: 1000px;
        margin: 0 auto;
        padding: 1rem 2rem;
    }

    .scroll-container {
        display: flex;
        overflow-x: auto;
        scroll-behavior: smooth;
        gap: 1rem;
        padding: 1rem 0;
        scrollbar-width: none; /* Firefox */
    }

    .scroll-container::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
    }

    .scroll-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.9);
        border: none;
        font-size: 1.5rem;
        padding: 0.5rem 1rem;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        z-index: 1;
    }

    .scroll-btn:hover {
        background: #eee;
    }

    .scroll-btn.left {
        left: 0;
    }

    .scroll-btn.right {
        right: 0;
    }

    p {
        text-align: center;
        color: #777;
        font-style: italic;
        margin-top: 2rem;
    }

    .top-section {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 2rem;
        flex-wrap: wrap;
        margin-bottom: 2rem;
    }

    .profile-card-wrapper {
        max-width: 350px;
        flex: 1 1 auto;
    }

    .currently-reading {
        max-width: 200px;
        flex: 1 1 auto;
        text-align: center;
    }

    .currently-reading :global(.book-card) {
        background-color: #f9f9f9;
        border: 1px solid #ccc;
    }
</style>