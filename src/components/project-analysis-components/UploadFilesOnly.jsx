import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../Api/api";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import "./uploadFiles.css";

export default function UploadFilesOnly({ projectId }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const filesPerPage = 6;
  const inputRef = useRef();

  useEffect(() => {
    fetchUploadedFiles();
  }, [projectId]);

  const fetchUploadedFiles = async () => {
    try {
      const response = await api.get(`/get-pdfs-by-project/${projectId}`);
      setUploadedFiles(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch uploaded resumes");
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("project_id", projectId);

      try {
        await api.post("/upload-pdf", formData);
        toast.success(`${file.name} uploaded successfully`);
      } catch (err) {
        console.log(err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    fetchUploadedFiles();
  };

  const getFileIconClass = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "pdf") return "fa-file-pdf";
    if (["doc", "docx"].includes(ext)) return "fa-file-word";
    return "fa-file";
  };

  const pageCount = Math.ceil(uploadedFiles.length / filesPerPage);
  const paginatedFiles = uploadedFiles.slice(
    currentPage * filesPerPage,
    (currentPage + 1) * filesPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  return (
    <div className="upload-files-page">
      <div className="uf-upload-files-container">
        <h1 className="uf-upload-files-title">
          <i className="fa-solid fa-upload"></i> Upload Resumes
        </h1>
        <h4 className="upload-file-description">
          Upload your files either in .pdf or .docx/.doc
        </h4>
        <div className="upload-file-underline"></div>

        <div className="upload-outside-box">
          <div className="uf-upload-files-box-wrapper">
            <div
              className="uf-upload-files-box"
              onClick={() => inputRef.current.click()}
            >
              <input
                type="file"
                ref={inputRef}
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              {isUploading ? (
                <i className="fa-solid fa-spinner fa-spin fa-2x uf-upload-files-icon"></i>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up fa-2x uf-upload-files-icon"></i>
                  <p className="uf-upload-files-title-text">
                    Click to select or drag files
                  </p>
                  <p className="uf-upload-files-subtitle">
                    Supports PDF, DOC, DOCX
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="uf-uploaded-files-grid-container">
          {paginatedFiles.map((file) => (
            <div className="uf-uploaded-file-card" key={file.id}>
              <div className="uf-uploaded-file-name">
                <i
                  className={`fa-solid ${getFileIconClass(
                    file.file_name
                  )} uf-uploaded-file-icon`}
                ></i>{" "}
                {file.file_name}
              </div>
              <div className="uf-uploaded-file-timestamp">
                <p>
                  Date:{" "}
                  {new Date(file.file_uploaded_timestamp).toLocaleDateString()}
                </p>
                <p>
                  Time:{" "}
                  {new Date(file.file_uploaded_timestamp).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
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

        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={"prev"}
            nextLabel={"next"}
            breakLabel={null} // no breaks
            pageCount={pageCount}
            marginPagesDisplayed={0} // no margin pages
            pageRangeDisplayed={pageCount} // show exactly all page numbers
            onPageChange={handlePageClick}
            containerClassName="uf-upload-files-pagination"
            activeClassName="active"
            previousClassName="pagination-previous"
            nextClassName="pagination-next"
            pageClassName="pagination-page"
            // add these to increase clickable area on prev/next
            previousLinkClassName="pagination-link"
            nextLinkClassName="pagination-link"
            // to ensure clickable area is full li, wrap label in link element
            renderOnZeroPageCount={null}
          />
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
