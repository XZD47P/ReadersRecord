<script lang="ts">
    import {onMount} from "svelte";

    let {bookId, onUpdate} = $props();

    let rating = $state(0);
    let comment = $state("");
    let maxStars: number = 5;
    let submitting = $state(false);
    let hasReview = $state(false);

    let hover = $state(0);

    onMount(async () => {
        const res = await fetch(`/api/rating/${bookId}`);
        if (res.ok) {
            const existing = await res.json();
            rating = existing.rating || 0;
            comment = existing.comment || '';
            if (rating > 0) {
                hasReview = true;
            }
        }
    });

    async function handleRate(value: number) {
        rating = value;
    }

    async function submitRating() {
        submitting = true;
        const res = await fetch(`/api/rating/${bookId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({rating, comment})
        });

        if (!res.ok) {
            alert('Could not save rating.');
        } else {
            hasReview = true;
            onUpdate(); //Szólunk, hogy a mentés megtörtént, a parent frissíthet
        }

        submitting = false;
    }

    async function deleteReview() {
        const confirmed = confirm("Are you sure you want to delete your review?");
        if (!confirmed) return;

        const res = await fetch(`/api/rating/${bookId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            rating = 0;
            comment = '';
            hasReview = false;
            onUpdate();
        } else {
            alert("Could not delete review.");
        }
    }
</script>
<div class="rating-container">
    <h3>Rate this book:</h3>
    <div class="stars">
        {#each Array(maxStars) as _, i}
    <span
            class="star {i < (hover || rating) ? 'filled' : ''}"
            onclick={() => handleRate(i + 1)}
            onmouseover={() => (hover = i + 1)}
            onmouseleave={() => (hover = 0)}
    >
            ★
        </span>
        {/each}
    </div>
    <textarea
            bind:value={comment}
            class="comment-box"
            placeholder="Leave a comment..."
            rows="3"
    ></textarea>
    <div class="btn-row">
        <button class="submit-btn" disabled={submitting} onclick={submitRating}>
            {submitting ? 'Submitting...' : 'Submit Rating'}
        </button>

        {#if hasReview}
            <button class="delete-btn" onclick={deleteReview}>
                Delete Review
            </button>
        {/if}
    </div>
</div>

<style>
    .stars {
        display: flex;
        justify-content: center;
        font-size: 1.5rem;
    }

    .star {
        cursor: pointer;
        color: #ccc;
        transition: color 0.2s ease;
        margin: 0 2px;
    }

    .star.filled {
        color: gold;
    }

    .rating-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 360px;
        margin: 1rem auto;
        padding: 1rem;
        background-color: #f9f9f9;
        border-radius: 0.75rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .comment-box {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.4rem;
        border: 1px solid #ccc;
        font-size: 0.9rem;
    }

    .submit-btn,
    .delete-btn {
        align-self: flex-end;
        padding: 0.4rem 0.9rem;
        background-color: #0070f3;
        color: white;
        border: none;
        border-radius: 0.4rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .submit-btn:disabled {
        background-color: #aaa;
        cursor: not-allowed;
    }

    .submit-btn:hover:not(:disabled) {
        background-color: #005ec2;
    }

    .delete-btn {
        background-color: #ff5c5c;
        color: white;
    }

    .delete-btn:hover {
        background-color: #e04848;
    }
</style>