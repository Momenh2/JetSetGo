import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react"; // Add this line
//pages & components

import LoginForm1 from "./components/accountBox/LoginTrial.js"  //Kont bagarab 7aga hena
import Profile from "./pages/Tourguide/Profile.js";
//import touristProfile from './components/touristProfile'
import UpdateProfile from "./pages/Tourguide/UpdateProfile.js";
//import touristUpdateProfile from './components/touristUpdateProfile';


import TourismGovTags from "./pages/tourismgoverner/tourismgovernortags.js";

import ProfilePage from "./components/TryProfile.js"
import TouristProfilePagehazem from "./pages/TouristProfilePages.js";
import TouristEditPage from "./pages/TouristEditPage.js";
import AdminAddPage from "./pages/AdminAddPage.js";
import AdminProfilePage from "./pages/AdminProfilePage.js";
import DeleteOptions from "./pages/DeleteOptions.js";
import UserList from "./pages/UserList.js";
import ItineraryManager from "./pages/Tourguide/ItineraryAdd.js";
import ProductListing from "./pages/Product/productsPage.js";
import ViewProduct from "./pages/Product/ProductDetails.js";
import MyPrefs from './pages/my_prefrences.js';
import MyBookingsPage from './components/my_bookings.js'
import TransportBookingPage from './components/TouristTransportationComponent.js';
// import Navbar from "./components/Navbar";
import TourismGovernerHomepage from './pages/tourismgoverner/tourismgovernerhome.js';
import ProductForm from "./pages/Product/ProductForm.js";
import UpdateProducts from "./pages/Product/UpdateProduct.js";

import Activities2 from "./pages/Activities.js";
import Itineraries2 from "./pages/Itineraries.js";
import Museums from "./pages/museums.js";
import HistoricalLocations from "./pages/historicallocations.js";

// import ActivityFilter from './components/ActivityFilter';
// import ItineraryFilter from './components/ItineraryFilter';
import MuseumFilter from "./components/MuseumFilter.js";
import HistoricalPlaceFilter from "./components/HistoricalPlaceFilter.js";

import HomePage from "./pages/HomePage.js";

import "@fortawesome/fontawesome-free/css/all.css";

// import { BrowserRouter, Routes, Route } from 'react-router-dom'
//pages and components 
import NotificationsPage from './pages/NotificationsPage.js';
import Tagspage from './pages/my_tags.js'
import PreferencesSelection from './pages/SelectPrefrences.js'
import Transportationpage from './pages/Transportation.js'
import Categorypage from './pages/my_category.js'
//pages and components


// import Navbar from './components/navbar.js'
import Tourism_Governer from "./pages/Tourism_Governer.js";
import HL from "./pages/HistoricalLocations2.js";
import Museum from "./pages/Museums2.js";
import HLMs from "./pages/my_HLMs.js";
import Activities from "./pages/my_activities2.js";
import Itineraries from "./pages/Tourguide/my_itineraries.js";
import HLTags from "./pages/hltag.js";

//johnimport { useTouristId } from '../../pages/Tourist/TouristIdContext';
//const { id } = useTouristId();




import ViewAct_Iten from "./components/ite_view.js"

import ViewActivity from "./components/activity_view.js"
import Updateavtivityadvertiser from"./pages/Updateavtivityadvertiser.js";

import TourGuideLayout from "./components/TourGuide/TourGuideLayout.js";
import FlagItinerary from "./components/FlagItinerary.js";
import ItineraryManagement from "./components/ItineraryManagement.js";
import CategoriesAndActivities from "./components/CategoriesAndActivities.js";
import TourismGovernerLayout from "./pages/tourismgoverner/tourismgovernerlayout.js";
import TourismGovernerNavBar from "./pages/tourismgoverner/tourismgovernernavbar.js";
//homepages
import AdminDashboard from "./pages/homepages/adminhomepage.js";
import Layout from "./components/Admin/layout.js";

