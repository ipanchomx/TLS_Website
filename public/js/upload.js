const uploadForm = document.querySelector('.upload');

uploadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    //console.log('Si entró al evento');
    let file = e.target.sampleFile.files[0];
    //console.log(file);
    let formData = new FormData();

    formData.append('file', file);

    /*for (var key of formData.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }
    */
    fetch('https://localhost:8080/upload', {
            method: 'POST',
            body: formData
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.errors) {
                alert(data.errors);
            } else {
                console.log(data);
            }
        });
});