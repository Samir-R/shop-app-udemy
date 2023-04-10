import { Outlet } from 'react-router-dom';

import Directory from '../../components/directory/directory.component';

const Home = () => {
  return (
    <div style={{ width: "100%" }}>
      <Directory />
      <Outlet />
    </div>
  );
};

export default Home;
