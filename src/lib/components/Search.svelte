<div class="max-w-md mt-10 ml-20">
  <label
    for="default-search"
    class="mb-2 text-sm font-medium text-black sr-only dark:text-white"
  >
    Search
  </label>
  <div class="relative">
    <div
      class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
    >
      <svg
        class="ml-2 w-4 h-4 text-black"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>
    </div>
    <input
      type="text"
      id="default-search"
      class="placeholder-black block w-full px-20 p-3.5 pl-12 text-sm text-black bg-white border border-white rounded-full focus:ring-blue-500 focus:border-blue-500"
      placeholder="Search"
      required
    />
  </div>
</div>

<style>
  :global(#default-search:focus) {
    outline: none;
  }
  .placeholder-black::placeholder {
    color: black;
  }
</style>
