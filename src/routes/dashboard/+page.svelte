<script lang="ts">
	  import { fetchApi } from '$lib/utils/fetchApi';
	  import { user } from '$lib/stores/validation.js'
	  import { checkStatusCode } from '$lib/validations/status';
    import { ioClient } from "$lib/socket/socket.js";
    import { onMount } from 'svelte';

    let userId : string;
    let chatList : object[]
    export let data;

    let response = checkStatusCode(data.json);
    if(response == true){
    
    userId =  data.json.message.username;
    user.set(userId);
    ioClient.emit('join',{userId});

    if(data.json.message.username != undefined){
    let {json} = Promise.all([fetchApi('/getUserChats',{userId:data.json.message.username})])
    console.log('chat json ',JSON.stringify(json))
    }
    
   

    }
 
  function sendMessage(){
        console.log('socket called');
        ioClient.emit('message', 'Hello from Svelte!');
        ioClient.on('user-message',(message) => {
          console.log('Received message from svelte:', message);
        })
  }

  sendMessage();

    
</script>
<h1>This is dashboard</h1>

<!-- {#if chatList.length > 0}
{#each chatList as ch}
<h1>ch.firstname</h1>
{/each}
{:else}
<h1>No Data Found !</h1>
{/if} -->
