
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

function addList(item, itemList){
    var profile= capitalizeFirstLetter(item.profile_type);
    const li = document.createElement('li');
    li.id=profile;
    li.textContent = profile;
    const div=document.createElement('div')
    div.className="buttons"
    const btn1 = document.createElement('button');
    btn1.className="view-button"
    const btn2 = document.createElement('button');
    btn2.className="edit-button"
    btn1.setAttribute('onclick', "verElemento("+profile+")");
    btn2.setAttribute('onclick', "editarElemento("+profile+")");
    btn1.textContent = "View";
    btn2.textContent = "Delete"
    btn1.id = "button Ver"+ profile ;
    btn2.id = "button Ver"+ profile ;

    btn1.append;
    btn2.append;
    div.appendChild(btn1);
    div.appendChild(btn2);

    div.append
    li.appendChild(div);
    li.append
    itemList.appendChild(li);
}

function addDropdown(item, div_drop){
    var profile= capitalizeFirstLetter(item.profile_type);
    const label = document.createElement('label');
    const input= document.createElement('input');
    input.type="checkbox";
    input.name="button name " + profile;
    input.value="button value "+ profile;
    
    input.append
    label.appendChild(input);
    label.innerHTML += profile;    

    label.append;
    
    div_drop.appendChild(label);

}

function capitalizeFirstLetter(word) {
    if (word.length === 0) return ''; // Retorna una cadena vacía si la palabra está vacía
   const palabra= word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
   
    return palabra
}

function getProfiles() {
    fetch('http://localhost:3000/profiles')
        .then(response => response.json())
        .then(data => {
            const itemList = document.getElementById('itemList');
            const div_drop=  document.getElementById('dropdown-content');
            itemList.innerHTML = ''; // Limpiar lista
            
            data.profiles.forEach(item => {
                addList(item, itemList);
                addDropdown(item, div_drop);
               
            });
        });
}

// Obtener datos al cargar la página
window.onload = getProfiles;