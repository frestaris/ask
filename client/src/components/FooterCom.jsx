import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

function FooterCom() {
  return (
    <footer className="border-top p-4">
      <div className="d-flex justify-content-between">
        <div>&copy; {new Date().getFullYear()} Ask!</div>
        <div className="d-flex gap-3">
          <a href="#" className="text-secondary">
            <BsFacebook size={20} />
          </a>
          <a href="#" className="text-secondary">
            <BsInstagram size={20} />
          </a>
          <a href="#" className="text-secondary">
            <BsTwitter size={20} />
          </a>
          <a href="#" className="text-secondary">
            <BsGithub size={20} />
          </a>
          <a href="#" className="text-secondary">
            <BsDribbble size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default FooterCom;
