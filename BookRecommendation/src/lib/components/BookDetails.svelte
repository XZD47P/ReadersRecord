<script lang="ts">
    import {onMount} from "svelte";

    let {title, thumbnail, publishDate, isbnNumber, genre, author, desc, bookId, session} = $props();

    //Kedvencek felvétele
    let isFavourite = $state(false);
    let isReading = $state(false);
    let message = $state();

    onMount(async () => {
        if (session) {
            const res = await fetch(`/api/favourite?userId=${session.user.id}&bookId=${bookId}`);
            if (res.ok) {
                const data = await res.json();
                isFavourite = data.isFavourite;
            }

            const readRes = await fetch(`/api/reading-status?userId=${session.user.id}&bookId=${bookId}`);
            if (readRes.ok) {
                const readData = await readRes.json();
                isReading = readData.isReading;
            }
        }
    });

    async function toggleFavorite() {
        if (!session) {
            message = 'You need to be logged in to add favorites.';
            return;
        }

        const res = await fetch('/api/favourite', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                bookId,
                userId: session.user.id,
                title: title,
                thumbnail: thumbnail,
                favourite: !isFavourite
            })
        });

        if (res.ok) {
            isFavourite = !isFavourite;
            message = isFavourite ? 'Added to favorites!' : 'Removed from favorites.';
        } else {
            message = 'Something went wrong.';
        }
    }

    async function toggleReadingStatus() {
        if (!session) {
            message = 'You need to be logged in to add favorites.';
            return;
        }

        const res = await fetch('/api/reading-status', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                bookId,
                userId: session.user.id,
                title: title,
                thumbnail: thumbnail,
                reading: !isReading,
            })
        })

        if (res.ok) {
            isReading = !isReading;
            message = isReading ? 'Added to currently reading!' : 'Added to read!';
        }
        if (res.status === 409) {
            const {error} = await res.json();
            message = error;
        }
    }

</script>

<div class="book-details">
    <div class="left-section">
        <img alt="Default book cover" src={thumbnail}/>
        <h1>{title}</h1>
        <p class="author">By: {author}</p>
        {#if session}
            <button class="fav-button" onclick={toggleFavorite}>
                {isFavourite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <button class="read-button" onclick={toggleReadingStatus}>
                {isReading ? "Mark as read" : "Mark as currently reading"}
            </button>
        {/if}
        {#if message}
            <p class="message">{message}</p>
        {/if}
    </div>

    <div class="right-section">
        <div class="details">
            <p><strong>Published:</strong> {publishDate}</p>
            <p><strong>ISBN Number:</strong> {isbnNumber}</p>
            <p><strong>Genre:</strong> {genre}</p>
            <p class="description"><strong>Description:</strong> {desc}</p>
        </div>
    </div>
</div>

<style>
    .book-details {
        display: flex;
        flex-wrap: wrap;
        padding: 2rem;
        gap: 2rem;
        justify-content: center;
        align-items: flex-start;
        background-color: #f9f9f9;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 1000px;
        margin: 2rem auto;
    }

    .left-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        max-width: 300px;
        flex: 1;
    }

    .left-section img {
        width: 100%;
        max-width: 200px;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .left-section h1 {
        font-size: 1.5rem;
        margin: 0.5rem 0 0.25rem;
        color: #333;
    }

    .left-section .author {
        font-size: 1rem;
        color: #555;
    }

    .right-section {
        flex: 2;
        padding: 1rem;
        background-color: #fff;
        border-radius: 8px;
    }

    .details p {
        margin: 0.75rem 0;
        font-size: 1rem;
        line-height: 1.5;
        color: #444;
    }

    .details strong {
        color: #000;
    }

    .description {
        margin-top: 1rem;
    }

    @media (max-width: 768px) {
        .book-details {
            flex-direction: column;
            align-items: center;
        }

        .right-section {
            width: 100%;
        }
    }

    .fav-button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: #0070f3;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-weight: bold;
    }

    .fav-button:hover {
        background-color: #0099f3;
    }

    .message {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: #555;
    }
</style>