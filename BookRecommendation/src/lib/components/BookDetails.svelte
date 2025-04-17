<script lang="ts">
    let {title, thumbnail, publishDate, isbnNumber, genre, author, desc} = $props();
</script>

<div class="book-details">
    <div class="left-section">
        <img alt="Default book cover" src={thumbnail}/>
        <h1>{title}</h1>
        <p class="author">By: {author}</p>
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
</style>