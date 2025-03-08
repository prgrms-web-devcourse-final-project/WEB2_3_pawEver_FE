// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import svgr from "vite-plugin-svgr";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), svgr()],
//   server: {
//     port: 5175,
//   },
// });

//배포전에 테스트용으로 잠시 고정하겠습니다.

//

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 5175,
    proxy: {
      "/api": {
        target: "https://yellowdog.p-e.kr",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});

//https환경테스트 가능

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import svgr from "vite-plugin-svgr";
// import mkcert from "vite-plugin-mkcert";

// export default defineConfig({
//   plugins: [
//     react(),
//     svgr(),
//     mkcert(), // 여기서 mkcert 플러그인을 추가
//   ],
//   server: {
//     port: 5175,
//     https: true, // https 환경
//     host: "localhost",
//     proxy: {
//       "/api": {
//         target: "https://yellowdog.p-e.kr",
//         changeOrigin: true,
//         secure: true,
//       },
//     },
//   },
// });
