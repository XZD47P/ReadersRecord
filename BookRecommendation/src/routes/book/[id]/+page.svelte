<script lang="ts">
    import BookDetails from "$lib/components/BookDetails.svelte";
    import Cover from "$lib/pic/default-thumbnail.png";
    import {onMount} from "svelte";
    import BookRating from "$lib/components/BookRating.svelte";

    export let data: {
        session: any,
        book: any
    };

    let book: {
        id: string;
        volumeInfo: {
            title: string;
            authors: string[];
            description: string;
            publishedDate: string;
            categories?: string[];
            imageLinks?: {
                thumbnail?: string;
            };
            industryIdentifiers?: {
                type: string;
                identifier: string;
            }[];
        };
    } = data.book;

    //A tisztaság fentartásavégett
    const isbn13 = book.volumeInfo.industryIdentifiers?.find(
        (industryIdentifier) => industryIdentifier.type === "ISBN_13"
    )?.identifier;

    //Értékelés
    let rating = 0;
    let comment = '';

    let averageRating: number | null = null;
    let reviewCount: number = 0;
    let reviews: {
        user_id: string;
        rating: number;
        comment: string | null;
    }[] = [];

    async function loadAllRatings(bookId: string) {
        const res = await fetch(`/api/rating/${bookId}/all`);
        if (res.ok) {
            const data = await res.json();
            averageRating = data.averageRating;
            reviewCount = data.reviewCount;
            reviews = data.reviews;
        }
    }

    onMount(async () => {
        await loadAllRatings(book.id);

        if (!data.session) return;

        const res = await fetch(`/api/rating/${book.id}`);
        if (res.ok) {
            const existing = await res.json();
            rating = existing.rating || 0;
            comment = existing.comment || '';
        }

    });

    async function handleRate(value: number) {
        rating = value;

        const res = await fetch(`/api/rating/${book.id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({rating, comment})
        });

        if (!res.ok) {
            alert('Could not save rating.');
        }

        await loadAllRatings(book.id);
    }
</script>
<BookDetails
        author={book.volumeInfo.authors}
        desc={book.volumeInfo.description}
        genre={book.volumeInfo.categories}
        isbnNumber={isbn13}
        publishDate={book.volumeInfo.publishedDate}
        thumbnail={book.volumeInfo.imageLinks?.thumbnail || Cover}
        title={book.volumeInfo.title}/>

{#if data.session}
    <h3>Rate this book:</h3>
    <BookRating rating={rating} editable={true} onRate={handleRate}/>

    <textarea bind:value={comment} placeholder="Leave a comment..." rows="3"></textarea>
    <button on:click={() => handleRate(rating)}>Submit Rating</button>
{:else }
    <h3>Login <a href="/signin">here</a> to rate this book!</h3>
{/if}

{#if averageRating !== null}
    <p><strong>⭐ {averageRating}</strong> ({reviewCount} reviews)</p>
{:else}
    <p>No ratings yet.</p>
{/if}

<div class="review-list">
    {#each reviews as review}
        <div class="review">
            <BookRating rating={review.rating} editable={false}/>
            {#if review.comment}
                <p>{review.comment}</p>
            {/if}
            <small>User: {review.user_id}</small>
        </div>
    {/each}
</div>

<style>
    .review-list {
        margin-top: 2rem;
    }

    .review {
        border-bottom: 1px solid #ddd;
        padding: 0.5rem 0;
    }
</style>