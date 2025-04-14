<script lang="ts">
    import {signIn} from '@auth/sveltekit/client';
    import {goto} from '$app/navigation';
    import {SignIn} from "@auth/sveltekit/components";

    let email = '';
    let password = '';
    let error = '';

    async function loginUser(event: Event) {
        event.preventDefault();
        error = '';

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.ok) {
            goto('/'); // or wherever you want to redirect
        } else {
            error = 'Invalid email or password';
        }
    }
</script>

<form class="login-form" on:submit={loginUser}>
    <h2>Login</h2>

    {#if error}
        <p class="error">{error}</p>
    {/if}

    <input bind:value={email} placeholder="Email" required type="email"/>
    <input bind:value={password} placeholder="Password" required type="password"/>
    <button type="submit">Login</button>
</form>
<SignIn provider="github"></SignIn>

<style>
    .login-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 400px;
        margin: 2rem auto;
        padding: 24px;
        border-radius: 12px;
        background-color: #f0f0f0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
        text-align: center;
        color: #333;
    }

    input {
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 1rem;
    }

    button {
        padding: 10px;
        background-color: #0070f3;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #0059c1;
    }

    .error {
        color: red;
        font-weight: bold;
        text-align: center;
    }
</style>