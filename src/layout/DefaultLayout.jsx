import { Outlet } from "react-router-dom";
import { Header } from "../components/header/header";
import { Footer } from "../components/footer/footer";

export function DefaultLayout() {
  return (
    <>
      <Header />  {/* Header */}

      <main id="main-content" className="main" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />  {/* Footer */}
    </>
  );
}
