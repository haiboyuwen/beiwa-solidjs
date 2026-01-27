import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">页面未找到</h1>
      <p class="text-4xl mb-8">404</p>
      <p class="mt-8 text-gray-600">
        抱歉，您访问的页面不存在。
      </p>
      <p class="my-4">
        <A href="/" class="text-sky-600 hover:underline">
          返回首页
        </A>
        {" · "}
        <A href="/about" class="text-sky-600 hover:underline">
          关于页面
        </A>
      </p>
    </main>
  );
}
