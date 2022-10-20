'use strict'

// API
/**
 * Create an unique hash code
 * @returns string
 */
function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}

const studentUrl = 'http://localhost:3000/students';
const ul = document.querySelector(".students__list")
const form = document.getElementById('dataForm');
const stud = document.querySelector(".student");
const sbmBtn = document.querySelector(".submitbtn");
const editBtn = document.querySelector(".edittbtn");

/**
 * Get all data from the Server
 * @param url string
 */
const getData = async (url) => {
	let response = await fetch(url);
	let data = await response.json();
	return data
}


/**
 * Print the list of element got from server
 * @param element - HTMLElement
 * @param items - Array 
 */
const printList = async (element, items) => {
	element.innerHTML = '';
	let data = [];
	data = await items;

	for (let i = 0; i < data.length; i++) {
		element.innerHTML += `
		<li>
		<div class="student">
			<p><b>ID: </b><span class="id">${data[i].id}</span></p>
			<p><b>Name: </b><span class="name">${data[i].name} </span></p>
			<p><b>Surname: </b><span class="surname">${data[i].surname}</span></p>
			<p><b>Register: </b><span class="register">${data[i].register}</span></p>
			<button class="EditBtn" id="edit">Edit</button>
			<button class="DeleteBtn" id="delete">Delete</button>
		</div>
	</li>
		`
	}
}

ul.addEventListener('click', (e) => {
	let delButton = e.target.id == 'delete';
	let editButton = e.target.id == 'edit';
	let id = e.target.parentElement.querySelector('.id').textContent;
	let name = e.target.parentElement.querySelector('.name').textContent;
	let surname = e.target.parentElement.querySelector('.surname').textContent;
	let register = e.target.parentElement.querySelector('.register').textContent;
	
	// HTTP DELETE REQUEST
	if(delButton) {
		fetch(studentUrl+`/${id}`, {
			method: 'DELETE'
		})
		.then(res => res.json())
		.then(() => location.reload())
	}
	if(editButton){
		sbmBtn.textContent = 'Edit';
		form.id.value = id;
		form.name.value = name;
		form.surname.value = surname;
		form.register.value = register;
		let updPayload = {id, name, surname, register}
		console.log(updPayload)
	}
});


form.addEventListener('submit',(e) =>{
	e.preventDefault();
	const prePayload = new FormData(form);
	sbmBtn.textContent === "SEND" && prePayload.append("id", uuidv4());
	const payload = new URLSearchParams(prePayload);
	fetch(sbmBtn.textContent === "SEND"	? studentUrl: `${studentUrl}/${form.id.value}`, {
		method: sbmBtn.textContent === "SEND" ? "POST" : "PUT",
		body: payload
	})
		.then(res => {
			// if the post has not successful throw and error
			if (!res.ok) {
				throw new Error("There are some problems with your http put request");
			}
			console.log(res)
			// if the post is successful the page will be updates
			printList(ul, getData(studentUrl));
			return res.json();
		})
})

/**
 * On page load all the data are retrieved
 */
window.onload = printList(ul, getData(studentUrl));


//TO DO: IMPLEMENT EDIT WITH EDITABLE CONTENT LIKE: https://www.w3schools.com/jsref/tryit.asp?filename=try_dom_body_contenteditable
