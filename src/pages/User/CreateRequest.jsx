import '../../style/user.css'
import React from 'react'
import { Navigate, useNavigate } from "react-router-dom";


function CreateRequest() {
    const navigate = useNavigate();
        const move1 = () => {
            navigate("/create-request");
       }
    return(
        <div>
            <div id='topBox'>
                <h1>
                    財務系統
                </h1>
                <div>
                    
                </div>
            </div>
            <div id="toolContainer">
                <button onClick={move1}> 新增請款</button>
                <button > 審核中款項</button>
                <button > 處理中款項</button>
                <button > 請款紀錄</button>
            </div>

            <div>

            </div>
        </div>
    );

};

export default CreateRequest;