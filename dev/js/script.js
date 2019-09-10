"use strict";

const app = new Vue({
  el: '#books',
  data: {
    newBook: {
      authors: []
    },
    editBook: {
      id: 0,
      name: '',
      description: '',
      authors: [],
      genres: ''
    },
    books: [
      {
        id: 0,
        name: 'New World',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium at deserunt doloribus dolorum, ea eligendi.',
        authors: [
          {
            id: 0,
            firstName: 'Andrew',
            lastName: 'Hellver'
          }
        ],
        genres: ['history', 'example', 'test']
      }
    ],
    authorsAll: [
      {
        id: 0,
        firstName: 'Andrew',
        lastName: 'Hellver',
        books: [0]
      },
      {
        id: 1,
        firstName: 'Marina',
        lastName: 'Molina',
        books: []
      }
    ],

    newAuthor: {
      id: 0,
      firstName: '',
      lastName: '',
      books: []
    },

    copyAuthor: {
      id: 0,
      firstName: '',
      lastName: '',
    }
  },
  methods: {

    addAuthor( firstName, lastName ) {
      if ( this.newAuthor.firstName && this.newAuthor.lastName ) {
        const author = {
          firstName,
          lastName,
          books : []
        };

        if ( this.authorsAll.length === 0 ) {
          author.id = 0;
        } else {
          author.id = this.authorsAll[ this.authorsAll.length - 1 ].id + 1;
        }

        this.authorsAll.push( author );
      }
    },

    deleteAuthor(author) {
      this.authorsAll.splice(this.authorsAll.indexOf(author), 1);

      // Delete Book with this author
      // this.books.forEach(book => {
      //   for ( let i = 0; i < author.books.length; i++ ) {
      //     if ( author.books[i] === book.id ) {
      //       this.books.splice(this.books.indexOf(book), 1)
      //     }
      //   }
      // });
    },

    editAuthor(author) {
      this.copyAuthor.id = author.id;
      this.copyAuthor.firstName = author.firstName;
      this.copyAuthor.lastName = author.lastName;
    },

    saveAuthor(author) {
      this.authorsAll.forEach( item => {
        if ( item.id === this.copyAuthor.id ) {
          item.firstName = this.copyAuthor.firstName;
          item.lastName = this.copyAuthor.lastName;
        }
      });

      this.books.forEach( item => {
        for ( let i = 0; i < item.authors.length; i++ ) {
          if ( item.authors[i].id === this.copyAuthor.id ) {
            item.authors[i].firstName = this.copyAuthor.firstName;
            item.authors[i].lastName = this.copyAuthor.lastName;
          }
        }
      })
    },

    addItem: function () {
      const book = {};

      if ( this.books.length === 0 ) {
        book.id = 0;
      } else {
        book.id = this.books[ this.books.length - 1 ].id + 1;
      }

      book.name = this.newBook.name;
      book.description = this.newBook.description;
      book.authors = createAuthors(this.newBook.authors, this.authorsAll);
      book.genres = createGenres(this.newBook.genres);

      this.authorsAll.forEach(author => {
        for ( let i = 0; i < book.authors.length; i++ ) {
          if ( book.authors[i].id === author.id) {
            author.books.push(book.id);
          }
        }
      });

      this.books.push(book);
    },

    deleteItem: function (item) {
      this.books.splice(this.books.indexOf(item), 1)
    },

    editItem: function ( { id, name, description, authors, genres } = item ) {
      this.editBook.id = id;
      this.editBook.name = name;
      this.editBook.description = description;
      this.editBook.genres = genres.join(', ');
      openModal('.edit-modal');
    },

    saveItem: function () {
     this.books.forEach(item => {
       if (item.id === this.editBook.id) {
         item.name = this.editBook.name;
         item.description = this.editBook.description;
         item.authors = createAuthors(this.editBook.authors, this.authorsAll);
         item.genres = createGenres(this.editBook.genres);
       }
     })
    }
  }
});

function createAuthors(arr, allAuthors) {
  let authorsArr = [];
  let authorArrResult = [];
  authorsArr = arr.map(item => {
    return {
      firstName : item.split(' ')[0],
      lastName : item.split(' ')[1]
    };
  });

  authorArrResult = allAuthors.filter(item => {
    for( let i = 0; i < authorsArr.length; i++ ) {
      if ( item.firstName === authorsArr[i].firstName && item.lastName === authorsArr[i].lastName ) {
        return item;
      }
    }
  });

  return authorArrResult;
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