import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <>
      <Header></Header>
      <Sidebar></Sidebar>
      <main>{children}</main>
    </>
  );
}
