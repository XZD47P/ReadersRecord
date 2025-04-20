<script lang="ts">
    import {signIn} from "@auth/sveltekit/client";

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

<div class="login-wrapper">
    <h2>Welcome back!</h2>

    <form class="login-form" on:submit={handleLogin}>
        <div class="form-group">
            <label for="email">Email</label>
            <input bind:value={email} id="email" name="email" placeholder="you@example.com" required type="email"/>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input bind:value={password} id="password" name="password" placeholder="••••••••" required type="password"/>
        </div>
        <button class="primary-btn" type="submit">Log In</button>
    </form>

    {#if errorMessage}
        <div class="error">{errorMessage}</div>
    {/if}

    <div class="divider">or</div>

    <button class="github-btn" on:click={() => signIn("github", { callbackUrl: "/" })}>
        <i class="fab fa-github"></i> Log in with GitHub
    </button>
    You dont have an account? <a href="/register">Register now!</a>
</div>

<style>
    .login-wrapper {
        max-width: 400px;
        margin: 3rem auto;
        padding: 2rem;
        background: white;
        border-radius: 16px;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    h2 {
        margin-bottom: 1.5rem;
        font-size: 1.75rem;
        color: #333;
    }

    .login-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        text-align: left;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    label {
        margin-bottom: 0.25rem;
        font-weight: 600;
        font-size: 0.95rem;
        color: #444;
    }

    input {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    input:focus {
        outline: none;
        border-color: #0070f3;
    }

    .primary-btn {
        padding: 0.75rem;
        background-color: #0070f3;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .primary-btn:hover {
        background-color: #0059c1;
    }

    .divider {
        margin: 1.5rem 0;
        font-size: 0.9rem;
        color: #999;
        position: relative;
    }

    .divider::before,
    .divider::after {
        content: "";
        position: absolute;
        top: 50%;
        width: 40%;
        height: 1px;
        background-color: #ddd;
    }

    .divider::before {
        left: 0;
    }

    .divider::after {
        right: 0;
    }

    .github-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem;
        width: 100%;
        font-size: 1rem;
        font-weight: 600;
        background-color: #24292e;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .github-btn:hover {
        background-color: #1b1f23;
    }

    .error {
        margin-top: 1rem;
        color: red;
        font-weight: 500;
    }

    .fab.fa-github {
        font-size: 1.2rem;
    }

    a, a:visited {
        color: #0070f3;
    }
</style>