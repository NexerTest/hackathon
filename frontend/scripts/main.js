
var expanded;
    function showOptions(){
        var items= document.getElementById("items-list");
        if(!expanded){
            items.style.display = "block";
            expanded= true;
        }else{
            items.style.display = "none";
            expanded= false;
        }
    }

    document.getElementById('loadData').addEventListener('click', () => {
        fetch('/api/data')
            .then(response => response.json())
            .then(data => {
                const dataList = document.getElementById('dataList');
                dataList.innerHTML = '';
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = JSON.stringify(item);
                    dataList.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error));
    });

    function mostrarMensaje(mensaje) {
        alert(mensaje);
    }

    function verElemento(elemento) {
        alert(`Ver detalles de ${elemento}`);
        // Aquí podrías redirigir a una página de detalles
        // window.location.href = `/ver/${elemento}`;
    }

    function editarElemento(elemento) {
        alert(`Editar ${elemento}`);
        // Aquí podrías redirigir a una página de edición
        // window.location.href = `/editar/${elemento}`;
    }


// Obtener el modal
var modal = document.getElementById("myModal");

// Obtener el botón que abre el modal
var btn = document.getElementById("openModalBtn");

// Obtener el elemento <span> que cierra el modal
var span = document.getElementsById("closeModalBtn");

// Cuando el usuario hace clic en el botón, abre el modal
btn.onclick = function() {
    modal.style.display = "block";
}

// Cuando el usuario hace clic en <span> (x), cierra el modal
span.onclick = function() {
    modal.style.display = "none";
}

// Cuando el usuario hace clic fuera del modal, también lo cierra
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


