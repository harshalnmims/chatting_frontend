<script lang="ts">
  import { fetchApi } from "$lib/utils/fetchApi";
  import { ioClient } from "$lib/socket/socket.js";
  import { onMount } from "svelte";
  import { io } from "socket.io-client";

  let chatUserList: object[];
  let chatMessages: object[] = [{}];
  let buttonFlag: string = "d-none";
  let inputMessage: string;
  let contactLid: number;

  $: messages = chatMessages;
  $: val = buttonFlag;
  $: contact = contactLid;

  export let data;
  let userId: string = data.username;
  chatUserList = data.chatData.message;

  $: chatList = chatUserList;

  console.log("username ", userId, JSON.stringify(chatList));
  ioClient.emit("join", { userId });

  //   function sendMessage() {
  //     console.log("socket called");
  //     ioClient.emit("message", "Hello from Svelte!");
  //     ioClient.on("user-message", (message) => {
  //       console.log("Received message from svelte:", message);
  //     });
  //   }

  //   sendMessage();

  function selectUser(contactId: number) {
    console.log(contactId);
    contactLid = contactId;

    ioClient.emit("fetchMessage", {
      userContactId: userId,
      contact: contactId,
    });

    ioClient.on("userList", ({ messages }) => {
      console.log("User List", JSON.stringify(messages));
      chatMessages = messages;
    });

    buttonFlag = "show";
  }

  function sendMessage() {
    console.log("send message called ", inputMessage, contact);
    ioClient.emit("private message", { inputMessage, contact, userId });
    ioClient.on("updatedChats", ({ updateChat }) => {
      console.log("user messages ", updateChat);
      chatMessages = updateChat;
    });
  }
</script>

<style>
 :global(body){
   background-color: #F1F2F3; 
 }
</style>

{#if chatList.length > 0}
  {#each chatList as ch}
    <button on:click={() => selectUser(ch.id)}>{ch.firstname}</button><br />
  {/each}
{:else}
  <h1>No Data Found Chats!</h1>
{/if}

<h1>User Messages</h1>

{#if messages.length > 0}
  {#each messages as ms}
    <h1>{ms.message}</h1>
  {/each}
{:else}
  <h1>No Data Found Messages !</h1>
{/if}

<input type="text" class={val} bind:value={inputMessage} />
<button class={val} on:click={sendMessage}>Send</button>


