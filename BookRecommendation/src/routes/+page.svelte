<script lang="ts">
    import {SignIn, SignOut} from "@auth/sveltekit/components";
    // import {page} from "$app/stores"

    export let data:{
        session: any;
    }
    //page.data.session tartalmazza a felhasználó auth adatait
    console.log(data.session)


</script>

<div>
    {#if data.session}
        <h1>You are logged in</h1>
        <SignOut/>
    {:else}
        <h1>You are not logged in</h1>
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