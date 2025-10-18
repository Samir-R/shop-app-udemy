import React, {useState} from 'react';
import AccountDashboard from "../../components/account/account.component";
import Rewards from "../../components/account/rewards.component";
import OrderHistory from "../../components/order/order-history.component";
import PersonalInfo from "../../components/account/personal-info.component";

export default function MyAccount() {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'personal-info':
        return <PersonalInfo onBack={() => setCurrentSection('dashboard')} />;
      case 'orders':
        return <OrderHistory onBack={() => setCurrentSection('dashboard')} />;
      case 'rewards':
        return <Rewards onBack={() => setCurrentSection('dashboard')} />;
      default:
        return <AccountDashboard onNavigate={setCurrentSection} />;
    }
  };

  return renderCurrentSection();
}