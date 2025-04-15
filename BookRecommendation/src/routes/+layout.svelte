<script lang="ts">
    import {SignOut} from "@auth/sveltekit/components";
    import {signOut} from "@auth/sveltekit/client";

    export let data: {
        session: any;
        pathname: string;
    }
</script>

<nav class="navbar">
    <div class="left">
        <a class:active={data.pathname === '/'} href="/">Home</a>
    </div>
    <div class="right">
        {#if data.session}
            <button class="link-button" onclick={()=> signOut()}>Sign out</button>
        {:else}
            <a class:active={data.pathname === '/signin'} href="/signin">Login</a>
        {/if}
    </div>
</nav>

<slot/>

<style>
    .navbar {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background-color: #0070f3;
        justify-content: space-between;
    }

    .navbar a {
        color: white;
        text-decoration: none;
        font-weight: bold;
    }

    .navbar a.active {
        text-decoration: underline;
    }

    .link-button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        text-decoration: none;
        font-weight: bold;
        padding: 0;
    }

    .right {
        text-decoration: none;
        color: inherit;
        margin-left: auto;

    }
</style>