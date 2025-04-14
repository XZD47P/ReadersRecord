<script lang="ts">
    import {signIn} from "@auth/sveltekit/client";
    import {SignIn} from "@auth/sveltekit/components";
    import {goto} from "$app/navigation";

    let email = '';
    let password = '';
    let errorMessage = '';

    async function handleLogin(event: Event) {
        event.preventDefault();

        try {
            const result = await signIn("credentials", {
                email,
                password,
                callbackUrl: "/"
            });

        } catch (error) {
            errorMessage = "An error occurred during login.";
            console.error("Login error:", error);
        }
    }
</script>

<div>
    <form class="login-form" on:submit={handleLogin}>
        <label>
            Email
            <input bind:value={email} name="email" required type="email"/>
        </label>
        <label>
            Password
            <input bind:value={password} name="password" required type="password"/>
        </label>
        <button type="submit">Log in</button>
    </form>

    {#if errorMessage}
        <div class="error">{errorMessage}</div>
    {/if}
</div>

<button on:click={()=> signIn("github", {callbackUrl: "/"})}>Log in with Github</button>

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