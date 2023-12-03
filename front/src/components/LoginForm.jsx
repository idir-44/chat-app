

export default function LoginForm() {
  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
  <div class="relative m-6 flex flex-col space-y-8 rounded-2xl bg-white shadow-2xl md:flex-row md:space-y-0">
    <div class="flex flex-col justify-center p-8 md:p-14">
      <h1 class="text-center text-2xl font-bold">Chat App</h1>
      <form action="" class="mt-8">
        <input type="email" name="email" class="py- mb-10 mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required placeholder="Email Address" />

        <input type="password" class="js-password mb-5 mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-16 focus:border-blue-500 focus:outline-none" id="password" placeholder="password" required />

        <div>
          <button type="submit" class="mt-6 w-full rounded-md bg-blue-500 px-6 py-3 text-white transition duration-150 ease-in-out hover:bg-blue-300">Login</button>
        </div>
      </form>
    </div>
  </div>
</div>
  );
}
