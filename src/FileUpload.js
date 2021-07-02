import React from "react";
import axios, { post } from "axios";
import "./FileUpload.scss";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      showError: false,
      showSuccess: false,
      showTXTError: false,
      showSpinner: false,
      isSuccess: false,
      showModal: false,
      whichNode: "",
      nodesToPrint: [],
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);

    this.onModalFormSubmit = this.onModalFormSubmit.bind(this);
    this.onModalSelectHandler = this.onModalSelectHandler.bind(this);
  }

  onFormSubmit(e) {
    this.setState({ showSpinner: true });
    e.preventDefault(); // Stop form submit
    this.fileUpload(this.state.file)
      .then((response) => {
        console.log(response.data);
        if (response.data !== "Please upload txt file.") {
          this.setState({ showSpinner: false });
          this.setState({ showSuccess: true });
          this.setState({ isSuccess: true });
        } else {
          this.setState({ showSpinner: false });
          this.setState({ showTXTError: true });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status) {
          this.setState({ showSpinner: false });
          this.setState({ showError: true });
        }
      });
  }

  onModalFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    axios
      .get("http://127.0.0.1:5000/nodes", {
        headers: { node: this.state.whichNode },
      })
      .then((response) => {
        this.setState({ nodesToPrint: response.data.Nodes });
        console.log("response", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  fileUpload(file) {
    const url = "http://127.0.0.1:5000/upload";
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  }

  onModalSelectHandler(event) {
    this.setState({ whichNode: event.target.value });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <h3 className="file_header">Upload Your User Story File(.txt)</h3>
          <div>
            <input
              type="file"
              onChange={this.onChange}
              className="btn btn-dark"
            />
            <button type="submit" className="btn btn-light">
              Upload
            </button>
          </div>
        </form>
        {this.state.isSuccess ? (
          <>
            <h5 className="successInfo">
              Your file is uploaded to the server and processed{" "}
              <span>successfully</span>. You can visit interactive graph
              database.
            </h5>
            <Button
              variant="light"
              className="successButton"
              href="http://localhost:7474/browser/"
              target="_blank"
            >
              Visit Graph Database (neo4j)
            </Button>
            <Button
              variant="primary"
              onClick={() => this.setState({ showModal: true })}
              className="modalButton"
            >
              Open Detailed Query Module
            </Button>
          </>
        ) : null}

        <Modal
          show={this.state.showError}
          onHide={() => this.setState({ showError: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>File Upload Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.showSpinner ? (
              <Spinner animation="border" />
            ) : (
              <Alert key={"uploadError"} variant={"warning"}>
                Please upload a txt file. You can not submit empty. No file
                chosen!
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showError: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.showSuccess || this.state.showSpinner}
          onHide={() => this.setState({ showSuccess: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>
              {this.state.showSpinner
                ? "File Uploading Please Wait"
                : "File Upload Success"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.showSpinner ? (
              <Spinner animation="border" />
            ) : (
              <Alert key={"uploadSuccess"} variant={"success"}>
                File Successfully uploaded to the server!
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() =>
                this.setState({ showSuccess: false, showSpinner: false })
              }
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.showTXTError}
          onHide={() => this.setState({ showTXTError: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>File Upload Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.showSpinner ? (
              <Spinner animation="border" />
            ) : (
              <Alert key={"uploadTXTError"} variant={"danger"}>
                Please Upload a txt File!
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showTXTError: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          dialogClassName="my-modal"
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Database Question Module
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              {" "}
              <Row>
                <Col xs={8} md={4}>
                  <form onSubmit={this.onModalFormSubmit}>
                    <select
                      class="form-select"
                      aria-label="Default select example"
                      onChange={(e) => this.onModalSelectHandler(e)}
                    >
                      <option selected disabled>
                        Choose Type of Nodes to Show
                      </option>
                      <option value="Action">Action</option>
                      <option value="ActionRole">Action Role</option>
                      <option value="ActionObject">Action Object</option>
                      <option value="ActionPlace">Action Place</option>
                      <option value="ActionTime">Action Time</option>
                      <option value="ActionTool">Action Tool</option>
                      <option value="BenefitAction">Benefit Action</option>
                      <option value="BenefitObject">Benefit Object</option>
                      <option value="BenefitPlace">Benefit Place</option>
                      <option value="BenefitTime">Benefit Time</option>
                      <option value="BenefitTool">Benefit Tool</option>
                    </select>
                    <button type="submit" className="btn btn-dark">
                      Get Nodes
                    </button>
                  </form>
                </Col>
                <Col xs={12} md={8}>
                  <Row>
                    {this.state.nodesToPrint.map((node, index) => (
                      <>
                        {node.name.length > 0 ? (
                          <Col xs={8} md={3}>
                            <li>{node.name}</li>
                          </Col>
                        ) : (
                          <></>
                        )}
                      </>
                    ))}
                  </Row>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ showModal: false })}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default FileUpload;
