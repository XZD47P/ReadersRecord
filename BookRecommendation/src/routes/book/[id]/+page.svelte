<script lang="ts">
    import BookDetails from "$lib/components/BookDetails.svelte";
    import Cover from "$lib/pic/default-thumbnail.png";
    import {onMount} from "svelte";
    import BookRating from "$lib/components/BookRating.svelte";
    import BookReviews from "$lib/components/BookReviews.svelte";

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
    let averageRating: number | null = null;
    let reviewCount: number = 0;
    let reviews: {
        username: string;
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
    });
</script>
<BookDetails
        author={book.volumeInfo.authors}
        bookId={book.id}
        desc={book.volumeInfo.description}
        genre={book.volumeInfo.categories}
        isbnNumber={isbn13}
        publishDate={book.volumeInfo.publishedDate}
        session={data.session}
        thumbnail={book.volumeInfo.imageLinks?.thumbnail || Cover}
        title={book.volumeInfo.title}/>

{#if data.session}
    <BookRating bookId={book.id} on:updated={() => loadAllRatings(book.id)}/>
{:else }
    <h3>Login <a href="/signin">here</a> to rate this book!</h3>
{/if}

<BookReviews
        averageRating={averageRating}
        reviewCount={reviewCount}
        reviews={reviews}
/>

<style>

</style>