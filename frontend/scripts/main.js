
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


function fetchItems() {
    fetch('http://localhost:3000/profiles')
        .then(response => response.json())
        .then(data => {
            const itemList = document.getElementById('itemList');
            const div_drop=  document.getElementById('dropdown-content');
            itemList.innerHTML = ''; // Limpiar lista
            
            data.profiles.forEach(item => {
                const li = document.createElement('li');
                
                //add li en profile
                li.id=item.profile_type;
                li.textContent = item.profile_type;
                const div=document.createElement('div')
                div.className="buttons"
                const btn1 = document.createElement('button');
                btn1.className="view-button"
                const btn2 = document.createElement('button');
                btn2.className="edit-button"
                btn1.setAttribute('onclick', "verElemento("+item.profile_type+")");
                btn2.setAttribute('onclick', "editarElemento("+item.profile_type+")");
                btn1.textContent = "Ver";
                btn2.textContent = "Editar"
                btn1.id = "button Ver"+ item.profile_type ;
                btn2.id = "button Ver"+ item.profile_type ;

                btn1.append;
                btn2.append;
                div.appendChild(btn1);
                div.appendChild(btn2);

                div.append
                li.appendChild(div);
                li.append
                itemList.appendChild(li);
                

                //add label en dropdown

                const label = document.createElement('label');
                const input= document.createElement('input');
                input.type="checkbox";
                input.name="button name " + item.profile_type;
                input.value="button value "+ item.profile_type;
                
                input.append
                label.appendChild(input);
                label.innerHTML += item.profile_type;    

                label.append;
                
                div_drop.appendChild(label);

            });
        });
}

// Obtener datos al cargar la página
window.onload = fetchItems;