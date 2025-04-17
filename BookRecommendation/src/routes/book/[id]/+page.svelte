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

    onMount(() => {
        const stored = localStorage.getItem(`rating-${data.book.id}`);
        if (stored) rating = +stored;
    });

    function handleRate(value: number) {
        rating = value;
        localStorage.setItem(`rating-${data.book.id}`, value.toString());
        // If you had a backend, this is where you’d POST the rating
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
    <BookRating editable={!!data.session} onRate={handleRate} rating={rating}/>
{:else }
    <h3>Login <a href="/signin">here</a> to rate this book!</h3>
{/if}