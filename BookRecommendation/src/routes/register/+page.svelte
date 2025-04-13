<script>
    let email = '';
    let password = '';
    let name = '';

    async function registerUser(event) {
        event.preventDefault();

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password, name})
        });

        const data = await res.json();
        if (res.ok) {
            alert('User registered. You can now log in.');
        } else {
            alert(data.error || 'Registration failed');
        }
    }
</script>

<form on:submit|preventDefault={registerUser}>
    <input bind:value={name} placeholder="Name" required type="text"/>
    <input bind:value={email} placeholder="Email" required type="email"/>
    <input bind:value={password} placeholder="Password" required type="password"/>
    <button type="submit">Register</button>
</form>