"use strict";

const app = new Vue({
  el: '#books',
  data: {
    newBook: {
      authors: [],
      genres: []
    },
    editBook: {
      id: 0,
      name: '',
      description: '',
      authors: [],
      genres: []
    },
    books: [

    ],
    authorsAll: [

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
    },
    genresAll: [

    ],
    newGenre : {
      id: 0,
      name: '',
      books: []
    },
    copyGenre: {
      id: 0,
      name: ''
    }
  },
  methods: {
    addAuthor( firstName, lastName ) {
      // Validate inputs
      if ( !this.newAuthor.firstName || !this.newAuthor.lastName) {
        this.validate(this.newAuthor.firstName, "#add-author-name");
        this.validate(this.newAuthor.lastName, "#add-author-last-name");
        return false;
      }

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

      // Add author to all author list
      this.authorsAll.push( author );

      // Clear Inputs
      this.newAuthor.firstName = '';
      this.newAuthor.lastName = '';
    },

    deleteAuthor(author) {
      this.authorsAll.splice(this.authorsAll.indexOf(author), 1);
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

    addGenre(name) {
      // Validate inputs
      if ( !this.newGenre.name ) {
        this.validate(this.newGenre.name, "#add-genre-name");
        return false;
      }

      const genre = {
        name,
        books: []
      };

      if ( this.genresAll.length === 0 ) {
        genre.id = 0;
      } else {
        genre.id = this.genresAll[ this.genresAll.length - 1 ].id + 1;
      }

      this.genresAll.push( genre );

      this.newGenre.name = '';
    },

    deleteGenre(genre) {
      this.genresAll.splice(this.genresAll.indexOf(genre), 1);
    },

    editGenre(genre) {
      this.copyGenre.id = genre.id;
      this.copyGenre.name = genre.name;
    },

    saveGenre(genre) {
      this.genresAll.forEach( item => {
        if ( item.id === this.copyGenre.id ) {
          item.name = this.copyGenre.name;
        }
      });

      this.books.forEach( item => {
        for ( let i = 0; i < item.genres.length; i++ ) {
          if ( item.genres[i].id === this.copyGenre.id ) {
            item.genres[i].name = this.copyGenre.name;
          }
        }
      })
    },

    addBook() {
      // Validate Inputs
      if ( !this.newBook.name || !this.newBook.description || !this.newBook.genres ) {
        this.validate(this.newBook.name, "#add-book-name");
        this.validate(this.newBook.description, "#add-book-description");
        this.validate(this.newBook.genres, "#add-book-genres");
        return false;
      }

      const book = {},
      name = this.newBook.name,
      description = this.newBook.description,
      authors = createAuthors(this.newBook.authors, this.authorsAll),
      genres = createGenres(this.newBook.genres, this.genresAll);


      if ( this.books.length === 0 ) {
        book.id = 0;
      } else {
        book.id = this.books[ this.books.length - 1 ].id + 1;
      }

      book.name = name;
      book.description = description;
      book.authors = authors;
      book.genres = genres;

      this.authorsAll.forEach(author => {
        for ( let i = 0; i < book.authors.length; i++ ) {
          if ( book.authors[i].id === author.id) {
            author.books.push(book.id);
          }
        }
      });

      this.genresAll.forEach(genre => {
        for ( let i = 0; i < book.genres.length; i++ ) {
          if ( book.genres[i].id === genre.id) {
            genre.books.push(book.id);
          }
        }
      });

      this.books.push(book);

      // Clear Fills
      this.newBook.name = '';
      this.newBook.description = '';
      this.newBook.authors = [];
      this.newBook.genres = [];
    },

    deleteBook: function (item) {
      this.books.splice(this.books.indexOf(item), 1)
    },

    editTheBook: function ( { id, name, description, authors, genres } = item ) {
      this.editBook.id = id;
      this.editBook.name = name;
      this.editBook.description = description;
      this.editBook.authors = authors.map(author => `${author.firstName} ${author.lastName}`);
      this.editBook.genres = genres.map(genre => `${genre.name}`);
    },

    saveBook() {
     this.books.forEach(item => {
       if (item.id === this.editBook.id) {
         item.name = this.editBook.name;
         item.description = this.editBook.description;
         item.authors = createAuthors(this.editBook.authors, this.authorsAll);
         item.genres = createGenres(this.editBook.genres, this.genresAll);
       }
     })
    },

    validate(input, node) {
      if ( input === undefined || input === '' ) {
        document.querySelector(node).classList.add('has-error');
      } else {
        document.querySelector(node).classList.remove('has-error');
      }
    },

    blur(input, node) {
      if ( input === undefined || input === '' ) {
        document.querySelector(node).classList.add('has-error');
      } else {
        document.querySelector(node).classList.remove('has-error');
      }
      document.querySelector(node).classList.remove('has-focus');
    },

    focus(input, node) {
      document.querySelector(node).classList.add('has-focus');
    },
  },
  mounted() {
    console.log('App Mounted');
    if (localStorage.getItem('authorsAll')) this.authorsAll = JSON.parse(localStorage.getItem('authorsAll'));
    if (localStorage.getItem('genresAll')) this.genresAll = JSON.parse(localStorage.getItem('genresAll'));
    if (localStorage.getItem('books')) this.books = JSON.parse(localStorage.getItem('books'));
  },
  watch: {
    authorsAll: {
      handler() {
        localStorage.setItem('authorsAll', JSON.stringify(this.authorsAll))
      },
      deep: true
    },
    genresAll: {
      handler() {
        localStorage.setItem('genresAll', JSON.stringify(this.genresAll))
      },
      deep: true
    },
    books: {
      handler() {
        localStorage.setItem('books', JSON.stringify(this.books))
      },
      deep: true
    },
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

function createGenres(arr, allGenres) {
  let genresArr = [];
  let genresArrResult = [];
  genresArr = arr.map(item => {
    return {
      name : item
    };
  });

  genresArrResult = allGenres.filter(item => {
    for( let i = 0; i < genresArr.length; i++ ) {
      if ( item.name === genresArr[i].name ) {
        return item;
      }
    }
  });

  return genresArrResult;
}

function openModal(element) {
  let modal = document.querySelector(element);
  modal.classList.add('active')
}

function closeModal(element) {
  let modal = document.querySelector(element);
  modal.classList.remove('active');
  resetValidate(element);
}

function resetValidate(node) {
  let inputs = document.querySelector(node).querySelectorAll('.form-input');
  inputs.forEach(input => input.classList.remove('has-error'))
}