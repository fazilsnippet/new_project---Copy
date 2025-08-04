// import React from 'react'
// import Hero from '../components/ui/hero'
// import Header from '../components/layout/header'
// import CategoriesList from '../components/layout/Categories'
// import TopSellingPreview from '../components/features/products/topSellingPreview.jsx'
// import { RecentProductPreview } from '../components/features/products/recentProductPreview.jsx'
// import TopBrandsWithProductsSlider from '../components/features/brand/topBrands.jsx'
// import RecentlyViewedPreview from '../components/features/products/recentlyViewPreview.jsx'
// import RecentlyViewedProductsPage from '../components/features/products/recentlyViewPage.jsx'
// import UnauthorizedHeader from '../components/layout/unAuthorisedHeader.jsx'
// import Login from '../components/features/auth/Login.jsx'
// import { useSelector } from 'react-redux'
// const homePage = () => {
//     const isAuthenticated = useSelector((state) => !!state.auth.userInfo);

//   return (
//     <div>
//     <div> {isAuthenticated ? <Header /> : <UnauthorizedHeader />} </div> 
//       <Hero/>
//       <CategoriesList/>
// \      <TopSellingPreview/>
// <RecentProductPreview/>
// <TopBrandsWithProductsSlider/>
// <div className="space-y-8">
//       {isAuthenticated ? (
//         <RecentlyViewedPreview />
//       ) : (
//         <div className="flex justify-center">
//           <Login />
//         </div>
//       )}
//     </div>
//     </div>
//   )
// }

// export default homePage


import React from "react";
import { useSelector } from "react-redux";

import Hero from "../components/ui/hero";
import Header from "../components/layout/header";
import UnauthorizedHeader from "../components/layout/unAuthorisedHeader";
import CategoriesList from "../components/layout/Categories";
import TopSellingPreview from "../components/features/products/topSellingPreview";
import { RecentProductPreview } from "../components/features/products/recentProductPreview";
import TopBrandsWithProductsSlider from "../components/features/brand/topBrands";
import RecentlyViewedPreview from "../components/features/products/recentlyViewPreview";

const HomePage = () => {
  // ✅ Auth check based on updated Redux structure
const isAuthenticated = useSelector(
  (state) => Boolean(state.auth.userInfo?._id)
);
console.log("🔍 userInfo in Redux:", isAuthenticated);


  return (
    <div className="bg-white">
      {/* Header */}
      {isAuthenticated ? <Header /> : <UnauthorizedHeader />}

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 space-y-12">
        {/* Hero Section */}
        <section aria-label="Hero Banner">
          <Hero />
        </section>

        {/* Categories */}
        <section aria-label="Categories">
          <CategoriesList />
        </section>

        {/* Top Selling Products */}
        <section aria-label="Top Selling Products">
          <TopSellingPreview />
        </section>

        {/* Recent Products */}
        <section aria-label="Recent Products">
          <RecentProductPreview />
        </section>

        {/* Recently Viewed (Only if logged in) */}
        {isAuthenticated && (
          <section aria-label="Recently Viewed Products">
            <RecentlyViewedPreview />
          </section>
        )}

        {/* Top Brands */}
        <section aria-label="Top Brands">
          <TopBrandsWithProductsSlider />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
