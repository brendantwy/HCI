import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { Typography, Button } from "@mui/material";

const FileUpload = (props) => {
  const { disabled, file_info, setLocalRowData, localRowData, type } = props;
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState(undefined);
  const [message, setMessage] = useState("");
  const loginID = localStorage.getItem("employeeId");

  const onChange = async (e) => {
    var objKey = "";
    if (type === "leaves") {
      objKey = "leaves_file";
    } else {
      objKey = "claims_file";
    }
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
    console.log(e.target.files[0]);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("type", type);
    formData.append("employeeId", loginID);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { fileName, filePath } = res.data;
      const partialFilePath = filePath.split("/")[4];
      console.log(partialFilePath);
      setUploadedFile({ fileName, filePath, partialFilePath });
      setLocalRowData({
        ...localRowData,
        [objKey]: filePath,
      });
      setMessage("File Uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  useEffect(() => {
    setFile(file_info);
  }, [file_info]);

  if (file_info) {
    return (
      <Button target="_blank" href={file_info}>
        {file_info.split("/")[4]}
      </Button>
    );
  } else {
    return (
      <Fragment>
        {message ? <Typography msg={message} /> : null}
        {uploadedFile ? (
          <Button target="_blank" href={uploadedFile.filePath}>
            {uploadedFile.partialFilePath}
          </Button>
        ) : (
          <label htmlFor="raised-button-file">
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={onChange}
            />
            <Button disabled={disabled} variant="raised" component="span">
              Choose File
            </Button>
          </label>
        )}
      </Fragment>
    );
  }
};

export default FileUpload;
