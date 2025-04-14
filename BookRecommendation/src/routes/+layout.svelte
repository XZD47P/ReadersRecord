<script lang="ts">
    import {page} from '$app/stores';
</script>

<nav class="navbar">
    <a class:active={$page.url.pathname === '/'} href="/">Home</a>
    <a class:active={$page.url.pathname === '/about'} href="/about">About</a>
    <a class:active={$page.url.pathname === '/login'} href="/signin">Login</a>
</nav>

<slot/>

<style>
    .navbar {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background-color: #0070f3;
    }

    .navbar a {
        color: white;
        text-decoration: none;
        font-weight: bold;
    }

    .navbar a.active {
        text-decoration: underline;
    }

    main {
        padding: 1.5rem;
    }
</style>