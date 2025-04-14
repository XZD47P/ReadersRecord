<script lang="ts">
    import {SignIn, SignOut} from "@auth/sveltekit/components";
    import {page} from "$app/stores"
    //page.data.session tartalmazza a felhasználó auth adatait
    console.log($page.data.session)
    import {signIn} from '@auth/sveltekit/client';
    import RegisterForm from "$lib/components/RegisterForm.svelte";
    import LoginForm from "$lib/components/LoginForm.svelte";

</script>

<div>
    {#if $page.data.session}
        <h1>You are logged in</h1>
        <SignOut/>
    {:else}
        <h1>You are not logged in</h1>
        <LoginForm/>
        <RegisterForm/>
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