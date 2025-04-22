<script lang="ts">
    let {averageRating, reviewCount, reviews} = $props();
</script>

{#if averageRating !== null}
    <p class="average-rating">
        Average Rating:
        <span class="star">⭐</span> {averageRating}
        <span class="review-count">({reviewCount} reviews)</span>
    </p>
{:else}
    <p class="no-ratings">No ratings yet.</p>
{/if}

<div class="review-list">
    {#each reviews as review}
        <div class="review-card">
            <div class="review-header">
                <span class="review-rating">⭐ {review.rating}</span>
                <span class="review-user">by {review.username}</span>
            </div>
            {#if review.comment}
                <p class="review-comment">"{review.comment}"</p>
            {/if}
        </div>
    {/each}
</div>

<style>
    .average-rating {
        font-size: 1.2rem;
        font-weight: bold;
        margin: 1rem 0;
    }

    .star {
        color: #ffb400;
    }

    .review-count {
        font-weight: normal;
        font-size: 0.95rem;
        color: #666;
        margin-left: 0.5rem;
    }

    .no-ratings {
        font-style: italic;
        color: #888;
        margin: 1rem 0;
    }

    .review-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .review-card {
        padding: 1rem;
        border: 1px solid #eee;
        border-radius: 0.75rem;
        background-color: #fafafa;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .review-header {
        font-size: 0.95rem;
        font-weight: 500;
        color: #333;
    }

    .review-rating {
        color: #333;
    }

    .review-user {
        color: #555;
        margin-left: 0.25rem;
    }

    .review-comment {
        margin-top: 0.5rem;
        color: #444;
        font-size: 0.95rem;
    }
</style>