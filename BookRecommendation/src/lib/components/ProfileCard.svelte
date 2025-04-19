<script lang="ts">
    let {data} = $props();
</script>

<div class="profile-card">
    <p><strong>Name:</strong> {data.session.user.name}</p>
    <p><strong>Email:</strong> {data.session.user.email}</p>
    {#if data.session.user.image}
        <img src={data.session.user.image} alt="Profile picture" class="profile-pic"/>
    {/if}
</div>

<style>
    .profile-card {
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 12px;
        max-width: 400px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        margin: auto;
        text-align: center;
    }

    .profile-card p {
        margin: 0.5rem 0;
    }

    .profile-pic {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-top: 1rem;
    }
</style>