import TouristComplaint from "./pages/Tourist/TouristComplaints.js";
import ToursitPage from "./pages/Tourist/home.js";
import TouristLayout from "./components/Tourist/TouristLayout.js";
import { CurrencyProvider } from "./components/Tourist/CurrencyContext.js";
import GuestPage from "./pages/homepages/guestHomepage.js";
import TermsAndConditionsForm from "./components/TermsAndCondition/TermsAndCondition.js";
import AdminDocumentReview from "./pages/Admin/AdminVeiwDocuments.js";
import AdminComplaints from "./pages/Admin/AdminComplaints.js";
import TouristProductListing from "./pages/Tourist/TouristProductPage.js";
import SalesOverviewChart from "./components/Admin/SalesOverviewChart.js";
import CheckoutItinerary from "./components/Jimmy/CheckoutItinerary.js"//////////////////////////////////////
import AdminViewComplaint from "./pages/Admin/AdminViewComplaint.js";
import ProductSales from "./pages/Product/ProductSales.js";
import TouristAddComplaintPage from "./pages/Tourist/TouristComplaintPage.js";
import TouristProfile from "./pages/Tourist/TouristProfilePage.js";
import ActivityDetailPage from "./pages/ActivityDetailPage.js";
import ItineraryDetailPage from "./pages/ItineraryDetailPage.js";

import PromoCodespage from './components/Admin/AdminPromoCode.js'

import FlagActivity from "./components/FlagActivity.js";

import ChangePassword from "./components/Profile_Settings/changePassword.js";
import ImageUpload from "./components/Profile_Settings/uploadPicture.js";
import RequestAccountDeletion from "./components/Profile_Settings/AccountDeletion.js";

import ActivityForm from "./pages/Advertiser/ActivityAdd.js";

import Authentication from "./pages/Authentication/Authentication.js";
import SellerProfile from "./components/Seller/sellerProfile.js";
import AdvertiserProfile from "./pages/Advertiser/Advertiseromo.js";
import AdminAddProduct from "./pages/Admin/AdminAddProduct.js";
import OrderDetails from "./components/Jimmy/OrderDetails.js";
// import CheckoutItinerary from "./components/Jimmy/CheckoutItinerary.js";

import TouristOrders from "./components/Jimmy/TouristOrders.js";
// Jimmy
import Dashboard2 from "./components/Jimmy/Dashboard2.js";
import AddRatingComment from "./components/Jimmy/AddRatingComment.js";
import AddRatingCommentItinerary from "./components/Jimmy/AddRatingCommentItinerary.js";
import TouristTourGuideProfile from "./components/Jimmy/TouristTourGuideProfile.js";
import TouristItineraryDetails from "./components/Jimmy/TouristItineraryDetails.js";
import AdvertiserLayout from "./components/Advertiser/AdvertiserLayout.js"
import AdvertiserActivities from "./pages/Advertiser/ActivitiesMainPage.js";
// JIMMY END
import { useNavigate, Navigate } from 'react-router-dom';

import GuestLayout from "./components/Guest/GuestLayout.js";


import ItinerarySales from "./pages/Tourguide/ItinerarySales.js"
import ActivitySales from  "./pages/Advertiser/ActivitySales.js"

import SellerLayout from "./components/Seller/SellerLayout.js";
import AdminUpdateProducts from "./pages/Admin/AdminUpdateProduct.js";

import ViewItineraryTourGuide from "./pages/Tourguide/ViewItineraryDetailes.js"

import Booking from './pages/bookhotel.js'
import ActivityList from './components/ActivityList-Rate-Comment.js';
import FlightSearch from './components/flights.js';
import ResetPassword from "./pages/resetpass.js";

import Cart from "./components/Tourist/cart.js";

import Checkout from "./components/Tourist/Checkout.js";

import Confirmation from "./components/Tourist/confirmation.js";



