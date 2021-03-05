import "./App.css";
import $ from "jquery";
import { Component } from "react";
import Preview from "./components/Preview";
import Editor from "./components/Editor";
import ThemeBtn from "./components/ThemeBtn";

// eslint-disable-next-line no-undef
marked.setOptions({
  breaks: true,
});
const htmlText = `
<h2>TYPE YOUR HTML IN THE LEFT!! (make sure to clear the default input)</h2> 
<br>
<h1> What is HTML? </h1>
<br>
<h4> Hypertext Markup Language is the standard markup language for documents designed to be displayed in a web browser. It can be assisted by technologies such as Cascading Style Sheets and scripting languages such as JavaScript.</h4>
<br>
<h3><a href="https://en.wikipedia.org/wiki/HTML">Click here</a> to read more.</h3>
<br>
<ul>
   <li> This is some example of inline code: <code> <div></div> </code>.</li>
   
   <li> Below is some example of multiline code:
<code>
<html>
<head></head>
  <body></body>
  </html>
</code>
<br>
  <blockquote> <strong>Lack of transparency is a huge political advantage.</strong> </blockquote><cite>--Jonathan Gruber</cite>
<img src="http://supertux.lethargik.org/wiki/images/a/a9/Example.jpg"/>
`;

const markdownText = `
## TYPE YOUR MARKDOWN IN THE LEFT!! (make sure to clear the default input) 
&nbsp;
# What is Markdown? 
&nbsp;
#### Markdown is a lightweight markup language for creating formatted text using a plain-text editor. John Gruber and Aaron Swartz created Markdown in 2004 as a markup language that is appealing to human readers in its source code form.
&nbsp;
### [Click here](https://en.wikipedia.org/wiki/Markdown) to read more.

&nbsp;
   - This is some example of inline code:  \` <div></div\`.
   &nbsp;
   - Below is some example of multiline code:
\`\`\` 
<html>
<head></head>
  <body></body>
  </html>
\`\`\`
&nbsp;
  > **Lack of transparency is a huge political advantage.** --Jonathan Gruber

![this is an image](http://supertux.lethargik.org/wiki/images/a/a9/Example.jpg)
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      preview: "",
      darkTheme: false,
      htmlMode: false,
      editorWidth: "",
      previewWidth: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.attatchOnUnload();
    this.accessLocalStorage();
    this.debugAnimate();
    this.hideRestoreButton();
    this.attatchDragResizeEventHandler();
  }

  componentDidUpdate(preProps, preState) {
    if (preState !== this.state) {
      if (preState.htmlMode !== this.state.htmlMode) {
        if (
          this.state.input === "" ||
          this.state.input === htmlText ||
          this.state.input === markdownText
        ) {
          this.setDefaultText();
        } else {
          this.compileText();
        }
      }
      if (preState.darkTheme !== this.state.darkTheme) {
        this.setTheme();
      }
      if (this.state.htmlMode) {
        $("#html-mode").hide();
        $("#md-mode").show();
      } else {
        $("#md-mode").hide();
        $("#html-mode").show();
      }
      if (preState.editorWidth !== this.state.editorWidth) {
        this.setWidth();
      }
    }
  }

  handleChange(e) {
    this.editorResponse(e);
  }

  handleClick(e) {
    this.toolboxButtonResponse(e);
    this.themeButtonResponse(e);
    this.editorModeButtonResponse(e);
  }

  editorModeButtonResponse(e) {
    if (e.target.id === "md-mode") {
      this.setState({ htmlMode: false });
      this.setTheme();
    }
    if (e.target.id === "html-mode") {
      this.setState({ htmlMode: true });
      this.setTheme();
    }
  }

  themeButtonResponse(e) {
    if (e.target.id === "themebtn") {
      this.setState({ darkTheme: !this.state.darkTheme });
    }
  }

  toolboxButtonResponse(e) {
    const targetContainer = "#" + e.target.parentNode.parentNode.parentNode.id;
    const animationTime = 1000;

    if (e.target.dataset.title === "maximize") {
      if ($(document).width() > 440) {
        $(".min,.max,#dragbar").hide();
        $(targetContainer)
          .animate({ width: "100%" }, animationTime)
          .siblings()
          .animate({ width: 0, opacity: "toggle" }, animationTime, () => {
            $(targetContainer).siblings().hide();
            this.showRestoreButtonOnly();
          });
      } else {
        $(targetContainer)
          .css({ height: "50%", width: "100vw" })
          .animate({ height: "100%" })
          .siblings()
          .hide();
        this.showRestoreButtonOnly();
      }
    }
    if (e.target.dataset.title === "restore") {
      $(".min,.max,#dragbar,.res").hide();
      $(targetContainer).siblings().show();
      if ($(document).width() > 440) {
        this.setWidth(() => {
          this.hideRestoreButton();
        });
      } else {
        this.hideRestoreButton();
      }
    }

    if (e.target.dataset.title === "minimize") {
      if ($(document).width() > 440) {
        $(".min,.max,#dragbar").hide();

        $(targetContainer)
          .siblings()
          .animate({ width: "100%" }, animationTime, () => {
            this.showRestoreButtonOnly();
          });
        $(targetContainer).animate(
          { width: 0, opacity: "toggle" },
          animationTime,
          () => {
            $(targetContainer).hide();
          }
        );
      } else {
        $(targetContainer)
          .hide()
          .siblings()
          .css({ height: "50%", width: "100vw" })
          .animate({ height: "100%" });
        this.showRestoreButtonOnly();
      }
    }
  }

  editorResponse(e) {
    if (e.target.nodeName === "TEXTAREA") {
      this.compileText();
    }
  }

  compileText() {
    let typedText = $("#editor").val();
    this.setState({
      input: typedText,
    });
    if (!this.state.htmlMode) {
      // eslint-disable-next-line no-undef
      this.setState({ preview: marked(typedText) });
    } else {
      this.setState({ preview: typedText });
    }
  }

  setDefaultText() {
    if (this.state.htmlMode) {
      this.setState({ input: htmlText, preview: htmlText });
    } else {
      // eslint-disable-next-line no-undef
      this.setState({ input: markdownText, preview: marked(markdownText) });
    }
  }

  attatchOnUnload() {
    onbeforeunload = () => {
      localStorage.setItem("editorData", JSON.stringify(this.state));
    };
  }

  accessLocalStorage() {
    let localData = localStorage.editorData;
    if (localData) {
      localData = JSON.parse(localData);
      this.setState(localData);
    }
  }

  setWidth(callback) {
    let eW = this.state.editorWidth;
    let pW = this.state.previewWidth;
    let tW = eW + pW;
    $("#dragbar").show();
    if (tW) {
      let previewWidthInVW = `${(pW * 100) / tW}vw`;
      let editorWidthInVW = `${(eW * 100) / tW}vw`;
      $("#preview-container").animate(
        { width: previewWidthInVW, opacity: 1 },
        1000,
        callback
      );
      $("#editor-container").animate(
        { width: editorWidthInVW, opacity: 1 },
        990
      );
    }
  }

  attatchDragResizeEventHandler() {
    let dragging = false;

    document
      .querySelector("#dragbar")
      .addEventListener("touchstart", function (e) {
        dragging = true;
        $("*").css("user-select", "none");
        document.addEventListener("touchmove", moveListener);
      });

    $("#dragbar").on("mousedown", (e) => {
      dragging = true;
      $("*").css("user-select", "none");
      $(document).on("mousemove", moveListener);
    });

    document.addEventListener("touchend", (e) => endListener(e));

    $(document).on("mouseup", (e) => endListener(e));

    const moveListener = (e) => {
      e.stopPropagation();
      e.preventDefault();
      let width = $("#container").width();
      if (e.type === "mousemove") {
        if (e.pageX < width * 0.75 && e.pageX > width * 0.25) {
          $("#editor-container").css("width", `${(100 * e.pageX) / width}%`);
          $("#preview-container").css(
            "width",
            `${(100 * (width - e.pageX)) / width}%`
          );
        }
      } else {
        let co = e.changedTouches[0].pageX;
        if (co < width * 0.75 && co > width * 0.25) {
          $("#editor-container").css("width", `${(100 * co) / width}%`);
          $("#preview-container").css(
            "width",
            `${(100 * (width - co)) / width}%`
          );
        }
      }
    };

    const endListener = (e) => {
      if (dragging) {
        this.setWidthState();
        $("*").css("user-select", "");
        dragging = false;
        $(document).unbind("mousemove");
        document.removeEventListener("touchmove", moveListener);
      }
    };
  }

  debugAnimate() {
    $("#editor-container,#preview-container").animate({ width: "50%" }, 0);
  }

  setWidthState() {
    let editorW = $("#editor-container").outerWidth();
    let previewW = $("#preview-container").outerWidth();
    this.setState({ editorWidth: editorW, previewWidth: previewW });
  }

  setTheme() {
    if (this.state.darkTheme) {
      $("*").css({
        color: "white",
        "background-color": "black",
      });
      $("body").hide().fadeIn("slow");
    } else {
      $("*").css({
        color: "",
        "background-color": "",
      });
      $("body").hide().fadeIn("slow");
    }
  }

  showRestoreButtonOnly() {
    $(".min,.max,#dragbar").hide();
    $(".res").fadeIn();
  }

  hideRestoreButton() {
    $(".min,.max").fadeIn();
    $("#dragbar").show();
    $(".res").hide();
  }

  render() {
    const modename = this.state.htmlMode ? "HTML" : "Markdown";

    return (
      <>
        <header>
          <h2 id="title">
            <img
              src="./icon.svg"
              alt="editor icon"
              height="30px"
              width="30px"
            />
            {modename} Editor
          </h2>
          <div id="mod-buttons-container">
            <button
              id="html-mode"
              className={"mod btn fab fa-html5"}
              data-title="use HTML Editor"
              title="use HTML Editor"
              onClick={this.handleClick}
            />
            <button
              id="md-mode"
              className={"mod btn fab fa-markdown"}
              data-title="use Markdown Editor"
              title="use Markdown Editor"
              onClick={this.handleClick}
            />
            <ThemeBtn toggle={this.handleClick} />
          </div>
        </header>
        <div id="container">
          <Editor
            input={this.state.input}
            onChange={this.handleChange}
            handlebuttonClick={this.handleClick}
          />

          <Preview
            text={this.state.preview}
            handlebuttonClick={this.handleClick}
          />
        </div>
        <footer>
          <p>Designed and Coded by:</p>
          <a href="https://www.linkedin.com/in/imran-qureshi-92b822154/">
            Emre
          </a>
        </footer>
      </>
    );
  }
}

export default App;
