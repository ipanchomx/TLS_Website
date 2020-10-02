let data;
let files = [];
let grid_container = document.querySelector('#grid-container');

/*

            <div class="xs-100 md-50 lg-33 xl-25">
                <h2>Heading</h2>
                <img src="../img/Document-icon-by-rudezstudio-6-580x386.jpg" alt="Document" >
                <div id="divButton">
                    <button>Verify</button>
                </div>
            </div>

*/
// 1. Crear XMLHttpRequest object
let xhr = new XMLHttpRequest();
// 2. Configurar: POST actualizar archivo
xhr.open('GET', 'https://localhost:8080/getFiles');
// 3. indicar tipo de datos JSON
xhr.setRequestHeader('Content-Type', 'application/json');

// 4. Enviar solicitud al servidor
xhr.send();

// 5. Una vez recibida la respuesta del servidor
xhr.onload = function () {
    if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP
        // Ocurrió un error
        //alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
        alert(xhr.status + ': ' + xhr.statusText);
        console.log(xhr.response.files);

    } else {
        //console.log(xhr.responseText); // Significa que fue exitoso
        //alert(xhr.responseText);
        data = JSON.parse(xhr.response);
        //console.log("data: ", data);
        files = data.files;
        cargarDocs();
        /*
        console.log("data files: ", files);
        console.log("data 0: ", files[0]);
        console.log("data 1: ", files[1]);
        */
    }
};

let cargarDocs = function() {
    files.forEach(item => {
        grid_container.innerHTML += `<div class="xs-100 md-50 lg-33 xl-25">
        <h2>${item}</h2>
        <img src="../img/document-icon.jpg" alt="Document" >
        <div id="divButton">
        <button>Verify</button>
        </div>
        </div>`
    });
}
