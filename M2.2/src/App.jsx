import './App.css'
import { Route, Routes } from 'react-router';
import Header from './components/pax/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Login from './components/Login/Login.jsx'
import Signup from './components/Signup/Signup.jsx'
import Home from './components/pax/Home/Home.jsx'
import { AuthProvider } from "./components/AuthContext.jsx";
import Account from './components/pax/Account/Account.jsx';
import Sell from './components/pax/Sell/Sell.jsx';
import History from './components/pax/History/History.jsx';
import SellRequest from './components/admin/SellRequest/SellRequest.jsx';
import Summary from './components/admin/Summary/Summary.jsx';
import Details from './components/pax/Home/HomeCard/Details/Details.jsx';
import Order from './components/pax/Order/Order.jsx';
import Checkout from './components/pax/Order/Checkout/Checkout.jsx';
import BuyOrder from './components/admin/BuyOrder/BuyOrder.jsx';
import Discount from './components/admin/Discount/Discount.jsx';
import Support from './components/pax/Support/Support.jsx';
import AdminSupport from './components/admin/Support/Support.jsx';

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <Header></Header>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/signup' element={<Signup></Signup>}></Route>
          <Route path='/account' element={<Account></Account>}></Route>
          <Route path='/recover'  element={<div><h1>Recover Page</h1></div>}></Route>
          <Route path='/sellrequest' element={<Sell></Sell>}></Route>
          <Route path='/history' element={<History></History>}></Route>
          <Route path='/admin/confirmsellrequest' element={<SellRequest></SellRequest>}></Route>
          <Route path='/admin/summary' element={<Summary></Summary>}></Route>
          <Route path='/details/:id' element={<Details></Details>}></Route>
          <Route path='/order' element={<Order></Order>}></Route>
          <Route path='/checkout/:id' element={<Checkout></Checkout>}></Route>
          <Route path='/admin/buyorder' element={<BuyOrder></BuyOrder>}></Route>
          <Route path='/admin/discount' element={<Discount></Discount>}></Route>
          <Route path='/support' element={<Support></Support>}></Route>
          <Route path='/admin/support' element={<AdminSupport></AdminSupport>}></Route>
        </Routes>
        <Footer></Footer>
      </div>
    </AuthProvider>
  )
}
export default App