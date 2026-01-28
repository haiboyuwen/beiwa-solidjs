import { A } from "@solidjs/router";

export default function About() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">关于页面</h1>
      <p class="mt-8">
        这是一个使用{" "}
        <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">
          SolidJS
        </a>{" "}
        和 SolidStart 构建的专辑管理应用。
      </p>
      <p class="my-4">
        <A href="/" class="text-sky-600 hover:underline">
          返回首页
        </A>
      </p>
    </main>
  );
}
