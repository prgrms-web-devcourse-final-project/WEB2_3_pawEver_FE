// import Header from "./Header";
// // import Sidebar from "./SideBarM";
// import Footer from "./Footer";
// import { Outlet } from "react-router-dom";

// export default function RootLayout() {
//   return (
//     <div>
//       <Header />
//       <Outlet />
//       <Footer />
//     </div>
//   );
// }

// RootLayout.tsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import Header from "./Header";

// const RootLayout: React.FC = () => {
//   return (
//     <div className="relative min-h-screen bg-white">
//       {/* Header는 내부적으로 모바일 메뉴를 관리함 */}
//       <Header />

//       <main className="pt-16">
//         <div className="max-w-[1200px] mx-auto py-8 px-4">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default RootLayout;

//

import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="w-full min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
