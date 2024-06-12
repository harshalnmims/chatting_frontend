<script lang="ts">
  export let data;
  let headerModules: object[] = data.modules;
</script>

<div class="d-flex justify-content-center">
  {#if headerModules.length > 0}
    <ul class="d-flex gap-4 my-4 flex-wrap">
      {#each headerModules as mod}
        <li class="px-8 text-[18px]"><a href="#" class="hover:text-green-500 focus:underline-[green] focus:text-green-500">{mod.module_name}</a></li>
      {/each}
    </ul>
  {/if}
</div>

<slot />
