import '../../style/user.css';
import { Navigate, useNavigate } from "react-router-dom";
import React from 'react';

function UserTools() {
    const navigate = useNavigate();
    const move1 = () => {
        navigate("/create-request");
   }


    return(
        <div id="toolContainer">
            <button onClick={move1}> 新增請款</button>
            <button > 審核中款項</button>
            <button > 處理中款項</button>
            <button > 請款紀錄</button>
        </div>
    );
}

export default UserTools;