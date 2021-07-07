const themeToggle = document.getElementById('checkbox')

// Check color scheme and watch for changes
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', e => {
    if (!localStorage.getItem('isDarkTheme')) {
      resetColorScheme()
    }
  })
function resetColorScheme() {
  if (!localStorage.getItem('isDarkTheme')) {
    if (window.matchMedia('(prefers-color-scheme: no-preference').matches)
      return
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.body.classList.add('light')
      document.body.classList.remove('dark')
      themeToggle.checked = false
    } else {
      document.body.classList.remove('light')
      document.body.classList.add('dark')
      themeToggle.checked = true
    }
  } else {
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true'
    if (isDarkTheme) {
      document.body.classList.remove('light')
      document.body.classList.add('dark')
      themeToggle.checked = true
    } else {
      document.body.classList.add('light')
      document.body.classList.remove('dark')
      themeToggle.checked = false
    }
  }
}

// Create Book class
class Book {
  constructor(title, author, isbn) {
    this.id = uuid.v4()
    this.title = title
    this.author = author
    this.isbn = isbn
  }
}
// Create UI class
class UI {
  // Add book to list function
  addBookToList(book) {
    // Get the book list
    const bookList = document.querySelector('#book-list')
    // Create tr element
    const row = document.createElement('tr')
    // Insert cols in the innerHTML. create more tds
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td id="${book.id}" class="delete">X</td>
        `
    bookList.appendChild(row)
    document.getElementById(book.id).addEventListener('click', this.deleteBook)
  }
  //show alert function
  showAlert(message, className) {
    //create div
    const alertDiv = document.createElement('div')
    //get the heading
    const heading = document.getElementById('heading')
    //add the classes
    alertDiv.className = `alert ${className}`
    //append the message
    alertDiv.appendChild(document.createTextNode(message))
    // add the div after
    heading.after(alertDiv)
    //set the timeout
    setTimeout(function () {
      document.querySelector('.alert').remove()
    }, 3000)
  }
  // create delete Book function
  deleteBook(e) {
    document
      .getElementById(e.target.id)
      .removeEventListener('click', this.deleteBook)
    Store.removeBookFromLocalStorage(e.target.id)
    e.target.parentElement.remove()
    ui.showAlert('Book removed from list', 'success')
  }

  removeAllBooks() {
    document.getElementById('book-list').innerHTML = ''
  }

  // create clear Fields function
  clearFields() {
    document.getElementById('title').value = ''
    document.getElementById('author').value = ''
    document.getElementById('ISBN').value = ''
  }
}
const ui = new UI()

// Local Storage class
class Store {
  //create get books function
  static getBooks() {
    let books

    //do the usual checking in local storage and getting the item, remember to return the array
    if (localStorage.getItem('books') === null) {
      books = []
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }

    return books
  }

  //create display books function
  static displayBooks() {
    const books = Store.getBooks()

    //loop and add every book to the list
    books.forEach(function (book) {
      ui.addBookToList(book)
    })
  }

  // create add book to local storage function
  static addBookToLocalStorage(book) {
    const books = Store.getBooks()

    //push the book
    books.push(book)

    //set the item
    localStorage.setItem('books', JSON.stringify(books))
  }

  //create remove book from local storage function
  static removeBookFromLocalStorage(id) {
    const books = Store.getBooks()

    //loop through every books and check
    books.forEach(function (book, index) {
      if (book.id === id) {
        books.splice(index, 1)
      }
    })

    //set item to local storage
    localStorage.setItem('books', JSON.stringify(books))
  }

  static removeAllBooksFromLocalStorage() {
    localStorage.clear()
  }
}

// DOM Load Event (event when the page loads)
document.addEventListener('DOMContentLoaded', initialSetup)
function initialSetup() {
  resetColorScheme()
  Store.displayBooks()
}

// Event Listener for submit
document.getElementById('book-form').addEventListener('submit', function (e) {
  // get form values
  const title = document.getElementById('title').value
  const author = document.getElementById('author').value
  const isbn = document.getElementById('ISBN').value

  // Instantiate a book
  const book = new Book(title, author, isbn)

  // validation, the alert that goes when I don't fill the form
  if (title === '' || author === '' || isbn === '') {
    ui.showAlert('Please fill in all fields!', 'error')
  } else {
    // Add book to list
    ui.addBookToList(book)

    // Add to local Storage
    Store.addBookToLocalStorage(book)

    //show alert
    ui.showAlert('Book added!', 'success')
    // Clear fields
    ui.clearFields()
  }

  //prevent default
  e.preventDefault()
})

document.getElementById('clear-btn').addEventListener('click', function (e) {
  const bookList = document.getElementById('book-list')

  if (bookList === 'undefined') {
    document.getElementById('clear-btn').disabled = true
  } else {
    ui.removeAllBooks()

    Store.removeAllBooksFromLocalStorage()
  }

  e.preventDefault()
})

// dark mode start
themeToggle.addEventListener('click', function (e) {
  if (e.altKey) {
    localStorage.removeItem('isDarkTheme')
    resetColorScheme()
  } else {
    if (themeToggle.checked) {
      document.body.classList.remove('light')
      document.body.classList.add('dark')
      localStorage.setItem('isDarkTheme', true)
    } else {
      document.body.classList.remove('dark')
      document.body.classList.add('light')
      localStorage.setItem('isDarkTheme', false)
    }
  }
})
// dark mode end
