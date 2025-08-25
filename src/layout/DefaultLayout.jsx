import { Outlet } from "react-router-dom";
import { Header } from "../components/header/header";
// import { Footer } from "../components/";

export function DefaultLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
}
