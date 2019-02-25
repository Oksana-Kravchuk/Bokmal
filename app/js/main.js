let openMenu = document.getElementById("aside__open");
let closeMenu = document.getElementById("aside__close");
let modal = document.getElementById("modal");
var asideMenu = document.getElementById("aside__main");
let dropdownBtn = document.getElementById("dropdown");
let submenu = document.getElementById("submenu");
let dropdownArrow = document.getElementById("dropdown__arrow");

openMenu.addEventListener("click", function() {
	asideMenu.classList.toggle("aside__main_open");
	modal.style.display = "block";
	openMenu.style.display = "none";
	closeMenu.style.display = "block";

});


closeMenu.addEventListener("click", function() {
	asideMenu.classList.toggle("aside__main_open");
	closeMenu.style.display = "none";
	openMenu.style.display = "block";
	modal.style.display = "none";
})

dropdownBtn.addEventListener("click", function() {
	submenu.classList.toggle("submenu_is-open");
	dropdownArrow.classList.toggle("dropdown__arrow_is-rotated");
})
