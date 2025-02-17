const openModal = document.querySelector("#addBook");
const modal = document.querySelector(".modal");
const modalSpan = document.getElementsByClassName("close")[0];
const bookTitleInput = document.querySelector("#title");
const bookAuthorInput = document.querySelector("#author");
const bookPagesInput = document.querySelector("#pages");
const bookHasReadInput = document.querySelector("#read");
const addBookToArray = document.querySelector(".addBookToArray");
const onPageLibrary = document.querySelector(".library");
const mainContainer = document.querySelector(".main-container");
const readBooksResult = document.querySelector(".readBooksResult");
const unreadBooksResult = document.querySelector(".unreadBooksResult");
const pagesCounter = document.querySelector(".pagesReadResult");

class Book {
  constructor(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
  }
}

// This is an array that will hold all the default books
const defaultBooks = [
  new Book("The Hobbit", "J.R.R. Tolkien", 295, true),
  new Book("The Lord of the Rings", "J.R.R. Tolkien", 1216, false),
  new Book("The Silmarillion", "J.R.R. Tolkien", 480, true),
  new Book("The Fellowship of the Ring", "J.R.R. Tolkien", 423, false),
  new Book("The Two Towers", "J.R.R. Tolkien", 352, true),
  new Book("The Return of the King", "J.R.R. Tolkien", 416, false),
  new Book("The Children of Hurin", "J.R.R. Tolkien", 352, true),
  new Book("A Game of Thrones", "George R.R. Martin", 694, false),
  new Book("Mistborn: The Final Empire", "Brandon Sanderson", 541, true),
  new Book("The Way of Kings", "Brandon Sanderson", 1007, false),
];

openModal.addEventListener("click", () => {
  openBookModal();
});

modalSpan.addEventListener("click", () => {
  closeBookModal();
});

let myLibrary = [];

// Add default books to the library
myLibrary.push(...defaultBooks);
myLibrary.forEach(createBookCard);

function updateCounters() {
  const totalBooksRead = myLibrary.filter((b) => b.status).length;
  const totalNumberBooks = myLibrary.length;
  const totalPagesRead = myLibrary.reduce((accumulator, book) => {
    if (book.status) {
      return parseInt(accumulator, 10) + parseInt(book.pages, 10);
    }
    return accumulator;
  }, 0);

  readBooksResult.innerText = totalBooksRead;
  unreadBooksResult.innerText = totalNumberBooks - totalBooksRead;
  pagesCounter.innerText = totalPagesRead.toLocaleString();
}

// This isn't the best way to handle forms (although it works lol)
// addBookToArray.addEventListener("click", () => {
//   const newBook = createNewBook();
//   myLibrary.push(newBook);
//   createBookCard(newBook);
//   closeBookModal();
// });

// The JustValidate library will take care of the form validation and error messages
// It will also create a new book object and add it to the library if the form is valid
function createFormValidation() {
  // Create validation intance
  const validation = new JustValidate("#form", {
    focusInvalidField: true,
    errorFieldCssClass: "is-invalid",
    errorLabelStyle: {
      fontSize: "14px",
      color: "#dc3545",
    },
  });
  console.log(validation);

  validation
    .addField("#title", [
      {
        rule: "required",
        errorMessage: "Please enter a title",
      },
    ])
    .addField("#author", [
      {
        rule: "required",
        errorMessage: "Please enter an author",
      },
    ])
    .addField("#pages", [
      {
        rule: "required",
        errorMessage: "Please enter the number of pages",
      },
      {
        rule: "minLength",
        value: 1,
        errorMessage: "Please enter a number of pages",
      },
      {
        rule: "number",
        errorMessage: "Please enter a number",
      },
    ])
    .onSuccess(() => {
      console.log("Validation success");
      const newBook = createNewBook();
      myLibrary.push(newBook);
      createBookCard(newBook);
      closeBookModal();
    })
    .onFail((fields) => {
      console.log("Validation failed", fields);
    });
}

function createBookCard(newBook) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("cardContainer");
  const bookCard = document.createElement("div");
  bookCard.classList.add("bookCard");

  const title = document.createElement("p");
  const author = document.createElement("p");
  const pages = document.createElement("p");
  const readButton = document.createElement("button");
  const readButtonText = document.createTextNode("Mark as read");
  const deleteButton = document.createElement("button");
  const deleteButtonText = document.createTextNode("Remove Book");

  title.textContent = `${newBook.title}`;
  author.textContent = `By: ${newBook.author}`;
  pages.textContent = `Pages: ${newBook.pages}`;

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(pages);
  readButton.appendChild(readButtonText);
  bookCard.appendChild(readButton);

  deleteButton.appendChild(deleteButtonText);
  bookCard.appendChild(deleteButton);

  onPageLibrary.insertAdjacentElement("beforeend", bookCard);

  if (newBook.status === true) {
    bookCard.style.borderColor = "green";
    readButtonText.textContent = "Mark as un-read";
  } else {
    bookCard.style.borderColor = "red";
    readButtonText.textContent = "Mark as read";
  }
  updateCounters();
  readButton.addEventListener("click", () => {
    if (newBook.status === false) {
      newBook.status = true;
      updateCounters();
      bookCard.style.borderColor = "green";
      readButtonText.textContent = "Mark as un-read";
    } else {
      newBook.status = false;
      updateCounters();
      bookCard.style.borderColor = "red";
      readButtonText.textContent = "Mark as read";
    }
  });

  deleteButton.addEventListener("click", () => {
    const currentBookIndex = myLibrary.indexOf(newBook);
    myLibrary.splice(currentBookIndex, 1);
    onPageLibrary.textContent = "";
    myLibrary.forEach(createBookCard);
    updateCounters();
  });
}

function createNewBook() {
  return new Book(
    document.querySelector("#title").value,
    document.querySelector("#author").value,
    document.querySelector("#pages").value,
    document.querySelector("#read").checked
  );
}

function resetModalValues() {
  bookTitleInput.value = "";
  bookAuthorInput.value = "";
  bookPagesInput.value = "";
  bookHasReadInput.checked = false;
}

function openBookModal() {
  modal.style.display = "block";
  mainContainer.className += " modalIsOpen";
}

function closeBookModal() {
  resetModalValues();
  modal.style.display = "none";
  mainContainer.className = " main-container";
}

// Run the form validation on page load
createFormValidation();
