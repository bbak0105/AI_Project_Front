import "./fileUploadCss.css";
import { useState, useEffect, useContext } from 'react';
import React from 'react';
import axios from 'axios'
import Alert from '@mui/material/Alert';
import { adminAccount } from "../authentication/auth/AuthLogin";


const FileUploadBox = () => {
    const [fileData, setFileData] = useState();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isShowAlert, setIsShowAlert] = useState(false);

    const onUploadFile = (e) => {
        if(!fileData) {
            setIsShowAlert(true);
            return;
        }

        setIsShowAlert(false);
    
        const formData = new FormData();
        formData.append('file', fileData);

        axios({
          baseURL: "http://127.0.0.1:5000",
          url: '/uploadData',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        })
        .then(response => {
            if(response.data === "Uplaod Success!") {
                const findingUser = localStorage.getItem("user");
                const userCounting = localStorage.getItem(`${findingUser}_counting`)
                localStorage.setItem(`${findingUser}_counting`, userCounting-1);
                window.location.href = "/dashboard";
            }
        })
        .catch(error => {
            console.error(error);
        });
    };
      
    return(
        <div className="modal">
            { !isSuccess && isShowAlert && 
                <Alert variant="outlined" severity="error">
                    파일을 올바르게 업로드 해주세요!
                </Alert>
            }
            <div className="modal-header">
                <div className="modal-logo">
                    <span className="logo-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="512" height="419.116" viewBox="0 0 512 419.116">
                            <defs>
                                <clipPath id="clip-folder-new">
                                    <rect width="512" height="419.116" />
                                </clipPath>
                            </defs>
                            <g id="folder-new" clipPath="url(#clip-folder-new)">
                                <path id="Union_1" data-name="Union 1" d="M16.991,419.116A16.989,16.989,0,0,1,0,402.125V16.991A16.989,16.989,0,0,1,16.991,0H146.124a17,17,0,0,1,10.342,3.513L227.217,57.77H437.805A16.989,16.989,0,0,1,454.8,74.761v53.244h40.213A16.992,16.992,0,0,1,511.6,148.657L454.966,405.222a17,17,0,0,1-16.6,13.332H410.053v.562ZM63.06,384.573H424.722L473.86,161.988H112.2Z" fill="var(--c-action-primary)" stroke="" strokeWidth="1" />
                            </g>
                        </svg>
                    </span>
                </div>
            </div>
            <div className="modal-body">
                <h2 className="modal-title">Upload a file</h2>
                <p className="modal-description">Attach the file below</p>
                <button 
                    className="upload-area"
                    onClick={(e) => {
                        document.getElementById("fileUpload").click();
                    }}
                >
                    <span className="upload-area-icon">
                    </span>
                    <span className="upload-area-title">
                        {fileData ?
                            <span>Uploaded file's name</span>
                            :
                            <span style={{ borderBottom: '1px solid grey'}}>Click box for uploading.</span>
                        }
                    </span>
                    <span className="upload-area-description">
                        {fileData ?
                            <>
                                <p style={{ borderBottom: '1px solid grey'}}>{fileData.name}</p>
                            </>
                            : 
                            <>
                                Alternatively, you can select a file by<br/>
                                <strong>clicking here</strong>
                            </>
                        }
                    </span>
                    <input 
                        type="file" 
                        id="fileUpload" 
                        style={{display: 'none'}}
                        onChange={(e) => {
                            e.preventDefault();
                            const file = e.target.files[0];

                            if(file) {
                                setFileData(e.target.files[0]);
                                setIsShowAlert(false)
                                e.target.value = "";
                            } else {
                                setIsShowAlert(true)
                            }
                        }}
                    />
                </button>
            </div>
            <div className="modal-footer">
                <button 
                    className="btn-secondary"
                    style={{cursor: 'pointer'}}
                    onClick={(e) => {
                        setFileData();
                    }}
                >
                    Clean File
                </button>
                <button 
                    className="btn-primary"
                    onClick={onUploadFile}
                    style={{cursor: 'pointer'}}
                >
                    Submit File
                </button>
            </div>
        </div>
    )
}

export default FileUploadBox;