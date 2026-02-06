import Navbar from "./Navbar";
import "./Layout.css";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="page">{children}</div>
    </>
  );
}

export default Layout;
