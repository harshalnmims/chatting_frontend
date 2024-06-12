<script lang="ts">
  import { goto } from "$app/navigation";
  import { fetchApi } from "$lib/utils/fetchApi";
  import { numberValidator, phoneValidator } from "$lib/validations/validator";
  import { checkStatusCode } from "$lib/validations/status";
  import Alert from "$lib/components/Alert.svelte";

  let userId: number;
  let userOtp: number;
  let otpField: boolean = false;

  async function handleClick(): Promise<void> {
    let val: boolean = phoneValidator(userId);

    if (val) {
      let obj: { phone: number } = {
        phone: userId,
      };

      let { json } = await fetchApi("/validateNumber", obj);
      let statusCode: boolean | null | undefined = checkStatusCode(json);

      if (statusCode == true) {
        otpField = true;
      }
    }
  }

  async function handleOtpClick(): Promise<void> {
    try {
      let numval: boolean = false;

      let phoneVal: boolean = phoneValidator(userId);
      numval = numberValidator(userOtp);

      let obj: { username: number; otp: number } = {
        username: userId,
        otp: userOtp,
      };

      if (numval && phoneVal) {
        let { json } = await fetchApi("/login", obj);
        console.log("response ", json);

        let statusCode: boolean | null | undefined = checkStatusCode(json);
        console.log("status Code ", statusCode);

        if (statusCode == true) {

          let credentails = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phoneNumber: userId }),
          };

          let response = await fetch("/userCookie", credentails);
          console.log("response ", response);

          goto("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
</script>

<style>
  .form-control {
    border: 2px solid #6A0DAD; 
  }
</style>

<Alert />
<div class="container flex flex-row ... mt-10">
  <div class="col-sm">
    <img
      class="mt-18 ..."
      width="100%"
      src="/images/loginNew.svg"
      alt="Not Found"
    />
  </div>

  <div class="col-sm mt-14">
    <div>
      <p class="text-[#6A0DAD] font-['Secular_One','Open_Sans'] text-[40px] mt-24 ml-24">
        Welcome Back !
      </p>
      <p class="text-[#6A0DAD] ml-24 mt-2 font-semibold ...">Login To Continue</p>
    </div>

    <div>
      <div class="form-group ml-20 mt-20">
        <input
          type="number"
          class="form-control shadow-none ... p-3 font-bold border-2 border-[#6A0DAD]"
          id="exampleInputphone1"
          aria-describedby="phoneHelp"
          placeholder="Phone No."
          bind:value={userId}
        />
      </div>
      <br />
      <div class="form-group ml-20">
        <!-- svelte-ignore missing-declaration -->
        <input
          type="number"
          class={otpField
            ? "form-control shadow-none ... p-3 font-bold border-2 border-[#6A0DAD]"
            : "form-control shadow-none ... p-3 font-bold border-2 border-[#6A0DAD] d-none"}
          id="exampleInputPassword1"
          placeholder="Otp"
          bind:value={userOtp}
        />
      </div>
      <div class="d-flex">
        {#if !otpField}
          <button
            type="button"
            class="bg-[#A259FF] text-white mt-20 ml-20 rounded-[30px] p-2 w-40 h-12 font-['Secular_One','Open_Sans']"
            on:click={handleClick}>Login</button
          >`
        {:else}
          <button
            type="button"
            class="bg-[#A259FF] text-white mt-20 ml-20 rounded-[30px] p-2 w-40 h-12 font-['Secular_One','Open_Sans']"
            on:click={handleOtpClick}>Login</button
          >`
        {/if}
        <a href="/forgot" class="text-[#6A0DAD] mt-24 ml-20 font-semibold">Forgot Password ?</a
        >
      </div>
    </div>
  </div>
</div>
