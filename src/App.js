import "./App.scss";
import FileUpload from "./FileUpload";

function App() {
  return (
    <div className="appWrapper">
      <h1 className="header1">Turkish User Story Graph Data Base Creator</h1>
      {/* <div class="input-group mb-3">
        <input type="file" class="form-control" id="inputGroupFile" />
        <label class="input-group-text" for="inputGroupFile02">
          Upload User Story File
        </label>
      </div> */}
      <FileUpload />
    </div>
  );
}

export default App;
