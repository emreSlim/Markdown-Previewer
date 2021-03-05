export default function ThemeBtn({ toggle }) {
  return (
    <button
      id="themebtn"
      className="thm btn fas fa-magic"
      data-title="toggle theme"
      title="toggle theme"  
      onClick={toggle}
    ></button>
  );
}