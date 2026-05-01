import { Outlet } from 'react-router-dom';

import Directory from '../../components/directory/directory.component';
import ProductList from "../../new-components/ProductList";

const Home = () => {
  return (
    <div style={{ width: "100%" }}>
      <Directory />
        {/*<ProductList />*/}
      <Outlet />
    </div>
  );
};

export default Home;
