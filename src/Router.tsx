import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import AnimalBoard from "./components/pages/AnimalBoard/AnimalBoard";
import AnimalDetail from "./components/pages/AnimalDetail/AnimalDetail";
import EditReservation from "./components/pages/EditReservation/EditReservation";
import Matching from "./components/pages/Matching/Matching";
import Community from "./components/pages/Community/Community";
import CommunityDetail from "./components/pages/CommunityDetail/CommunityDetail";
import EditCommunity from "./components/pages/EditCommunity/EditCommunity";
import UserPage from "./components/pages/UserPage/UserPage";
import NotFound from "./components/pages/NotFound/NotFound";
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
