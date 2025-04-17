<script lang="ts">
    export let rating: number = 0;
    export let maxStars: number = 5;
    export let editable: boolean = false;
    export let onRate: (value: number) => void = () => {
    };

    let hover = 0;

    function setRating(value: number) {
        if (editable) {
            onRate(value);
        }
    }
</script>
<div>
    {#each Array(maxStars) as _, i}
    <span
            class="star {i < (hover || rating) ? 'filled' : ''}"
            on:click={() => setRating(i + 1)}
            on:mouseover={() => (hover = i + 1)}
            on:mouseleave={() => (hover = 0)}
    >
      ★
    </span>
    {/each}
</div>

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