
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

// Obtener el modal y los botones
var modal = document.getElementById("myModal");
var openModalBtn = document.getElementById("openModalBtn");
var closeModalBtn = document.getElementById("closeModalBtn");

// Abrir el modal cuando se haga clic en el botón
openModalBtn.onclick = function() {
    modal.style.display = "flex";
}

// Cerrar el modal cuando se haga clic en el botón de cierre (X)
closeModalBtn.onclick = function() {
    modal.style.display = "none";
}

// Cerrar el modal si se hace clic fuera del contenido del modal
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}