<script lang="ts">

    export let data: {
        session: any;
    };
    import ProfileCard from "$lib/components/ProfileCard.svelte";
</script>

<h1>Profile</h1>
<ProfileCard data={data}/>

<style>

</style>