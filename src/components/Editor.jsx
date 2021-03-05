import Toolbox from "./Toolbox";

export default function Editor({ input, onChange, handlebuttonClick }) {
  return (
    <div id="editor-container">
      <Toolbox name="Input" handlebuttonClick={handlebuttonClick} />
      <textarea
        id="editor"
        className="editor"
        value={input}
        onChange={onChange}
      />
      <div id="dragbar" title='drag to resize'/>
    </div>
  );
}