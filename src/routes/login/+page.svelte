<script lang="ts">
  import { fetchApi } from "$lib/utils/fetchApi";
  import { numberValidator } from "$lib/validations/validator";

  let userId: string;
  let otp: number;

  async function handleClick() {
    let obj: { username: string; otp: number } = {
      username: userId,
      otp: otp,
    };

    numberValidator(otp);

    let response = await fetchApi("/login", obj);
    console.log("response ", response);
  }
</script>

<div class="container flex flex-row ... mt-10">
  <div class="col-sm">
    <img class="mt-20 ..." width="90%" src="/images/login.jpg" />
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
          type="text"
          class="form-control shadow-none ... p-3 font-bold border-2 border-black"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Email-Id"
          bind:value={userId}
        />
      </div>
      <br />
      <div class="form-group ml-20">
        <input
          type="text"
          class="form-control shadow-none ... p-3 font-bold border-2 border-black"
          id="exampleInputPassword1"
          placeholder="Otp"
          bind:value={otp}
        />
      </div>
      <div class="d-flex">
        <button
          type="button"
          class="btn btn-primary mt-20 ml-20 rounded-[30px] p-2 w-40 h-12 font-['Secular_One','Open_Sans']"
          on:click={handleClick}>Login</button
        >
        <a href="#" class="mt-24 ml-20 font-semibold">Forgot Password ?</a>
      </div>
    </div>
  </div>
</div>
