<script lang="ts">
  import { fetchApi } from "$lib/utils/fetchApi";
  import { ioClient } from "$lib/socket/socket.js";
  import { onMount } from "svelte";
  import { user } from "$lib/stores/validation.js";

  //   let chatList: object[];
  //   let response: any;
  //   export let data;

  //   let userId = undefined;
  //   let status: boolean = data.status;

  //   if (status == true) {
  //     onMount(async () => {
  //       userId = $user;

  //       ioClient.emit("join", { userId });

  //       console.log("username data", userId);
  //       response = await fetchApi("/getUserChats", { userId: userId });
  //       console.log("chat json ", JSON.stringify(response));
  //     });
  //   }

  //   function sendMessage() {
  //     console.log("socket called");
  //     ioClient.emit("message", "Hello from Svelte!");
  //     ioClient.on("user-message", (message) => {
  //       console.log("Received message from svelte:", message);
  //     });
  //   }

  //   sendMessage();
</script>

<h1>This is dashboard</h1>

<!-- {#if chatList.length > 0}
{#each chatList as ch}
<h1>ch.firstname</h1>
{/each}
{:else}
<h1>No Data Found !</h1>
{/if} -->
