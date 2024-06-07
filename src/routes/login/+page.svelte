<script lang="ts">
	import { username } from '$lib/stores/auth.ts';
  import { goto } from "$app/navigation";
  import { fetchApi } from "$lib/utils/fetchApi";
  import { numberValidator, phoneValidator } from "$lib/validations/validator";
  import { checkStatusCode } from "$lib/validations/status";
  import { PUBLIC_USER_COOKIE } from "$env/static/public";

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
        let userToken = PUBLIC_USER_COOKIE;

        const date: Date = new Date();
        date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
        const expires: string = `expires=${date.toUTCString()}`;

        document.cookie = `token=${userToken}; expires=${expires}; path=/`;
        console.log('logged In dashbord')

        username.set(String(userId));
        goto("/dashboard");
      }
    }
  }
</script>

<Alert />
<div class="container flex flex-row ... mt-10">
  <div class="col-sm">
    <img
      class="mt-20 ..."
      width="90%"
      src="/images/login.jpg"
      alt="Not Found"
    />
  </div>

  <div class="col-sm mt-14">
    <div>
      <p class="font-['Secular_One','Open_Sans'] text-[40px] mt-24 ml-24">
        Welcome Back !
      </p>
      <p class="ml-24 mt-2 font-semibold ...">Login To Continue</p>
    </div>

    <div>
      <div class="form-group ml-20 mt-20">
        <input
          type="number"
          class="form-control shadow-none ... p-3 font-bold border-2 border-black"
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
            ? "form-control shadow-none ... p-3 font-bold border-2 border-black"
            : "form-control shadow-none ... p-3 font-bold border-2 border-black d-none"}
          id="exampleInputPassword1"
          placeholder="Otp"
          bind:value={userOtp}
        />
      </div>
      <div class="d-flex">
        {#if !otpField}
          <button
            type="button"
            class="btn btn-primary mt-20 ml-20 rounded-[30px] p-2 w-40 h-12 font-['Secular_One','Open_Sans']"
            on:click={handleClick}>Login</button
          >`
        {:else}
          <button
            type="button"
            class="btn btn-primary mt-20 ml-20 rounded-[30px] p-2 w-40 h-12 font-['Secular_One','Open_Sans']"
            on:click={handleOtpClick}>Login</button
          >`
        {/if}
        <a href="/forgot" class="mt-24 ml-20 font-semibold">Forgot Password ?</a
        >
      </div>
    </div>
  </div>
</div>
