import SideBar from "./components/sidebar";
import "./home.scss";

export default function HomePage() {
  return (
    <div className="page d-flex justify-content-start align-items-start">
      <SideBar />
    </div>
  );
}
