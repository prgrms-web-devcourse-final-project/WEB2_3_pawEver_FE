import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="w-full">
        <div className="max-w-[1200px] mx-auto px-4 min-h-[calc(100vh-200px)]">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
