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
  let inputMessage: string | undefined | null;
  let contactLid: number;
  let count: number = 0;
  let isOpen: string = "show";
  let openFlag: boolean = false;
  let msgFlag: string = "del";
  let newMessage: string;
  let element: any = [];
  let particularContact : number;
  let inputVal : boolean = true;

  $: inputText = inputMessage;
  $: messages = chatMessages;
  $: val = buttonFlag;
  $: contact = contactLid;
  $: chatCount = count;
  $: openUser = isOpen;
  $: openVal = openFlag;
  $: msgVal = msgFlag;
  $: latestMessage = newMessage;
  $: privateContact = particularContact
  $: chatList = chatUserList;
  $: inputBool = inputVal


  export let data;
  console.log("user >>>>>>>>>>> ", JSON.stringify(data.chatData));
  let userId: string = data?.username;

  onMount(() => {
    document.getElementById('userInput')?.addEventListener('input',(e) => {
      let inputValue = e?.target?.value;
      
      if(inputValue.length > 0){
        inputVal = false;
      }else{
        inputVal = true;
      }

    })
  })

  console.log("username ", userId, JSON.stringify(chatList));

  ioClient.emit("join", { userId });
  ioClient.emit("getUserChats", { username: userId });

  ioClient.on("userChatList", ({ chatData }) => {
    console.log("user chats >>>>>>>>>>>>>> ", JSON.stringify(chatData));
    chatUserList = chatData;
  });

  // Setup listeners only once
  ioClient.on("userList", ({ messages }) => {
    console.log("User List", JSON.stringify(messages));
    chatMessages = messages;
    isOpen = "d-none";
    openFlag = true;
  });

  ioClient.on("updatedChats", ({ updateChat }) => {
    console.log("user messages ", updateChat);
    chatMessages = updateChat;

    ioClient.on("newUserChatList", ({ chatUsers }) => {
        console.log("sended private message chats >>>>>>>>>>>>>> ", JSON.stringify(chatUsers));
        chatUserList = chatUsers;
      });

  });

  ioClient.on(
    "private message",
    ({ senderPhoneNumber, inputMessage, messageLid }) => {
      console.log(
        "user messages ",
        senderPhoneNumber,
        inputMessage,
        messageLid
      );
      chatMessages = chatMessages.concat({ message: inputMessage });
      count = inputMessage.length;

      console.log('is chat box open ',openVal)
      if (openVal) {
        ioClient.emit("updateMsgStatus", {
          messageLid: messageLid,
          status: "rd",
        });
      } else {
        ioClient.emit("updateMsgStatus", {
          messageLid: messageLid,
          status: "dv",
        });
      }

      ioClient.emit('sender Chats',{userId});  


      // ioClient.on("updatedMsgStatus", async ({ messageLid, status }) => {
      //   msgFlag = "read";
      //   console.log("msg val ", msgVal, messageLid, status);
      // });

      ioClient.on("sender msg", ({ chatUserMsg }) => {
        console.log("sender private message chats >>>>>>>>>>>>>> ", JSON.stringify(chatUserMsg));
        chatUserList = chatUserMsg;
      });
      
    }
  );

    //  ioClient.on("newUserChatList", ({ chatUsers }) => {
    //     console.log("sended private message chats >>>>>>>>>>>>>> ", JSON.stringify(chatUsers));
    //     chatUserList = chatUsers;
    //   });

  

  function selectUser(contactId: number) : void{
    console.log(contactId);
    contactLid = contactId;

    ioClient.emit("fetchMessage", {
      userContactId: userId,
      contact: contactId,
    });

    buttonFlag = "show";
    openFlag = true;
  }

  function sendMessage() : void {
    console.log("send message called ", inputMessage, contact);
    ioClient.emit("private message", { inputMessage, contact, userId });
    inputMessage = "";
    newMessage = inputMessage;
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
      {#if chatList?.length > 0}
        {#each chatList as ch}
          <div class="flex flex-row items-center mb-4" data-id={ch.contact}>
            <img
              width="60px"
              src="../images/profile.jpg"
              alt="Image Not Found"
              class="mr-2 rounded-[20px] py-3"
            />
            <button
              id="particularUser"
              class="w-full text-left mb-4 mt-3 flex flex-col"
              on:click={() => selectUser(ch.id)}
            >
              <p>{ch.firstname} {ch.lastname}</p>

              {#if userId == ch.latest_messages[0].created}
              <p class="mt-2">{ch.latest_messages[0].message}</p>
              {:else}
      
              {#if ch.latest_messages[0].status === 'dv' && !openVal }
              <p class="font-semibold ... mt-2">{ch.latest_messages[0].message}</p>               
              {:else}              
              <p class="mt-2">{ch.latest_messages[0].message}</p>                
              {/if}

              {/if}
            </button>
            
            {#if ch.message_count > 0}
            <p
              class="float-right bg-[#A259FF] text-white p-2.5 py-2.5 relative mb-[30px] flex items-center justify-center {openUser}"
              style="width: 20px; height: 20px; border-radius: 50%;"
            >  
            {ch.message_count}
            </p>
            {/if}
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
      <div class="flex-1 overflow-auto px-4">
        {#if messages.length > 0 && openVal}
          {#each messages as ms}
            <div class="flex flex-col justify-center mb-4 p-4" >
              {#if ms.created_by === userId}
                <p
                  class="self-end max-w-[30%] p-3.5 px-2 bg-[#A259FF] text-white rounded-lg"
                  >
                  {ms.message}
                </p>

              {:else}
                <div class="flex flex-row">
                  <img
                    src="../images/profile.jpg"
                    alt="Image Not Found"
                    class="mr-2 h-[100px] w-[60px] rounded-[20px] py-3"
                  />
                  <p
                    class="self-start mt-4 max-w-[30%] bg-[#f5f7fb] p-3.5 rounded-lg"
                  >
                    {ms.message}
                  </p>
                </div>
              {/if}
            </div>
          {/each}
        {:else}
          <ImageNotFound />
        {/if}
      </div>
      <div class="p-2 pb-3 bg-white flex flex-row flex-shrink-0">
        <input
          type="text"
          placeholder="Type Message"
          id="userInput"
          class="{val} ml-2 bg-[#f5f7fb] rounded-[30px] px-[30px] w-[100%] sendInput"
          bind:value={inputMessage}
        />

        <button class={inputBool ? 'opacity-50' : 'opacity-100'} disabled = {inputBool} on:click={sendMessage}>
          <img
            width="40px"
            src="../images/send.png"
            alt="Image Not Found"
            class="{val} ml-2 rounded-[20px] py-3 pr-2"
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
    outline: none;
  }
</style>
