<script lang="ts">
  export let data;
  let headerModules: object[] = data.modules;
</script>

<div class="d-flex justify-content-end">
  {#if headerModules.length > 0}
    <ul
      class="d-flex gap-4 my-4 flex-wrap mt-0 py-4 rounded-b-lg"
      style="margin-right: 10rem;"
    >
      {#each headerModules as mod}
        <li class="px-8 text-[18px]">
          <a href="/dashboard" class="hover:text-green-500 hover:underline-[green]"
            >{mod.module_name}</a
          >
        </li>
      {/each}
    </ul>
    <div class="mt-4">
      <i style="font-size:30px;" class="fa-regular fa-bell mr-[50px]"></i>
    </div>
  {/if}
</div>

<slot />

<style>
</style>
