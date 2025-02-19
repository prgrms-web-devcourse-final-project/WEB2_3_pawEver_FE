import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import AnimalBoard from "./pages/animalboard/AnimalBoard";
import AnimalDetail from "./pages/animaldetail/AnimalDetail";
import EditReservation from "./pages/editreservation/EditReservation";
import Matching from "./pages/matching/Matching";
import Community from "./pages/community/Community";
import CommunityDetail from "./pages/communitydetail/CommunityDetail";
import EditCommunity from "./pages/editcommunity/EditCommunity";
import UserPage from "./pages/userpage/UserPage";
import NotFound from "./pages/notfound/NotFound";
import RootLayout from "./components/layout/RootLayout";

export default function Router() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/AnimalBoard" element={<AnimalBoard />} />
        <Route path="/AnimalDetail/:id" element={<AnimalDetail />} />
        <Route path="/EditReservation" element={<EditReservation />} />
        <Route path="/Matching" element={<Matching />} />
        <Route path="/Community" element={<Community />} />
        <Route path="/CommunityDetail/:id" element={<CommunityDetail />} />
        <Route path="/EditCommunity" element={<EditCommunity />} />
        <Route path="/UserPage/:userId" element={<UserPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
