<script lang="ts">
    import {onMount, createEventDispatcher} from "svelte";

    let {bookId} = $props();

    const dispatch = createEventDispatcher();

    let rating = $state(0);
    let comment = $state("");
    let maxStars: number = 5;
    let submitting = $state(false);

    let hover = $state(0);

    onMount(async () => {
        const res = await fetch(`/api/rating/${bookId}`);
        if (res.ok) {
            const existing = await res.json();
            rating = existing.rating || 0;
            comment = existing.comment || '';
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
            dispatch('updated'); //Szólunk, hogy a mentés megtörtént, a parent frissíthet
        }

        submitting = false;
    }
</script>
<div>
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
        placeholder="Leave a comment..."
        rows="3"
></textarea>
<button disabled={submitting} onclick={submitRating}>
    {submitting ? 'Submitting...' : 'Submit Rating'}
</button>

<style>
    .star {
        cursor: pointer;
        font-size: 2rem;
        color: #ccc;
        transition: color 0.2s;
    }

    .star.filled {
        color: gold;
    }
</style>