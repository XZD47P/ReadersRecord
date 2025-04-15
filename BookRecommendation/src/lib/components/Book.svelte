<script lang="ts">
    let {title, thumbnail} = $props();
</script>

<div class="book-card">
    <img alt="Book cover not found" class="thumbnail" src={thumbnail}/>
    <h3>{title}</h3>
</div>

<style>

    /*.thumbnail {*/
    /*    width: 120px;*/
    /*    height: 180px;*/
    /*    object-fit: cover;*/
    /*    margin-bottom: 0.5rem;*/
    /*}*/

    .book-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #fff;
        border-radius: 0.75rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        text-align: center;
        transition: transform 0.2s ease;
    }

    .book-card:hover {
        transform: translateY(-4px);
    }

    .book-card img {
        width: 100px;
        height: auto;
        border-radius: 4px;
        margin-bottom: 0.5rem;
    }

    .book-card h3 {
        font-size: 1rem;
        color: #333;
        margin: 0;
    }
</style>