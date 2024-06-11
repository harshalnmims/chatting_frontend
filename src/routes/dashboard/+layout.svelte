<script lang="ts">
  export let data;
  let headerModules: object[] = data.modules;
</script>

<div class="d-flex justify-content-center">
  {#if headerModules.length > 0}
    <ul class="d-flex gap-4 my-4">
      {#each headerModules as mod}
        <li class="px-8 text-[20px]">{mod.module_name}</li>
      {/each}
    </ul>
  {/if}
</div>

<slot />
