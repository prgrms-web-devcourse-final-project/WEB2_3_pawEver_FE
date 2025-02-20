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
