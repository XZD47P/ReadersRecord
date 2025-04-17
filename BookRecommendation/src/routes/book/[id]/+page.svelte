<script lang="ts">
    import BookDetails from "$lib/components/BookDetails.svelte";
    import Cover from "$lib/pic/default-thumbnail.png";

    export let data;
    // const book = data.book.volumeInfo;
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
</script>
<BookDetails
        author={book.volumeInfo.authors}
        desc={book.volumeInfo.description}
        genre={book.volumeInfo.categories}
        isbnNumber={isbn13}
        publishDate={book.volumeInfo.publishedDate}
        thumbnail={book.volumeInfo.imageLinks?.thumbnail || Cover}
        title={book.volumeInfo.title}/>