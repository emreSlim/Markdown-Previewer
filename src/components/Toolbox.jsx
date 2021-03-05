export default function Toolbox({ name, handlebuttonClick }) {
  const classSubstring = name === "Input" ? "keyboard" : "tv";

  return (
    <div className="toolbox">
      <i className={"toolbox-icon fas fa-" + classSubstring}></i>
      <p className="toolbox-name">{name}</p>
      <div className="buttons-container">
        <button
          className="min btn fas fa-window-minimize"
          data-title="minimize"
         title="minimize"
          onClick={handlebuttonClick}
        ></button>
        <button
          className="res btn fas fa-window-restore"
          data-title="restore"
          title="restore"
          onClick={handlebuttonClick}
        ></button>
        <button
          className="max btn fas fa-window-maximize"
          data-title="maximize"
          title="maximize"
          onClick={handlebuttonClick}
        ></button>
      </div>
    </div>
  );
}