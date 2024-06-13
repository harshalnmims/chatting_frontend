<script lang="ts">
  import Search from "$lib/components/Search.svelte";
  import Button from "$lib/components/Button.svelte";
  import ImageNotFound from "$lib/components/ImageNotFound.svelte";
  import { fetchApi } from "$lib/utils/fetchApi";
  import { ioClient } from "$lib/socket/socket.js";
  import { onMount } from "svelte";

  let chatUserList: object[];
  let chatMessages: object[] = [];
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

  // Setup listeners only once
  ioClient.on("userList", ({ messages }) => {
    console.log("User List", JSON.stringify(messages));
    chatMessages = messages;
  });

  ioClient.on("updatedChats", ({ updateChat }) => {
    console.log("user messages ", updateChat);
    chatMessages = updateChat;
  });

  ioClient.on("private message", ({ senderPhoneNumber, inputMessage }) => {
    console.log("user messages ", senderPhoneNumber, inputMessage);
    chatMessages = chatMessages.concat({ message: inputMessage });
  });

  function selectUser(contactId: number) {
    console.log(contactId);
    contactLid = contactId;

    ioClient.emit("fetchMessage", {
      userContactId: userId,
      contact: contactId,
    });

    buttonFlag = "show";
  }

  function sendMessage() {
    console.log("send message called ", inputMessage, contact);
    ioClient.emit("private message", { inputMessage, contact, userId });
    inputMessage = "";
  }
</script>

<div class="container-fluid">
  <div class="row justify-content-center flex-wrap">
    <div class="col-12 col-md-6 p-2">
      <Search />
    </div>
    <div class="col-12 col-md-6 p-2">
      <Button />
    </div>
  </div>

  <div class="flex flex-row h-[calc(100vh-250px)]">
    <div
      class="flex flex-col flex-wrap mt-4 w-[28%] ml-[60px] px-4 bg-white rounded-[20px] overflow-auto"
    >
      {#if chatList.length > 0}
        {#each chatList as ch}
          <div class="flex flex-row items-center mb-4">
            <img
              width="60px"
              src="../images/profile.jpg"
              alt="Image Not Found"
              class="mr-2 rounded-[20px] py-3"
            />
            <button class="w-full text-left" on:click={() => selectUser(ch.id)}>
              {ch.firstname}
            </button>
          </div>
          <hr class="w-full my-2 border-t border-gray-300" />
        {/each}
      {:else}
        <h1>No Data Found Chats!</h1>
      {/if}
    </div>

    <div
      class="flex flex-col mt-4 w-[80%] mr-4 ml-8 bg-white rounded-[20px] overflow-hidden relative"
    >
    <div class="flex-1 overflow-auto p-4">

      {#if messages.length > 0}
        {#each messages as ms}
          <div class="flex flex-col justify-center mb-4 p-4">
            {#if ms.created_by == userId}
              <p
                class="self-end w-[200px] p-3.5 bg-[#A259FF] text-white rounded-lg"
              >
                {ms.message}
              </p>
            {:else}
              <p class="self-start w-[200px] bg-[#f5f7fb] p-3.5 rounded-lg">
                {ms.message}
              </p>
            {/if}
          </div>
        {/each}
      {:else}
        
       <ImageNotFound />
      {/if}
      </div>
      <div class="p-2 bg-white flex flex-row flex-shrink-0">
        <input type="text" placeholder = "Type Message" class='{val} ml-2 bg-[#f5f7fb] rounded-[30px] px-[30px] w-[90%] sendInput' bind:value={inputMessage} />
        <button on:click={sendMessage}>
        <img
        width="40px"
        src="../images/send.png"
        alt="Image Not Found"
        class="{val} ml-2 rounded-[20px] py-3"
        
      />
       </button>
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #f5f7fb;
  }
  .sendInput:focus {
    outline:none;
  }
</style>
