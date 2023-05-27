import React, {useEffect, useState} from 'react';
import './Spinner.scss'
function Spinner(){
    return(
        <div class="spinner-border text-dark spinner" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    )
}

export default Spinner;