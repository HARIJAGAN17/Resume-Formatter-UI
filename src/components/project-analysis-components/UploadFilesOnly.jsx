import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../Api/api";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import "./uploadFiles.css";

export default function UploadFilesOnly({ projectId }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isBulkUpload, setIsBulkUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileSpinners, setFileSpinners] = useState({});
  const [analyzedFiles, setAnalyzedFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const inputRef = useRef();
  const filesPerPage = 6;

  useEffect(() => {
    fetchAnalyzedFiles();
  }, [projectId]);

  const fetchAnalyzedFiles = async () => {
    try {
      const res = await api.get(`/get-pdfs-by-project/${projectId}`);
      const analyzed = res.data.filter(
        (f) => f.analysis_status && f.analysis_status !== "not_analyzed"
      );
      setAnalyzedFiles(analyzed);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch analyzed resumes");
    }
  };

  const handlePageClick = ({ selected }) => setCurrentPage(selected);
  const paginatedFiles = analyzedFiles.slice(
    currentPage * filesPerPage,
    (currentPage + 1) * filesPerPage
  );

  const getFileIconClass = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    if (ext === "pdf") return "fa-file-pdf";
    if (["doc", "docx"].includes(ext)) return "fa-file-word";
    return "fa-file";
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setIsBulkUpload(files.length > 1);
  };

  const uploadSingle = async (file) => {
    setFileSpinners({ [file.name]: true });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("project_id", projectId);

    try {
      await api.post("/upload-pdf", formData);
      toast.success(`${file.name} uploaded successfully`);
      fetchAnalyzedFiles();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to upload ${file.name}`);
    }

    setFileSpinners({});
    setSelectedFiles([]);
    setIsBulkUpload(false);
  };

  const uploadAll = async () => {
    setUploading(true);
    for (let file of selectedFiles) {
      setFileSpinners((prev) => ({ ...prev, [file.name]: true }));
      const fd = new FormData();
      fd.append("file", file);
      fd.append("project_id", projectId);

      try {
        await api.post("/upload-pdf", fd);
        toast.success(`${file.name} uploaded successfully`);
      } catch (err) {
        console.error(err);
        toast.error(`Failed to upload ${file.name}`);
      }
      setFileSpinners((prev) => ({ ...prev, [file.name]: false }));
    }
    fetchAnalyzedFiles();
    setUploading(false);
    setSelectedFiles([]);
    setIsBulkUpload(false);
  };

  return (
    <div className="uf-upload-files-page">
      <div className="uf-upload-files-container">
        <h1 className="uf-upload-files-title">
          <i className="fa-solid fa-upload"></i> Upload Resumes
        </h1>
        <h4 className="uf-upload-file-description">
          Upload your files either in .pdf or .docx/.doc
        </h4>
        <div className="uf-upload-file-underline" />

        <div className="uf-upload-outside-box">
          <div className="uf-upload-files-box-wrapper">
            <div
              className="uf-upload-files-box"
              onClick={() => inputRef.current.click()}
            >
              <input
                type="file"
                ref={inputRef}
                multiple
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <i className="fa-solid fa-cloud-arrow-up fa-2x uf-upload-files-icon" />
              <p className="uf-upload-files-title-text">
                Click to select or drag files
              </p>
              <p className="uf-upload-files-subtitle">
                Supports PDF, DOC, DOCX
              </p>
            </div>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="uf-uploaded-list-preview">
            <h4 className="uf-upload-ready-title">Selected Files</h4>
            <ul className="uf-uploaded-files-list">
              {selectedFiles.map((file, idx) => (
                <li key={idx} className="uf-uploaded-file-item">
                  <i className={`fa-solid ${getFileIconClass(file.name)}`} />
                  <span className="uf-file-name-text">{file.name}</span>
                </li>
              ))}
            </ul>

            <div className="uf-upload-actions-all">
              {isBulkUpload ? (
                <>
                  <button
                    className="uf-btn uf-upload-all-btn"
                    onClick={uploadAll}
                    disabled={uploading}
                  >
                    Upload All{" "}
                    {uploading && <span className="spinner-inline" />}
                  </button>
                  <button
                    className="uf-btn uf-remove-all-btn"
                    onClick={() => {
                      setSelectedFiles([]);
                      setIsBulkUpload(false);
                    }}
                    disabled={uploading}
                  >
                    Remove All
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="uf-btn uf-upload-btn-single"
                    onClick={() => uploadSingle(selectedFiles[0])}
                    disabled={fileSpinners[selectedFiles[0].name]}
                  >
                    <span className="btn-text">Upload</span>
                    {fileSpinners[selectedFiles[0].name] && (
                      <span className="spinner-inline" />
                    )}
                  </button>
                  <button
                    className="uf-btn uf-remove-btn-single"
                    onClick={() => setSelectedFiles([])}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {analyzedFiles.length > 0 && (
          <>
            <div className="uf-uploaded-files-grid-container">
              {paginatedFiles.map((file) => (
                <div key={file.id} className="uf-uploaded-file-card">
                  <div className="uf-uploaded-file-name">
                    <i
                      className={`fa-solid ${getFileIconClass(
                        file.file_name
                      )} uf-uploaded-file-icon`}
                    />
                    {file.file_name}
                  </div>
                  <div className="uf-uploaded-file-timestamp">
                    <p>
                      Date:{" "}
                      {new Date(
                        file.file_uploaded_timestamp
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      Time:{" "}
                      {new Date(
                        file.file_uploaded_timestamp
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="analysis-status">
                    <p>
                      Analysis status:{" "}
                      <span
                        className={
                          file.analysis_status === "completed"
                            ? "completed"
                            : "pending"
                        }
                      >
                        {file.analysis_status}
                      </span>
                    </p>
                  </div>
                  <div className="uf-uploaded-file-actions">
                    <button
                      className="uf-preview-button"
                      onClick={() =>
                        setPreviewUrl(
                          `data:application/pdf;base64,${file.file_data}#toolbar=0`
                        )
                      }
                    >
                      Preview
                    </button>
                    <button className="uf-delete-button">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {analyzedFiles.length > filesPerPage && (
              <ReactPaginate
                previousLabel="prev"
                nextLabel="next"
                pageCount={Math.ceil(analyzedFiles.length / filesPerPage)}
                onPageChange={handlePageClick}
                containerClassName="uf-upload-files-pagination"
                activeClassName="active"
              />
            )}
          </>
        )}

        <Modal
          isOpen={!!previewUrl}
          onRequestClose={() => setPreviewUrl(null)}
          contentLabel="Preview Resume"
          className="uf-custom-modal"
          overlayClassName="uf-custom-modal-overlay"
          ariaHideApp={false}
        >
          <div className="uf-modal-content-wrapper">
            <button
              className="uf-close-modal-btn"
              onClick={() => setPreviewUrl(null)}
            >
              Close
            </button>
            <iframe
              src={previewUrl}
              title="Resume Preview"
              className="uf-modal-iframe"
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}
