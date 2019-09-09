"use strict";

const app = new Vue({
  el: '#books',
  data: {
    newBook: {},
    editBook: {
      id: 0,
      name: '',
      description: '',
      authors: '',
      genres: ''
    },
    books: [
      {
        id: 0,
        name: 'New World',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium at deserunt doloribus dolorum, ea eligendi.',
        authors: [
          {
            firstName: 'Gel',
            lastName: 'Bandit'
          },
          {
            firstName: 'Gel',
            lastName: 'Bandit'
          },
          {
            firstName: 'Gel',
            lastName: 'Bandit'
          }
        ],
        genres: ['history', 'example', 'test']
      }
    ]
  },
  methods: {

    addItem: function () {
      const book = {};

      if ( this.books.length === 0 ) {
        book.id = 0;
      } else {
        book.id = this.books[ this.books.length - 1 ].id + 1;
      }

      book.name = this.newBook.name;
      book.description = this.newBook.description;
      book.authors = createAuthors(this.newBook.authors);
      book.genres = createGenres(this.newBook.genres);

      this.books.push(book);
    },

    deleteItem: function (item) {
      this.books.splice(this.books.indexOf(item), 1)
    },

    editItem: function ( { id, name, description, authors, genres } = item ) {
      this.editBook.id = id;
      this.editBook.name = name;
      this.editBook.description = description;
      this.editBook.authors = authors
        .map(item => {
          let { firstName, lastName } = item;
          return `${firstName} ${lastName}`;
        })
        .join(', ');

      this.editBook.genres = genres.join(', ');
      openModal('.edit-modal');
    },

    saveItem: function () {
     this.books.forEach(item => {
       if (item.id === this.editBook.id) {
         item.name = this.editBook.name;
         item.description = this.editBook.description;
         item.authors = createAuthors(this.editBook.authors);
         item.genres = createGenres(this.editBook.genres);
       }
     })
    }
  }
});

function createAuthors(string) {
  let authorsArr = string.trim().split(',');
  let authors = [];

  for ( let i = 0; i < authorsArr.length; i++) {
    let newAuthor = {};
    let authorArr = authorsArr[i].trim().split(' ');

    let [firstName, ...lastName] = authorArr;
    lastName = lastName.join(' ');

    if ( firstName !== '' ) {
      newAuthor.firstName = firstName;
      newAuthor.lastName = lastName;

      authors.push(newAuthor);
    }
  }

  return authors;
}

function createGenres(string) {
  return string.split(', ').filter( item => item !== '' );
}

function openModal(element) {
  let modal = document.querySelector(element);
  modal.classList.add('active')
}

function closeModal(element) {
  let modal = document.querySelector(element);
  modal.classList.remove('active')
}