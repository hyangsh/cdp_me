import React from 'react';
import CalorieCircle from '../components/CalorieCircle';
import NutrientBars from '../components/NutrientBars';
import MealList from '../components/MealList';
import FooterNav from '../components/FooterNav';

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Main content area */}
      <main className="p-4 space-y-6 pb-24"> {/* Padding at the bottom to avoid overlap with footer */}
        <CalorieCircle />
        <NutrientBars />
        <MealList />
      </main>

      {/* Fixed Footer Navigation */}
      <FooterNav />
    </div>
  );
};

export default Dashboard;