function App() {
  const [view, setView] = useState("home"); // 'home', 'viewDocuments'


  const handleViewDocuments = () => {
    setView("viewDocuments");
  };

  const handleBackToHome = () => {
    setView("home");
  };
  const [filteredActivities, setFilteredActivities] = useState(null);
  const [filteredItinerary, setFilteredItinerary] = useState(null);
  const [filteredMuseum, setFilteredMuseum] = useState(null);
  const [filteredHistoricalPlace, setFilteredHistoricalPlace] = useState(null);

  const handleFilterResultsActivities = (results) => {
    setFilteredActivities(results);
  };

  const handleFilterResultsItineraries = (results) => {
    setFilteredItinerary(results);
  };

  const handleFilterResultsMusuems = (results) => {
    setFilteredMuseum(results);
  };

  const handleFilterResultsHistoricalPlaces = (results) => {
    setFilteredHistoricalPlace(results);
  };

  // useEffect(() => {
  //   const socket = io("http://localhost:8000");
  //   console.log(socket)
  // },[])

  return (
    <div>
      <BrowserRouter>
        <div>
          <CurrencyProvider>
            <Routes>
              <Route
                path="/change-password/:id/:modelName"
                element={<ChangePassword />}
              />
              {/*kol users */}
              <Route
                path="/upload-image/:id/:modelName"
                element={<ImageUpload />}
              />
              {/*tourguide advertiser seller */}
              <Route
                path="/RequestDelete/:id/:modelName"
                element={<RequestAccountDeletion />}
              />
              <Route path="/:modelName/:id/terms" element={<TermsAndConditionsForm />} />
              {/* tourguide advertiser seller tourist*/}



              {/* Advertiser//////////////////////////////////////////////////////////////////////////////////////////////// */}

              
              <Route path="/Advertisers/:id" element={<AdvertiserLayout />}>
                {/* <Route path='/Advertisers/:id/advertiserprofile' element={<AdvertiserProfile />} />  */}
                {/* {this is the (old) profile view for advertiser + edit functions} */}

                <Route path='/Advertisers/:id/advertiserprofile' element={<AdvertiserProfile />} />

                <Route
                  path="/Advertisers/:id/ActivitiesForm/:id"
                  element={<ActivityForm />}
                />

                <Route path="/Advertisers/:id/ViewActivityEdit/:activityId" element={<Updateavtivityadvertiser />} />
                
                 <Route path="/Advertisers/:id/notifications" element={<NotificationsPage/>} />

                <Route path='/Advertisers/:id/ActivitySales' element={<ActivitySales />} />

                 <Route
                path="Advertisers/:id/change-password/:modelName"
                element={<ChangePassword />}
              />
              <Route
                  path="/Advertisers/:id/RequestDelete/:id/:modelName"
                  element={<RequestAccountDeletion />}
                />
                <Route
                  path="/Advertisers/:id/ActivitiesMainPage/:id"
                  element={<AdvertiserActivities />}
                />


              </Route>






{/* Notifications */}
              {/*///////////////////////////////////////////tg//////////////////////////////////////////////////////////////*/}

              <Route path="/tourism_governer" element={<TourismGovernerLayout />}>
                <Route path="/tourism_governer" element={<TourismGovernerHomepage />}></Route>
                <Route path="/tourism_governer/Tags" element={<TourismGovTags />} />
                <Route path="/tourism_governer/:modelName/change-password" element={<ChangePassword />} />


              </Route>


             


             <Route path="/ProfileGarab" element = {<ProfilePage  />} />
              <Route path="/Authentication" element={<Authentication />} />
              <Route path="/reset-password" element={<ResetPassword />} />


              <Route path="/terms" element={<TermsAndConditionsForm />} />
              <Route path="/" element={<Navigate to="/guest/home" replace />} />
              {/* Admiin */}
              <Route path="/admin" element={<Layout />}>
              <Route path = "/admin/flagItinerary"
                element={<FlagItinerary />} />
                <Route path = "/admin/flagActivity"
                element={<FlagActivity/>} />
                <Route path="/admin/my_category" element={<Categorypage />} />
                <Route path="/admin/my_tags" element={<Tagspage />} />
                <Route path="/admin/promocodes" element={<PromoCodespage />} />
                <Route path="/admin/users" element={<Tourism_Governer />} />

              <Route
                  path="/admin/productSales"
                  element={<ProductSales usertype="admin" />}
                />
                <Route
                  path="/admin/requests"
                  element={<AdminDocumentReview />}
                  
                />
                
                <Route path="/admin/flagITI" element ={<FlagItinerary />} />

                {/*momen */}
                <Route
                  path="/admin/products"
                  element={<ProductListing usertype="admin" />}
                />
                <Route path="/admin/viewproduct" element={<ViewProduct />} />
                <Route
                  path="/admin/complaints"
                  element={<AdminComplaints />}
                />{" "}
                {/*momen */}
                <Route
                  path="/admin/addProduct"
                  element={<AdminAddProduct usertype="admin" />}
                />{" "}
                {/* Add product page */}
                <Route
                  path="/admin/viewComplaint"
                  element={<AdminViewComplaint />}
                />
                <Route path="/admin/sales" element={<SalesOverviewChart />} />
                <Route
                  path="/admin/change-password/:id/:modelName"
                  element={<ChangePassword />}
                />

                <Route
                  path="/admin/updateProduct/:id"
                  element={<AdminUpdateProducts usertype="admin" />}
                />

                <Route path="/admin/my_category" element={<Categorypage />} />
                <Route path="/admin/my_tags" element={<Tagspage />} />
                <Route path="/admin/Tourism_Governer" element={<Tourism_Governer />} />
              </Route>

              {/** Tourist */}
              <Route path="/tourist" element={<TouristLayout />}>
              
                {/* <Route path="/tourist/:id/terms" element={<TermsAndConditionsForm />} /> */}
                <Route path="/tourist/products" element={<ProductListing usertype="tourist" />} />  {/**/}

                <Route path="/tourist/Complaints" element={<TouristComplaint />} />{/** lazem takhod id */}         {/**/}
                <Route path="/tourist/home" element={<ToursitPage />} />                                           {/**/}
                <Route path="/tourist/cart" element={<Cart />} /> 
                <Route path="/tourist/checkout" element={<Checkout />} />
                <Route path="/tourist/CheckoutItinerary" element={<CheckoutItinerary />} />
                
                <Route path="/tourist/confirmation" element={<Confirmation/>} />
                <Route path="/tourist/viewproduct" element={<ViewProduct />} />                                    {/**/}
                <Route path="/tourist/addComplaint" element={<TouristAddComplaintPage />} />                     {/**/}
                <Route path="/tourist/change-password/:id/:modelName" element={<ChangePassword />} />               {/**/}
                <Route path="/tourist/RequestDelete/:modelName/:id" element={<RequestAccountDeletion />} />        {/**/}
                <Route path="/tourist/profile/tourist/:id" element={<TouristProfile />} />                         {/**/}
                <Route path="/tourist/activity/:activityId/tourist/:id" element={<ActivityDetailPage />} />{/* New route for activity details */}
                <Route path="/tourist/activities2" element={<Activities2 filteredActivities={filteredActivities} />} />{/**/}
                <Route path="/tourist/itineraries2" element={<Itineraries2 filteredItinerary={filteredItinerary} />} />{/**/}
                <Route path="/tourist/itinerary/:itineraryId/tourist/:id" element={<ItineraryDetailPage />} />
                {/* jimmy */}

                
                <Route path="/tourist/touristOrders/:id" element={<TouristOrders />} />   
                <Route path="/tourist/order-details/:orderId" element={<OrderDetails />} /> 

                <Route path="/tourist/tourguidelist" element={<Dashboard2 />} />                                    {/**/}
                <Route path="/tourist/viewTourGuideProfile/:guideId" element={<TouristTourGuideProfile />} />{/**/}
                <Route path="/tourist/add-rating-comment/:guideId" element={<AddRatingComment />} />{/**/}
                <Route path="/tourist/add-rating-comment-itinerary/:iternaryId" element={<AddRatingCommentItinerary />} /> {/**/}
                <Route path="/tourist/TouristItineraryDetails/:iternaryId" element={<TouristItineraryDetails />} /> {/**/}
                <Route path="/tourist/ActivitiesHazem" element={<CategoriesAndActivities />} />
                <Route path="/tourist/book-hotel" element={<div style={{ padding: 20 }}><Booking touristId={"670255f97b12bc9e3f1c7f26"} /></div>} />
                <Route path="/tourist/book_flight" element={<FlightSearch touristId={"670255f97b12bc9e3f1c7f26"} />} />
                <Route path="/tourist/my_bookings" element={<MyBookingsPage />} />
                <Route path="/tourist/historicalLocations" element={<> <HistoricalPlaceFilter onFilter={handleFilterResultsHistoricalPlaces} />
                  <HistoricalLocations filteredHistoricalPlace={filteredHistoricalPlace} /></>} />
                <Route path="/tourist/rate-comment-event/:modelName/:id" element={<ActivityList touristId={"670255f97b12bc9e3f1c7f26"} />} />  ///////////////////////////////////
                <Route
                  path="/tourist/transportbooking"
                  element={<TransportBookingPage />}
                />
                <Route path="/tourist/myprefs/:id" element={<MyPrefs />} />
                <Route
                  path="/tourist/my_prefrences"
                  element={<PreferencesSelection />}
                />
                <Route
                  path="/tourist/Transportation"
                  element={<Transportationpage />}
                />
                <Route
                  path="/tourist/ViewItineraryEdit/:ItineraryID"
                  element={<ViewAct_Iten />}
                />
                <Route
                  path="/tourist/ViewActivity/:ItineraryID"
                  element={<ViewActivity />}
                />
              </Route>
              {/* carol */}
            

              


              {/* carol */}

              {/** Guest */}
              <Route path="/guest" element={<GuestLayout />}>
                <Route path="/guest/home" element={<GuestPage />} />
                <Route path="/guest/activity/:activityId" element={<ActivityDetailPage />} />{/* New route for activity details */}
                <Route path="/guest/activities2" element={<Activities2 filteredActivities={filteredActivities} />} />
                <Route path="/guest/itineraries2" element={<Itineraries2 filteredItinerary={filteredItinerary} />} />
                <Route path="/guest/itinerary/:itineraryId" element={<ItineraryDetailPage />} />
                <Route path="/guest/historicalLocations" element={<> <HistoricalPlaceFilter onFilter={handleFilterResultsHistoricalPlaces} /> <HistoricalLocations filteredHistoricalPlace={filteredHistoricalPlace} /></>} />
                {/* <Route path="/guest/authentication" element={<Authentication />} /> */}

              </Route>

               <Route path = "/GARAB" element ={<LoginForm1/>}/>

              {/** Tourguide */}
              <Route path="/Tourguide/:id" element={<TourGuideLayout />}>
              
              <Route path ="/Tourguide/:id/ItinerarySales" element ={<ItinerarySales/>} />      

              <Route path="/Tourguide/:id/notifications" element={<NotificationsPage/>} />


                <Route
                  path="/Tourguide/:id/profile/tour-guides/:id"
                  element={<Profile />}
                />
                <Route
                
                path="/Tourguide/:id/tour-guide/itineraryAdd/:id"
                element={<ItineraryManager />}
              />
              <Route path ="/Tourguide/:id/ViewItineraryEdit/:ItineraryID" element = {<ViewItineraryTourGuide />} />
                <Route
                  path="/Tourguide/:id/update-profile/tour-guides/:id"
                  element={<UpdateProfile />}
                />
                <Route
                  path="/Tourguide/:id/MyItineraries"
                  element={<Itineraries />}
                />
                 <Route
                  path="/Tourguide/:id/change-password/:id/:modelName"
                  element={<ChangePassword />}
                  
                />

                <Route
                  path="/Tourguide/:id/RequestDelete/:id/:modelName"
                  element={<RequestAccountDeletion />}
                />
          
                
                



                {/* {HHHHHHHEEEEEEEEERRRRRRRRRREEEEEEE vvvvvvvvvvvvvvvvvvv} */}
                
                <Route
                  path="/Tourguide/:id/Activities"
                  element={<Activities />}
                />
                <Route path="/Tourguide/:id/Museum" element={<Museum />} />
                <Route path="/Tourguide/:id/HL" element={<HL />} />
                <Route
                  path="/Tourguide/:id/ItineraryManagement"
                  element={<ItineraryManagement />}
                />  
              </Route>









              {/** seller */}
              <Route path="/Seller" element={<SellerLayout />}>
                <Route
                  path="/Seller/change-password/:id/:modelName"
                  element={<ChangePassword />}
                />
                                <Route
                  path="/Seller/profile"
                  element={<SellerProfile />}
                />
                <Route
                  path="/Seller/productSales"
                  element={<ProductSales usertype="sellers" />}
                     />
                <Route
                  path="/Seller/upload-image/:id/:modelName"
                  element={<ImageUpload />}
                />
                <Route
                  path="/Seller/RequestDelete/:id/:modelName"
                  element={<RequestAccountDeletion />}
                />
                <Route
                  path="/Seller/products"
                  element={<ProductListing usertype="sellers" />}
                />
                <Route
                  path="/Seller/addProduct"
                  element={<ProductForm usertype="sellers" />}
                />
                <Route
                  path="/Seller/updateProduct/:id"
                  element={<UpdateProducts usertype="sellers" />}
                />
                <Route path="/Seller/viewproduct" element={<ViewProduct />} />

              </Route>
              {/** seller */}






              <Route path="/guest" element={<GuestPage />} />
              <Route
                path="/admindashboard"
                element={<AdminDashboard />}
              ></Route>

              {/* Update product page */}

              <Route path="/delete/:role" element={<UserList />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />
              <Route path="/admin/delete-options" element={<DeleteOptions />} />
              <Route path="/admin/add" element={<AdminAddPage />} />
              <Route path="/edit/tourist/:id" element={<TouristEditPage />} />

              <Route
                path="/update-profile/tour-guides/:id"
                element={<UpdateProfile />}
              />
              <Route path="/profile/tour-guides/:id" element={<Profile />} />
              <Route
                path="/activities2"
                element={
                  <Activities2 filteredActivities={filteredActivities} />
                }
              />
              {/** tourist and guest */}
              <Route
                path="/itineraries2"
                element={<Itineraries2 filteredItinerary={filteredItinerary} />}
              />
              <Route
                path="/museums"
                element={
                  <>
                    <MuseumFilter onFilter={handleFilterResultsMusuems} />
                    <Museums filteredMuseum={filteredMuseum} />
                  </>
                }
              />

              <Route path="/rate-comment-event" element={<ActivityList touristId={"670255f97b12bc9e3f1c7f26"} />} />  ///////////////////////////////////

            


              <Route path="/Itineraries" element={<Itineraries />} />{/*show for all */}
              {/*JIMMY */}

              <Route
                path="/historicalLocations"
                element={
                  <>
                    <HistoricalPlaceFilter
                      onFilter={handleFilterResultsHistoricalPlaces}
                    />
                    <HistoricalLocations
                      filteredHistoricalPlace={filteredHistoricalPlace}
                    />
                  </>
                }
              />
            </Routes>
          </CurrencyProvider>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

