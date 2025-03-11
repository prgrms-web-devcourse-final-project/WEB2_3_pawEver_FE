import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import AnimalBoard from "./pages/animalboard/AnimalBoard";
import AnimalDetail from "./pages/animaldetail/AnimalDetail";
import EditCommunity from "./pages/editcommunity/EditCommunity";
import Matching from "./pages/matching/Matching";
import MatchingProgress from "./pages/matching/MatchingProgress";
import MatchingComplete from "./pages/matching/MatchingComplete";
import MatchingResult from "./pages/matching/MatchingResult";
import Community from "./pages/community/Community";
import CommunityDetail from "./pages/communitydetail/CommunityDetail";
import Userpage from "./pages/userpage/UserPage";
import NotFound from "./pages/notfound/NotFound";
import RootLayout from "./components/layout/RootLayout";
import Donation from "./pages/donation/Donation";
import DonationFail from "./pages/donation/components/DonationFail";
import DonationSuccess from "./pages/donation/components/DonationSuccess";

export default function Router() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/AnimalBoard" element={<AnimalBoard />} />
        <Route path="/AnimalBoard/:id" element={<AnimalDetail />} />
        <Route path="/Matching" element={<Matching />} />
        <Route path="/Matching/progress" element={<MatchingProgress />} />
        <Route path="/Matching/complete" element={<MatchingComplete />} />
        <Route path="/Matching/result/:id" element={<MatchingResult />} />
        <Route path="/Community" element={<Community />} />
        <Route path="/Community/:id" element={<CommunityDetail />} />
        <Route path="/EditCommunity" element={<EditCommunity />} />
        <Route path="/EditCommunity/:id" element={<EditCommunity />} />
        <Route path="/UserPage/:userId" element={<Userpage />} />
        <Route path="/Donation" element={<Donation />} />
        <Route path="/Donation/success" element={<DonationSuccess />} />
        <Route path="/Donation/fail" element={<DonationFail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
