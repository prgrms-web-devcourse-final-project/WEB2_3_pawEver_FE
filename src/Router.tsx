// import { Route, Routes } from "react-router-dom";
// import Home from "./pages/home/Home";
// import AnimalBoard from "./pages/animalboard/AnimalBoard";
// import AnimalDetail from "./pages/animaldetail/AnimalDetail";
// import EditReservation from "./pages/editreservation/EditReservation";
// import Matching from "./pages/matching/Matching";
// import MatchingProgress from "./pages/matching/MatchingProgress";
// import MatchingComplete from "./pages/matching/MatchingComplete";
// import MatchingResult from "./pages/matching/MatchingResult";
// import Community from "./pages/community/Community";
// import CommunityDetail from "./pages/communitydetail/CommunityDetail";
// import EditCommunity from "./pages/editcommunity/EditCommunity";
// import UserPage from "./pages/userpage/UserPage";
// import NotFound from "./pages/notfound/NotFound";
// import RootLayout from "./components/layout/RootLayout";
// import Donation from "./pages/donation/Donation";
// import DonationFail from "./pages/donation/components/DonationFail";
// import DonationSuccess from "./pages/donation/components/DonationSuccess";

// export default function Router() {
//   return (
//     <Routes>
//       <Route element={<RootLayout />}>
//         <Route path="/" element={<Home />} />
//         <Route path="/AnimalBoard" element={<AnimalBoard />} />
//         <Route path="/AnimalBoard/:id" element={<AnimalDetail />} />
//         <Route path="/EditReservation" element={<EditReservation />} />
//         <Route path="/Matching" element={<Matching />} />
//         <Route path="/Matching/progress" element={<MatchingProgress />} />
//         <Route path="/Matching/complete" element={<MatchingComplete />} />
//         <Route path="/Matching/result/:id" element={<MatchingResult />} />
//         <Route path="/Community" element={<Community />} />
//         <Route path="/Community/:id" element={<CommunityDetail />} />
//         <Route path="/EditCommunity" element={<EditCommunity />} />
//         <Route path="/UserPage/:userId" element={<UserPage />} />
//         <Route path="/Donation" element={<Donation />} />
//         <Route path="/Donation/success" element={<DonationSuccess />} />
//         <Route path="/Donation/fail" element={<DonationFail />} />
//       </Route>
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// Data Route

import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Home from "./pages/home/Home";
import AnimalBoard from "./pages/animalboard/AnimalBoard";
import AnimalDetail from "./pages/animaldetail/AnimalDetail";
import EditReservation from "./pages/editreservation/EditReservation";
import Matching from "./pages/matching/Matching";
import MatchingProgress from "./pages/matching/MatchingProgress";
import MatchingComplete from "./pages/matching/MatchingComplete";
import MatchingResult from "./pages/matching/MatchingResult";
import Community from "./pages/community/Community";
import CommunityDetail from "./pages/communitydetail/CommunityDetail";
import EditCommunity from "./pages/editcommunity/EditCommunity";
import UserPage from "./pages/userpage/UserPage";
import Donation from "./pages/donation/Donation";
import DonationFail from "./pages/donation/components/DonationFail";
import DonationSuccess from "./pages/donation/components/DonationSuccess";
import NotFound from "./pages/notfound/NotFound";

const router = createBrowserRouter([
  {
    element: (
      <>
        <RootLayout />
        <ScrollRestoration />
      </>
    ),
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/AnimalBoard",
        element: <AnimalBoard />,
      },
      { path: "/AnimalBoard/:id", element: <AnimalDetail /> },
      { path: "/EditReservation", element: <EditReservation /> },
      { path: "/Matching", element: <Matching /> },
      { path: "/Matching/progress", element: <MatchingProgress /> },
      { path: "/Matching/complete", element: <MatchingComplete /> },
      { path: "/Matching/result/:id", element: <MatchingResult /> },
      { path: "/Community", element: <Community /> },
      { path: "/Community/:id", element: <CommunityDetail /> },
      { path: "/EditCommunity", element: <EditCommunity /> },
      { path: "/UserPage/:userId", element: <UserPage /> },
      { path: "/Donation", element: <Donation /> },
      { path: "/Donation/success", element: <DonationSuccess /> },
      { path: "/Donation/fail", element: <DonationFail /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
