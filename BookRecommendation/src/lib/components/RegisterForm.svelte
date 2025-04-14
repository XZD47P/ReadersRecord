<script lang="ts">
    let email = '';
    let password = '';
    let name = '';
    let error = '';
    let success = '';

    async function registerUser(event: Event) {
        event.preventDefault();
        error = '';
        success = '';

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password, name})
        });

        const data = await res.json();
        if (res.ok) {
            success = 'User registered. You can now log in.';
            email = '';
            password = '';
            name = '';
        } else {
            error = data.error || 'Registration failed';
        }
    }
</script>

<form class="register-form" on:submit={registerUser}>
    <h2>Register</h2>

    {#if success}
        <p class="success">{success}</p>
    {/if}
    {#if error}
        <p class="error">{error}</p>
    {/if}

    <input bind:value={name} placeholder="Name" required type="text"/>
    <input bind:value={email} placeholder="Email" required type="email"/>
    <input bind:value={password} placeholder="Password" required type="password"/>
    <button type="submit">Register</button>
</form>

<style>
    .register-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 400px;
        margin: 2rem auto;
        padding: 24px;
        border-radius: 12px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
        margin: 0;
        font-size: 1.5rem;
        color: #333;
        text-align: center;
    }

    input {
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 1rem;
    }

    button {
        padding: 10px;
        background-color: #0066ff;
        color: white;
        font-weight: bold;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #004acc;
    }

    .success {
        color: green;
        font-weight: bold;
    }

    .error {
        color: red;
        font-weight: bold;
    }
</style>