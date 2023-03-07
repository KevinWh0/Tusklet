import App from "./App.svelte";
//@ts-ignore
import wasm from "../../rust/Cargo.toml";

// const app = new App({
// 	target: document.body,
// 	props: {
// 		name: 'world'
// 	}
// });

// export default app;
//@ts-ignore
const init = async () => {
  const bindings = await wasm();
  const app = new App({
    target: document.body,
    props: {
      //@ts-ignore
      bindings,
    },
  });
};

init();
