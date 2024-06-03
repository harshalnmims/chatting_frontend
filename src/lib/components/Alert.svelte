<script lang="ts">
	import { message } from '$lib/stores/validation';
   
    $: valid = $message;
    console.log('store function called')
    console.log('valid message ',$message)

    
</script>

<div class={valid == null ?  "alert alert-danger alert-dismissible fade hide" : "alert alert-danger alert-dismissible fade show" } role="alert">
   
    {#if valid == null }
   <strong class="text-center text-danger d-flex justify-content-center"></strong>
   {:else}
   <strong class="text-center text-danger d-flex justify-content-center">{$message}</strong>
   {/if}
   
   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>