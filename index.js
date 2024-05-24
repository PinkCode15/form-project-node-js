
document.getElementById("myForm").addEventListener("submit", function (event) {
    event.preventDefault();
    validateForm();
});
  
function validateForm() {
const firstName = document.getElementById("firstName").value.trim();
const lastName = document.getElementById("lastName").value.trim();
const otherNames = document.getElementById("otherNames").value;
const email = document.getElementById("email").value.trim();
const phone = document.getElementById("phone").value.trim();
const gender = document.getElementById("gender").value;

const errors = [];

if (!firstName) {
    errors.push("First name is required.");
}

if (!lastName) {
    errors.push("Last name is required.");
}

if (/\d/.test(firstName)) {
    errors.push("First name cannot contain numbers.");
}

if (/\d/.test(lastName)) {
    errors.push("Last name cannot contain numbers.");
}

if (otherNames && /\d/.test(otherNames)) {
    errors.push("Other names cannot contain numbers.");
}

if (!email.includes("@") || !email.includes(".")) {
    errors.push("Invalid email address.");
}

if (phone.length !== 11) {
    errors.push("Phone number must be 11 digits.");
}

if (!gender) {
    errors.push("Gender is required.");
}

if (errors.length > 0) {
    displayErrors(errors);
} else {
    submitForm();
}
}

function displayErrors(errors) {
const errorContainer = document.getElementById("errors");
errorContainer.innerHTML = "";
const ul = document.createElement("ul");
errors.forEach((error) => {
    const li = document.createElement("li");
    li.textContent = error;
    ul.appendChild(li);
});
errorContainer.appendChild(ul);
}

function submitForm() {
const formObject = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    otherNames: document.getElementById("otherNames").value,
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    gender: document.getElementById("gender").value
};

fetch("http://127.0.0.1:3000/submit", {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify(formObject)
})
    .then((response) => {
    if (response.status == 200) {
        console.log("Form submitted successfully.");
        document.getElementById("errors").innerHTML = "";
        alert("Form submitted successfully!");
        document.getElementById("myForm").reset();
    } else {
        console.error("Failed to submit form. Status code:", response.status);
        document.getElementById("errors").innerHTML = "Failed to submit form";
    }
    })
    .catch((error) => {
        document.getElementById("errors").innerHTML = "Failed to submit form";
        console.error("Error: ", error);
    });
}
  