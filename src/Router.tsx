import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import AnimalBoard from "./pages/AnimalBoard/AnimalBoard";
import AnimalDetail from "./pages/AnimalDetail/AnimalDetail";
import EditReservation from "./pages/EditReservation/EditReservation";
import Matching from "./pages/Matching/Matching";
import Community from "./pages/community/Community";
import CommunityDetail from "./pages/communitydetail/CommunityDetail";
import EditCommunity from "./pages/EditCommunity/EditCommunity";
import UserPage from "./pages/UserPage/UserPage";
import NotFound from "./pages/NotFound/NotFound";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/AnimalBoard" element={<AnimalBoard />} />
      <Route path="/AnimalDetail/:id" element={<AnimalDetail />} />
      <Route path="/EditReservation" element={<EditReservation />} />
      <Route path="/Matching" element={<Matching />} />
      <Route path="/Community" element={<Community />} />
      <Route path="/CommunityDetail/:id" element={<CommunityDetail />} />
      <Route path="/EditCommunity" element={<EditCommunity />} />
      <Route path="/UserPage/:userId" element={<UserPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
