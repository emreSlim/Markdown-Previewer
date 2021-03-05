import Toolbox from "./Toolbox";

export default function Preview({ text, handlebuttonClick }) {
  return (
    <div id="preview-container">
      <Toolbox name="Output" handlebuttonClick={handlebuttonClick} />
      <div
        id="preview"
        className="editor"
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
    </div>
  );
}
