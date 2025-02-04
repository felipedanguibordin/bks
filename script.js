async function getSuggestions() {
  let query = document.getElementById("searchInput").value;
  let suggestionsList = document.getElementById("suggestions");

  // Se o campo estiver vazio, esconde as sugestões
  if (!query) {
    suggestionsList.innerHTML = "";
    return;
  }

  let response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}`
  );
  let data = await response.json();

  // Limpa a lista antes de adicionar novas sugestões
  suggestionsList.innerHTML = "";

  if (data.items) {
    data.items.slice(0, 5).forEach((book) => {
      let title = book.volumeInfo.title;
      let li = document.createElement("li");
      li.innerText = title;
      li.onclick = function () {
        document.getElementById("searchInput").value = title;
        suggestionsList.innerHTML = "";
        searchBook();
      };
      suggestionsList.appendChild(li);
    });
  }
}

async function searchBook() {
  let query = document.getElementById("searchInput").value;
  if (!query) return alert("Digite o nome do livro!");

  let response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}`
  );
  let data = await response.json();

  if (data.items && data.items.length > 0) {
    let book = data.items[0].volumeInfo;
    document.getElementById("bookTitle").innerText =
      book.title || "Título não encontrado";
    document.getElementById("bookSynopsis").innerText =
      book.description || "Sem sinopse disponível";
    document.getElementById("bookImage").src = book.imageLinks?.thumbnail || "";
  } else {
    alert("Livro não encontrado!");
  }
}

function saveBook() {
  let title = document.getElementById("bookTitle").innerText;
  let synopsis = document.getElementById("bookSynopsis").innerText;
  let comments = document.getElementById("comments").value;
  let characters = document.getElementById("characters").value;
  let imgSrc = document.getElementById("bookImage").src;

  if (title === "Título do Livro")
    return alert("Busque um livro antes de salvar!");

  let savedBooks = document.getElementById("savedBooks");
  let bookDiv = document.createElement("div");
  bookDiv.innerHTML = `
        <hr>
        <h3>${title}</h3>
        <img src="${imgSrc}" width="80">
        <p><strong>Sinopse:</strong> ${synopsis}</p>
        <p><strong>Comentários:</strong> ${comments}</p>
        <p><strong>Personagens:</strong> ${characters}</p>
    `;
  savedBooks.appendChild(bookDiv);

  document.getElementById("comments").value = "";
  document.getElementById("characters").value = "";
}

function displayBook(title, synopsis, imageUrl) {
  const bookTitle = document.getElementById("bookTitle");
  const bookSynopsis = document.getElementById("bookSynopsis");
  const bookImage = document.getElementById("bookImage");

  if (imageUrl) {
    bookImage.src = imageUrl;
    bookImage.style.display = "block";
    bookTitle.classList.add("hidden");
  }

  if (synopsis) {
    bookSynopsis.textContent = synopsis;
    bookSynopsis.classList.remove("hidden");
  }
}
