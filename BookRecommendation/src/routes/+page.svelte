<script lang="ts">
    import {SignIn, SignOut} from "@auth/sveltekit/components";
    import {page} from "$app/stores"
    //page.data.session tartalmazza a felhasználó auth adatait
    console.log($page.data.session)
    import {signIn} from '@auth/sveltekit/client';

    let email = '';
    let password = '';
</script>

<div>
    {#if $page.data.session}
        <h1>You are logged in</h1>
        <SignOut/>
    {:else}
        <h1>You are not logged in</h1>

        <div>
            <form>
                <label>
                    Email
                    <input name="email" type="email" bind:value={email}/>
                </label>
                <label>
                    Password
                    <input name="password" type="password" bind:value={password}/>
                </label>
                <button on:click={() => signIn("credentials", { email, password })}>
                    Log in
                </button>
            </form>
        </div>
        <SignIn provider="github"></SignIn>
    {/if}
</div>

<style lang="scss">
  div {
    padding: 24px;
  }

  .button {
    background-color: darkblue;
    padding: 8px;
    color: white;
    font-weight: bold;
    border-radius: 10px;
  }
</style>